# Architecture

> Status: scaffolding. This is the planned architecture and will evolve with implementation.

## Overview

CalmJourney is a webapp for sensory-sensitive travelers: it plans routes with **lower sensory stress** based on **real-time / historical crowd levels, noise, and refuge locations**.

```
Browser (React SPA)
   │
   ▼
Cloudflare Pages Functions (functions/api/*)   ← serverless API
   │
   ├── server/sensoryLogic.js     sensory scoring algorithm
   ├── server/predictionLogic.js  crowd / stress prediction
   ├── server/cityOfMelbourneApi.js  Melbourne open data
   ├── server/routingApi.js       route planning service
   └── server/supabase.js         Postgres data layer
```

## Layers

| Layer | Location | Responsibility |
|---|---|---|
| Presentation | `src/components/*` `src/pages/*` | map, route, sensory panel, refuges, alerts UI |
| State | `src/context/*` `src/hooks/*` | React Context + custom hooks |
| Service | `src/services/*` | frontend API call wrappers |
| API | `functions/api/*` | route entry, auth / validation / response format |
| Logic | `server/*` | pure business logic (unit-testable) |
| Data | `supabase/` | PostgreSQL migrations, relational refuge schema and seed data |

## Core modules

- **sensory scoring**: score route segments (noise, crowd, greenery, refuge density → 0-100 pressure)
- **crowd intelligence**: real-time crowd + historical patterns → congestion level and prediction
- **refuges**: Supabase PostgreSQL RPC lookup for nearby libraries, parks and quiet public spaces
- **alerts**: pre-trip and mid-trip stress warnings
