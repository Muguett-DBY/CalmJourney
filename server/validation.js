// Input validation utilities (scaffold)
export function validateCoordinate(value) {
  return typeof value === 'number' && value >= -90 && value <= 90
}

export function validateLatitude(value) {
  return typeof value === 'number' && value >= -90 && value <= 90
}

export function validateLongitude(value) {
  return typeof value === 'number' && value >= -180 && value <= 180
}
