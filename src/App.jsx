import { useCallback, useEffect, useRef, useState } from 'react'
import config from './config'
import Envelope from './components/Envelope'
import Hero from './components/Hero'
import Invitation from './components/Invitation'
import ScratchDate from './components/ScratchDate'
import Events from './components/Events'
import Closing from './components/Closing'
import Loader from './components/Loader'
import MusicBtn from './components/MusicBtn'

const PRELOAD_IMAGES = [
  'envelope.png',
  'hero-bg.png',
  'invitation-bg.png',
  'scratch-foil.png',
  'event-header.png',
  'closing-bg.png',
]
const TOTAL = PRELOAD_IMAGES.length + 1 // +1 for video

export default function App() {
  const [opened, setOpened] = useState(false)
  const audioRef = useRef(null)
  const [loaderVisible, setLoaderVisible] = useState(true)
  const [loadProgress, setLoadProgress] = useState(0)
  const [assetsReady, setAssetsReady] = useState(false)

  useEffect(() => {
    const base = import.meta.env.BASE_URL
    let count = 0
    const tick = () => {
      count++
      setLoadProgress(count / TOTAL)
    }

    const imgPromises = PRELOAD_IMAGES.map(
      name =>
        new Promise(resolve => {
          const img = new Image()
          img.onload = () => { tick(); resolve() }
          img.onerror = () => { tick(); resolve() }
          img.src = base + name
        }),
    )

    const videoPromise = new Promise(resolve => {
      const v = document.createElement('video')
      v.onloadedmetadata = () => { tick(); resolve() }
      v.onerror = () => { tick(); resolve() }
      v.preload = 'metadata'
      v.src = base + 'envelope-open.mp4'
    })

    const fallback = setTimeout(() => setAssetsReady(true), 12000)

    Promise.all([...imgPromises, videoPromise]).then(() =>
      setAssetsReady(true),
    )

    return () => clearTimeout(fallback)
  }, [])

  const handleLoaderDone = useCallback(() => setLoaderVisible(false), [])

  // Lock scrolling while the sealed envelope is on screen.
  useEffect(() => {
    document.body.classList.toggle('is-locked', !opened)
    return () => document.body.classList.remove('is-locked')
  }, [opened])

  const handleAnimationStart = useCallback(() => {
    const audio = audioRef.current
    if (audio) {
      audio.volume = 0.35
      audio.play().catch(() => {})
    }
  }, [])

  const handleOpen = () => {
    setOpened(true)
    window.scrollTo({ top: 0, behavior: 'auto' })
  }

  return (
    <>
      <main className="site">
        <Hero
          names={config.hero.names}
          tagline={config.hero.tagline}
          place={config.hero.place}
        />
        <Invitation data={config.invitation} />
        <ScratchDate data={config.scratch} />
        <Events title={config.eventsTitle} events={config.events} />
        <Closing
          initials={config.initials}
          line={config.closing.line}
          dua={config.closing.dua}
        />
      </main>

      {!opened && <Envelope config={config.envelope} onOpen={handleOpen} onStart={handleAnimationStart} />}

      <audio ref={audioRef} src={import.meta.env.BASE_URL + 'back_music.mp3'} loop preload="none" />
      {opened && <MusicBtn audioRef={audioRef} />}

      {loaderVisible && (
        <Loader
          progress={loadProgress}
          loaded={assetsReady}
          onDone={handleLoaderDone}
        />
      )}
    </>
  )
}
