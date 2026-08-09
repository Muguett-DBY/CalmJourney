import { useCallback, useEffect, useMemo, useState } from 'react'
import InnerHeader from '../components/InnerHeader.jsx'
import RefugeMap from '../components/RefugeMap.jsx'
import { getNearbyRefuges } from '../services/refugeService.js'
import {
  estimateWalkingMinutes,
  formatDistance,
  formatRefugeType,
  nextWalkingMinutes,
} from '../utils/refuges.js'

const defaultLocation = {
  latitude: -37.8136,
  longitude: 144.9631,
}

const filters = [
  { label: 'All', value: '' },
  { label: 'Parks', value: 'park' },
  { label: 'Libraries', value: 'library' },
  { label: 'Quiet public spaces', value: 'quiet_public_space' },
]

export default function RefugePage() {
  const [location, setLocation] = useState(defaultLocation)
  const [locationLabel, setLocationLabel] = useState('Melbourne CBD')
  const [locationMessage, setLocationMessage] = useState('Showing refuges near Melbourne CBD.')
  const [activeFilter, setActiveFilter] = useState('')
  const [walkingMinutes, setWalkingMinutes] = useState(10)
  const [refuges, setRefuges] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')
  const [locating, setLocating] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    setStatus('loading')
    setError('')

    getNearbyRefuges({
      latitude: location.latitude,
      longitude: location.longitude,
      walkingMinutes,
      type: activeFilter,
      signal: controller.signal,
    })
      .then((data) => {
        setRefuges(data)
        setSelectedId(data[0]?.id ?? null)
        setStatus('ready')
      })
      .catch((requestError) => {
        if (requestError.name === 'AbortError') return
        setError(requestError.message)
        setStatus('error')
      })

    return () => controller.abort()
  }, [activeFilter, location, walkingMinutes])

  const selectedRefuge = useMemo(
    () => refuges.find((refuge) => refuge.id === selectedId),
    [refuges, selectedId],
  )

  const selectRefuge = useCallback((id) => setSelectedId(id), [])

  function useCurrentLocation() {
    setLocating(true)
    setLocationMessage('Requesting your current location...')

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLocation({ latitude: coords.latitude, longitude: coords.longitude })
        setLocationLabel('your location')
        setLocationMessage('Your location is used only for this nearby search.')
        setLocating(false)
      },
      () => {
        setLocationMessage('Location access was not granted. Showing Melbourne CBD instead.')
        setLocating(false)
      },
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }

  const directionsUrl = selectedRefuge
    ? `https://www.google.com/maps/dir/?api=1&destination=${selectedRefuge.latitude},${selectedRefuge.longitude}&travelmode=walking`
    : undefined

  return (
    <div className="page-shell refuge-page">
      <InnerHeader active="Refuges" />

      <main className="refuge-main">
        <section className="refuge-intro" aria-labelledby="refuge-heading">
          <div>
            <h1 id="refuge-heading">Sensory refuge map</h1>
            <p>Find parks, libraries and calm public spaces near your current location.</p>
            <span className="location-message" aria-live="polite">{locationMessage}</span>
          </div>
          <button
            className="button button--primary location-button"
            type="button"
            onClick={useCurrentLocation}
            disabled={locating}
          >
            {locating ? 'Finding your location...' : 'Use my location'}
          </button>
        </section>

        <div className="refuge-layout">
          <div className="refuge-map-column">
            <section className="refuge-filters" aria-label="Refuge filters">
              <div className="refuge-filter-group">
                {filters.map((filter) => (
                  <button
                    className={`filter-pill${activeFilter === filter.value ? ' filter-pill--active' : ''}`}
                    type="button"
                    key={filter.label}
                    onClick={() => setActiveFilter(filter.value)}
                    aria-pressed={activeFilter === filter.value}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
              <div className="walking-filter">
                <span>Walking distance</span>
                <button
                  className="filter-pill walking-filter__value"
                  type="button"
                  onClick={() => setWalkingMinutes(nextWalkingMinutes(walkingMinutes))}
                  aria-label={`Change walking distance. Current limit ${walkingMinutes} minutes`}
                >
                  {walkingMinutes} min
                </button>
              </div>
            </section>

            <figure className="refuge-map-frame">
              <RefugeMap
                location={location}
                refuges={refuges}
                selectedId={selectedId}
                onSelect={selectRefuge}
              />
            </figure>
          </div>

          <aside className="quiet-spaces-panel" aria-labelledby="quiet-spaces-heading">
            <div className="quiet-spaces-panel__heading">
              <h2 id="quiet-spaces-heading">Nearby refuge locations</h2>
              <p>Sorted by distance from {locationLabel}</p>
            </div>

            <div className="quiet-spaces-list" aria-live="polite">
              {status === 'loading' ? <p className="refuge-status">Finding nearby places...</p> : null}
              {status === 'error' ? <p className="refuge-status refuge-status--error">{error}</p> : null}
              {status === 'ready' && refuges.length === 0 ? (
                <p className="refuge-status">No matching places were found within {walkingMinutes} minutes.</p>
              ) : null}
              {status === 'ready' ? refuges.map((refuge) => (
                <button
                  className={`quiet-space-card${selectedId === refuge.id ? ' quiet-space-card--selected' : ''}`}
                  type="button"
                  onClick={() => selectRefuge(refuge.id)}
                  aria-pressed={selectedId === refuge.id}
                  key={refuge.id}
                >
                  <strong>{refuge.name}</strong>
                  <span className="quiet-space-card__meta">
                    {formatRefugeType(refuge.refuge_type)} · {estimateWalkingMinutes(refuge.distance_m)} min · {formatDistance(refuge.distance_m)}
                  </span>
                  <span className="quiet-space-card__footer">
                    <span className="refuge-type-pill">Open data</span>
                    <span>{refuge.description}</span>
                  </span>
                </button>
              )) : null}
            </div>

            <a
              className={`button button--primary navigate-button${selectedRefuge ? '' : ' navigate-button--disabled'}`}
              href={directionsUrl}
              target={selectedRefuge ? '_blank' : undefined}
              rel={selectedRefuge ? 'noreferrer' : undefined}
              aria-disabled={!selectedRefuge}
              onClick={(event) => {
                if (!selectedRefuge) event.preventDefault()
              }}
            >
              {selectedRefuge ? `Directions to ${selectedRefuge.name}` : 'Select a refuge for directions'}
            </a>
          </aside>
        </div>
      </main>
    </div>
  )
}
