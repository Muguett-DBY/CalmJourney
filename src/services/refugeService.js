export async function getNearbyRefuges({ latitude, longitude, walkingMinutes, type, signal }) {
  const query = new URLSearchParams({
    lat: latitude.toString(),
    lng: longitude.toString(),
    minutes: walkingMinutes.toString(),
  })

  if (type) query.set('type', type)

  const response = await fetch(`/api/refuges/nearby?${query}`, { signal })
  const payload = await response.json()

  if (!response.ok) throw new Error(payload.error)

  return payload.data
}
