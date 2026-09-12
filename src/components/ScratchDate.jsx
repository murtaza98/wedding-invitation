import { useCallback, useEffect, useRef, useState } from 'react'
import Reveal from './Reveal'
import './ScratchDate.css'

const BRUSH = 30 // scratch radius in CSS pixels
const THRESHOLD = 0.25 // ~3-4 scratch strokes triggers auto-reveal

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
      ctx.fillStyle = 'rgba(70, 40, 20, 0.45)'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.font = "500 0.8rem 'Cormorant', serif"
      ctx.fillText(
        `✦  ${data.foilLabel.toUpperCase()}  ✦`,
        rect.width / 2,
        rect.height / 2,
      )
    }

    const img = new Image()
    img.src = '/scratch-foil.png'
    if (img.complete) {
      draw()
    } else {
      img.onload = draw
    }
  }, [data.foilLabel])

  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      reveal()
      return
    }
    paintFoil()
    const onResize = () => {
      if (!revealedRef.current) paintFoil()
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [paintFoil, reveal])

  const posFromEvent = (e) => {
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
      ctx.beginPath()
      ctx.moveTo(last.x, last.y)
      ctx.lineTo(x, y)
      ctx.stroke()
    } else {
      ctx.beginPath()
      ctx.arc(x, y, BRUSH, 0, Math.PI * 2)
      ctx.fill()
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
    const { width, height } = canvas
    const data32 = ctx.getImageData(0, 0, width, height).data
    let clear = 0
    // sample every 16th pixel for speed
    for (let i = 3; i < data32.length; i += 64) {
      if (data32[i] < 12) clear++
    }
    const total = data32.length / 64
    if (clear / total > THRESHOLD) reveal()
  }

  const onPointerDown = (e) => {
    if (revealedRef.current) return
    drawingRef.current = true
    lastPtRef.current = null
    canvasRef.current.setPointerCapture?.(e.pointerId)
    scratchTo(posFromEvent(e))
  }

  const onPointerMove = (e) => {
    if (!drawingRef.current || revealedRef.current) return
    e.preventDefault()
    scratchTo(posFromEvent(e))
    sampleProgress()
  }

  const onPointerUp = () => {
    if (!drawingRef.current) return
    drawingRef.current = false
    lastPtRef.current = null
    sampleProgress()
  }

  return (
    <section className="scr" id="date">
      <Reveal className="scr-head">
        <p className="eyebrow">{data.eyebrow}</p>
        <h2 className="scr-title">{data.title}</h2>
      </Reveal>

      <Reveal delay={120} className="scr-stage">
        <div className={`scr-card ${revealed ? 'is-revealed' : ''}`} ref={wrapRef}>
          <div className="scr-content">
            <p className="scr-event eyebrow">{data.event}</p>
            <p className="scr-weekday">{data.weekday}</p>
            <p className="scr-date">{data.date}</p>
            <p className="scr-hijri">{data.hijri}</p>
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

        {!revealed && (
          <button type="button" className="scr-btn" onClick={reveal}>
            {data.revealButton}
          </button>
        )}
      </Reveal>
    </section>
  )
}
