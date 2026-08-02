import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'

const terms = [
  ['绳中 / Bight', '绳索对折处形成的弯曲部分，不等同于绳头。'],
  ['工作端 / Working ends', '当前由操作者移动、穿绕或整理的绳端。'],
  ['单柱 / Single column', '围绕一个柱状对象形成的结构；人体练习中仍存在神经、循环和局部压力风险。'],
  ['双柱 / Double column', '把两个柱状对象保持在一定间距的结构，不应自动理解为把两腕紧贴在一起。'],
  ['活动绳段', '当前步骤正在生成或移动的绳段，在 3D 播放器中以高亮颜色显示。'],
  ['完成绳段', '此前步骤已经完成的绳路，会降低亮度以减少视觉干扰。'],
  ['接触带', '绳索与身体接触的一段区域；平整和分散压力不等于没有风险。'],
  ['停止信号', '任何一方用于立即终止动作的明确约定，必须在开始前确认且被无条件执行。'],
  ['快速解除', '停止、稳定身体、选择最短路径、徒手解除或安全剪切、完全移除并复查的完整流程。'],
  ['安全剪', '用于紧急剪开绳索的钝头工具；需保持可及并让剪切面远离皮肤。'],
]

export function GlossaryPage() {
  const [query, setQuery] = useState('')
  const filtered = useMemo(() => terms.filter((term) => term.join(' ').toLowerCase().includes(query.trim().toLowerCase())), [query])
  return (
    <div className="content-page">
      <section className="page-hero page-hero--compact"><span className="eyebrow">术语库</span><h1>用同一套词，看懂同一段动作。</h1><p>术语解释只服务于本项目的课程阅读，不替代专业培训或医学建议。</p></section>
      <section className="page-section glossary-section">
        <div className="search-field search-field--large"><Search /><input aria-label="搜索术语" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索术语或解释" /></div>
        <dl className="glossary-list">{filtered.map(([term, definition], index) => <div key={term}><dt><span>{String(index + 1).padStart(2, '0')}</span>{term}</dt><dd>{definition}</dd></div>)}</dl>
      </section>
    </div>
  )
}

