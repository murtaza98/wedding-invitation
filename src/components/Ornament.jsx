// A small gold flourish used inside .flourish dividers.
export default function Ornament() {
  return (
    <div className="flourish" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none">
        <path
          d="M12 2c1.6 2.8 1.6 5.8 0 8.6-1.6-2.8-1.6-5.8 0-8.6Z"
          fill="currentColor"
        />
        <path
          d="M12 22c-1.6-2.8-1.6-5.8 0-8.6 1.6 2.8 1.6 5.8 0 8.6Z"
          fill="currentColor"
        />
        <circle cx="12" cy="12" r="1.6" fill="currentColor" />
        <path
          d="M4 12c2.6-1.4 5.4-1.4 8 0-2.6 1.4-5.4 1.4-8 0Z"
          fill="currentColor"
          opacity="0.6"
        />
        <path
          d="M20 12c-2.6-1.4-5.4-1.4-8 0 2.6 1.4 5.4 1.4 8 0Z"
          fill="currentColor"
          opacity="0.6"
        />
      </svg>
    </div>
  )
}
