import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchWeddingPage, getStrapiMedia } from '../lib/strapi'
import defaultWeddingContent from '../content/defaultWeddingContent'

// Overlays whatever the Strapi single type returns onto the default copy,
// field by field, so an empty/unpublished field just keeps showing the default.
function mergeContent(base, remote) {
  if (!remote) return base

  const merged = { ...base }

  for (const key of Object.keys(base)) {
    const value = remote[key]

    if (key === 'programmeItems') {
      if (Array.isArray(value) && value.length > 0) {
        merged.programmeItems = value.map((item) => ({
          time: item.time ?? '',
          title: item.title ?? '',
          description: item.description ?? '',
        }))
      }
    } else if (key === 'heroImage' || key === 'venuePhoto') {
      const url = getStrapiMedia(value)
      if (url) merged[key] = url
    } else if (typeof value === 'string' && value.trim() !== '') {
      merged[key] = value
    }
  }

  return merged
}

// Renders text with literal "\n" line breaks (used for CMS fields that map
// onto multi-line headings) as separate lines.
function Multiline({ text }) {
  const lines = text.split('\n')
  return lines.map((line, i) => (
    <span key={i}>
      {i > 0 && <br />}
      {line}
    </span>
  ))
}

// HashRouter owns the URL hash for routing, so plain `href="#histoire"`
// anchors would be read as a route change. Scroll manually instead and keep
// the hash untouched.
function scrollToSection(e, id) {
  e.preventDefault()
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

function LandingPage() {
  const [content, setContent] = useState(defaultWeddingContent)

  useEffect(() => {
    const controller = new AbortController()

    fetchWeddingPage(controller.signal)
      .then((remote) => setContent((current) => mergeContent(current, remote)))
      .catch((err) => {
        if (err.name !== 'AbortError') {
          console.error('Falling back to default content — Strapi fetch failed:', err)
        }
      })

    return () => controller.abort()
  }, [])

  return (
    <>
      <nav>
        <a href="#histoire" onClick={(e) => scrollToSection(e, 'histoire')}>Histoire</a>
        <a href="#programme" onClick={(e) => scrollToSection(e, 'programme')}>Programme</a>
        <a href="#lieu" onClick={(e) => scrollToSection(e, 'lieu')}>Lieu</a>
        <a href="#rsvp" onClick={(e) => scrollToSection(e, 'rsvp')}>RSVP</a>
      </nav>

      {/* HERO */}
      <header className="hero" id="top" style={{ '--hero-image': `url(${content.heroImage})` }}>
        <div className="hero-leaf">❦</div>
        <p className="eyebrow">{content.heroEyebrow}</p>
        <div className="divider"></div>
        <h1>
          {content.brideName}
          <span className="script amp">&amp;</span>
          {content.groomName}
        </h1>
        <div className="meta">
          <span>{content.weddingDate}</span>
          <span className="venue">{content.venueNameShort}</span>
          <span className="venue">{content.venueLocationShort}</span>
        </div>
      </header>

      {/* HISTOIRE */}
      <section className="story center" id="histoire">
        <div className="wrap">
          <p className="eyebrow">{content.storyEyebrow}</p>
          <p className="script">
            <Multiline text={content.storyScript} />
          </p>
          <p className="lede">{content.storyLede}</p>
        </div>
      </section>

      {/* PROGRAMME */}
      <section className="program center" id="programme">
        <div className="wrap">
          <p className="eyebrow">{content.programmeEyebrow}</p>
          <h2 className="section-title">{content.programmeTitle}</h2>
          <div className="timeline">
            {content.programmeItems.map((item) => (
              <div className="tl-item" key={`${item.time}-${item.title}`}>
                <div className="tl-time">{item.time}</div>
                <div className="tl-event">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LIEU */}
      <section className="venue-sec center" id="lieu">
        <div className="wrap" style={{ maxWidth: '1000px' }}>
          <p className="eyebrow">{content.venueEyebrow}</p>
          <h2 className="section-title">{content.venueTitle}</h2>
          <p className="lede">{content.venueLede}</p>
          <div className="venue-grid">
            <img className="venue-photo" src={content.venuePhoto} alt={content.venuePhotoAlt} />
            <div className="venue-info">
              <h3>{content.venueName}</h3>
              <p className="addr">{content.venueAddress}</p>

              <span className="label">{content.howToReachLabel}</span>
              <p>{content.howToReachText}</p>

              <span className="label">{content.accommodationLabel}</span>
              <p>{content.accommodationText}</p>

              <span className="label">{content.venueContactLabel}</span>
              <p>{content.venueContactText}</p>

              <a className="map-link" href={content.mapUrl} target="_blank" rel="noopener">
                {content.mapLinkLabel}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* RSVP */}
      <section className="rsvp" id="rsvp">
        <div className="wrap">
          <p className="eyebrow">{content.rsvpEyebrow}</p>
          <h2 className="section-title">
            <Multiline text={content.rsvpTitle} />
          </h2>
          <p>{content.rsvpDeadlineText}</p>
          <Link className="btn" to="/rsvp">
            {content.rsvpButtonLabel}
          </Link>
          <div className="date-line">{content.rsvpDateLine}</div>
        </div>
      </section>

      <footer>
        <div className="script">{content.footerScript}</div>
        <div className="tagline">{content.footerTagline}</div>
      </footer>
    </>
  )
}

export default LandingPage
