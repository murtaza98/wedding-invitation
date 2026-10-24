import { useEffect, useRef, useState } from 'react'
import './Hero.css'

const base = import.meta.env.BASE_URL

export default function Hero({ names, tagline, place }) {
  const [showHand, setShowHand] = useState(false)
  const scrolledRef  = useRef(false)
  const nudgeTimer   = useRef(null)
  const handTimer    = useRef(null)

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 80) {
        scrolledRef.current = true
        setShowHand(false)
        window.removeEventListener('scroll', onScroll)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    // 10s: gentle nudge — scroll down then back up (no hand shown)
    nudgeTimer.current = setTimeout(() => {
      if (scrolledRef.current) return
      window.scrollBy({ top: 90, behavior: 'smooth' })
      setTimeout(() => {
        if (!scrolledRef.current) window.scrollBy({ top: -90, behavior: 'smooth' })
      }, 1300)
    }, 10000)

    // 20s: show hand if still idle
    handTimer.current = setTimeout(() => {
      if (!scrolledRef.current) setShowHand(true)
    }, 20000)

    return () => {
      window.removeEventListener('scroll', onScroll)
      clearTimeout(nudgeTimer.current)
      clearTimeout(handTimer.current)
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
        <p className="hero-scroll-label">Scroll up</p>
      </div>
    </section>
  )
}
