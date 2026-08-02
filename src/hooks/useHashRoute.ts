import { useCallback, useEffect, useState } from 'react'

export interface AppRoute {
  page: 'home' | 'safety' | 'path' | 'library' | 'course' | 'studio' | 'progress' | 'glossary' | 'not-found'
  slug?: string
}

function parseHash(hash: string): AppRoute {
  const path = hash.replace(/^#/, '').replace(/^\//, '').split('?')[0]
  if (!path) return { page: 'home' }
  const parts = path.split('/').filter(Boolean)
  if (parts[0] === 'safety') return { page: 'safety' }
  if (parts[0] === 'path') return { page: 'path' }
  if (parts[0] === 'library') return { page: 'library' }
  if (parts[0] === 'progress') return { page: 'progress' }
  if (parts[0] === 'glossary') return { page: 'glossary' }
  if (parts[0] === 'course' && parts[1]) return { page: 'course', slug: parts[1] }
  if (parts[0] === 'studio' && parts[1]) return { page: 'studio', slug: parts[1] }
  return { page: 'not-found' }
}

export function useHashRoute() {
  const [route, setRoute] = useState<AppRoute>(() => parseHash(window.location.hash))

  useEffect(() => {
    const onHashChange = () => {
      setRoute(parseHash(window.location.hash))
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const navigate = useCallback((to: string) => {
    window.location.hash = to.startsWith('#') ? to : `#${to}`
  }, [])

  return { route, navigate }
}

