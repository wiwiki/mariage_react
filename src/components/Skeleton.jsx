// Shimmer placeholders shown while the first Strapi fetch is in flight.
// `onDark` switches to a light translucent shimmer for the olive/charcoal
// sections. Widths are strings ("60%", "12ch") so lines can vary naturally.
export function Skeleton({ width = '100%', height, onDark = false, className = '' }) {
  return (
    <span
      aria-hidden="true"
      className={`skeleton ${onDark ? 'skeleton-dark' : ''} ${className}`}
      style={{ width, height }}
    />
  )
}

export function SkeletonText({ lines = 3, onDark = false, className = '' }) {
  // Last line shorter, like a real paragraph.
  const widths = Array.from({ length: lines }, (_, i) => (i === lines - 1 ? '62%' : '100%'))
  return (
    <span aria-hidden="true" className={`skeleton-text ${className}`}>
      {widths.map((width, i) => (
        <Skeleton key={i} width={width} onDark={onDark} />
      ))}
    </span>
  )
}
