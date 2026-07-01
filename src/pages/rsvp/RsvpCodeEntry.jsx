import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { verifyRsvpCode } from '../../lib/rsvp'
import { saveRsvpSession } from '../../lib/rsvpSession'

function RsvpCodeEntry() {
  const navigate = useNavigate()
  const [code, setCode] = useState('')
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()

    if (!/^\d{6}$/.test(code)) {
      setError('Le code doit contenir 6 chiffres.')
      return
    }

    setError(null)
    setSubmitting(true)

    try {
      const { invitation, guests } = await verifyRsvpCode(code)
      saveRsvpSession(code, invitation, guests)
      navigate('/rsvp/form')
    } catch (err) {
      setError(err.status === 404 ? 'Code invalide, veuillez réessayer.' : 'Une erreur est survenue, veuillez réessayer.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="rsvp-page center">
      <div className="wrap narrow">
        <Link className="rsvp-back" to="/">‹ Retour</Link>
        <p className="eyebrow">Réponse souhaitée</p>
        <h1 className="section-title">Entrez votre code</h1>
        <p className="lede">Le code à 6 chiffres se trouve sur votre carton d'invitation.</p>

        <form className="code-form" onSubmit={handleSubmit}>
          <input
            type="text"
            inputMode="numeric"
            pattern="\d*"
            maxLength={6}
            placeholder="000000"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            autoFocus
          />
          {error && <p className="form-error">{error}</p>}
          <button className="btn" type="submit" disabled={submitting}>
            {submitting ? 'Vérification…' : 'Continuer'}
          </button>
        </form>
      </div>
    </section>
  )
}

export default RsvpCodeEntry
