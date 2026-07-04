export const STRAPI_URL = import.meta.env.VITE_STRAPI_URL

// Single combined endpoint (one request for the whole landing page). The
// backend may not expose it yet — fetchWeddingPage falls back to fanning out
// to the six per-section single types below when it's missing.
const COMBINED_ENDPOINT = `${STRAPI_URL}/api/wedding-content`

// The wedding page content lives in five separate Strapi single types, one
// per section (the hero is static in code). Each is fetched independently so
// a section that isn't published yet (or fails) only drops its own fields —
// the rest of the page still renders.
const SECTION_ENDPOINTS = [
  'story',
  'programme',
  'venue',
  'rsvp',
  'footer',
].map((slug) => `${STRAPI_URL}/api/${slug}?populate=*`)

// Strapi v5 returns media fields as flat objects with a `url` (relative
// unless an absolute provider URL, e.g. Strapi Cloud media, is used).
export function getStrapiMedia(media) {
  const url = media?.url
  if (!url) return null
  return url.startsWith('http') ? url : `${STRAPI_URL}${url}`
}

async function fetchSection(endpoint, signal) {
  const res = await fetch(endpoint, { signal })

  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}`)
  }

  const json = await res.json()
  return json.data ?? null
}

async function fetchCombined(signal) {
  try {
    const res = await fetch(COMBINED_ENDPOINT, { signal })
    if (!res.ok) return null
    const json = await res.json()
    const data = json.data ?? null
    return data && typeof data === 'object' ? data : null
  } catch (err) {
    if (err.name === 'AbortError') throw err
    return null
  }
}

// Returns one flat object with every landing-page field, matching what
// mergeContent() expects. Prefers the combined endpoint (1 request); falls
// back to the six-section fan-out, using allSettled so one failing section
// only drops its own fields instead of blanking the whole page.
export async function fetchWeddingPage(signal) {
  const combined = await fetchCombined(signal)
  if (combined) return combined

  const results = await Promise.allSettled(
    SECTION_ENDPOINTS.map((endpoint) => fetchSection(endpoint, signal)),
  )

  const merged = {}
  for (const result of results) {
    if (result.status === 'fulfilled' && result.value) {
      Object.assign(merged, result.value)
    }
  }

  return merged
}
