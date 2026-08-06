import { useNavigate } from 'react-router-dom'
import InnerHeader from '../components/InnerHeader.jsx'
import ForecastMap from '../components/ForecastMap.jsx'

export default function ForecastPage() {
  const navigate = useNavigate()

  return (
    <div className="page-shell">
      <InnerHeader active="Forecast" />
      <main className="inner-main">
        <section className="page-title-row forecast-title">
          <div><h1>Sensory forecast map</h1><p>See which corridors may become overwhelming during the next hour.</p></div>
          <div className="forecast-controls" aria-label="Forecast time">
            <button className="time-pill" type="button">Now</button>
            <button className="time-pill time-pill--active" type="button">+30 min</button>
            <button className="time-pill" type="button">+60 min</button>
            <button className="button button--primary compact-button" type="button" onClick={() => navigate('/alerts')}>Save alert</button>
          </div>
        </section>

        <div className="forecast-layout">
          <figure className="forecast-map-frame"><ForecastMap /></figure>
          <aside className="forecast-insights">
            <h2>Forecast insights</h2>
            <span>Prediction for 5:10–5:45 PM</span>
            <div className="insight-block"><small>High-risk corridor</small><strong className="danger-text">Swanston Street</strong><span className="status-pill status-pill--danger">High</span><p>Expected peak pedestrian volume</p></div>
            <div className="insight-block"><small>Recommended route</small><span className="status-pill">Low sensory load</span><strong>Wellington Pde → Spring St → La Trobe St</strong><p>Avoids projected crowding and uses calmer streets.</p></div>
            <div className="metric"><span>Prediction confidence</span><strong>86%</strong><small>Validated against available city trends</small></div>
            <div className="metric"><span>Estimated extra time</span><strong>+4 minutes</strong></div>
            <button className="button button--primary insight-button" type="button" onClick={() => navigate('/alerts')}>Use lower-stress route</button>
          </aside>
        </div>
      </main>
    </div>
  )
}
