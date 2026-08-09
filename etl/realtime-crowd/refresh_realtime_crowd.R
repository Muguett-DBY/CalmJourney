# Realtime crowd ETL for Feature 5.
# Fetches City of Melbourne past-hour pedestrian counts, cleans rows, and
# optionally upserts cleaned records into Supabase.

# install.packages(c("data.table", "httr2", "janitor", "jsonlite", "lubridate", "stringr"))

library(data.table)
library(httr2)
library(janitor)
library(jsonlite)
library(lubridate)
library(stringr)

api_base <- "https://data.melbourne.vic.gov.au/api/explore/v2.1/catalog/datasets"
minute_dataset_id <- "pedestrian-counting-system-past-hour-counts-per-minute"
sensor_dataset_id <- "pedestrian-counting-system-sensor-locations"

supabase_url <- Sys.getenv("SUPABASE_URL")
supabase_key <- Sys.getenv("SUPABASE_SERVICE_ROLE_KEY")
minute_table <- Sys.getenv("SUPABASE_MINUTE_TABLE", "pedestrian_minute_counts")
refresh_log_table <- Sys.getenv("SUPABASE_REFRESH_LOG_TABLE", "data_refresh_logs")
dry_run <- tolower(Sys.getenv("ETL_DRY_RUN", "true")) != "false"

started_at <- now(tzone = "UTC")

build_csv_api_url <- function(dataset_id) {
  paste0(
    api_base,
    "/",
    dataset_id,
    "/exports/csv?delimiter=%2C&timezone=Australia%2FMelbourne"
  )
}

read_api_csv <- function(dataset_id) {
  url <- build_csv_api_url(dataset_id)
  tmp <- tempfile(fileext = ".csv")
  on.exit(unlink(tmp), add = TRUE)

  req_perform(req_url(url), path = tmp)
  fread(tmp, na.strings = c("", "NA", "N/A"), showProgress = FALSE)
}

replace_blank_with_na <- function(dt) {
  character_columns <- names(dt)[vapply(dt, is.character, logical(1))]

  if (length(character_columns) > 0) {
    dt[, (character_columns) := lapply(.SD, function(x) {
      x <- str_squish(x)
      x[x == ""] <- NA_character_
      x
    }), .SDcols = character_columns]
  }

  invisible(dt)
}

require_columns <- function(dt, required, dataset_name) {
  missing <- setdiff(required, names(dt))
  if (length(missing) > 0) {
    stop(
      dataset_name,
      " is missing expected columns: ",
      paste(missing, collapse = ", ")
    )
  }
}

parse_melbourne_datetime <- function(x) {
  parsed <- suppressWarnings(ymd_hms(x, quiet = TRUE, tz = "Australia/Melbourne"))

  if (all(is.na(parsed))) {
    parsed <- suppressWarnings(dmy_hms(x, quiet = TRUE, tz = "Australia/Melbourne"))
  }

  if (all(is.na(parsed))) {
    parsed <- suppressWarnings(mdy_hms(x, quiet = TRUE, tz = "Australia/Melbourne"))
  }

  with_tz(parsed, "UTC")
}

load_valid_sensor_ids <- function() {
  sensor_raw <- read_api_csv(sensor_dataset_id)
  setDT(sensor_raw)
  setnames(sensor_raw, names(sensor_raw), make_clean_names(names(sensor_raw)))
  replace_blank_with_na(sensor_raw)

  if (!"location_id" %in% names(sensor_raw) && "sensor_id" %in% names(sensor_raw)) {
    setnames(sensor_raw, "sensor_id", "location_id")
  }

  require_columns(sensor_raw, c("location_id", "latitude", "longitude"), "Sensor Locations dataset")

  sensor_raw[, location_id := as.integer(location_id)]
  sensor_raw[, latitude := as.numeric(latitude)]
  sensor_raw[, longitude := as.numeric(longitude)]

  sensor_raw[
    !is.na(location_id) &
      !is.na(latitude) & latitude >= -90 & latitude <= 90 &
      !is.na(longitude) & longitude >= -180 & longitude <= 180,
    unique(location_id)
  ]
}

