import {
  findNearbySensors,
  getHourlyBaseline,
  getLatestMinuteCount,
  getLatestRefreshLog,
} from '../../../server/crowdRepository.js'
import { predictSensoryAlert } from '../../../server/predictionLogic.js'
import { ok, fail } from '../../../server/response.js'
import {
  validateLatitude,
  validateLongitude,
} from '../../../server/validation.js'

const DEFAULT_RADIUS_METERS = 800
const DEFAULT_THRESHOLD = 700
const DEFAULT_LIMIT = 3

// GET /api/alerts/predict - sensory stress prediction alerts
export async function onRequest(context) {
  const url = new URL(context.request.url)
  const lat = Number(url.searchParams.get('lat'))
  const lng = Number(url.searchParams.get('lng'))
  const radiusMeters = parsePositiveNumber(
    url.searchParams.get('radius'),
    DEFAULT_RADIUS_METERS,
  )
  const threshold = parsePositiveNumber(
    url.searchParams.get('threshold'),
    DEFAULT_THRESHOLD,
  )
  const limit = parsePositiveNumber(url.searchParams.get('limit'), DEFAULT_LIMIT)

  if (!validateLatitude(lat) || !validateLongitude(lng)) {
    return fail(400, 'Valid lat and lng query parameters are required')
  }

  const sensors = await findNearbySensors({ lat, lng, radiusMeters })

  if (sensors.length === 0) {
    return ok({
      userLocation: { lat, lng },
      generatedAt: new Date().toISOString(),
      overallRiskLevel: 'unknown',
      shouldAlert: false,
      alerts: [],
      dataFreshness: await getDataFreshness(),
      message: 'No nearby pedestrian sensor data is available for this location.',
    })
  }

  const alerts = await buildAlerts({ sensors, threshold, limit })
  const overallRiskLevel = getOverallRiskLevel(alerts)

  return ok({
    userLocation: { lat, lng },
    generatedAt: new Date().toISOString(),
    overallRiskLevel,
    shouldAlert: alerts.some((alert) => alert.shouldAlert),
    alerts,
    dataFreshness: await getDataFreshness(),
  })
}

async function buildAlerts({ sensors, threshold, limit }) {
  const alerts = []

  for (const sensor of sensors.slice(0, limit)) {
    const latest = await getLatestMinuteCount(sensor.locationId)
    const baseline = await getHourlyBaseline(sensor.locationId)

    if (!latest || !baseline) continue

    alerts.push({
      ...predictSensoryAlert({
        sensor,
        currentCount: latest.totalCount,
        sevenDayAverage: baseline.averageCount,
        threshold,
      }),
      latestObservedAt: latest.recordedAt,
      baselineSampleCount: baseline.sampleCount,
      baselineWindowDays: baseline.windowDays,
    })
  }

  return alerts
}

async function getDataFreshness() {
  const refreshLog = await getLatestRefreshLog()

  return {
    source: 'mock_supabase_clean_data',
    latestRefreshStatus: refreshLog.status,
    latestRefreshFinishedAt: refreshLog.finishedAt,
    cleanRows: refreshLog.cleanRows,
  }
}

function getOverallRiskLevel(alerts) {
  if (alerts.some((alert) => alert.riskLevel === 'high')) return 'high'
  if (alerts.some((alert) => alert.riskLevel === 'medium')) return 'medium'
  if (alerts.some((alert) => alert.riskLevel === 'low')) return 'low'
  return 'unknown'
}

function parsePositiveNumber(value, fallback) {
  const number = Number(value)
  return Number.isFinite(number) && number > 0 ? number : fallback
}
