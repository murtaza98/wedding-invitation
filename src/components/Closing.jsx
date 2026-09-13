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
        </Reveal>
      </div>
      <div className="cl-floral-wrap">
        <img
          className="cl-floral"
          src={base + 'closing-bg.png'}
          alt=""
          aria-hidden="true"
        />
        <a
          className="cl-credit"
          href="https://murtaza98.github.io/wedding-invitation/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="cl-credit-line">This website was envisioned by Sakina</span>
          <span className="cl-credit-sep" aria-hidden="true"> &amp; </span>
          <span className="cl-credit-line">created by Murtaza</span>
        </a>
      </div>
    </footer>
  )
}