clean_minute_counts <- function(minute_raw, valid_sensor_ids) {
  setDT(minute_raw)
  setnames(minute_raw, names(minute_raw), make_clean_names(names(minute_raw)))

  if (!"sensing_date_time" %in% names(minute_raw) && "sensing_datetime" %in% names(minute_raw)) {
    setnames(minute_raw, "sensing_datetime", "sensing_date_time")
  }

  if (!"location_id" %in% names(minute_raw) && "sensor_id" %in% names(minute_raw)) {
    setnames(minute_raw, "sensor_id", "location_id")
  }

  require_columns(
    minute_raw,
    c("location_id", "sensing_date_time", "direction_1", "direction_2", "total_of_directions"),
    "Past Hour Counts per Minute dataset"
  )

  minute_raw[, location_id := as.integer(location_id)]
  minute_raw[, direction_1 := as.integer(direction_1)]
  minute_raw[, direction_2 := as.integer(direction_2)]
  minute_raw[, total_of_directions := as.integer(total_of_directions)]
  minute_raw[, recorded_at := parse_melbourne_datetime(sensing_date_time)]

  minute_raw[, valid_row :=
    !is.na(location_id) &
      !is.na(recorded_at) &
      !is.na(direction_1) & direction_1 >= 0 &
      !is.na(direction_2) & direction_2 >= 0 &
      !is.na(total_of_directions) & total_of_directions >= 0 &
      direction_1 + direction_2 == total_of_directions &
      location_id %in% valid_sensor_ids
  ]

  key_profile <- minute_raw[, .(
    n_records = .N,
    n_distinct_measurements = uniqueN(
      paste(direction_1, direction_2, total_of_directions, sep = "|")
    )
  ), by = .(location_id, recorded_at)]

  conflict_keys <- key_profile[n_records > 1 & n_distinct_measurements > 1]

  minute_raw[, conflict_key := FALSE]
  minute_raw[conflict_keys, on = .(location_id, recorded_at), conflict_key := TRUE]

  minute_clean <- minute_raw[
    valid_row == TRUE & conflict_key == FALSE,
    .(
      location_id,
      recorded_at = format(recorded_at, "%Y-%m-%dT%H:%M:%SZ", tz = "UTC"),
      direction_1_count = direction_1,
      direction_2_count = direction_2,
      total_count = total_of_directions,
      cleaned_at = format(now(tzone = "UTC"), "%Y-%m-%dT%H:%M:%SZ", tz = "UTC"),
      source = "city_of_melbourne_past_hour_counts_per_minute"
    )
  ]

  unique(minute_clean, by = c("location_id", "recorded_at"))
}

supabase_upsert <- function(table, rows, on_conflict) {
  if (dry_run) {
    message("Dry run enabled; skipping Supabase upsert for table: ", table)
    return(invisible(TRUE))
  }

  if (supabase_url == "" || supabase_key == "") {
    stop("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required when ETL_DRY_RUN=false.")
  }

  endpoint <- paste0(
    sub("/$", "", supabase_url),
    "/rest/v1/",
    table,
    "?on_conflict=",
    on_conflict
  )

  req <- request(endpoint) |>
    req_method("POST") |>
    req_headers(
      apikey = supabase_key,
      Authorization = paste("Bearer", supabase_key),
      "Content-Type" = "application/json",
      Prefer = "resolution=merge-duplicates"
    ) |>
    req_body_raw(toJSON(rows, dataframe = "rows", auto_unbox = TRUE, na = "null"))

  req_perform(req)
  invisible(TRUE)
}

write_refresh_log <- function(status, raw_rows, clean_rows, invalid_rows, message_text) {
  log_row <- data.table(
    dataset_key = "pedestrian_minute_counts",
    status = status,
    started_at = format(started_at, "%Y-%m-%dT%H:%M:%SZ", tz = "UTC"),
    finished_at = format(now(tzone = "UTC"), "%Y-%m-%dT%H:%M:%SZ", tz = "UTC"),
    raw_rows = raw_rows,
    clean_rows = clean_rows,
    invalid_rows = invalid_rows,
    message = message_text
  )

  supabase_upsert(refresh_log_table, log_row, "dataset_key,finished_at")
}

main <- function() {
  message("Starting realtime crowd ETL. dry_run=", dry_run)

  valid_sensor_ids <- load_valid_sensor_ids()
  minute_raw <- read_api_csv(minute_dataset_id)
  minute_clean <- clean_minute_counts(minute_raw, valid_sensor_ids)
  invalid_rows <- nrow(minute_raw) - nrow(minute_clean)

  message("Raw rows: ", nrow(minute_raw))
  message("Clean rows: ", nrow(minute_clean))
  message("Invalid/quarantined rows: ", invalid_rows)

  supabase_upsert(minute_table, minute_clean, "location_id,recorded_at")
  write_refresh_log(
    status = "success",
    raw_rows = nrow(minute_raw),
    clean_rows = nrow(minute_clean),
    invalid_rows = invalid_rows,
    message_text = "Realtime crowd data refreshed successfully."
  )
}

tryCatch(
  main(),
  error = function(e) {
    message("Realtime crowd ETL failed: ", conditionMessage(e))
    write_refresh_log(
      status = "failed",
      raw_rows = NA_integer_,
      clean_rows = NA_integer_,
      invalid_rows = NA_integer_,
      message_text = conditionMessage(e)
    )
    quit(status = 1)
  }
)
