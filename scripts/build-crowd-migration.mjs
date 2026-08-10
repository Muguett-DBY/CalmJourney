import fs from 'node:fs'
import path from 'node:path'

const [dataFolder, outputFile] = process.argv.slice(2)

if (!dataFolder || !outputFile) {
  console.error('Usage: node scripts/build-crowd-migration.mjs <data-folder> <output-file>')
  process.exit(1)
}

const sensorFile = path.join(dataFolder, 'sensor_locations_clean.csv')
const hourlyFile = path.join(dataFolder, 'pedestrian_hourly_clean.csv')
const sensorRows = readCsv(sensorFile)
const activeSensorIds = new Set(sensorRows.map((sensor) => sensor.location_id))
const hourlyLines = fs.readFileSync(hourlyFile, 'utf8').trim().split(/\r?\n/)
const latestDate = hourlyLines.at(-1).split(',')[1]
const validationStart = addDays(latestDate, -13)
const patterns = new Map()
const sensorCounts = new Map()

for (const line of hourlyLines.slice(1)) {
  const [locationId, date, hour, , , total] = line.split(',')
  if (!activeSensorIds.has(locationId) || date >= validationStart) continue

  const dayType = getDayType(date)
  const patternKey = `${locationId}|${dayType}|${hour}`
  addValue(patterns, patternKey, Number(total))
  addValue(sensorCounts, locationId, Number(total))
}

const sensorThresholds = new Map(
  [...sensorCounts].map(([locationId, values]) => [
    locationId,
    {
      medium: percentile(values, 0.5),
      high: percentile(values, 0.75),
    },
  ]),
)

let validationRows = 0
let matchingRisks = 0
let withinThirtyPercent = 0
let absoluteError = 0

for (const line of hourlyLines.slice(1)) {
  const [locationId, date, hour, , , total] = line.split(',')
  if (!activeSensorIds.has(locationId) || date < validationStart) continue

  const pattern = patterns.get(`${locationId}|${getDayType(date)}|${hour}`)
  const thresholds = sensorThresholds.get(locationId)
  if (!pattern || !thresholds) continue

  const actual = Number(total)
  const predicted = Math.round(average(pattern))
  const error = Math.abs(actual - predicted)
  validationRows += 1
  absoluteError += error
  withinThirtyPercent += error / Math.max(actual, 1) <= 0.3 ? 1 : 0
  matchingRisks += classifyRisk(predicted, thresholds) === classifyRisk(actual, thresholds) ? 1 : 0
}

const availableSensors = sensorRows
  .filter((sensor) => sensorThresholds.has(sensor.location_id))
  .sort((a, b) => Number(a.location_id) - Number(b.location_id))

const sensorValues = availableSensors.map((sensor) => {
  const thresholds = sensorThresholds.get(sensor.location_id)
  return `(${Number(sensor.location_id)}, source.id, '${sql(sensor.sensor_name || sensor.sensor_description)}', '${sql(sensor.sensor_description)}', ${Number(sensor.latitude)}, ${Number(sensor.longitude)}, ${thresholds.medium}, ${thresholds.high})`
})

const patternValues = [...patterns]
  .sort(([left], [right]) => left.localeCompare(right, undefined, { numeric: true }))
  .map(([key, values]) => {
    const [locationId, dayType, hour] = key.split('|')
    return `(${Number(locationId)}, '${dayType}', ${Number(hour)}, ${Math.round(average(values))}, ${values.length})`
  })

const accuracy = ((matchingRisks / validationRows) * 100).toFixed(1)
const toleranceAccuracy = ((withinThirtyPercent / validationRows) * 100).toFixed(1)
const meanAbsoluteError = (absoluteError / validationRows).toFixed(1)

