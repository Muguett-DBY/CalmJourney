create or replace function public.nearby_refuges(
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
  limit 100;
$$;
