import { useEffect, useState } from 'react'

// First-visit loading screen, styled like an invitation envelope opening.
// Kept mounted briefly after `open` flips to false so the fade-out can play.
function SplashScreen({ open }) {
  const [rendered, setRendered] = useState(open)

  useEffect(() => {
    if (open) {
      setRendered(true)
      return
    }
    const timer = setTimeout(() => setRendered(false), 650)
    return () => clearTimeout(timer)
  }, [open])

  if (!rendered) return null

  return (
    <div className={`splash ${open ? '' : 'splash-out'}`} aria-hidden="true">
      <div className="splash-inner">
        <div className="splash-leaf">❦</div>
        <div className="splash-monogram script">A &amp; A</div>
        <div className="splash-bar">
          <span />
        </div>
      </div>
    </div>
  )
}

export default SplashScreen
