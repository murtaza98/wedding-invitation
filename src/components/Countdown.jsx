import { useEffect, useState } from 'react'
import Reveal from './Reveal'
import './Countdown.css'

function calcTimeLeft(targetISO) {
  const diff = new Date(targetISO) - Date.now()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  const s = Math.floor(diff / 1000)
  return {
    days:    Math.floor(s / 86400),
    hours:   Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  }
}

function Pad({ n }) {
  return String(n).padStart(2, '0')
}

export default function Countdown({ tagline, title, date, targetISO }) {
  const [time, setTime] = useState(() => calcTimeLeft(targetISO))

  useEffect(() => {
    const id = setInterval(() => setTime(calcTimeLeft(targetISO)), 1000)
    return () => clearInterval(id)
  }, [targetISO])

  const units = [
    { label: 'Days',    value: time.days },
    { label: 'Hours',   value: time.hours },
    { label: 'Minutes', value: time.minutes },
    { label: 'Seconds', value: time.seconds },
  ]

  return (
    <section className="cd" id="countdown">
      <div className="cd-content">
        <Reveal className="cd-head">
          <p className="cd-tagline">{tagline}</p>
          <h2 className="cd-title">{title}</h2>
          <p className="cd-date">{date}</p>
        </Reveal>

        <Reveal delay={120} className="cd-timer">
          {units.map((u, i) => (
            <div key={u.label} className="cd-unit-wrap">
              <div className="cd-unit">
                <span className="cd-num"><Pad n={u.value} /></span>
                <span className="cd-label">{u.label}</span>
              </div>
              {i < units.length - 1 && <span className="cd-colon" aria-hidden="true">:</span>}
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
