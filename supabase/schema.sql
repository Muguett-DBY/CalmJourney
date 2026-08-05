-- CalmJourney database schema (scaffold, subject to change)
-- Migrations live in supabase/migrations/, seed data in supabase/seed/

-- Refuges (quiet places)
CREATE TABLE IF NOT EXISTS refuges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  location geography(POINT, 4326),
  type text NOT NULL,            -- library / park / cafe / community
  quiet_level smallint DEFAULT 0 CHECK (quiet_level BETWEEN 0 AND 10),
  opening_hours jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Crowd observations
CREATE TABLE IF NOT EXISTS crowd_observations (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  sensor_id text NOT NULL,
  location geography(POINT, 4326),
  count integer NOT NULL,
  observed_at timestamptz NOT NULL
);

-- Route sensory scores
CREATE TABLE IF NOT EXISTS route_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  route_geojson jsonb NOT NULL,
  total_pressure numeric(5,2) NOT NULL,
  segments jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);
