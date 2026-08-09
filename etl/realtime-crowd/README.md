# Realtime Crowd ETL

Background data refresh for Feature 5 predictive sensory alerts.

This job fetches City of Melbourne `Past Hour Counts per Minute`, applies the
same minute-count validation rules used by the offline R cleaning pipeline, and
upserts clean rows into Supabase.

## Runtime

This is intended to run as a GCP Cloud Run Job. It is not called by users and is
not part of the Cloudflare Pages Functions request path.

Current web request path:

```txt
Cloudflare Pages Functions
  -> /api/alerts/predict
  -> read clean Supabase data
  -> predictionLogic.js
  -> return alert response
```

Background refresh path:

```txt
GitHub Actions or Cloud Scheduler
  -> execute Cloud Run Job
  -> refresh_realtime_crowd.R
  -> write clean rows to Supabase
```

## Safety

The script defaults to dry-run mode:

```txt
ETL_DRY_RUN=true
```

This means the code can be committed and pushed before the Supabase tables and
Cloud Run Job exist. It will not write to Supabase unless the Cloud Run Job sets:

```txt
ETL_DRY_RUN=false
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
```

Do not commit Supabase keys.

## Expected Supabase Tables

`pedestrian_minute_counts` should support upsert on:

```txt
location_id
recorded_at
```

Recommended unique constraint:

```sql
unique (location_id, recorded_at)
```

`data_refresh_logs` records job status and data freshness for AC2.2.3.

## Schedule

MVP schedule can run hourly:

```txt
0 * * * *
```

A later version can run every 15 minutes:

```txt
*/15 * * * *
```

GitHub Actions workflow is intentionally not added yet. Add it after Supabase
tables and the Cloud Run Job are created.
