import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { submitRsvp } from '../../lib/rsvp'
import { clearRsvpSession, loadRsvpSession } from '../../lib/rsvpSession'
import AgeGroupPicker from '../../components/AgeGroupPicker'

const MEAL_OPTIONS = [
  { value: 'standard', label: 'Standard' },
  { value: 'vegetarian', label: 'Végétarien' },
  { value: 'vegan', label: 'Végan' },
  { value: 'allergie', label: 'Allergies particulières' },
]

const MAX_GUESTS = 10
const ALLERGIES_MAX_LENGTH = 200
const MESSAGE_MAX_LENGTH = 1000

const EMPTY_GUEST = {
  firstName: '',
  lastName: '',
  attending: null,
  mealChoice: '',
  allergies: '',
  ageGroup: 'adult',
}

function normalizeGuest(guest) {
  return {
    firstName: guest.firstName ?? '',
    lastName: guest.lastName ?? '',
    attending: typeof guest.attending === 'boolean' ? guest.attending : null,
    mealChoice: guest.mealChoice ?? '',
    allergies: guest.allergies ?? '',
    ageGroup: guest.ageGroup === 'child' || guest.ageGroup === 'baby' ? guest.ageGroup : 'adult',
  }
}

// Editable form shows one card per available slot (up to maxGuests, capped at
// 10 like the backend), prefilled with whatever guests the backend sent. The
// locked view only shows the guests that actually exist.
function buildSlots(invitation, guests, readOnly) {
  if (readOnly) return guests.map(normalizeGuest)
  const cap = Math.min(invitation.maxGuests || Math.max(guests.length, 1), MAX_GUESTS)
  return Array.from({ length: cap }, (_, i) =>
    guests[i] ? normalizeGuest(guests[i]) : { ...EMPTY_GUEST },
  )
}

// A slot counts as "used" once it has a name or an attendance answer —
// untouched slots are simply not submitted.
function isUsed(slot) {
  return Boolean(slot.firstName.trim() || slot.lastName.trim() || slot.attending !== null)
}

// A slot is "complete" when it has both names and an attendance answer —
// completing a card is what reveals the next empty one.
function isComplete(slot) {
  return Boolean(slot.firstName.trim() && slot.lastName.trim() && slot.attending !== null)
}

// Progressive disclosure: prefilled cards are always shown, then one empty
// card at a time — the next appears only once the previous card is complete.
function countVisibleSlots(slots, prefilledCount) {
  let visible = Math.min(Math.max(prefilledCount, 1), slots.length)
  while (visible < slots.length && isComplete(slots[visible - 1])) visible++
  return visible
}

// Returns null, or { message, index, field } pointing at the offending card
// so the form can scroll to it and move focus onto the field to fix.
function validateSlots(slots) {
  if (!slots.some(isUsed)) {
    return { message: 'Veuillez renseigner au moins un invité.', index: 0, field: 'name' }
  }
  for (let i = 0; i < slots.length; i++) {
    const slot = slots[i]
    if (!isUsed(slot)) continue
    if (!slot.firstName.trim() && !slot.lastName.trim()) {
      return { message: `Invité ${i + 1} : veuillez indiquer son nom.`, index: i, field: 'name' }
    }
    if (slot.attending === null) {
      return { message: `Invité ${i + 1} : veuillez indiquer sa présence.`, index: i, field: 'attending' }
    }
    if (slot.attending && !slot.mealChoice) {
      return { message: `Invité ${i + 1} : veuillez choisir un repas.`, index: i, field: 'meal' }
    }
  }
  return null
}

function AttendanceToggle({ index, value, onChange, disabled }) {
  return (
    <div className="segmented" role="radiogroup" aria-label={`Présence de l'invité ${index + 1}`}>
      <label>
        <input
          className="visually-hidden"
          type="radio"
          name={`attending-${index}`}
          checked={value === true}
          onChange={() => onChange(true)}
          disabled={disabled}
        />
        <span>Présent(e)</span>
      </label>
      <label>
        <input
          className="visually-hidden"
          type="radio"
          name={`attending-${index}`}
          checked={value === false}
          onChange={() => onChange(false)}
          disabled={disabled}
        />
        <span>Absent(e)</span>
      </label>
    </div>
  )
}

