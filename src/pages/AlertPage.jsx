import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import InnerHeader from '../components/InnerHeader.jsx'
import { getCrowdForecast } from '../services/alertService.js'

const defaultLocation = {
  latitude: -37.8136,
  longitude: 144.9631,
}

export default function AlertPage() {
  const navigate = useNavigate()
  const [location, setLocation] = useState(defaultLocation)
  const [locationLabel, setLocationLabel] = useState('Melbourne CBD')
  const [forecast, setForecast] = useState(null)
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)
  const [locating, setLocating] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    setStatus('loading')
    setError('')

    getCrowdForecast({ ...location, signal: controller.signal })
      .then((data) => {
        setForecast(data)
        setStatus('ready')
      })
      .catch((requestError) => {
        if (requestError.name === 'AbortError') return
        setError(requestError.message)
        setStatus('error')
      })

    return () => controller.abort()
  }, [location, refreshKey])

  function useCurrentLocation() {
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLocation({ latitude: coords.latitude, longitude: coords.longitude })
        setLocationLabel('your location')
        setLocating(false)
      },
      () => {
        setError('Location access was not granted. Melbourne CBD is still selected.')
        setLocating(false)
      },
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }

  const summary = getSummary(forecast)

  return (
    <div className="page-shell">
      <InnerHeader active="Alerts" />

      <main className="inner-main alert-main">
        <section className="page-title-row alert-title-row">
          <div>
            <h1>One-hour crowd alerts</h1>
            <p>See which nearby areas may become overwhelming before you arrive.</p>
            <span className="alert-location-note">Showing predictions near {locationLabel}.</span>
          </div>
          <div className="alert-page-actions">
            <button
              className="button button--secondary compact-button"
              type="button"
              onClick={() => setRefreshKey((key) => key + 1)}
              disabled={status === 'loading'}
            >
              Refresh forecast
            </button>
            <button
              className="button button--primary compact-button"
              type="button"
              onClick={useCurrentLocation}
              disabled={locating}
            >
              {locating ? 'Finding location...' : 'Use my location'}
            </button>
          </div>
        </section>

        {status === 'loading' ? (
          <section className="dashboard-card alert-state" aria-live="polite">
            <h2>Preparing your forecast...</h2>
            <p>Checking historical patterns and the latest City of Melbourne counts.</p>
          </section>
        ) : null}

        {status === 'error' ? (
          <section className="dashboard-card alert-state alert-state--error" role="alert">
            <h2>Forecast unavailable</h2>
            <p>{error}</p>
          </section>
        ) : null}

        {status === 'ready' && forecast ? (
          <>
            <section className={`crowd-summary crowd-summary--${forecast.overallRiskLevel}`} aria-live="polite">
              <div>
                <span className={`status-pill${forecast.shouldAlert ? ' status-pill--danger' : ''}`}>
                  {summary.label}
                </span>
                <h2>{summary.title}</h2>
                <p>{summary.description}</p>
              </div>
              <dl className="crowd-summary__metrics">
                <div><dt>Forecast for</dt><dd>{formatTime(forecast.targetAt)}</dd></div>
                <div><dt>Areas checked</dt><dd>{forecast.alerts.length}</dd></div>
                <div><dt>Live data</dt><dd>{forecast.dataFreshness.liveObservedAt ? formatTime(forecast.dataFreshness.liveObservedAt) : 'Unavailable'}</dd></div>
              </dl>
            </section>

            <section className="crowd-alert-section" aria-labelledby="crowd-alert-heading">
              <div className="section-heading">
                <div>
                  <h2 id="crowd-alert-heading">Nearby pedestrian forecast</h2>
                  <span>Higher-risk areas are shown first.</span>
                </div>
              </div>

              {forecast.alerts.length === 0 ? (
                <div className="dashboard-card alert-state">
                  <h2>No pedestrian sensors found nearby</h2>
                  <p>Try using Melbourne CBD or a location closer to the city centre.</p>
                </div>
              ) : (
                <div className="crowd-alert-grid">
                  {forecast.alerts.map((alert) => (
                    <article className={`crowd-alert-card crowd-alert-card--${alert.riskLevel}`} key={alert.sensorId}>
                      <div className="crowd-alert-card__heading">
                        <div>
                          <span className={`status-pill${alert.riskLevel === 'high' ? ' status-pill--danger' : alert.riskLevel === 'medium' ? ' status-pill--warning' : ''}`}>
                            {alert.riskLevel} sensory load
                          </span>
                          <h3>{alert.areaName}</h3>
                          <p>{formatDistance(alert.distanceMeters)} away</p>
                        </div>
                        <strong className="forecast-count">{formatCount(alert.predictedCount)}</strong>
                      </div>

                      <p className="crowd-alert-card__reason">{alert.reason}</p>

                      <dl className="crowd-alert-card__data">
                        <div><dt>Predicted next hour</dt><dd>{formatCount(alert.predictedCount)}</dd></div>
                        <div><dt>Historical average</dt><dd>{formatCount(alert.historicalAverage)}</dd></div>
                        <div><dt>Current past hour</dt><dd>{alert.currentCount === null ? 'Not available' : formatCount(alert.currentCount)}</dd></div>
                      </dl>

                      <div className="crowd-alert-card__actions">
                        <button
                          className="button button--primary"
                          type="button"
                          onClick={() => navigate(`/refuges?lat=${alert.lat}&lng=${alert.lng}`)}
                        >
                          Find refuge nearby
                        </button>
                        <a
                          className="button button--secondary"
                          href={`https://www.google.com/maps/search/?api=1&query=${alert.lat},${alert.lng}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          View area on map
                        </a>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>

            {forecast.model ? (
              <section className="dashboard-card model-note">
                <div>
                  <h2>How this forecast is checked</h2>
                  <p>
                    The hourly baseline was tested against {Number(forecast.model.sample_count).toLocaleString('en-AU')} recent records.
                  </p>
                </div>
                <dl>
                  <div><dt>Risk classification accuracy</dt><dd>{forecast.model.classification_accuracy}%</dd></div>
                  <div><dt>Validation period</dt><dd>{formatDate(forecast.model.validation_start)}–{formatDate(forecast.model.validation_end)}</dd></div>
                </dl>
              </section>
            ) : null}
          </>
        ) : null}
      </main>
    </div>
  )
}

function getSummary(forecast) {
  if (!forecast) return { label: '', title: '', description: '' }
  const highCount = forecast.alerts.filter((alert) => alert.riskLevel === 'high').length

  if (highCount > 0) {
    return {
      label: 'Crowd alert',
      title: `${highCount} nearby ${highCount === 1 ? 'area is' : 'areas are'} likely to be busy`,
      description: 'Consider a nearby quiet place or allow extra time for your journey.',
    }
  }

  return {
    label: 'No high alerts',
    title: 'No unusually busy nearby areas are predicted',
    description: 'Conditions can change, so refresh the forecast before you travel.',
  }
}

function formatTime(value) {
  return new Intl.DateTimeFormat('en-AU', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'Australia/Melbourne',
  }).format(new Date(value))
}

function formatDate(value) {
  return new Intl.DateTimeFormat('en-AU', { day: 'numeric', month: 'short' }).format(new Date(value))
}

function formatCount(value) {
  return `${Number(value).toLocaleString('en-AU')} people`
}

function formatDistance(value) {
  return value < 1000 ? `${value} m` : `${(value / 1000).toFixed(1)} km`
}
