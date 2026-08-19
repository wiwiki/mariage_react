import { useEffect, useState } from 'react'
import { fetchProgramme } from '../lib/supabase'
import defaultProgramme from '../content/defaultProgramme'

// Fetched programme content is cached in sessionStorage (plus this
// module-level mirror) so navigating between the landing page and the RSVP
// flow doesn't refetch on every mount. The TTL keeps content edits in the
// database from being invisible for a whole browsing session. The key is
// versioned so a backend swap can't hand a returning visitor a stale shape.
const CACHE_KEY = 'programme-content-v2'
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

// Overlays the fetched schedule onto the default copy, so an empty or
// missing row just keeps showing the default items. The section
// heading is hardcoded in ProgrammeSection, so only the items matter here.
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
          console.error('Falling back to default programme — Supabase fetch failed:', err)
          setState((current) => ({ ...current, status: 'ready' }))
        }
      })

    return () => controller.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return state
}
