import { useMemo, useState } from 'react'
import { ArrowRight, Clock3, Filter, LockKeyhole, Search, Users } from 'lucide-react'
import { ReviewBadge, RiskBadge } from '../components/ui/StatusBadge'
import { catalog } from '../data/catalog'

const stageLabels = { preparation: '入门准备', foundation: '基础技术', 'ground-technique': '地面技法' }

export function LibraryPage() {
  const [query, setQuery] = useState('')
  const [stage, setStage] = useState('all')
  const [availability, setAvailability] = useState('all')

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return catalog.filter((entry) => {
      const text = [entry.title, entry.summary, ...entry.bodyParts, ...entry.techniqueTypes].join(' ').toLowerCase()
      return (
        (!normalized || text.includes(normalized)) &&
        (stage === 'all' || entry.stage === stage) &&
        (availability === 'all' || entry.availability === availability)
      )
    })
  }, [availability, query, stage])

  return (
    <div className="content-page">
      <section className="page-hero page-hero--compact library-hero">
        <span className="eyebrow">课程库</span>
        <h1>先筛选适合此刻练习的课。</h1>
        <p>风险等级、前置能力、伙伴需求和审核状态都比“看起来好玩”更重要。</p>
      </section>
      <section className="page-section library-layout">
        <aside className="filters" aria-label="课程筛选">
          <div className="filters__title"><Filter size={18} /><strong>筛选</strong><button type="button" onClick={() => { setStage('all'); setAvailability('all'); setQuery('') }}>清空</button></div>
          <label className="field-label" htmlFor="course-search">搜索</label>
          <div className="search-field"><Search size={18} /><input id="course-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="技法、部位或关键词" /></div>
          <fieldset><legend>学习阶段</legend>{[['all', '全部'], ['preparation', '入门准备'], ['foundation', '基础技术'], ['ground-technique', '地面技法']].map(([value, label]) => <label key={value}><input type="radio" name="stage" value={value} checked={stage === value} onChange={() => setStage(value)} /><span>{label}</span></label>)}</fieldset>
          <fieldset><legend>开放状态</legend>{[['all', '全部'], ['available', '现在可体验'], ['planned', '规划中'], ['locked', '暂时锁定']].map(([value, label]) => <label key={value}><input type="radio" name="availability" value={value} checked={availability === value} onChange={() => setAvailability(value)} /><span>{label}</span></label>)}</fieldset>
        </aside>
        <div className="library-results">
          <div className="library-results__header"><p>找到 <strong>{results.length}</strong> 门课程</p><span>内容少是刻意的：先把一门课做准确。</span></div>
          <div className="course-card-grid">
            {results.map((entry) => (
              <article className={`course-card ${entry.availability !== 'available' ? 'course-card--unavailable' : ''}`} key={entry.id}>
                <div className="course-card__visual">
                  <span>{stageLabels[entry.stage]}</span>
                  <div className="course-card__rope" aria-hidden="true"><i /><i /><i /></div>
                  {entry.availability !== 'available' && <div className="course-card__lock"><LockKeyhole /><small>{entry.availability === 'planned' ? '规划中' : '前置未开放'}</small></div>}
                </div>
                <div className="course-card__body">
                  <div className="badge-row"><RiskBadge level={entry.riskLevel} /><ReviewBadge status={entry.reviewStatus} /></div>
                  <h2>{entry.title}</h2>
                  <p>{entry.summary}</p>
                  <div className="course-card__meta"><span><Clock3 /> {entry.estimatedMinutes} 分钟</span><span><Users /> {entry.needsPartner ? '需要伙伴' : '可单独练习'}</span></div>
                  <div className="tag-row">{entry.techniqueTypes.slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}</div>
                  {entry.availability === 'available' ? <a className="course-card__link" href={`#/course/${entry.slug}`}>打开 3D 课程 <ArrowRight /></a> : <span className="course-card__link is-disabled">等待内容与安全审核</span>}
                </div>
              </article>
            ))}
          </div>
          {results.length === 0 && <div className="empty-state"><Search /><h2>没有符合条件的课程</h2><p>试试减少筛选条件。第一阶段不会为了数量加入未经审核的内容。</p></div>}
        </div>
      </section>
    </div>
  )
}

