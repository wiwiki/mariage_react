export const STRAPI_URL = import.meta.env.VITE_STRAPI_URL

// Only the programme section is still CMS-driven — every other section is
// hardcoded in its component (see HeroSection.jsx for the pattern), so the
// cold-starting backend can only ever delay the programme timeline.
const PROGRAMME_ENDPOINT = `${STRAPI_URL}/api/programme?populate=*`

export async function fetchProgramme(signal) {
  const res = await fetch(PROGRAMME_ENDPOINT, { signal })

  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}`)
  }

  const json = await res.json()
  return json.data ?? null
}
