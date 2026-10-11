import './Hero.css'

const base = import.meta.env.BASE_URL

export default function Hero({ names, tagline, place }) {
  return (
    <section className="hero">
      <video
        className="hero-bg"
        src={base + 'hero-bg.mp4'}
        poster={base + 'hero-bg.png'}
        autoPlay
        loop
        muted
        playsInline
        aria-label={`${names} — ${tagline}`}
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
