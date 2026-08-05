// Input validation utilities (scaffold)
export function validateCoordinate(value) {
  return typeof value === 'number' && value >= -90 && value <= 90
}
