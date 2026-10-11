const refugeTypes = new Set(['park', 'library', 'quiet_public_space'])

export async function onRequestGet({ request, env }) {
  const query = new URL(request.url).searchParams
  const latitudeValue = query.get('lat')
  const longitudeValue = query.get('lng')
  const latitude = latitudeValue?.trim() ? Number(latitudeValue) : NaN
  const longitude = longitudeValue?.trim() ? Number(longitudeValue) : NaN
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

  if (!env.SUPABASE_URL || !env.SUPABASE_PUBLISHABLE_KEY) {
    return Response.json({ error: 'Refuge data is temporarily unavailable.' }, { status: 503 })
  }

  // Keep upstream failures in the JSON error contract expected by the browser.
  try {
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

    if (!response.ok) {
      return Response.json({ error: 'Refuge data is temporarily unavailable.' }, { status: 502 })
    }

    const data = await response.json()
    return Response.json({ data })
  } catch {
    return Response.json({ error: 'Refuge data is temporarily unavailable.' }, { status: 502 })
  }
}
