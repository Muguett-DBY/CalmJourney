export function findNearbyRefuges({
  userLocation,
  refuges,
  radiusMeters = 800,
  limit = 5,
}) {
  if (!isValidCoordinate(userLocation?.lat, userLocation?.lng)) {
    throw new Error('Valid user latitude and longitude are required')
  }

  return refuges
    .filter((refuge) => refuge.isCandidateRefuge === true)
    .filter((refuge) => isValidCoordinate(refuge.lat, refuge.lng))
    .map((refuge) => ({
      ...refuge,
      distanceMeters: Math.round(
        calculateDistanceMeters(
          userLocation.lat,
          userLocation.lng,
          refuge.lat,
          refuge.lng,
        ),
      ),
    }))
    .filter((refuge) => refuge.distanceMeters <= radiusMeters)
    .sort((a, b) => a.distanceMeters - b.distanceMeters)
    .slice(0, limit)
}

export function calculateDistanceMeters(lat1, lng1, lat2, lng2) {
  const earthRadiusMeters = 6371000

  const dLat = toRadians(lat2 - lat1)
  const dLng = toRadians(lng2 - lng1)

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) ** 2

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return earthRadiusMeters * c
}

export function isValidCoordinate(lat, lng) {
  return (
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  )
}

function toRadians(degrees) {
  return degrees * (Math.PI / 180)
}