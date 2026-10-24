import { useCallback, useEffect, useRef, useState } from 'react'
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

    const draw = () => {
      ctx.globalCompositeOperation = 'source-over'
      ctx.drawImage(img, 0, 0, rect.width, rect.height)
      // title line
      ctx.fillStyle = 'rgba(60, 35, 15, 0.52)'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.font = "italic 600 1.35rem 'Cormorant Garamond', 'Cormorant', serif"
      ctx.fillText(data.foilTitle, rect.width / 2, rect.height / 2 - 13)
      // hint line
      ctx.font = "400 0.68rem 'Jost', sans-serif"
      ctx.fillStyle = 'rgba(60, 35, 15, 0.38)'
      ctx.fillText(data.foilHint, rect.width / 2, rect.height / 2 + 13)
    }

    const img = new Image()
    img.src = import.meta.env.BASE_URL + 'scratch-foil.png'
    if (img.complete) draw()
    else img.onload = draw
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
