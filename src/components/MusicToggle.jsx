import { useEffect, useRef, useState } from 'react'
import './MusicToggle.css'

const base = import.meta.env.BASE_URL

export default function MusicToggle() {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    audio.volume = 0.35
    // Try silent autoplay; most browsers will block it — user taps to start
    audio.play().then(() => setPlaying(true)).catch(() => {})
  }, [])

  const toggle = () => {
    const audio = audioRef.current
    if (playing) {
      audio.pause()
      setPlaying(false)
    } else {
      audio.play()
      setPlaying(true)
    }
  }

  return (
    <>
      <audio ref={audioRef} src={base + 'back_music.mp3'} loop preload="none" />
      <button
        className={`music-btn ${playing ? 'is-playing' : ''}`}
        onClick={toggle}
        aria-label={playing ? 'Pause background music' : 'Play background music'}
        title={playing ? 'Pause music' : 'Play music'}
      >
        {playing ? (
          /* pause bars */
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <rect x="5" y="4" width="4" height="16" rx="1" />
            <rect x="15" y="4" width="4" height="16" rx="1" />
          </svg>
        ) : (
          /* musical note */
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M9 18V6l12-2v12" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
        )}
      </button>
    </>
  )
}
