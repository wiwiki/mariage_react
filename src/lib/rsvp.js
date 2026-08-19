import { SUPABASE_KEY, SUPABASE_URL } from './supabase'

// `invitations` is not readable by any client key — the Edge Function is the
// only way in, and it never returns `code` or `inviteLink`.
const RSVP_BASE = `${SUPABASE_URL}/functions/v1/rsvp`

async function postJson(path, body, signal) {
  const res = await fetch(`${RSVP_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', apikey: SUPABASE_KEY },
    body: JSON.stringify(body),
    signal,
  })

  const json = await res.json().catch(() => null)

  if (!res.ok) {
    const error = new Error(json?.error?.message || json?.error || `Request failed with status ${res.status}`)
    error.status = res.status
    throw error
  }

  return json
}

// -> { invitation, guests }
export function verifyRsvpCode(code, signal) {
  return postJson('/verify', { code }, signal)
}

// -> { success: true }
export function submitRsvp(code, guests, message, signal) {
  return postJson('/submit', { code, guests, message }, signal)
}
