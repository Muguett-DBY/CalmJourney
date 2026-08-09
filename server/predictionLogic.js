const DEFAULT_THRESHOLD = 700
const HIGH_RATIO = 1.4
const MEDIUM_RATIO = 1.1

export function classifyCrowdRisk({
  currentCount,
  sevenDayAverage,
  threshold = DEFAULT_THRESHOLD,
}) {
  const current = normaliseCount(currentCount)
  const average = normaliseCount(sevenDayAverage)
  const safeThreshold = normaliseCount(threshold) || DEFAULT_THRESHOLD
  const ratio = average > 0 ? current / average : null

  if (current >= safeThreshold || (ratio !== null && ratio >= HIGH_RATIO)) {
    return {
      riskLevel: 'high',
      sensoryLoad: 'high',
      shouldAlert: true,
      ratio: formatRatio(ratio),
      reason: 'Crowd level is significantly higher than the expected baseline.',
    }
  }

  if (ratio !== null && ratio >= MEDIUM_RATIO) {
    return {
      riskLevel: 'medium',
      sensoryLoad: 'medium',
      shouldAlert: false,
      ratio: formatRatio(ratio),
      reason: 'Crowd level is slightly higher than the expected baseline.',
    }
  }

  return {
    riskLevel: 'low',
    sensoryLoad: 'low',
    shouldAlert: false,
    ratio: formatRatio(ratio),
    reason: 'Crowd level is within the expected baseline.',
  }
}

export function predictSensoryAlert({
  sensor,
  currentCount,
  sevenDayAverage,
  threshold = DEFAULT_THRESHOLD,
}) {
  const classification = classifyCrowdRisk({
    currentCount,
    sevenDayAverage,
    threshold,
  })

  return {
    sensorId: sensor?.locationId ?? sensor?.sensorId ?? null,
    areaName: sensor?.name ?? sensor?.sensorDescription ?? 'Nearby area',
    lat: sensor?.lat ?? null,
    lng: sensor?.lng ?? null,
    distanceMeters: sensor?.distanceMeters ?? null,
    currentCount: normaliseCount(currentCount),
    sevenDayAverage: normaliseCount(sevenDayAverage),
    ...classification,
    message: buildAlertMessage(classification.riskLevel, sensor),
    recommendedActions: buildRecommendedActions(classification.shouldAlert),
  }
}

// Backwards-compatible wrapper used by existing scaffold tests.
export function predictCrowding(historical = [], weather, time) {
  const counts = historical
    .map((item) => normaliseCount(item?.totalCount ?? item?.count))
    .filter((count) => count > 0)

  if (counts.length === 0) {
    return { level: 'unknown', confidence: 0 }
  }

  const average = counts.reduce((sum, count) => sum + count, 0) / counts.length
  const current = counts[counts.length - 1]
  const result = classifyCrowdRisk({
    currentCount: current,
    sevenDayAverage: average,
  })

  return {
    level: result.riskLevel,
    confidence: 0.7,
    time,
    weather,
  }
}

function buildAlertMessage(riskLevel, sensor) {
  const areaName = sensor?.name ?? sensor?.sensorDescription ?? 'this area'

  if (riskLevel === 'high') {
    return `High pedestrian density is likely near ${areaName} within the next hour.`
  }

  if (riskLevel === 'medium') {
    return `Pedestrian density near ${areaName} may be higher than usual.`
  }

  return `Pedestrian density near ${areaName} is currently within the expected range.`
}

function buildRecommendedActions(shouldAlert) {
  if (!shouldAlert) return []

  return [
    {
      type: 'find_nearby_refuge',
      label: 'Find nearby quiet place',
      api: '/api/refuges/nearby',
    },
    {
      type: 'reroute',
      label: 'Find calmer route',
      api: '/api/routes/reroute',
    },
  ]
}

function normaliseCount(value) {
  const number = Number(value)
  if (!Number.isFinite(number) || number < 0) return 0
  return number
}

function formatRatio(ratio) {
  if (ratio === null) return null
  return Number(ratio.toFixed(2))
}
