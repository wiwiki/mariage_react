const STRAPI_URL = import.meta.env.VITE_STRAPI_URL

const WEDDING_PAGE_ENDPOINT = `${STRAPI_URL}/api/wedding-page?populate=*`

// Strapi v5 returns media fields as flat objects with a `url` (relative
// unless an absolute provider URL, e.g. Strapi Cloud media, is used).
export function getStrapiMedia(media) {
  const url = media?.url
  if (!url) return null
  return url.startsWith('http') ? url : `${STRAPI_URL}${url}`
}

export async function fetchWeddingPage(signal) {
  const res = await fetch(WEDDING_PAGE_ENDPOINT, { signal })

  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}`)
  }

  const json = await res.json()
  return json.data ?? null
}
