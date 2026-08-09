insert into public.data_sources (source_key, name, dataset_url, retrieved_on)
values (
  'city-of-melbourne-landmarks',
  'City of Melbourne landmarks and places of interest',
  'https://data.melbourne.vic.gov.au/explore/dataset/landmarks-and-places-of-interest-including-schools-theatres-health-services-spor/',
  '2026-08-06'
)
on conflict (source_key) do update set
  name = excluded.name,
  dataset_url = excluded.dataset_url,
  retrieved_on = excluded.retrieved_on;

with source as (
  select id from public.data_sources where source_key = 'city-of-melbourne-landmarks'
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
  refuge.refuge_type,
  refuge.description,
  refuge.latitude,
  refuge.longitude
from source
cross join (
  values
    ('LM0156', 'Alexandra Gardens', 'park', 'Public park, garden or reserve', -37.8206051404251, 144.971796067365),
    ('LM0046', 'Argyle Square', 'park', 'Public park, garden or reserve', -37.8031480577285, 144.965761295089),
    ('LM0224', 'Batman Park', 'park', 'Public park, garden or reserve', -37.8218460949601, 144.956665812218),
    ('LM0131', 'Birrarung Marr', 'park', 'Public park, garden or reserve', -37.81806108403, 144.97314667014),
    ('LM0205', 'Carlton Gardens North', 'park', 'Public park, garden or reserve', -37.8017690847403, 144.971997551189),
    ('LM0218', 'Carlton Gardens South', 'park', 'Public park, garden or reserve', -37.8060684577258, 144.971266479841),
    ('LM0063', 'Darling Square', 'park', 'Public park, garden or reserve', -37.81299206932, 144.989062559512),
    ('LM0152', 'Docklands Park', 'park', 'Public park, garden or reserve', -37.8209956785618, 144.946781702342),
    ('LM0212', 'Enterprize Park', 'park', 'Public park, garden or reserve', -37.820210269629, 144.959276859602),
    ('LM0210', 'Fawkner Park', 'park', 'Public park, garden or reserve', -37.8413996708186, 144.981625667877),
    ('LM0021', 'Fitzroy Gardens', 'park', 'Public park, garden or reserve', -37.8129616331579, 144.980455714669),
    ('LM0012', 'Flagstaff Gardens', 'park', 'Public park, garden or reserve', -37.8111222889277, 144.954696055235),
    ('LM0018', 'J.J Holland Park', 'park', 'Public park, garden or reserve', -37.7982358832177, 144.923837074813),
    ('LM0003', 'Kings Domain', 'park', 'Public park, garden or reserve', -37.8255239795833, 144.974107925144),
    ('LM0199', 'Lincoln Square', 'park', 'Public park, garden or reserve', -37.8027919689732, 144.962760852233),
    ('LM0076', 'Macarthur Square', 'park', 'Public park, garden or reserve', -37.7983318676737, 144.971514146104),
    ('LM0166', 'Murchinson Square', 'park', 'Public park, garden or reserve', -37.8002735025371, 144.973059252203),
    ('LM0109', 'New Quay', 'quiet_public_space', 'Public waterfront open space', -37.8152178789077, 144.941617889032),
    ('LM0017', 'Newmarket Reserve', 'park', 'Public park, garden or reserve', -37.7878473341234, 144.922972125346),
    ('LM0042', 'North Melbourne Recreation Reserve', 'park', 'Public park, garden or reserve', -37.7988345257153, 144.941452061463),
    ('LM0068', 'Parliament Reserve', 'park', 'Public park, garden or reserve', -37.809852620638, 144.973462202839),
    ('LM0165', 'Piazza Italia', 'quiet_public_space', 'Public square and open space', -37.8025164192523, 144.965863092947),
    ('LM0154', 'Point Park', 'park', 'Public park, garden or reserve', -37.8233522700646, 144.942102276731),
    ('LM0179', 'Powlett Reserve', 'park', 'Public park, garden or reserve', -37.8116929882498, 144.987275671763),
    ('LM0043', 'Princes Park', 'park', 'Public park, garden or reserve', -37.7870161727156, 144.961115214367),
    ('LM0108', 'Queen Victoria Gardens', 'park', 'Public park, garden or reserve', -37.8216381244891, 144.971049530478),
    ('LM0061', 'Royal Botanic Gardens', 'park', 'Public park, garden or reserve', -37.8306631583233, 144.980850432751),
    ('LM0235', 'Royal Park', 'park', 'Public park, garden or reserve', -37.7906174256581, 144.953834240647),
    ('LM0091', 'Shrine of Remembrance Reserve', 'park', 'Public park, garden or reserve', -37.8320733992876, 144.973628364465),
    ('LM0029', 'State Library Victoria', 'library', 'Public library and indoor rest space', -37.8099852201226, 144.964330322397),
    ('LM0023', 'The Melbourne Athenaeum Library', 'library', 'Public library and indoor rest space', -37.8148855756416, 144.967291289941),
    ('LM0101', 'Treasury Gardens', 'park', 'Public park, garden or reserve', -37.8143993575938, 144.975952335785),
    ('LM0143', 'University Square', 'park', 'Public park, garden or reserve', -37.800410711209, 144.960398319302),
    ('LM0014', 'Westgate Park', 'park', 'Public park, garden or reserve', -37.8314918578874, 144.908824792698),
    ('LM0237', 'Yarra Park', 'park', 'Public park, garden or reserve', -37.820469374101, 144.986671109615)
) as refuge(source_place_id, name, refuge_type, description, latitude, longitude)
on conflict (source_place_id) do update set
  data_source_id = excluded.data_source_id,
  name = excluded.name,
  refuge_type = excluded.refuge_type,
  description = excluded.description,
  latitude = excluded.latitude,
  longitude = excluded.longitude,
  is_active = true,
  updated_at = now();

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
