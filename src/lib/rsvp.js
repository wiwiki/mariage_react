import { STRAPI_URL } from './strapi'

async function postJson(path, body, signal) {
  const res = await fetch(`${STRAPI_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
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
  return postJson('/api/rsvp/verify', { code }, signal)
}

// -> { success: true }
export function submitRsvp(code, guests, message, signal) {
  return postJson('/api/rsvp/submit', { code, guests, message }, signal)
}
