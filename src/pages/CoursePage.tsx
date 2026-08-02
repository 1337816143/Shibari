import { Bookmark, CalendarDays, Check, Clock3, ExternalLink, Heart, ListChecks, Package, ShieldAlert, Users } from 'lucide-react'
import { CoursePlayer } from '../components/course/CoursePlayer'
import { ReviewBadge, RiskBadge } from '../components/ui/StatusBadge'
import { getCourseBySlug } from '../data/catalog'
import { useLearningStore } from '../store/learningStore'
import { NotFoundPage } from './NotFoundPage'

export function CoursePage({ slug = '' }: { slug?: string }) {
  const course = getCourseBySlug(slug)
  const favorite = useLearningStore((state) => (course ? state.records[course.id]?.favorite : false))
  const setFavorite = useLearningStore((state) => state.setFavorite)
  if (!course) return <NotFoundPage />

  return (
    <div className="course-page">
      <div className="course-breadcrumb"><a href="#/library">课程库</a><span>/</span><span>{course.title}</span></div>
      <header className="course-header">
        <div className="course-header__main">
          <div className="badge-row"><RiskBadge level={course.riskLevel} /><ReviewBadge status={course.review.status} /></div>
          <h1>{course.title}</h1>
          <p>{course.subtitle}</p>
          <div className="course-facts"><span><Clock3 /> {course.estimatedMinutes} 分钟</span><span><ListChecks /> {course.steps.length} 步</span><span><Users /> {course.needsPartner ? '需要练习伙伴' : '可单独练习'}</span><span><Package /> {course.rope.quantity} 根 · {course.rope.length}</span></div>
        </div>
        <div className="course-header__actions">
          <button className={`button button--quiet ${favorite ? 'is-active' : ''}`} type="button" onClick={() => setFavorite(course.id, !favorite)}>{favorite ? <Heart fill="currentColor" /> : <Bookmark />} {favorite ? '已收藏' : '收藏课程'}</button>
          <a className="button button--quiet" href={`#/studio/${course.slug}`}>打开练习室 <ExternalLink /></a>
        </div>
      </header>
      <div className="review-notice"><ShieldAlert /><div><strong>这不是正式课程</strong><p>{course.review.note} 在线教程不能替代合格教师的现场指导。</p></div></div>
      <section className="player-section"><CoursePlayer course={course} /></section>

      <section className="course-details page-section">
        <div className="course-details__main">
          <article><span className="eyebrow">学习目标</span><h2>完成后应该能做到</h2><ul className="check-list">{course.learningObjectives.map((item) => <li key={item}><Check />{item}</li>)}</ul></article>
          <article><span className="eyebrow">适用范围</span><h2>只在这些条件下练习</h2><p>{course.scope}</p><h3>不适用情况</h3><ul>{course.contraindications.map((item) => <li key={item}>{item}</li>)}</ul></article>
          <article className="release-article"><span className="eyebrow">快速解除</span><h2>停止—稳定—解除—复查</h2><ol>{course.quickRelease.map((item) => <li key={item}>{item}</li>)}</ol><p><strong>安全剪位置：</strong>{course.safetyShearsPlacement}</p></article>
          <article><span className="eyebrow">来源与版本</span><h2>可追溯，而不是“网上找的”</h2>{course.sources.map((source) => <div className="source-entry" key={source.label}><div><strong>{source.label}</strong><small>{source.license}</small></div><p>{source.note}</p>{source.url && <a href={source.url} target="_blank" rel="noreferrer">查看公开参考 <ExternalLink /></a>}</div>)}</article>
        </div>
        <aside className="course-details__aside">
          <div><span className="eyebrow">材料</span><dl><div><dt>绳材</dt><dd>{course.rope.material}</dd></div><div><dt>直径</dt><dd>{course.rope.diameter}</dd></div><div><dt>长度</dt><dd>{course.rope.length}</dd></div></dl></div>
          <div><span className="eyebrow">前置知识</span><ul>{course.prerequisites.map((item) => <li key={item}>{item}</li>)}</ul></div>
          <div className="risk-aside"><span className="eyebrow">立即停止症状</span><ul>{course.stopSymptoms.map((item) => <li key={item}>{item}</li>)}</ul></div>
          <div><span className="eyebrow">版本</span><p><CalendarDays /> {course.version}<br />更新于 {course.updatedAt}</p></div>
        </aside>
      </section>
    </div>
  )
}

