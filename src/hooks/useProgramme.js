import { useEffect, useState } from 'react'
import { fetchProgramme } from '../lib/strapi'
import defaultProgramme from '../content/defaultProgramme'

// Fetched programme content is cached in sessionStorage (plus this
// module-level mirror) so navigating between the landing page and the RSVP
// flow doesn't refetch on every mount. The TTL keeps content edits in Strapi
// from being invisible for a whole browsing session.
const CACHE_KEY = 'programme-content-v1'
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

  if (Array.isArray(remote.programmeItems) && remote.programmeItems.length > 0) {
    merged.programmeItems = remote.programmeItems.map((item) => ({
      time: item.time ?? '',
      title: item.title ?? '',
      description: item.description ?? '',
    }))
  }

  for (const key of ['programmeEyebrow', 'programmeTitle']) {
    const value = remote[key]
    if (typeof value === 'string' && value.trim() !== '') {
      merged[key] = value
    }
  }

  return merged
}

// status: 'loading' while the first fetch is in flight (skeletons/splash),
// 'ready' once content is settled — either real CMS content, cached content,
// or the defaults if the backend was unreachable.
export function useProgramme() {
  const [state, setState] = useState(() => {
    const cached = loadCachedContent()
    return cached
      ? { content: mergeContent(defaultProgramme, cached), status: 'ready' }
      : { content: defaultProgramme, status: 'loading' }
  })

  useEffect(() => {
    if (state.status === 'ready') return

    const controller = new AbortController()

    fetchProgramme(controller.signal)
      .then((remote) => {
        if (remote && Object.keys(remote).length > 0) {
          saveCachedContent(remote)
        }
        setState({ content: mergeContent(defaultProgramme, remote), status: 'ready' })
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          console.error('Falling back to default programme — Strapi fetch failed:', err)
          setState((current) => ({ ...current, status: 'ready' }))
        }
      })

    return () => controller.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return state
}
