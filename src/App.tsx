import { lazy, Suspense } from 'react'
import { Shell } from './components/layout/Shell'
import { useHashRoute } from './hooks/useHashRoute'
import { GlossaryPage } from './pages/GlossaryPage'
import { HomePage } from './pages/HomePage'
import { LibraryPage } from './pages/LibraryPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { PathPage } from './pages/PathPage'
import { ProgressPage } from './pages/ProgressPage'
import { SafetyPage } from './pages/SafetyPage'

const CoursePage = lazy(() => import('./pages/CoursePage').then((module) => ({ default: module.CoursePage })))
const StudioPage = lazy(() => import('./pages/StudioPage').then((module) => ({ default: module.StudioPage })))

function RouteLoading() {
  return <div className="route-loading"><span /><p>正在按需加载 3D 课堂…</p></div>
}

export default function App() {
  const { route } = useHashRoute()
  let page
  switch (route.page) {
    case 'home': page = <HomePage />; break
    case 'safety': page = <SafetyPage />; break
    case 'path': page = <PathPage />; break
    case 'library': page = <LibraryPage />; break
    case 'progress': page = <ProgressPage />; break
    case 'glossary': page = <GlossaryPage />; break
    case 'course': page = <Suspense fallback={<RouteLoading />}><CoursePage slug={route.slug} /></Suspense>; break
    case 'studio': page = <Suspense fallback={<RouteLoading />}><StudioPage slug={route.slug} /></Suspense>; break
    default: page = <NotFoundPage />
  }
  return <Shell currentPage={route.page}>{page}</Shell>
}

