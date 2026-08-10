const HISTORICAL_WEIGHT = 0.7
const LIVE_WEIGHT = 0.3

export function classifyCrowdRisk({ predictedCount, mediumThreshold, highThreshold }) {
  if (predictedCount >= highThreshold) {
    return {
      riskLevel: 'high',
      shouldAlert: true,
      reason: 'Expected pedestrian activity is above this location\'s busy-hour threshold.',
    }
  }

  if (predictedCount >= mediumThreshold) {
    return {
      riskLevel: 'medium',
      shouldAlert: false,
      reason: 'Expected pedestrian activity is around this location\'s usual level.',
    }
  }

  return {
    riskLevel: 'low',
    shouldAlert: false,
    reason: 'Expected pedestrian activity is below this location\'s usual level.',
  }
}

export function buildCrowdForecast({ sensor, currentCount }) {
  const historicalAverage = Number(sensor.averageCount)
  const liveCount = currentCount === null ? null : Number(currentCount)
  const predictedCount = liveCount === null
    ? Math.round(historicalAverage)
    : Math.round(
      historicalAverage * HISTORICAL_WEIGHT + liveCount * LIVE_WEIGHT,
    )
  const classification = classifyCrowdRisk({
    predictedCount,
    mediumThreshold: Number(sensor.mediumThreshold),
    highThreshold: Number(sensor.highThreshold),
  })

  return {
    sensorId: sensor.locationId,
    areaName: sensor.areaName,
    lat: Number(sensor.lat),
    lng: Number(sensor.lng),
    distanceMeters: Number(sensor.distanceMeters),
    currentCount: liveCount,
    predictedCount,
    historicalAverage: Math.round(historicalAverage),
    mediumThreshold: Number(sensor.mediumThreshold),
    highThreshold: Number(sensor.highThreshold),
    historicalSampleCount: Number(sensor.sampleCount),
    ...classification,
  }
}

export function sortCrowdForecasts(forecasts) {
  const riskOrder = { high: 0, medium: 1, low: 2 }
  return [...forecasts].sort((left, right) => (
    riskOrder[left.riskLevel] - riskOrder[right.riskLevel]
    || left.distanceMeters - right.distanceMeters
  ))
}
