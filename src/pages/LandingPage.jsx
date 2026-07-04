import { useEffect, useRef, useState } from 'react'
import { useWeddingContent } from '../hooks/useWeddingContent'
import SplashScreen from '../components/SplashScreen'
import HeroSection from '../components/sections/HeroSection'
import StorySection from '../components/sections/StorySection'
import ProgrammeSection from '../components/sections/ProgrammeSection'
import VenueSection from '../components/sections/VenueSection'
import RsvpSection from '../components/sections/RsvpSection'
import SiteFooter from '../components/sections/SiteFooter'

// The splash never re-shows once content is cached: it stays up at least
// MIN_MS (so it doesn't blink on fast connections) and at most MAX_MS (past
// that, the page is revealed with skeletons rather than making guests wait).
const SPLASH_MIN_MS = 700
const SPLASH_MAX_MS = 2500

function useSplash(status) {
  // Only ever true if this mount started without cached content.
  const startedLoading = useRef(status === 'loading')
  const [minElapsed, setMinElapsed] = useState(false)
  const [maxElapsed, setMaxElapsed] = useState(false)

  useEffect(() => {
    if (!startedLoading.current) return
    const minTimer = setTimeout(() => setMinElapsed(true), SPLASH_MIN_MS)
    const maxTimer = setTimeout(() => setMaxElapsed(true), SPLASH_MAX_MS)
    return () => {
      clearTimeout(minTimer)
      clearTimeout(maxTimer)
    }
  }, [])

  return startedLoading.current && !maxElapsed && !(minElapsed && status === 'ready')
}

// HashRouter owns the URL hash for routing, so plain `href="#histoire"`
// anchors would be read as a route change. Scroll manually instead and keep
// the hash untouched.
function scrollToSection(e, id) {
  e.preventDefault()
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

function LandingPage() {
  const { content, status } = useWeddingContent()
  const splashOpen = useSplash(status)
  const loading = status === 'loading'

  return (
    <>
      <SplashScreen open={splashOpen} />

      <nav>
        <a href="#histoire" onClick={(e) => scrollToSection(e, 'histoire')}>Histoire</a>
        <a href="#programme" onClick={(e) => scrollToSection(e, 'programme')}>Programme</a>
        <a href="#lieu" onClick={(e) => scrollToSection(e, 'lieu')}>Lieu</a>
        <a href="#rsvp" onClick={(e) => scrollToSection(e, 'rsvp')}>RSVP</a>
      </nav>

      <HeroSection />
      <StorySection content={content} loading={loading} />
      <ProgrammeSection content={content} loading={loading} />
      <VenueSection content={content} loading={loading} />
      <RsvpSection content={content} loading={loading} />
      <SiteFooter content={content} loading={loading} />
    </>
  )
}

export default LandingPage
