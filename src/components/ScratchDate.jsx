import { useCallback, useEffect, useRef, useState } from 'react'

const HAND_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 48" fill="none"><path d="M20 2C20 2 20 14 20 18C20 16 22 14 24 14C26 14 28 16 28 18V22C28 20 30 18 32 18C34 18 36 20 36 22V28C36 26 38 25 38 27V34C38 40 33 46 26 46H18C13 46 9 42 8 38L4 28C3 26 4 23 7 23C9 23 11 25 12 27V18C12 16 14 14 16 14C18 14 20 16 20 18V2C20 0 22 0 22 2" fill="#c9a84c" opacity="0.9"/><path d="M20 2C20 2 20 14 20 18M12 27V18C12 16 14 14 16 14C18 14 20 16 20 18M28 22V18C28 16 26 14 24 14C22 14 20 16 20 18M36 28V22C36 20 34 18 32 18C30 18 28 20 28 22M38 34V27C38 25 36 26 36 28M4 28L8 38C9 42 13 46 18 46H26C33 46 38 40 38 34" stroke="#8B6914" stroke-width="1.2" stroke-linecap="round"/></svg>`
import Reveal from './Reveal'
import './ScratchDate.css'

const BRUSH = 30
const THRESHOLD = 0.25

export default function ScratchDate({ data }) {
  const wrapRef = useRef(null)
  const canvasRef = useRef(null)
  const ctxRef = useRef(null)
  const drawingRef = useRef(false)
  const lastPtRef = useRef(null)
  const lastSampleRef = useRef(0)
  const [revealed, setRevealed] = useState(false)
  const revealedRef = useRef(false)
  const [scratched, setScratched] = useState(false)

  const reveal = useCallback(() => {
    if (revealedRef.current) return
    revealedRef.current = true
    setRevealed(true)
  }, [])

  const paintFoil = useCallback(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return
    const rect = wrap.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    const ctx = canvas.getContext('2d')
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctxRef.current = ctx

    const w = rect.width
    const h = rect.height

    // Muted champagne-gold gradient matching reference (more beige, less yellow)
    const base = ctx.createLinearGradient(0, h, w, 0)
    base.addColorStop(0,    '#c2b87c')
    base.addColorStop(0.28, '#d4cc96')
    base.addColorStop(0.52, '#e2dcb0')
    base.addColorStop(0.75, '#d8d09e')
    base.addColorStop(1,    '#c8be88')
    ctx.fillStyle = base
    ctx.fillRect(0, 0, w, h)

    // Soft radial bloom (upper-center highlight)
    const bloom = ctx.createRadialGradient(w * 0.4, h * 0.2, 0, w * 0.4, h * 0.35, w * 0.55)
    bloom.addColorStop(0,   'rgba(255,252,228,0.55)')
    bloom.addColorStop(0.55,'rgba(255,252,228,0.15)')
    bloom.addColorStop(1,   'rgba(255,252,228,0)')
    ctx.fillStyle = bloom
    ctx.fillRect(0, 0, w, h)

    // Subtle horizontal grain
    for (let y = 0; y < h; y += 2) {
      ctx.globalAlpha = 0.022
      ctx.fillStyle = y % 4 < 2 ? '#fffce0' : '#7a6820'
      ctx.fillRect(0, y, w, 1)
    }
    ctx.globalAlpha = 1

    // Block-centered text
    const titleSz = Math.max(18, Math.round(h * 0.16))
    const hintSz  = Math.max(11, Math.round(h * 0.076))
    const gap     = Math.round(h * 0.08)
    const totalH  = titleSz + gap + hintSz
    const titleY  = (h - totalH) / 2 + titleSz / 2
    const hintY   = titleY + titleSz / 2 + gap + hintSz / 2

    ctx.textAlign    = 'center'
    ctx.textBaseline = 'middle'

    ctx.font      = `italic 400 ${titleSz}px 'Cormorant Garamond', Georgia, serif`
    ctx.fillStyle = 'rgba(50, 32, 8, 0.68)'
    ctx.fillText(data.foilTitle, w / 2, titleY)

    ctx.font      = `400 ${hintSz}px 'Jost', Arial, sans-serif`
    ctx.fillStyle = 'rgba(50, 32, 8, 0.46)'
    ctx.fillText(data.foilHint, w / 2, hintY)
  }, [data.foilTitle, data.foilHint])

  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduce) { reveal(); return }
    paintFoil()
    const onResize = () => { if (!revealedRef.current) paintFoil() }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [paintFoil, reveal])

  const posFromEvent = e => {
    const rect = canvasRef.current.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  const scratchTo = ({ x, y }) => {
    const ctx = ctxRef.current
    if (!ctx) return
    ctx.globalCompositeOperation = 'destination-out'
    ctx.lineWidth = BRUSH * 2
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    const last = lastPtRef.current
    if (last) {
      ctx.beginPath(); ctx.moveTo(last.x, last.y); ctx.lineTo(x, y); ctx.stroke()
    } else {
      ctx.beginPath(); ctx.arc(x, y, BRUSH, 0, Math.PI * 2); ctx.fill()
    }
    lastPtRef.current = { x, y }
  }

  const sampleProgress = () => {
    const now = Date.now()
    if (now - lastSampleRef.current < 120) return
    lastSampleRef.current = now
    const canvas = canvasRef.current
    const ctx = ctxRef.current
    if (!canvas || !ctx) return
    const data32 = ctx.getImageData(0, 0, canvas.width, canvas.height).data
    let clear = 0
    for (let i = 3; i < data32.length; i += 64) { if (data32[i] < 12) clear++ }
    if (clear / (data32.length / 64) > THRESHOLD) reveal()
  }

  const onPointerDown = e => {
    if (revealedRef.current) return
    setScratched(true)
    drawingRef.current = true
    lastPtRef.current = null
    canvasRef.current.setPointerCapture?.(e.pointerId)
    scratchTo(posFromEvent(e))
  }
  const onPointerMove = e => {
    if (!drawingRef.current || revealedRef.current) return
    e.preventDefault(); scratchTo(posFromEvent(e)); sampleProgress()
  }
  const onPointerUp = () => {
    if (!drawingRef.current) return
    drawingRef.current = false; lastPtRef.current = null; sampleProgress()
  }

  return (
    <section className="scr" id="date">
      <Reveal className="scr-head">
        <p className="eyebrow">{data.eyebrow}</p>
        <h2 className="scr-title">{data.title}</h2>
      </Reveal>

      <Reveal delay={80} className="scr-subtitle">
        {data.subtitle.map((line, i) => <p key={i}>{line}</p>)}
      </Reveal>

      <Reveal delay={140} className="scr-stage">
        <div className="scr-frame">
        <div className={`scr-card ${revealed ? 'is-revealed' : ''}`} ref={wrapRef}>
          <div className="scr-content">
            <p className="scr-save eyebrow">{data.revealEyebrow}</p>
            <div className="scr-range">
              <span className="scr-range-main">{data.rangeLine1}</span>
              <span className="scr-range-year">{data.rangeYear}</span>
            </div>
            <p className="scr-tagline">{data.tagline}</p>
          </div>
          <canvas
            ref={canvasRef}
            className={`scr-canvas ${revealed ? 'is-cleared' : ''}`}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
            aria-hidden="true"
          />
          {!revealed && !scratched && (
            <div
              className="scr-hand"
              aria-hidden="true"
              dangerouslySetInnerHTML={{ __html: HAND_SVG }}
            />
          )}
        </div>

        </div>
        {!revealed && (
          <button type="button" className="scr-btn" onClick={reveal}>
            {data.revealButton}
          </button>
        )}
      </Reveal>

      {!revealed && (
        <Reveal delay={200} className="scr-hint-wrap">
          <p className="scr-hint">{data.hint}</p>
        </Reveal>
      )}
    </section>
  )
}
