import { useEffect, useRef } from 'react'
import './Loader.css'

export default function Loader({ progress, loaded, onDone }) {
  const ref = useRef(null)

  useEffect(() => {
    if (!loaded) return
    const el = ref.current
    if (!el) return
    el.classList.add('is-done')
    const t = setTimeout(onDone, 650)
    return () => clearTimeout(t)
  }, [loaded, onDone])

  return (
    <div ref={ref} className="ldr" aria-live="polite" aria-label="Loading">
      <span className="ldr-mono">M &amp; S</span>
      <div className="ldr-track" role="progressbar" aria-valuenow={Math.round(progress * 100)}>
        <div className="ldr-bar" style={{ width: `${progress * 100}%` }} />
      </div>
      <p className="ldr-label eyebrow">Loading</p>
    </div>
  )
}
