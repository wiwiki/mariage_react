import { useEffect, useRef, useState } from 'react'

// Image with a shimmer placeholder that stays up until the image itself has
// loaded (not just until the CMS fetch settled), then fades the image in.
// onError also clears the shimmer so a broken URL degrades to the alt text
// instead of shimmering forever.
function SmartImage({ src, alt, className = '', imgClassName = '' }) {
  const [loaded, setLoaded] = useState(false)
  const imgRef = useRef(null)

  // Reset when the src swaps (defaults → CMS media), and handle images the
  // browser already had cached, whose load event can fire before React
  // attaches the listener.
  useEffect(() => {
    setLoaded(false)
    const img = imgRef.current
    if (img && img.complete && img.naturalWidth > 0) setLoaded(true)
  }, [src])

  return (
    <div className={`img-frame ${className}`}>
      {!loaded && <span className="skeleton skeleton-fill" aria-hidden="true" />}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className={`${imgClassName} ${loaded ? 'is-loaded' : ''}`}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
      />
    </div>
  )
}

export default SmartImage
