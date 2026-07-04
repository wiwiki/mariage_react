import { useEffect, useState } from 'react'
import { fetchWeddingPage, getStrapiMedia } from '../lib/strapi'
import defaultWeddingContent from '../content/defaultWeddingContent'

// Merged Strapi content is cached in sessionStorage (plus this module-level
// mirror) so navigating between the landing page and the RSVP flow doesn't
// refetch the six section endpoints on every mount. The TTL keeps content
// edits in Strapi from being invisible for a whole browsing session.
const CACHE_KEY = 'wedding-content-v1'
const CACHE_TTL_MS = 10 * 60 * 1000

let memoryCache = null

function loadCachedContent() {
  if (memoryCache) return memoryCache
  try {
    const raw = sessionStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const { savedAt, data } = JSON.parse(raw)
    if (Date.now() - savedAt > CACHE_TTL_MS) return null
    memoryCache = data
    return data
  } catch {
    return null
  }
}

function saveCachedContent(data) {
  memoryCache = data
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ savedAt: Date.now(), data }))
  } catch {
    // Storage full/blocked — the module-level cache still covers this tab.
  }
}

// Overlays whatever Strapi returns onto the default copy, field by field, so
// an empty/unpublished field just keeps showing the default.
function mergeContent(base, remote) {
  if (!remote) return base

  const merged = { ...base }

  for (const key of Object.keys(base)) {
    const value = remote[key]

    if (key === 'programmeItems') {
      if (Array.isArray(value) && value.length > 0) {
        merged.programmeItems = value.map((item) => ({
          time: item.time ?? '',
          title: item.title ?? '',
          description: item.description ?? '',
        }))
      }
    } else if (key === 'venuePhoto') {
      const url = getStrapiMedia(value)
      if (url) merged[key] = url
    } else if (typeof value === 'string' && value.trim() !== '') {
      merged[key] = value
    }
  }

  return merged
}

// status: 'loading' while the first fetch is in flight (skeletons/splash),
// 'ready' once content is settled — either real CMS content, cached content,
// or the defaults if the backend was unreachable.
export function useWeddingContent() {
  const [state, setState] = useState(() => {
    const cached = loadCachedContent()
    return cached
      ? { content: mergeContent(defaultWeddingContent, cached), status: 'ready' }
      : { content: defaultWeddingContent, status: 'loading' }
  })

  useEffect(() => {
    if (state.status === 'ready') return

    const controller = new AbortController()

    fetchWeddingPage(controller.signal)
      .then((remote) => {
        if (remote && Object.keys(remote).length > 0) {
          saveCachedContent(remote)
        }
        setState({ content: mergeContent(defaultWeddingContent, remote), status: 'ready' })
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          console.error('Falling back to default content — Strapi fetch failed:', err)
          setState((current) => ({ ...current, status: 'ready' }))
        }
      })

    return () => controller.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return state
}
