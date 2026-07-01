// Holds the verified code + invitation/guests between the /rsvp code step and
// the /rsvp/form step, for the current tab only — cleared on submit or close.
const STORAGE_KEY = 'rsvp-session'

export function saveRsvpSession(code, invitation, guests) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ code, invitation, guests }))
}

export function loadRsvpSession() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function clearRsvpSession() {
  sessionStorage.removeItem(STORAGE_KEY)
}
