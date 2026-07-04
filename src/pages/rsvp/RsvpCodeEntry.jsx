import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { verifyRsvpCode } from '../../lib/rsvp'
import { saveRsvpSession } from '../../lib/rsvpSession'
import { CODE_PATTERN, clearInviteCode, getInviteCode } from '../../lib/inviteCode'

function RsvpCodeEntry() {
  const navigate = useNavigate()
  const inviteCode = getInviteCode()
  const [code, setCode] = useState(inviteCode || '')
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  // A code from a personalized invitation link is verified automatically —
  // the guest only sees the manual form if that fails.
  const [autoVerifying, setAutoVerifying] = useState(Boolean(inviteCode))

  useEffect(() => {
    if (!inviteCode) return

    const controller = new AbortController()

    verifyRsvpCode(inviteCode, controller.signal)
      .then(({ invitation, guests }) => {
        saveRsvpSession(inviteCode, invitation, guests)
        navigate('/rsvp/form', { replace: true })
      })
      .catch((err) => {
        if (err.name === 'AbortError') return
        if (err.status === 404) {
          clearInviteCode()
          setError("Ce lien d'invitation n'est pas valide — entrez votre code manuellement.")
        } else {
          setError('Une erreur est survenue, veuillez réessayer.')
        }
        setAutoVerifying(false)
      })

    return () => controller.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()

    if (!CODE_PATTERN.test(code)) {
      setError('Le code doit contenir 6 caractères — lettres et chiffres.')
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

  if (autoVerifying) {
    return (
      <section className="rsvp-page center">
        <div className="wrap narrow">
          <div className="rsvp-card">
            <p className="eyebrow">Réponse souhaitée</p>
            <h1 className="section-title">Bienvenue !</h1>
            <p className="lede" role="status">Vérification de votre invitation…</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="rsvp-page center">
      <div className="wrap narrow">
        <Link className="rsvp-back" to="/">‹ Retour</Link>
        <div className="rsvp-card">
          <p className="eyebrow">Réponse souhaitée</p>
          <h1 className="section-title">Entrez votre code</h1>
          <p className="lede">Le code à 6 caractères se trouve sur votre carton d'invitation.</p>

          <form className="code-form" onSubmit={handleSubmit} noValidate>
            <label className="code-label">
              <span className="label">Code d'invitation</span>
              <input
                type="text"
                maxLength={6}
                placeholder="XXXXXX"
                autoComplete="one-time-code"
                autoCapitalize="characters"
                autoCorrect="off"
                spellCheck={false}
                value={code}
                onChange={(e) =>
                  setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6))
                }
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? 'code-error' : undefined}
                autoFocus
              />
            </label>
            {error && (
              <p className="form-error" id="code-error" role="alert">
                {error}
              </p>
            )}
            <button className="btn btn-light" type="submit" disabled={submitting}>
              {submitting ? 'Vérification…' : 'Continuer'}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default RsvpCodeEntry
