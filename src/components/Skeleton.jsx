// Shimmer placeholder shown while the programme fetch is in flight (and by
// SmartImage while a photo loads). `onDark` switches to a light translucent
// shimmer for the olive/charcoal sections. Widths are strings ("60%", "12ch")
// so lines can vary naturally.
export function Skeleton({ width = '100%', height, onDark = false, className = '' }) {
  return (
    <span
      aria-hidden="true"
      className={`skeleton ${onDark ? 'skeleton-dark' : ''} ${className}`}
      style={{ width, height }}
    />
  )
}
