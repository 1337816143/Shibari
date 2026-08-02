import { ArrowLeft, ShieldAlert } from 'lucide-react'
import { CoursePlayer } from '../components/course/CoursePlayer'
import { getCourseBySlug } from '../data/catalog'
import { NotFoundPage } from './NotFoundPage'

export function StudioPage({ slug = '' }: { slug?: string }) {
  const course = getCourseBySlug(slug)
  if (!course) return <NotFoundPage />
  return (
    <div className="studio-page">
      <div className="studio-heading"><a href={`#/course/${course.slug}`}><ArrowLeft /> 返回课程详情</a><div><h1>{course.title}</h1><span><ShieldAlert /> 审核中 · 地面非负重演示</span></div></div>
      <CoursePlayer course={course} studio />
    </div>
  )
}
