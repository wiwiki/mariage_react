export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
// Publishable key — designed to ship to browsers; row-level security is what
// actually protects the data. `invitations` is readable by no client key at
// all, so every RSVP call goes through the `rsvp` Edge Function instead.
export const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY

// Only the programme section is still CMS-driven — every other section is
// hardcoded in its component (see HeroSection.jsx for the pattern), so a slow
// or unreachable backend can only ever delay the programme timeline.
const PROGRAMME_ENDPOINT = `${SUPABASE_URL}/rest/v1/programme?select=*`

// PostgREST needs both headers: `apikey` selects the project, `Authorization`
// establishes the role that row-level security is evaluated against.
export const supabaseHeaders = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
}

export async function fetchProgramme(signal) {
  const res = await fetch(PROGRAMME_ENDPOINT, { headers: supabaseHeaders, signal })

  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}`)
  }

  // PostgREST returns a bare array of rows — the table holds a single row.
  const json = await res.json()
  const row = json?.[0] ?? null
  if (!row) return null

  // The only place in the codebase that knows about Postgres' snake_case:
  // everything downstream (and the sessionStorage cache) sees camelCase.
  return {
    programmeEyebrow: row.programme_eyebrow,
    programmeTitle: row.programme_title,
    programmeItems: row.programme_items,
  }
}
