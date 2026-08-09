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
    'city-of-melbourne-libraries',
    'City of Melbourne library locations and opening hours',
    'https://www.melbourne.vic.gov.au/library-locations-and-opening-hours',
    '2026-08-10'
  ),
  (
    'state-library-victoria-visit',
    'State Library Victoria visitor information',
    'https://www.slv.vic.gov.au/visit',
    '2026-08-10'
  ),
  (
    'melbourne-athenaeum-library-contact',
    'Melbourne Athenaeum Library visitor information',
    'https://melbourneathenaeum.org.au/contact-us/',
    '2026-08-10'
  )
on conflict (source_key) do update set
  name = excluded.name,
  dataset_url = excluded.dataset_url,
  retrieved_on = excluded.retrieved_on;

with library_details as (
  select *
  from (
    values
      (
        'state-library-victoria-visit',
        'LM0029',
        'State Library Victoria',
        'Public library and indoor rest space',
        -37.8099852201226,
        144.964330322397,
        '328 Swanston Street, Melbourne VIC 3000',
        'Melbourne',
        E'Daily: 10am-6pm\nClosed on New Year''s Day, Good Friday, Christmas Day and Boxing Day',
        'https://www.slv.vic.gov.au/visit'
      ),
      (
        'melbourne-athenaeum-library-contact',
        'LM0023',
        'The Melbourne Athenaeum Library',
        'Public library and indoor rest space',
        -37.8148855756416,
        144.967291289941,
        'Level 1, 188 Collins Street, Melbourne VIC 3000',
        'Melbourne',
        E'Monday, Tuesday and Thursday: 10am-6pm\nWednesday: 10am-8pm\nFriday: 10am-4pm\nSaturday: 10am-2pm\nSunday: No opening hours listed',
        'https://melbourneathenaeum.org.au/contact-us/'
      ),
      (
        'city-of-melbourne-libraries',
        'COM-AER-LIBRARY-CITY',
        'City Library',
        'City public library and meeting place near Degraves Street',
        -37.816910000000,
        144.965840000000,
        '253 Flinders Lane, Melbourne VIC 3000',
        'Melbourne',
        E'Monday-Thursday: 9am-7pm\nFriday: 9am-6pm\nSaturday: 10am-4pm\nSunday: 12pm-4pm',
        'https://whatson.melbourne.vic.gov.au/things-to-do/city-library'
      ),
      (
        'city-of-melbourne-libraries',
        'COM-AER-LIBRARY-DOCKLANDS',
        'Library at The Dock',
        'Waterfront library and community hub with study areas',
        -37.820020000000,
        144.940550000000,
        '107 Victoria Harbour Promenade, Docklands VIC 3008',
        'Docklands',
        E'Monday-Thursday: 10am-7pm\nFriday: 1pm-6pm\nSaturday: 10am-4pm\nSunday: 12pm-4pm',
        'https://whatson.melbourne.vic.gov.au/things-to-do/library-at-the-dock'
      ),
      (
        'city-of-melbourne-libraries',
        'COM-AER-LIBRARY-EAST-MELBOURNE',
        'East Melbourne Library',
        'Sustainable public library designed for high indoor air quality',
        -37.815070000000,
        144.986380000000,
        '122 George Street, East Melbourne VIC 3002',
        'East Melbourne',
        E'Monday, Tuesday and Thursday: 10am-6pm\nWednesday: 10am-7pm\nFriday: 1pm-6pm\nSaturday: 10am-1pm\nSunday: 12pm-4pm',
        'https://whatson.melbourne.vic.gov.au/things-to-do/east-melbourne-library'
      ),
      (
        'city-of-melbourne-libraries',
        'COM-AER-LIBRARY-NORTH-MELBOURNE',
        'North Melbourne Library',
        'Community public library on Errol Street',
        -37.803550000000,
        144.949870000000,
        '66 Errol Street, North Melbourne VIC 3051',
        'North Melbourne',
        E'Monday-Thursday: 10am-7pm\nFriday: 1pm-6pm\nSaturday: 10am-4pm\nSunday: 12pm-4pm',
        'https://whatson.melbourne.vic.gov.au/things-to-do/north-melbourne-library'
      ),
      (
        'city-of-melbourne-libraries',
        'COM-LIBRARY-NARRM-NGARRGU',
        'narrm ngarrgu Library',
        'Public library with study spaces, makerspaces and a rooftop terrace',
        -37.807720000000,
        144.958420000000,
        '141 Therry Street, Melbourne VIC 3000',
        'Melbourne',
        E'Monday-Thursday: 10am-7pm\nFriday: 10am-6pm\nSaturday: 10am-4pm\nSunday: 12pm-4pm',
        'https://whatson.melbourne.vic.gov.au/things-to-do/narrm-ngarrgu-library'
      ),
      (
        'city-of-melbourne-libraries',
        'COM-LIBRARY-KATHLEEN-SYME',
        'Kathleen Syme Library and Community Centre',
        'Library and community centre with study spaces and free Wi-Fi',
        -37.798730000000,
        144.965250000000,
        '251 Faraday Street, Carlton VIC 3053',
        'Carlton',
        E'Monday-Thursday: 10am-7pm\nFriday: 1pm-6pm\nSaturday: 10am-4pm\nSunday: 12pm-4pm',
        'https://whatson.melbourne.vic.gov.au/things-to-do/kathleen-syme-library-and-community-centre'
      ),
      (
        'city-of-melbourne-libraries',
        'COM-LIBRARY-SOUTHBANK-BOYD',
        'Southbank Library at Boyd',
        'Public library in the heritage-listed Boyd Community Hub',
        -37.825580000000,
        144.961220000000,
        '207 City Road, Southbank VIC 3006',
        'Southbank',
        E'Monday: 10am-7pm\nTuesday-Thursday: 10am-6pm\nFriday: 1pm-6pm\nSaturday: 10am-1pm\nSunday: 12pm-4pm',
        'https://whatson.melbourne.vic.gov.au/things-to-do/southbank-library-at-boyd'
      )
  ) as details(
    source_key,
    source_place_id,
    name,
    description,
    latitude,
    longitude,
    address,
    suburb,
    opening_hours_text,
    website_url
  )
)
insert into public.refuges (
  data_source_id,
  source_place_id,
  name,
  refuge_type,
  description,
  latitude,
  longitude,
  address,
  suburb,
  opening_hours_text,
  website_url
)
select
  source.id,
  details.source_place_id,
  details.name,
  'library',
  details.description,
  details.latitude,
  details.longitude,
  details.address,
  details.suburb,
  details.opening_hours_text,
  details.website_url
