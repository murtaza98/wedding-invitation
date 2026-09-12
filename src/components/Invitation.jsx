import Reveal from './Reveal'
import Ornament from './Ornament'
import './Invitation.css'

export default function Invitation({ data }) {
  const elders = [...data.elders]
  if (data.paternalGrandmother?.include) {
    elders.push(data.paternalGrandmother.line)
  }

  return (
    <section className="inv" id="invitation">
      <div className="inv-card">
        <Reveal>
          <p className="inv-bismillah" lang="ar" dir="rtl">
            {data.bismillah}
          </p>
        </Reveal>

        <Reveal delay={120}>
          <div className="inv-blessing">
            {data.blessing.map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        </Reveal>

        <Reveal delay={180}>
          <ul className="inv-elders">
            {elders.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={120}>
          <div className="inv-names">
            <p className="inv-name">{data.groom}</p>
            <p className="inv-connector">{data.connector}</p>
            <p className="inv-name">{data.bride}</p>
            <p className="inv-lineage">{data.brideLineage}</p>
          </div>
        </Reveal>

        <Reveal>
          <Ornament />
        </Reveal>

        <Reveal delay={120}>
          <div className="inv-regards">
            <p className="inv-regards-label eyebrow">{data.regardsLabel}</p>
            <p className="inv-regards-names">{data.regardsNames}</p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
