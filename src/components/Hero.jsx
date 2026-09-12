import './Hero.css'

export default function Hero({ names, tagline, place }) {
  return (
    <section className="hero">
      <img
        className="hero-bg"
        src="/hero-bg.png"
        alt={`${names} — ${tagline}`}
      />
      <div className="hero-footer">
        {place && <p className="hero-place">{place}</p>}
        <div className="hero-scroll" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor">
            <path
              d="M12 5v14M6 13l6 6 6-6"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </section>
  )
}
