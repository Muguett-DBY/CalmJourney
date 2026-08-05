# API

> Scaffold: all endpoints currently return placeholder responses. Will be updated as implemented.

## Routes

| Method | Path | Description |
|---|---|---|
| POST | `/api/routes/search` | sensory-friendly route search |
| POST | `/api/routes/compare` | multi-route comparison |
| POST | `/api/routes/reroute` | mid-trip rerouting |

## Crowd

| Method | Path | Description |
|---|---|---|
| GET | `/api/crowd/current` | real-time crowd levels |
| GET | `/api/crowd/historical` | historical crowd trends |

## Refuges

| Method | Path | Description |
|---|---|---|
| GET | `/api/refuges/nearby` | nearby quiet refuges |

## Alerts

| Method | Path | Description |
|---|---|---|
| GET | `/api/alerts/predict` | sensory stress prediction alerts |

## Response format

Success: `{ "ok": true, "data": ... }`
Error: `{ "ok": false, "error": "..." }` (HTTP 4xx/5xx)
