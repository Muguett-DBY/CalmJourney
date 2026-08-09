create table public.data_sources (
  id smallint generated always as identity primary key,
  source_key text not null unique,
  name text not null,
  dataset_url text not null,
  retrieved_on date not null
);

create table public.refuges (
  id bigint generated always as identity primary key,
  data_source_id smallint not null references public.data_sources(id),
  source_place_id text not null unique,
  name text not null,
  refuge_type text not null check (refuge_type in ('park', 'library', 'quiet_public_space')),
  description text not null,
  latitude double precision not null check (latitude between -90 and 90),
  longitude double precision not null check (longitude between -180 and 180),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index refuges_type_index on public.refuges(refuge_type);
create index refuges_coordinates_index on public.refuges(latitude, longitude);

alter table public.data_sources enable row level security;
alter table public.refuges enable row level security;

create policy "Public data sources are readable"
on public.data_sources for select
to anon, authenticated
using (true);

create policy "Active refuges are readable"
on public.refuges for select
to anon, authenticated
using (is_active);

grant select on public.data_sources to anon, authenticated;
grant select on public.refuges to anon, authenticated;

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
    round(distances.distance_m)::integer
  from distances
  where distances.distance_m <= max_distance_m
  order by distances.distance_m, distances.name
  limit 50;
$$;

grant execute on function public.nearby_refuges(double precision, double precision, integer, text)
to anon, authenticated;
