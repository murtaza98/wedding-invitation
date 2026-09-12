import Reveal from './Reveal'
import Ornament from './Ornament'
import './Closing.css'

const base = import.meta.env.BASE_URL

export default function Closing({ initials, line, dua }) {
  return (
    <footer className="cl">
      <div className="cl-text">
        <Reveal className="cl-inner">
          <span className="cl-mono">{initials}</span>
          <Ornament />
          <p className="cl-line">{line}</p>
          <p className="cl-dua">{dua}</p>
          <p className="cl-credit">Envisioned by Sakina &nbsp;·&nbsp; Crafted by Murtaza</p>
        </Reveal>
      </div>
      <img
        className="cl-floral"
        src={base + 'closing-bg.png'}
        alt=""
        aria-hidden="true"
      />
    </footer>
  )
}