function RsvpForm() {
  const navigate = useNavigate()
  const [session, setSession] = useState(undefined)
  const [slots, setSlots] = useState([])
  const [message, setMessage] = useState('')
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const cardRefs = useRef([])

  useEffect(() => {
    const stored = loadRsvpSession()
    if (!stored) {
      navigate('/rsvp', { replace: true })
      return
    }
    const locked = stored.invitation.rsvpStatus !== 'pending'
    setSession(stored)
    setSlots(buildSlots(stored.invitation, stored.guests, locked))
    setMessage(stored.invitation.messageToCouple || '')
  }, [navigate])

  if (!session) return null

  const readOnly = session.invitation.rsvpStatus !== 'pending'
  const visibleCount = readOnly ? slots.length : countVisibleSlots(slots, session.guests.length)

  function updateSlot(index, patch) {
    setError(null)
    setSlots((prev) => prev.map((slot, i) => (i === index ? { ...slot, ...patch } : slot)))
  }

  function focusInvalidField(invalid) {
    const card = cardRefs.current[invalid.index]
    if (!card) return
    card.scrollIntoView({ behavior: 'smooth', block: 'center' })
    const target =
      invalid.field === 'meal'
        ? card.querySelector('select')
        : invalid.field === 'attending'
          ? card.querySelector('input[type="radio"]')
          : card.querySelector('input[type="text"]')
    setTimeout(() => target?.focus({ preventScroll: true }), 350)
  }

  async function handleSubmit(e) {
    e.preventDefault()

    const invalid = validateSlots(slots)
    if (invalid) {
      setError(invalid)
      focusInvalidField(invalid)
      return
    }

    setError(null)
    setSubmitting(true)

    // Full-replace payload: every used slot as a plain object, no ids —
    // whatever is sent becomes the household's complete guest list.
    const guests = slots.filter(isUsed).map((slot) => ({
      firstName: slot.firstName.trim(),
      lastName: slot.lastName.trim(),
      attending: slot.attending === true,
      mealChoice: slot.attending ? slot.mealChoice || null : null,
      allergies: slot.attending ? slot.allergies.trim() || null : null,
      ageGroup: slot.ageGroup,
    }))

    try {
      await submitRsvp(session.code, guests, message)
      clearRsvpSession()
      navigate('/rsvp/merci')
    } catch {
      setError({ message: "Une erreur est survenue lors de l'envoi. Veuillez réessayer." })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="rsvp-page">
      <div className="wrap narrow">
        <Link className="rsvp-back" to="/">‹ Retour</Link>
        <p className="eyebrow center">Réponse souhaitée</p>
        <h1 className="section-title center">
          {session.invitation.householdName
            ? `Famille ${session.invitation.householdName}`
            : 'Votre invitation'}
        </h1>
        {readOnly && (
          <p className="lede center">
            Merci, votre réponse a déjà été enregistrée
            {session.invitation.rsvpStatus === 'confirmed' ? ' — nous avons hâte de vous voir !' : '.'}
          </p>
        )}

        <form className="guest-form" onSubmit={handleSubmit} noValidate>
          {!readOnly && (
            <span className="visually-hidden" role="status">
              {visibleCount} {visibleCount > 1 ? 'invités affichés' : 'invité affiché'}
            </span>
          )}

          {slots.slice(0, visibleCount).map((slot, i) => (
            <fieldset
              className="guest-card"
              key={i}
              ref={(el) => { cardRefs.current[i] = el }}
            >
              <legend className="label guest-num">Invité {i + 1}</legend>

              <div className="guest-name-fields">
                <label className="text-field">
                  <span className="label">Prénom</span>
                  <input
                    type="text"
                    autoComplete="given-name"
                    value={slot.firstName}
                    onChange={(e) => updateSlot(i, { firstName: e.target.value })}
                    disabled={readOnly}
                    aria-invalid={error?.index === i && error.field === 'name' ? true : undefined}
                  />
                </label>
                <label className="text-field">
                  <span className="label">Nom</span>
                  <input
                    type="text"
                    autoComplete="family-name"
                    value={slot.lastName}
                    onChange={(e) => updateSlot(i, { lastName: e.target.value })}
                    disabled={readOnly}
                    aria-invalid={error?.index === i && error.field === 'name' ? true : undefined}
                  />
                </label>
              </div>

              <div className="field-block">
                <span className="label" aria-hidden="true">Présence</span>
                <AttendanceToggle
                  index={i}
                  value={slot.attending}
                  onChange={(attending) => updateSlot(i, { attending })}
                  disabled={readOnly}
                />
              </div>

              {slot.attending === true && (
                <>
                  <div className="field-block">
                    <span className="label" aria-hidden="true">Groupe d'âge</span>
                    <AgeGroupPicker
                      name={`age-${i}`}
                      value={slot.ageGroup}
                      onChange={(ageGroup) => updateSlot(i, { ageGroup })}
                      disabled={readOnly}
                    />
                  </div>

                  <label className="field-block">
                    <span className="label">Choix de repas</span>
                    <select
                      value={slot.mealChoice}
                      onChange={(e) => updateSlot(i, { mealChoice: e.target.value })}
                      disabled={readOnly}
                      aria-invalid={error?.index === i && error.field === 'meal' ? true : undefined}
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
                  </label>

                  <label className="field-block">
                    <span className="label">Allergies / restrictions</span>
                    <textarea
                      rows={2}
                      maxLength={ALLERGIES_MAX_LENGTH}
                      value={slot.allergies}
                      onChange={(e) => updateSlot(i, { allergies: e.target.value })}
                      disabled={readOnly}
                      placeholder="Aucune"
                    />
                    {!readOnly && slot.allergies.length > 0 && (
                      <span className="char-count">
                        {slot.allergies.length}/{ALLERGIES_MAX_LENGTH}
                      </span>
                    )}
                  </label>
                </>
              )}
            </fieldset>
          ))}

          <label className="message-field">
            <span className="label">Message au couple (optionnel)</span>
            <textarea
              maxLength={MESSAGE_MAX_LENGTH}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={readOnly}
            />
            {!readOnly && message.length > 0 && (
              <span className="char-count">
                {message.length}/{MESSAGE_MAX_LENGTH}
              </span>
            )}
          </label>

          {error && (
            <p className="form-error center" role="alert">
              {error.message}
            </p>
          )}

          {!readOnly && (
            <button className="btn btn-light" type="submit" disabled={submitting}>
              {submitting ? 'Envoi…' : 'Envoyer'}
            </button>
          )}
        </form>
      </div>
    </section>
  )
}

export default RsvpForm
