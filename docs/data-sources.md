# Data sources

## City of Melbourne open data

- Landmarks and places of interest: parks, gardens and public spaces used by US2.1
  - <https://data.melbourne.vic.gov.au/explore/dataset/landmarks-and-places-of-interest-including-schools-theatres-health-services-spor/>
- Library locations and opening hours: official addresses, visitor hours and website links
  - <https://www.melbourne.vic.gov.au/library-locations-and-opening-hours>
- Pedestrian Counting System: real-time / historical pedestrian counts for Melbourne CBD
  - <https://data.melbourne.vic.gov.au>

## Victorian open data

- Metropolitan open space: named public parks, gardens and reserves with open access
  - <https://www.data.gov.au/data/dataset/open-space>

## Library visitor information

- State Library Victoria visitor information
  - <https://www.slv.vic.gov.au/visit>
- Melbourne Athenaeum Library visitor information
  - <https://melbourneathenaeum.org.au/contact-us/>

## Routing services

- OSRM / Valhalla: walking / transit route planning (alternative: Mapbox Directions API)

## Noise / environment

- TBD: Melbourne City Council environmental noise data, POI datasets

## Database

- Supabase PostgreSQL stores data sources and refuge locations as related tables.
- US2.1 contains 58 curated refuge locations: 47 parks, 9 libraries and 2 quiet public spaces.
- Library records include an official address, regular opening hours and an information link.
- Park and public-space records include a suburb; unavailable opening hours are stated clearly in the interface.
- `nearby_refuges` calculates straight-line distance from the user's location.
- Public access is read-only through Row Level Security policies.
