import { useEffect, useState } from 'react'
import config from './config'
import Envelope from './components/Envelope'
import Hero from './components/Hero'
import Invitation from './components/Invitation'
import ScratchDate from './components/ScratchDate'
import Events from './components/Events'
import Closing from './components/Closing'

export default function App() {
  const [opened, setOpened] = useState(false)

  // Lock scrolling while the sealed envelope is on screen.
  useEffect(() => {
    document.body.classList.toggle('is-locked', !opened)
    return () => document.body.classList.remove('is-locked')
  }, [opened])

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

      {!opened && <Envelope config={config.envelope} onOpen={handleOpen} />}
    </>
  )
}
