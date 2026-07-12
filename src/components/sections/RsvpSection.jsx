import { Link } from 'react-router-dom'

// Fully static — the copy is final, so it renders instantly with no CMS
// fetch and no skeletons (same pattern as HeroSection.jsx).
function RsvpSection() {
  return (
    <section className="rsvp" id="rsvp">
      <div className="wrap">
        <p className="eyebrow">Réponse souhaitée</p>
        <h2 className="section-title">
          Nous serions ravis
          <br />
          de votre présence
        </h2>
        <p>
          Merci de confirmer votre présence avant le 15 septembre 2026. Pour toute question
          concernant l’hébergement ou le voyage, n’hésitez pas à nous écrire. De plus amples
          informations vous seront communiquées dans les mois à venir.
        </p>
        <Link className="btn" to="/rsvp">
          Confirmer ma présence
        </Link>
        <div className="date-line">19 · 06 · 2027 — Piémont, Italie</div>
      </div>
    </section>
  )
}

export default RsvpSection