const migration = `-- Generated from the supplied City of Melbourne clean pedestrian datasets.
insert into public.data_sources (source_key, name, dataset_url, retrieved_on)
values (
  'melbourne_pedestrian_counts',
  'City of Melbourne Pedestrian Counting System',
  'https://data.melbourne.vic.gov.au/explore/dataset/pedestrian-counting-system-monthly-counts-per-hour/',
  '2026-08-10'
)
on conflict (source_key) do update set
  name = excluded.name,
  dataset_url = excluded.dataset_url,
  retrieved_on = excluded.retrieved_on;

create table public.crowd_sensors (
  location_id integer primary key,
  data_source_id smallint not null references public.data_sources(id),
  name text not null,
  description text not null,
  latitude double precision not null check (latitude between -90 and 90),
  longitude double precision not null check (longitude between -180 and 180),
  medium_threshold integer not null,
  high_threshold integer not null,
  is_active boolean not null default true
);

create table public.crowd_hourly_patterns (
  location_id integer not null references public.crowd_sensors(location_id),
  day_type text not null check (day_type in ('weekday', 'weekend')),
  hour_of_day smallint not null check (hour_of_day between 0 and 23),
  average_count integer not null,
  sample_count integer not null,
  primary key (location_id, day_type, hour_of_day)
);

create table public.crowd_model_metrics (
  metric_key text primary key,
  validation_start date not null,
  validation_end date not null,
  sample_count integer not null,
  classification_accuracy numeric(5, 1) not null,
  within_thirty_percent numeric(5, 1) not null,
  mean_absolute_error numeric(10, 1) not null,
  evaluated_at timestamptz not null
);

create index crowd_sensors_coordinates_index
on public.crowd_sensors(latitude, longitude);

alter table public.crowd_sensors enable row level security;
alter table public.crowd_hourly_patterns enable row level security;
alter table public.crowd_model_metrics enable row level security;

create policy "Crowd sensors are readable"
on public.crowd_sensors for select
to anon, authenticated
using (is_active);

create policy "Crowd patterns are readable"
on public.crowd_hourly_patterns for select
to anon, authenticated
using (true);

create policy "Crowd model metrics are readable"
on public.crowd_model_metrics for select
to anon, authenticated
using (true);

grant select on public.crowd_sensors to anon, authenticated;
grant select on public.crowd_hourly_patterns to anon, authenticated;
grant select on public.crowd_model_metrics to anon, authenticated;

with source as (
  select id from public.data_sources where source_key = 'melbourne_pedestrian_counts'
)
insert into public.crowd_sensors (
  location_id,
  data_source_id,
  name,
  description,
  latitude,
  longitude,
  medium_threshold,
  high_threshold
)
select values_list.*
from source
cross join lateral (
  values
    ${sensorValues.join(',\n    ')}
) as values_list (
  location_id,
  data_source_id,
  name,
  description,
  latitude,
  longitude,
  medium_threshold,
  high_threshold
);

insert into public.crowd_hourly_patterns (
  location_id,
  day_type,
  hour_of_day,
  average_count,
  sample_count
)
values
  ${patternValues.join(',\n  ')};

insert into public.crowd_model_metrics (
  metric_key,
  validation_start,
  validation_end,
  sample_count,
  classification_accuracy,
  within_thirty_percent,
  mean_absolute_error,
  evaluated_at
)
values (
  'historical_hourly_baseline',
  '${validationStart}',
  '${latestDate}',
  ${validationRows},
  ${accuracy},
  ${toleranceAccuracy},
  ${meanAbsoluteError},
  '2026-08-10T00:00:00+10:00'
);

create or replace function public.nearby_crowd_patterns(
  user_lat double precision,
  user_lng double precision,
  target_day_type text,
  target_hour integer,
  max_distance_m integer default 2500,
  max_results integer default 8
)
returns table (
  location_id integer,
  name text,
  description text,
  latitude double precision,
  longitude double precision,
  distance_m integer,
  average_count integer,
  medium_threshold integer,
  high_threshold integer,
  sample_count integer
)
language sql
stable
security invoker
set search_path = ''
as $$
  with nearby as (
    select
      sensor.location_id,
      sensor.name,
      sensor.description,
      sensor.latitude,
      sensor.longitude,
      round(
        6371000 * 2 * asin(
          sqrt(
            least(
              1,
              power(sin(radians((sensor.latitude - user_lat) / 2)), 2) +
              cos(radians(user_lat)) * cos(radians(sensor.latitude)) *
              power(sin(radians((sensor.longitude - user_lng) / 2)), 2)
            )
          )
        )
      )::integer as distance_m,
      pattern.average_count,
      sensor.medium_threshold,
      sensor.high_threshold,
      pattern.sample_count
    from public.crowd_sensors as sensor
    join public.crowd_hourly_patterns as pattern
      on pattern.location_id = sensor.location_id
      and pattern.day_type = target_day_type
      and pattern.hour_of_day = target_hour
    where sensor.is_active
  )
  select *
  from nearby
  where nearby.distance_m <= max_distance_m
  order by nearby.distance_m, nearby.name
  limit least(max_results, 20);
$$;

grant execute on function public.nearby_crowd_patterns(
  double precision,
  double precision,
  text,
  integer,
  integer,
  integer
)
to anon, authenticated;
`

fs.writeFileSync(outputFile, migration)
console.log(`Created ${outputFile}`)
console.log(`${availableSensors.length} sensors, ${patternValues.length} hourly patterns`)
console.log(`${accuracy}% classification accuracy across ${validationRows} validation rows`)

function readCsv(file) {
  const [header, ...lines] = fs.readFileSync(file, 'utf8').trim().split(/\r?\n/)
  const columns = parseCsvLine(header)
  return lines.map((line) => Object.fromEntries(columns.map((column, index) => [column, parseCsvLine(line)[index]])))
}

function parseCsvLine(line) {
  const values = []
  let value = ''
  let quoted = false

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index]
    if (character === '"' && line[index + 1] === '"') {
      value += '"'
      index += 1
    } else if (character === '"') {
      quoted = !quoted
    } else if (character === ',' && !quoted) {
      values.push(value)
      value = ''
    } else {
      value += character
    }
  }

  values.push(value)
  return values
}

function addValue(map, key, value) {
  if (!map.has(key)) map.set(key, [])
  map.get(key).push(value)
}

function average(values) {
  return values.reduce((sum, value) => sum + value, 0) / values.length
}

function percentile(values, position) {
  const sorted = [...values].sort((a, b) => a - b)
  return sorted[Math.floor((sorted.length - 1) * position)]
}

function classifyRisk(count, thresholds) {
  if (count >= thresholds.high) return 'high'
  if (count >= thresholds.medium) return 'medium'
  return 'low'
}

function getDayType(date) {
  const day = new Date(`${date}T00:00:00Z`).getUTCDay()
  return day === 0 || day === 6 ? 'weekend' : 'weekday'
}

function addDays(date, days) {
  const value = new Date(`${date}T00:00:00Z`)
  value.setUTCDate(value.getUTCDate() + days)
  return value.toISOString().slice(0, 10)
}

function sql(value) {
  return String(value).replaceAll("'", "''")
}
