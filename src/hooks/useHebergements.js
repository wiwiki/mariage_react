import { useEffect, useState } from 'react'
import { fetchHebergements } from '../lib/supabase'
import { categories as defaultCategories } from '../content/hebergements'

// Same caching approach as useProgramme: sessionStorage plus a module-level
// mirror, with a TTL so a row added in the database shows up within minutes.
const CACHE_KEY = 'hebergements-v1'
const CACHE_TTL_MS = 10 * 60 * 1000

let memoryCache = null

function loadCachedPlaces() {
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

function saveCachedPlaces(data) {
  memoryCache = data
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ savedAt: Date.now(), data }))
  } catch {
    // Storage full/blocked — the module-level cache still covers this tab.
  }
}

// The section titles and intros live in the content file; the database only
// supplies the places, which arrive already sorted. An empty or missing
// result keeps the bundled list.
function groupByCategory(places) {
  if (!Array.isArray(places) || places.length === 0) return defaultCategories
  return defaultCategories.map((category) => ({
    ...category,
    places: places.filter((place) => place.category === category.id),
  }))
}

// status: 'loading' while the first fetch is in flight (skeleton rows),
// 'ready' once the list is settled — database rows, cached rows, or the
// bundled list if the backend was unreachable.
export function useHebergements() {
  const [state, setState] = useState(() => {
    const cached = loadCachedPlaces()
    return cached
      ? { categories: groupByCategory(cached), status: 'ready' }
      : { categories: defaultCategories, status: 'loading' }
  })

  useEffect(() => {
    if (state.status === 'ready') return

    const controller = new AbortController()

    fetchHebergements(controller.signal)
      .then((places) => {
        if (places.length > 0) saveCachedPlaces(places)
        setState({ categories: groupByCategory(places), status: 'ready' })
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          console.error('Falling back to bundled hébergements — Supabase fetch failed:', err)
          setState((current) => ({ ...current, status: 'ready' }))
        }
      })

    return () => controller.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return state
}
