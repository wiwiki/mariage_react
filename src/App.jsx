import { useEffect, useState } from 'react'
import './App.css'

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL

function App() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()

    async function fetchArticles() {
      setLoading(true)
      setError(null)

      try {
        const res = await fetch(
          `${STRAPI_URL}/api/ARTICLES?populate=*`,
          { signal: controller.signal },
        )

        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`)
        }

        const json = await res.json()
        // Strapi returns the collection under `data`.
        setArticles(Array.isArray(json.data) ? json.data : [])
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchArticles()

    return () => controller.abort()
  }, [])

  return (
    <main style={{ maxWidth: 640, margin: '2rem auto', padding: '0 1rem' }}>
      <h1>Articles</h1>

      {loading && <p>Loading…</p>}

      {error && (
        <p style={{ color: 'crimson' }}>
          Something went wrong: {error}
        </p>
      )}

      {!loading && !error && articles.length === 0 && (
        <p>No articles found.</p>
      )}

      {!loading && !error && articles.length > 0 && (
        <ul>
          {articles.map((article) => {
            // Strapi v5 flattens fields onto the item; v4 nests them under `attributes`.
            const data = article.attributes ?? article
            return (
              <li key={article.id}>
                <strong>{data.title ?? `Article #${article.id}`}</strong>
                {data.description && <p>{data.description}</p>}
              </li>
            )
          })}
        </ul>
      )}
    </main>
  )
}

export default App
