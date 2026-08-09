export const walkingOptions = [10, 20, 30]

export function nextWalkingMinutes(currentMinutes) {
  const currentIndex = walkingOptions.indexOf(currentMinutes)
  return walkingOptions[(currentIndex + 1) % walkingOptions.length]
}

export function formatDistance(distanceMetres) {
  if (distanceMetres < 1000) return `${distanceMetres} m`
  return `${(distanceMetres / 1000).toFixed(1)} km`
}

export function estimateWalkingMinutes(distanceMetres) {
  return Math.max(1, Math.ceil(distanceMetres / 80))
}

export function formatRefugeType(type) {
  if (type === 'quiet_public_space') return 'Quiet public space'
  return type.charAt(0).toUpperCase() + type.slice(1)
}

export function formatRefugeLocation(refuge) {
  if (refuge.address) return refuge.address
  return `${refuge.suburb}, Victoria`
}

export function formatCoordinates(latitude, longitude) {
  return `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`
}
