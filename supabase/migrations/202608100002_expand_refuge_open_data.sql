insert into public.data_sources (source_key, name, dataset_url, retrieved_on)
values
  (
    'victorian-planning-authority-open-space',
    'Victorian Planning Authority metropolitan open space',
    'https://www.data.gov.au/data/dataset/open-space',
    '2026-08-10'
  ),
  (
    'city-of-melbourne-environmental-assets',
    'City of Melbourne assets for environmental reporting',
    'https://data.melbourne.vic.gov.au/explore/dataset/assets-for-environmental-reporting/',
    '2026-08-10'
  )
on conflict (source_key) do update set
  name = excluded.name,
  dataset_url = excluded.dataset_url,
  retrieved_on = excluded.retrieved_on;

with source as (
  select id from public.data_sources where source_key = 'victorian-planning-authority-open-space'
)
insert into public.refuges (
  data_source_id,
  source_place_id,
  name,
  refuge_type,
  description,
  latitude,
  longitude
)
select
  source.id,
  refuge.source_place_id,
  refuge.name,
  'park',
  'Public open space with unrestricted access',
  refuge.latitude,
  refuge.longitude
from source
cross join (
  values
    ('VPA-35288', 'Victoria Market Reserve', -37.809233628788, 144.957892903860),
    ('VPA-35251', 'Eight Hour Reserve', -37.807306447760, 144.965523429275),
    ('VPA-35576', 'Eureka Reserve', -37.821353196532, 144.964889338031),
    ('VPA-35883', 'Gillott Reserve/Tianjin Gardens', -37.809917038870, 144.972479293607),
    ('VPA-35790', 'Gordon Reserve', -37.812441815878, 144.974002913289),
    ('VPA-35334', 'Royal College of Surgeons Gardens', -37.808596470419, 144.972360094441),
    ('VPA-35328', 'Burston Reserve', -37.811420444434, 144.975229704253),
    ('VPA-35827', 'Eades Park', -37.807308868940, 144.951442315069),
    ('VPA-35638', 'Wellington Park', -37.815988862596, 144.977184631938),
    ('VPA-35779', 'St Andrews Place Reserve', -37.812306005153, 144.977556652215),
    ('VPA-35311', 'City Road Park', -37.825413565251, 144.960370712120),
    ('VPA-35631', 'Grant Street Reserve', -37.825890541173, 144.968583439291),
    ('VPA-35557', 'Sturt Street Reserve', -37.829802956516, 144.964853560770),
    ('VPA-35402', 'Buluk Park', -37.820390792993, 144.940718329199),
    ('VPA-35354', 'Quay Park', -37.815700478655, 144.937498109066),
    ('VPA-35218', 'Gardiner Reserve', -37.799119874956, 144.943747150875)
) as refuge(source_place_id, name, latitude, longitude)
on conflict (source_place_id) do update set
  data_source_id = excluded.data_source_id,
  name = excluded.name,
  refuge_type = excluded.refuge_type,
  description = excluded.description,
  latitude = excluded.latitude,
  longitude = excluded.longitude,
  is_active = true,
  updated_at = now();

with source as (
  select id from public.data_sources where source_key = 'city-of-melbourne-environmental-assets'
)
insert into public.refuges (
  data_source_id,
  source_place_id,
  name,
  refuge_type,
  description,
  latitude,
  longitude
)
select
  source.id,
  refuge.source_place_id,
  refuge.name,
  'library',
  'City of Melbourne public library facility',
  refuge.latitude,
  refuge.longitude
from source
cross join (
  values
    ('COM-AER-LIBRARY-CITY', 'City Library', -37.816910000000, 144.965840000000),
    ('COM-AER-LIBRARY-DOCKLANDS', 'Docklands Library', -37.820020000000, 144.940550000000),
    ('COM-AER-LIBRARY-EAST-MELBOURNE', 'East Melbourne Library', -37.815070000000, 144.986380000000),
    ('COM-AER-LIBRARY-NORTH-MELBOURNE', 'North Melbourne Library', -37.803550000000, 144.949870000000)
) as refuge(source_place_id, name, latitude, longitude)
on conflict (source_place_id) do update set
  data_source_id = excluded.data_source_id,
  name = excluded.name,
  refuge_type = excluded.refuge_type,
  description = excluded.description,
  latitude = excluded.latitude,
  longitude = excluded.longitude,
  is_active = true,
  updated_at = now();
