const MOCK_SENSORS = [
  {
    locationId: 3,
    name: 'Melbourne Central',
    sensorDescription: 'Melbourne Central',
    lat: -37.81101524,
    lng: 144.96429485,
    status: 'A',
  },
  {
    locationId: 9,
    name: 'Southern Cross Station',
    sensorDescription: 'Southern Cross Station',
    lat: -37.81982992,
    lng: 144.95102555,
    status: 'A',
  },
  {
    locationId: 19,
    name: 'Chinatown-Swanston St',
    sensorDescription: 'Chinatown-Swanston St (North)',
    lat: -37.81237202,
    lng: 144.96550671,
    status: 'A',
  },
  {
    locationId: 41,
    name: 'Flinders Lane-Swanston St',
    sensorDescription: 'Flinders La-Swanston St (West)',
    lat: -37.81668634,
    lng: 144.96689733,
    status: 'A',
  },
]

const MOCK_LATEST_COUNTS = new Map([
  [3, { totalCount: 920, recordedAt: '2026-08-10T11:45:00.000Z' }],
  [9, { totalCount: 540, recordedAt: '2026-08-10T11:45:00.000Z' }],
  [19, { totalCount: 430, recordedAt: '2026-08-10T11:45:00.000Z' }],
  [41, { totalCount: 360, recordedAt: '2026-08-10T11:45:00.000Z' }],
])

const MOCK_BASELINES = new Map([
  [3, { averageCount: 610, sampleCount: 7, windowDays: 7 }],
  [9, { averageCount: 520, sampleCount: 7, windowDays: 7 }],
  [19, { averageCount: 390, sampleCount: 7, windowDays: 7 }],
  [41, { averageCount: 410, sampleCount: 7, windowDays: 7 }],
])

export async function findNearbySensors({ lat, lng, radiusMeters = 800 }) {
  return MOCK_SENSORS
    .map((sensor) => ({
      ...sensor,
      distanceMeters: Math.round(
        calculateDistanceMeters(lat, lng, sensor.lat, sensor.lng),
      ),
    }))
    .filter((sensor) => sensor.distanceMeters <= radiusMeters)
    .sort((a, b) => a.distanceMeters - b.distanceMeters)
}

export async function getLatestMinuteCount(locationId) {
  return MOCK_LATEST_COUNTS.get(Number(locationId)) ?? null
}

export async function getHourlyBaseline(locationId) {
  return MOCK_BASELINES.get(Number(locationId)) ?? null
}

export async function getLatestRefreshLog() {
  return {
    datasetKey: 'pedestrian_minute_counts',
    status: 'success',
    finishedAt: '2026-08-10T11:50:00.000Z',
    cleanRows: 3960,
    message: 'Mock refresh log for Feature 5 API prototype.',
  }
}

function calculateDistanceMeters(lat1, lng1, lat2, lng2) {
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

function toRadians(degrees) {
  return degrees * (Math.PI / 180)
}
