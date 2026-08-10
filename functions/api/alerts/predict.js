import {
  buildCrowdForecast,
  sortCrowdForecasts,
} from '../../../server/predictionLogic.js'

const CITY_DATASET_URL = 'https://data.melbourne.vic.gov.au/api/explore/v2.1/catalog/datasets/pedestrian-counting-system-past-hour-counts-per-minute/records'
const DEFAULT_RADIUS_METERS = 2500
const DEFAULT_LIMIT = 8

export async function onRequestGet({ request, env }) {
  const query = new URL(request.url).searchParams

  if (!query.has('lat') || !query.has('lng')) {
    return Response.json({ error: 'Latitude and longitude are required.' }, { status: 400 })
  }

  const latitude = Number(query.get('lat'))
  const longitude = Number(query.get('lng'))
  const radiusMeters = Number(query.get('radius') || DEFAULT_RADIUS_METERS)
  const limit = Number(query.get('limit') || DEFAULT_LIMIT)

  if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
    return Response.json({ error: 'A valid latitude is required.' }, { status: 400 })
  }

  if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
    return Response.json({ error: 'A valid longitude is required.' }, { status: 400 })
  }

  const targetAt = new Date(Date.now() + 60 * 60 * 1000)
  const targetTime = getMelbourneTime(targetAt)
  const livePromise = getLiveCounts().catch(() => ({ counts: new Map(), observedAt: null }))
  const [patterns, model, live] = await Promise.all([
    getNearbyPatterns({
      env,
      latitude,
      longitude,
      radiusMeters,
      limit,
      dayType: targetTime.dayType,
      hour: targetTime.hour,
    }),
    getModelMetrics(env),
    livePromise,
  ])

  const forecasts = patterns.map((pattern) => buildCrowdForecast({
    sensor: {
      locationId: pattern.location_id,
      areaName: pattern.description || pattern.name,
      lat: pattern.latitude,
      lng: pattern.longitude,
      distanceMeters: pattern.distance_m,
      averageCount: pattern.average_count,
      mediumThreshold: pattern.medium_threshold,
      highThreshold: pattern.high_threshold,
      sampleCount: pattern.sample_count,
    },
    currentCount: live.counts.get(Number(pattern.location_id)) ?? null,
  }))
  const alerts = sortCrowdForecasts(forecasts)
  const overallRiskLevel = getOverallRiskLevel(alerts)

  return Response.json({
    data: {
      userLocation: { latitude, longitude },
      generatedAt: new Date().toISOString(),
      targetAt: targetAt.toISOString(),
      overallRiskLevel,
      shouldAlert: alerts.some((alert) => alert.shouldAlert),
      alerts,
      dataFreshness: {
        mode: live.observedAt ? 'live_and_historical' : 'historical_only',
        liveObservedAt: live.observedAt,
      },
      model,
      sources: {
        live: 'City of Melbourne Pedestrian Counting System - Past Hour Counts Per Minute',
        historical: 'City of Melbourne Pedestrian Counting System - Monthly Counts Per Hour',
      },
    },
  })
}

async function getNearbyPatterns({ env, latitude, longitude, radiusMeters, limit, dayType, hour }) {
  const response = await fetch(`${env.SUPABASE_URL}/rest/v1/rpc/nearby_crowd_patterns`, {
    method: 'POST',
    headers: {
      apikey: env.SUPABASE_PUBLISHABLE_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_lat: latitude,
      user_lng: longitude,
      target_day_type: dayType,
      target_hour: hour,
      max_distance_m: Math.round(radiusMeters),
      max_results: Math.round(limit),
    }),
  })

  if (!response.ok) {
    throw new Error('Crowd forecast data is unavailable.')
  }

  return response.json()
}

async function getModelMetrics(env) {
  const response = await fetch(
    `${env.SUPABASE_URL}/rest/v1/crowd_model_metrics?select=*&metric_key=eq.historical_hourly_baseline`,
    { headers: { apikey: env.SUPABASE_PUBLISHABLE_KEY } },
  )

  if (!response.ok) return null
  const rows = await response.json()
  return rows[0] ?? null
}

async function getLiveCounts() {
  const latestQuery = new URLSearchParams({
    order_by: 'sensing_datetime desc',
    limit: '1',
  })
  const latestResponse = await fetch(`${CITY_DATASET_URL}?${latestQuery}`)
  const latestPayload = await latestResponse.json()
  const observedAt = latestPayload.results[0].sensing_datetime
  const windowStart = new Date(new Date(observedAt).getTime() - 60 * 60 * 1000).toISOString()
  const countQuery = new URLSearchParams({
    select: 'location_id,max(sensing_datetime) as latest_at,sum(total_of_directions) as count_last_hour,count(*) as samples',
    where: `sensing_datetime >= '${windowStart}'`,
    group_by: 'location_id',
    limit: '200',
  })
  const countResponse = await fetch(`${CITY_DATASET_URL}?${countQuery}`)
  const countPayload = await countResponse.json()
  const counts = new Map(
    countPayload.results.map((record) => [Number(record.location_id), Number(record.count_last_hour)]),
  )

  return { counts, observedAt }
}

function getMelbourneTime(date) {
  const parts = new Intl.DateTimeFormat('en-AU', {
    timeZone: 'Australia/Melbourne',
    weekday: 'short',
    hour: 'numeric',
    hourCycle: 'h23',
  }).formatToParts(date)
  const weekday = parts.find((part) => part.type === 'weekday').value
  const hour = Number(parts.find((part) => part.type === 'hour').value)

  return {
    dayType: weekday === 'Sat' || weekday === 'Sun' ? 'weekend' : 'weekday',
    hour,
  }
}

function getOverallRiskLevel(alerts) {
  if (alerts.some((alert) => alert.riskLevel === 'high')) return 'high'
  if (alerts.some((alert) => alert.riskLevel === 'medium')) return 'medium'
  if (alerts.some((alert) => alert.riskLevel === 'low')) return 'low'
  return 'unknown'
}