from library_details as details
join public.data_sources as source on source.source_key = details.source_key
on conflict (source_place_id) do update set
  data_source_id = excluded.data_source_id,
  name = excluded.name,
  refuge_type = excluded.refuge_type,
  description = excluded.description,
  latitude = excluded.latitude,
  longitude = excluded.longitude,
  address = excluded.address,
  suburb = excluded.suburb,
  opening_hours_text = excluded.opening_hours_text,
  website_url = excluded.website_url,
  is_active = true,
  updated_at = now();

update public.refuges as refuge
set suburb = locations.suburb,
    updated_at = now()
from (
  values
    ('LM0156', 'Melbourne'),
    ('LM0046', 'Carlton'),
    ('LM0224', 'Melbourne'),
    ('LM0131', 'Melbourne'),
    ('LM0205', 'Carlton'),
    ('LM0218', 'Carlton'),
    ('LM0063', 'East Melbourne'),
    ('LM0152', 'Docklands'),
    ('LM0212', 'Melbourne'),
    ('LM0210', 'South Yarra'),
    ('LM0021', 'East Melbourne'),
    ('LM0012', 'Melbourne'),
    ('LM0018', 'Kensington'),
    ('LM0003', 'Melbourne'),
    ('LM0199', 'Carlton'),
    ('LM0076', 'Carlton'),
    ('LM0166', 'Carlton'),
    ('LM0109', 'Docklands'),
    ('LM0017', 'Kensington'),
    ('LM0042', 'North Melbourne'),
    ('LM0068', 'East Melbourne'),
    ('LM0165', 'Carlton'),
    ('LM0154', 'Docklands'),
    ('LM0179', 'East Melbourne'),
    ('LM0043', 'Carlton North'),
    ('LM0108', 'Melbourne'),
    ('LM0061', 'Melbourne'),
    ('LM0235', 'Parkville'),
    ('LM0091', 'Melbourne'),
    ('LM0101', 'East Melbourne'),
    ('LM0143', 'Carlton'),
    ('LM0014', 'Port Melbourne'),
    ('LM0237', 'East Melbourne'),
    ('VPA-35288', 'Melbourne'),
    ('VPA-35251', 'Melbourne'),
    ('VPA-35576', 'Southbank'),
    ('VPA-35883', 'Melbourne'),
    ('VPA-35790', 'East Melbourne'),
    ('VPA-35334', 'Melbourne'),
    ('VPA-35328', 'East Melbourne'),
    ('VPA-35827', 'West Melbourne'),
    ('VPA-35638', 'East Melbourne'),
    ('VPA-35779', 'East Melbourne'),
    ('VPA-35311', 'Southbank'),
    ('VPA-35631', 'Southbank'),
    ('VPA-35557', 'Southbank'),
    ('VPA-35402', 'Docklands'),
    ('VPA-35354', 'Docklands'),
    ('VPA-35218', 'North Melbourne')
) as locations(source_place_id, suburb)
where refuge.source_place_id = locations.source_place_id;

delete from public.data_sources as source
where source.source_key = 'city-of-melbourne-environmental-assets'
  and not exists (
    select 1 from public.refuges as refuge where refuge.data_source_id = source.id
  );

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
