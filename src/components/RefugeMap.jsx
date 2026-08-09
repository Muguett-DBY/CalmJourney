import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const markerLabels = {
  park: 'P',
  library: 'L',
  quiet_public_space: 'Q',
}

export default function RefugeMap({ location, refuges, selectedId, onSelect }) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const markersRef = useRef(null)

  useEffect(() => {
    const map = L.map(containerRef.current, { zoomControl: true }).setView([-37.8136, 144.9631], 14)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map)

    mapRef.current = map
    markersRef.current = L.layerGroup().addTo(map)

    return () => {
      map.remove()
      mapRef.current = null
      markersRef.current = null
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    const markers = markersRef.current
    if (!map || !markers) return

    markers.clearLayers()
    map.setView([location.latitude, location.longitude], 14)

    L.circleMarker([location.latitude, location.longitude], {
      radius: 9,
      color: '#ffffff',
      weight: 3,
      fillColor: '#6a92a8',
      fillOpacity: 1,
    }).bindTooltip('You are here').addTo(markers)

    refuges.forEach((refuge) => {
      const selected = refuge.id === selectedId
      const icon = L.divIcon({
        className: 'refuge-marker-shell',
        html: `<span class="refuge-marker${selected ? ' refuge-marker--selected' : ''}">${markerLabels[refuge.refuge_type]}</span>`,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      })
      const marker = L.marker([refuge.latitude, refuge.longitude], { icon })
        .bindTooltip(refuge.name, { direction: 'top', offset: [0, -18] })
        .on('click', () => onSelect(refuge.id))
        .addTo(markers)

      if (selected) marker.openTooltip()
    })

    window.requestAnimationFrame(() => map.invalidateSize())
  }, [location, onSelect, refuges, selectedId])

  return (
    <div
      className="refuge-map refuge-map-canvas"
      ref={containerRef}
      role="region"
      aria-label="Interactive map of nearby sensory refuge locations"
    />
  )
}
