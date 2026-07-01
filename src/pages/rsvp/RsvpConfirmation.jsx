import { Link } from 'react-router-dom'

function RsvpConfirmation() {
  return (
    <section className="rsvp-page center">
      <div className="wrap narrow">
        <p className="eyebrow">Merci</p>
        <h1 className="section-title">À très vite !</h1>
        <p className="lede">Votre réponse a bien été enregistrée. Merci d'avoir pris le temps de répondre.</p>
        <Link className="btn" to="/">
          Retour au mariage
        </Link>
      </div>
    </section>
  )
}

export default RsvpConfirmation
