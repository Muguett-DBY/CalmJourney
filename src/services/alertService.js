export async function getCrowdForecast({ latitude, longitude, signal }) {
  const query = new URLSearchParams({
    lat: latitude.toString(),
    lng: longitude.toString(),
  })
  const response = await fetch(`/api/alerts/predict?${query}`, { signal })
  const payload = await response.json()

  if (!response.ok) throw new Error(payload.error)
  return payload.data
}
