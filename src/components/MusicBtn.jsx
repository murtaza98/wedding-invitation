import { useState } from 'react'
import './MusicBtn.css'

export default function MusicBtn({ audioRef }) {
  const [playing, setPlaying] = useState(true)

  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
      setPlaying(false)
    } else {
      audio.play().catch(() => {})
      setPlaying(true)
    }
  }

  return (
    <button
      className={`mbtn ${playing ? 'mbtn--on' : 'mbtn--off'}`}
      onClick={toggle}
      aria-label={playing ? 'Pause music' : 'Play music'}
    >
      <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        {playing ? (
          /* animated bars when playing */
          <>
            <rect x="3" y="6" width="2.5" height="8" rx="1" className="mbtn-bar mbtn-bar1" />
            <rect x="7.5" y="4" width="2.5" height="12" rx="1" className="mbtn-bar mbtn-bar2" />
            <rect x="12" y="7" width="2.5" height="7" rx="1" className="mbtn-bar mbtn-bar3" />
            <rect x="16.5" y="5" width="2.5" height="10" rx="1" className="mbtn-bar mbtn-bar4" />
          </>
        ) : (
          /* static note when paused */
          <path d="M8 3v9.26A3 3 0 1 0 10 15V7h4V3H8z" />
        )}
      </svg>
    </button>
  )
}
