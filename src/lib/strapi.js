const STRAPI_URL = import.meta.env.VITE_STRAPI_URL

// The wedding page content lives in six separate Strapi single types, one per
// section. Each is fetched independently so a section that isn't published yet
// (or fails) only drops its own fields — the rest of the page still renders.
const SECTION_ENDPOINTS = [
  'hero-banner',
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

// Fans out to all six section endpoints in parallel and shallow-merges their
// `data` objects into one flat object, matching the shape mergeContent() in
// App.jsx expects. Uses allSettled so one failing/unpublished section leaves
// its fields absent (App.jsx falls back to defaults) instead of blanking the
// whole page.
export async function fetchWeddingPage(signal) {
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
