// Personalized invitation links: the organiser emails each household a URL
// like https://mariagefranca.sifoni.ca/?code=58FXFP — the code is captured
// once on page load and kept for the tab session, so when the guest clicks
// "Confirmer ma présence" the RSVP page can verify it automatically without
// them typing anything.
const STORAGE_KEY = 'rsvp-invite-code'

// Codes are 6 characters, uppercase letters and digits (e.g. 58FXFP).
export const CODE_PATTERN = /^[A-Z0-9]{6}$/

// Reads ?code= from the normal query string, and also from a query tucked
// inside the hash (e.g. /#/rsvp?code=58FXFP), since the app uses hash routing.
export function captureInviteCode() {
  const fromSearch = new URLSearchParams(window.location.search).get('code')
  const hashQuery = window.location.hash.split('?')[1]
  const fromHash = hashQuery ? new URLSearchParams(hashQuery).get('code') : null
  const code = (fromSearch || fromHash || '').trim().toUpperCase()

  if (CODE_PATTERN.test(code)) {
    sessionStorage.setItem(STORAGE_KEY, code)
  }
}

export function getInviteCode() {
  return sessionStorage.getItem(STORAGE_KEY)
}

// Called when a stored code turns out to be invalid, so the guest isn't
// re-subjected to a failing auto-verify on every visit to the RSVP page.
export function clearInviteCode() {
  sessionStorage.removeItem(STORAGE_KEY)
}
