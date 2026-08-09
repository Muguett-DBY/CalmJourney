alter table public.refuges
  add column if not exists address text,
  add column if not exists suburb text,
  add column if not exists opening_hours_text text,
  add column if not exists website_url text;

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

drop function public.nearby_refuges(double precision, double precision, integer, text);

create function public.nearby_refuges(
  user_lat double precision,
  user_lng double precision,
  max_distance_m integer default 800,
  requested_type text default null
)
returns table (
  id bigint,
  source_place_id text,
  name text,
  refuge_type text,
  description text,
  latitude double precision,
  longitude double precision,
  address text,
  suburb text,
  opening_hours_text text,
  website_url text,
  source_name text,
  source_url text,
  distance_m integer
)
language sql
stable
security invoker
set search_path = ''
as $$
  with distances as (
    select
      refuge.id,
      refuge.source_place_id,
      refuge.name,
      refuge.refuge_type,
      refuge.description,
      refuge.latitude,
      refuge.longitude,
      refuge.address,
      refuge.suburb,
      refuge.opening_hours_text,
      refuge.website_url,
      source.name as source_name,
      source.dataset_url as source_url,
      6371000 * 2 * asin(
        sqrt(
          least(
            1,
            power(sin(radians((refuge.latitude - user_lat) / 2)), 2) +
            cos(radians(user_lat)) * cos(radians(refuge.latitude)) *
            power(sin(radians((refuge.longitude - user_lng) / 2)), 2)
          )
        )
      ) as distance_m
    from public.refuges as refuge
    join public.data_sources as source on source.id = refuge.data_source_id
    where refuge.is_active
      and (requested_type is null or refuge.refuge_type = requested_type)
  )
  select
    distances.id,
    distances.source_place_id,
    distances.name,
    distances.refuge_type,
    distances.description,
    distances.latitude,
    distances.longitude,
    distances.address,
    distances.suburb,
    distances.opening_hours_text,
    distances.website_url,
    distances.source_name,
    distances.source_url,
    round(distances.distance_m)::integer
  from distances
  where distances.distance_m <= max_distance_m
  order by distances.distance_m, distances.name
  limit 50;
$$;

grant execute on function public.nearby_refuges(double precision, double precision, integer, text)
to anon, authenticated;
