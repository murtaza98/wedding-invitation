import { useEffect, useRef, useState } from 'react'
import './Hero.css'

const base = import.meta.env.BASE_URL
const DELAY = 3000   // ms after mount before hand appears
const SCROLL_THRESHOLD = 40  // px scrolled = user is intentionally browsing

export default function Hero({ names, tagline, place }) {
  const [showHand, setShowHand] = useState(false)
  const scrolledRef = useRef(false)
  const timerRef = useRef(null)

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > SCROLL_THRESHOLD) {
        scrolledRef.current = true
        setShowHand(false)
        clearTimeout(timerRef.current)
        window.removeEventListener('scroll', onScroll)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })

    timerRef.current = setTimeout(() => {
      if (!scrolledRef.current) setShowHand(true)
    }, DELAY)

    return () => {
      window.removeEventListener('scroll', onScroll)
      clearTimeout(timerRef.current)
    }
  }, [])

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
      {showHand && (
        <div className="hero-hand-wrap" aria-hidden="true">
          <img
            src={base + 'scratch-hand.png'}
            className="hero-hand-img"
            alt=""
            draggable="false"
          />
        </div>
      )}
      <div className="hero-footer">
        {place && <p className="hero-place">{place}</p>}
      </div>
    </section>
  )
}
