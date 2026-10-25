import { useEffect, useRef, useState } from 'react'
import './Hero.css'

const base = import.meta.env.BASE_URL

export default function Hero({ names, tagline, active }) {
  const [showHand, setShowHand] = useState(false)
  const scrolledRef    = useRef(false)
  const nudgingRef     = useRef(false)
  const nudgeTimer     = useRef(null)
  const nudgeInterval  = useRef(null)
  const handTimer      = useRef(null)

  useEffect(() => {
    // Timers only start once the envelope has been dismissed (active = true)
    if (!active) return

    scrolledRef.current = false
    nudgingRef.current  = false

    const onScroll = () => {
      // Ignore scroll events we triggered ourselves via the nudge
      if (nudgingRef.current) return
      if (window.scrollY > 80) {
        scrolledRef.current = true
        setShowHand(false)
        clearInterval(nudgeInterval.current)
        window.removeEventListener('scroll', onScroll)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    // One nudge cycle: scroll down 90px then back up
    const doNudge = () => {
      if (scrolledRef.current) return
      nudgingRef.current = true
      window.scrollBy({ top: 90, behavior: 'smooth' })
      setTimeout(() => {
        if (!scrolledRef.current) window.scrollBy({ top: -90, behavior: 'smooth' })
        setTimeout(() => { nudgingRef.current = false }, 600)
      }, 1300)
    }

    // 10s: first nudge, then repeat every 4s until user scrolls
    nudgeTimer.current = setTimeout(() => {
      if (scrolledRef.current) return
      doNudge()
      nudgeInterval.current = setInterval(() => {
        if (scrolledRef.current) {
          clearInterval(nudgeInterval.current)
        } else {
          doNudge()
        }
      }, 4000)
    }, 10000)

    // 20s: show hand if still idle (nudge keeps looping alongside it)
    handTimer.current = setTimeout(() => {
      if (!scrolledRef.current) setShowHand(true)
    }, 20000)

    return () => {
      window.removeEventListener('scroll', onScroll)
      clearTimeout(nudgeTimer.current)
      clearInterval(nudgeInterval.current)
      clearTimeout(handTimer.current)
    }
  }, [active])

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
            src={base + 'scratch-hand-v2.png'}
            className="hero-hand-img"
            alt=""
            draggable="false"
          />
        </div>
      )}
    </section>
  )
}
