import { useEffect, useState } from 'react'
import './Hero.css'

const base = import.meta.env.BASE_URL

export default function Hero({ names, tagline, place }) {
  const [hint, setHint] = useState('hidden') // hidden → visible → faded

  useEffect(() => {
    const show = setTimeout(() => setHint('visible'), 2200)
    const onScroll = () => {
      if (window.scrollY > 40) setHint('faded')
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      clearTimeout(show)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <section className="hero">
      <img
        className="hero-bg"
        src={base + 'hero-bg.png'}
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

      <div className={`hero-hint hint-${hint}`} aria-hidden="true">
        <p className="hero-hint-label">scroll to explore</p>
        <svg viewBox="0 0 24 16" width="28" height="18" fill="none" stroke="currentColor">
          <path d="M2 2l10 12L22 2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </section>
  )
}
