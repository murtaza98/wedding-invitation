import Reveal from './Reveal'
import Ornament from './Ornament'
import './Closing.css'

const clBg = `url(${import.meta.env.BASE_URL}closing-bg.png)`

export default function Closing({ initials, line, dua }) {
  return (
    <footer className="cl" style={{ '--cl-bg': clBg }}>
      <Reveal className="cl-inner">
        <span className="cl-mono">{initials}</span>
        <Ornament />
        <p className="cl-line">{line}</p>
        <p className="cl-dua">{dua}</p>
        <p className="cl-credit">Envisioned by Sakina &nbsp;·&nbsp; Crafted by Murtaza</p>
      </Reveal>
    </footer>
  )
}
