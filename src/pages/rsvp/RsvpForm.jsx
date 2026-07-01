import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { submitRsvp } from '../../lib/rsvp'
import { clearRsvpSession, loadRsvpSession } from '../../lib/rsvpSession'

const MEAL_OPTIONS = [
  { value: 'standard', label: 'Standard' },
  { value: 'vegetarian', label: 'Végétarien' },
  { value: 'vegan', label: 'Végan' },
  { value: 'allergie', label: 'Allergies particulières' },
]

function validateGuests(guests) {
  for (const guest of guests) {
    if (typeof guest.attending !== 'boolean') {
      return 'Veuillez répondre pour chaque invité.'
    }
    if (guest.attending && guest.isOpenSlot && (!guest.firstName?.trim() || !guest.lastName?.trim())) {
      return 'Veuillez indiquer le nom de chaque invité présent.'
    }
    if (guest.attending && !guest.mealChoice) {
      return 'Veuillez choisir un repas pour chaque invité présent.'
    }
  }
  return null
}

function RsvpForm() {
  const navigate = useNavigate()
  const [session, setSession] = useState(undefined)
  const [guests, setGuests] = useState([])
  const [message, setMessage] = useState('')
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const stored = loadRsvpSession()
    if (!stored) {
      navigate('/rsvp', { replace: true })
      return
    }
    setSession(stored)
    setGuests(stored.guests.map((guest) => ({ ...guest })))
    setMessage(stored.invitation.messageToCouple || '')
  }, [navigate])

  if (!session) return null

  const readOnly = session.invitation.rsvpStatus !== 'pending'

  function updateGuest(id, patch) {
    setGuests((prev) => prev.map((guest) => (guest.id === id ? { ...guest, ...patch } : guest)))
  }

  async function handleSubmit(e) {
    e.preventDefault()

    const validationError = validateGuests(guests)
    if (validationError) {
      setError(validationError)
      return
    }

    setError(null)
    setSubmitting(true)

    try {
      await submitRsvp(session.code, guests, message)
      clearRsvpSession()
      navigate('/rsvp/merci')
    } catch {
      setError("Une erreur est survenue lors de l'envoi. Veuillez réessayer.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="rsvp-page">
      <div className="wrap narrow">
        <Link className="rsvp-back" to="/">‹ Retour</Link>
        <p className="eyebrow center">Réponse souhaitée</p>
        <h1 className="section-title center">{session.invitation.householdName}</h1>
        {readOnly && (
          <p className="lede center">
            Merci, votre réponse a déjà été enregistrée
            {session.invitation.rsvpStatus === 'confirmed' ? ' — nous avons hâte de vous voir !' : '.'}
          </p>
        )}

        <form className="guest-form" onSubmit={handleSubmit}>
          {guests.map((guest) => (
            <div className="guest-card" key={guest.id}>
              {guest.isOpenSlot ? (
                <div className="guest-name-fields">
                  <input
                    type="text"
                    placeholder="Prénom"
                    value={guest.firstName || ''}
                    onChange={(e) => updateGuest(guest.id, { firstName: e.target.value })}
                    disabled={readOnly}
                  />
                  <input
                    type="text"
                    placeholder="Nom"
                    value={guest.lastName || ''}
                    onChange={(e) => updateGuest(guest.id, { lastName: e.target.value })}
                    disabled={readOnly}
                  />
                </div>
              ) : (
                <h3>
                  {guest.firstName} {guest.lastName}
                </h3>
              )}

              <div className="attending-toggle">
                <label>
                  <input
                    type="radio"
                    name={`attending-${guest.id}`}
                    checked={guest.attending === true}
                    onChange={() => updateGuest(guest.id, { attending: true })}
                    disabled={readOnly}
                  />
                  Présent(e)
                </label>
                <label>
                  <input
                    type="radio"
                    name={`attending-${guest.id}`}
                    checked={guest.attending === false}
                    onChange={() => updateGuest(guest.id, { attending: false, mealChoice: '', allergies: '' })}
                    disabled={readOnly}
                  />
                  Absent(e)
                </label>
              </div>

              {guest.attending && (
                <div className="meal-fields">
                  <label className="label">Choix de repas</label>
                  <select
                    value={guest.mealChoice || ''}
                    onChange={(e) => updateGuest(guest.id, { mealChoice: e.target.value })}
                    disabled={readOnly}
                  >
                    <option value="" disabled>
                      Sélectionner…
                    </option>
                    {MEAL_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>

                  <label className="label">Allergies / restrictions</label>
                  <textarea
                    value={guest.allergies || ''}
                    onChange={(e) => updateGuest(guest.id, { allergies: e.target.value })}
                    disabled={readOnly}
                    placeholder="Aucune"
                  />
                </div>
              )}
            </div>
          ))}

          <div className="message-field">
            <label className="label">Message au couple (optionnel)</label>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} disabled={readOnly} />
          </div>

          {error && <p className="form-error">{error}</p>}

          {!readOnly && (
            <button className="btn" type="submit" disabled={submitting}>
              {submitting ? 'Envoi…' : 'Envoyer'}
            </button>
          )}
        </form>
      </div>
    </section>
  )
}

export default RsvpForm
