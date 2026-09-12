import { useEffect, useRef, useState } from 'react'

// Fades + lifts its children into view once, when scrolled near.
// Respects prefers-reduced-motion via the .reveal CSS (no transform there).
export default function Reveal({ children, as: Tag = 'div', delay = 0, className = '', style: styleProp, ...rest }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <Tag
      ref={ref}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`.trim()}
      style={{ ...(delay ? { transitionDelay: `${delay}ms` } : {}), ...styleProp }}
      {...rest}
    >
      {children}
    </Tag>
  )
}
