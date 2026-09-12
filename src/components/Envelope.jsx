import { useEffect, useRef, useState } from 'react'
import './Envelope.css'

const IMG_W = 1536, IMG_H = 2532

// The closed envelope is a Gemini-generated image (rich embossed paper + wax
// seal). Tapping it plays the opening — the Gemini clip if one is provided,
// otherwise a soft glow-and-fade — then reveals the site behind.
export default function Envelope({ config, onOpen }) {
  const [phase, setPhase] = useState('idle') // idle → opening → fading → done
  const videoRef = useRef(null)
  const stageRef = useRef(null)
  const { image, video } = config

  const finish = () => {
    setPhase('done')
    onOpen()
  }

  const open = () => {
    if (phase !== 'idle') return
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      finish()
      return
    }
    setPhase('opening')
    if (video && videoRef.current) {
      const v = videoRef.current
      v.play().catch(() => {})
      // When the video ends, fade the stage out then reveal the site.
      // Guard with `fired` so the safety-net timeout can't double-fire.
      let fired = false
      const done = () => {
        if (fired) return
        fired = true
        setPhase('fading')
        window.setTimeout(finish, 800)
      }
      v.addEventListener('ended', done, { once: true })
      v.addEventListener('error', done, { once: true })
      window.setTimeout(done, 14000) // safety net
    } else {
      window.setTimeout(finish, 1500)
    }
  }

  // Dynamically position background gradient stops at the exact image boundary.
  // rgba(0,0,0,0.04) darkens the base gradient by ~4% on the right strip,
  // matching the image's right edge (229,220,206 vs actual 232,220,205 at top;
  // 228,216,200 vs 226,213,197 at bottom — under 3 units, imperceptible).
  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    const imgRatio = IMG_W / IMG_H

    const update = () => {
      const vw = window.innerWidth
      const vh = window.innerHeight
      if (vw / vh > imgRatio) {
        const ox = (vw - vh * imgRatio) / 2 / vw * 100
        stage.style.background = [
          `linear-gradient(to right, transparent ${ox.toFixed(2)}%, rgba(0,0,0,0.04) ${(100 - ox).toFixed(2)}%)`,
          'linear-gradient(to bottom, #EFE5D7, #EDE1D0)',
        ].join(', ')
        stage.style.setProperty('--img-offset-x', ox.toFixed(2) + '%')
      } else {
        stage.style.background = 'linear-gradient(to bottom, #EFE5D7, #EDE1D0)'
        stage.style.setProperty('--img-offset-x', '0%')
      }
    }

    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  useEffect(() => {
    if (phase !== 'idle') return
    const onKey = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        open()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [phase])

  if (phase === 'done') return null

  return (
    <div ref={stageRef} className={`env-stage phase-${phase} ${video ? 'has-video' : ''}`}>
      <button
        type="button"
        className="env"
        onClick={open}
        aria-label="Open the wedding invitation"
      >
        <img
          className="env-img"
          src={image}
          alt="Sealed wedding invitation envelope for Murtaza and Sakina"
        />
        {video && (
          <video
            ref={videoRef}
            className="env-video"
            src={video}
            muted
            playsInline
            preload="auto"
          />
        )}
        <span className="env-glow" aria-hidden="true" />
      </button>
    </div>
  )
}
