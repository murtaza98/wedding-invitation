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
          <img
            src={base + 'scratch-hand.png'}
            className="hero-hand-img"
            alt=""
            draggable="false"
          />
        </div>
      </div>
    </section>
  )
}
