import { useEffect, useRef } from 'react'
import Reveal from './Reveal'
import './Events.css'

function TimelineFlower() {
  const petals = [0, 60, 120, 180, 240, 300]
  return (
    <svg viewBox="0 0 44 44" className="ev-flower-svg" aria-hidden="true">
      {petals.map(deg => (
        <ellipse
          key={deg}
          cx="22" cy="13"
          rx="3.5" ry="7.5"
          fill="#f8f0e3"
          stroke="#c9a84c"
          strokeWidth="0.7"
          transform={`rotate(${deg} 22 22)`}
        />
      ))}
      <circle cx="22" cy="22" r="4.5" fill="#c9a84c" />
      <circle cx="22" cy="22" r="2" fill="#f8f0e3" />
    </svg>
  )
}

export default function Events({ title, events }) {
  const sectionRef = useRef(null)
  const flowerRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    const flower = flowerRef.current
    if (!section || !flower) return

    const update = () => {
      const rect = section.getBoundingClientRect()
      const mid = window.innerHeight * 0.5
      const progress = Math.max(0, Math.min(1, (mid - rect.top) / rect.height))
      flower.style.top = `${progress * 100}%`
    }

    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => window.removeEventListener('scroll', update)
  }, [])

  return (
    <section className="ev" id="events" ref={sectionRef}>
      <div className="ev-content">
        <Reveal className="ev-head">
          <p className="eyebrow">Save these days</p>
          <h2 className="ev-title">{title}</h2>
        </Reveal>

        <div className="ev-timeline">
          <div className="ev-tl-line" />
          <div className="ev-tl-flower" ref={flowerRef}>
            <TimelineFlower />
          </div>

          {events.map((event, i) => (
            <Reveal
              key={event.name}
              delay={i * 120}
              className={`ev-tl-row${event.featured ? ' is-featured' : ''}`}
            >
              <div className="ev-tl-left">
                <p className="ev-tl-weekday">{event.weekday}</p>
                <p className="ev-tl-date">{event.date}</p>
                {Array.isArray(event.time)
                  ? event.time.map(t => <p key={t} className="ev-tl-time">{t}</p>)
                  : <p className="ev-tl-time">{event.time}</p>}
              </div>
              <div className="ev-tl-node">
                <div className="ev-tl-dot" />
              </div>
              <div className="ev-tl-right">
                <p className="ev-tl-name">{event.name}</p>
                <p className="ev-tl-venue">{event.venue}</p>
                <p className="ev-tl-area">{event.area}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
