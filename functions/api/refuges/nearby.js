const refugeTypes = new Set(['park', 'library', 'quiet_public_space'])

export async function onRequestGet({ request, env }) {
  const query = new URL(request.url).searchParams
  const latitude = Number(query.get('lat'))
  const longitude = Number(query.get('lng'))
  const walkingMinutes = Number(query.get('minutes') ?? 10)
  const requestedType = query.get('type') || null

  if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
    return Response.json({ error: 'A valid latitude is required.' }, { status: 400 })
  }

  if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
    return Response.json({ error: 'A valid longitude is required.' }, { status: 400 })
  }

  if (![10, 20, 30].includes(walkingMinutes)) {
    return Response.json({ error: 'Walking distance must be 10, 20 or 30 minutes.' }, { status: 400 })
  }

  if (requestedType && !refugeTypes.has(requestedType)) {
    return Response.json({ error: 'The refuge type is not supported.' }, { status: 400 })
  }

  const response = await fetch(`${env.SUPABASE_URL}/rest/v1/rpc/nearby_refuges`, {
    method: 'POST',
    headers: {
      apikey: env.SUPABASE_PUBLISHABLE_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_lat: latitude,
      user_lng: longitude,
      max_distance_m: walkingMinutes * 80,
      requested_type: requestedType,
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    return Response.json({ error: 'Refuge data is temporarily unavailable.' }, { status: 502 })
  }

  return Response.json({ data })
}
