import Reveal from './Reveal'
import Ornament from './Ornament'
import './Closing.css'

export default function Closing({ initials, line, dua }) {
  return (
    <footer className="cl">
      <Reveal className="cl-inner">
        <span className="cl-mono">{initials}</span>
        <Ornament />
        <p className="cl-line">{line}</p>
        <p className="cl-dua">{dua}</p>
      </Reveal>
    </footer>
  )
}
