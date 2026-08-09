# Data sources

## City of Melbourne open data

- Landmarks and places of interest: parks, gardens and public spaces used by US2.1
  - <https://data.melbourne.vic.gov.au/explore/dataset/landmarks-and-places-of-interest-including-schools-theatres-health-services-spor/>
- Assets for environmental reporting: City of Melbourne public library facilities
  - <https://data.melbourne.vic.gov.au/explore/dataset/assets-for-environmental-reporting/>
- Pedestrian Counting System: real-time / historical pedestrian counts for Melbourne CBD
  - <https://data.melbourne.vic.gov.au>

## Victorian open data

- Metropolitan open space: named public parks, gardens and reserves with open access
  - <https://www.data.gov.au/data/dataset/open-space>

## Routing services

- OSRM / Valhalla: walking / transit route planning (alternative: Mapbox Directions API)

## Noise / environment

- TBD: Melbourne City Council environmental noise data, POI datasets

## Database

- Supabase PostgreSQL stores data sources and refuge locations as related tables.
- US2.1 currently contains 55 curated refuge locations from three open data sources.
- `nearby_refuges` calculates straight-line distance from the user's location.
- Public access is read-only through Row Level Security policies.
