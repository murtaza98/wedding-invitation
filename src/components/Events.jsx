import Reveal from './Reveal'
import './Events.css'

// A slim arch motif — a nod to the masjid venues.
function ArchMark() {
  return (
    <svg className="ev-mark" viewBox="0 0 40 44" fill="none" aria-hidden="true">
      <path
        d="M8 42 V20 a12 12 0 0 1 24 0 V42"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path d="M20 8 v-6 M17 4 h6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="20" cy="20" r="2" fill="currentColor" />
    </svg>
  )
}

export default function Events({ title, events }) {
  return (
    <section className="ev" id="events">
      <img className="ev-header-img" src="/event-header.png" alt="" aria-hidden="true" />
      <Reveal className="ev-head">
        <p className="eyebrow">Save these days</p>
        <h2 className="ev-title">{title}</h2>
      </Reveal>

      <div className="ev-grid">
        {events.map((event, i) => (
          <Reveal key={event.name} delay={i * 120} className="ev-card">
            <ArchMark />
            <p className="ev-name eyebrow">{event.name}</p>
            <p className="ev-venue">{event.venue}</p>
            <p className="ev-area">{event.area}</p>
            <div className="ev-when">
              <span className="ev-date">{event.date}</span>
              <span className="ev-dot">·</span>
              <span className="ev-time">{event.time}</span>
            </div>
            <p className="ev-hijri">{event.hijri}</p>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
