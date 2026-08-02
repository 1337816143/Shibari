import { ArrowRight, CheckCircle2, CircleDashed, LockKeyhole } from 'lucide-react'

const stages = [
  {
    number: '01',
    title: '入门准备',
    description: '在碰到绳索之前，先建立同意、风险识别与解除能力。',
    courses: [
      ['同意与沟通', '规划中'], ['停止信号', '规划中'], ['风险认知与身体检查', '规划中'], ['安全剪与快速解除', '规划中'],
      ['绳索选择、长度与保养', '规划中'], ['基础绳索整理', '规划中'],
    ],
    status: 'building',
  },
  {
    number: '02',
    title: '基础技术',
    description: '在稳定地面姿势中学习手法、走向、松紧与检查节奏。',
    courses: [
      ['绳索基本操作', '规划中'], ['基础结', '规划中'], ['双圈单柱路径 · 技术示范', '可体验'], ['双柱缚', '锁定'],
      ['绳索延长与绳尾处理', '锁定'], ['基础身体绳路', '锁定'],
    ],
    status: 'active',
  },
  {
    number: '03',
    title: '地面组合技法',
    description: '只有基础架构稳定且完成专业审核后，才逐步增加低风险地面组合。',
    courses: [['对称地面绳路', '锁定'], ['基础组合与过渡', '锁定'], ['不同体型适配原则', '锁定']],
    status: 'locked',
  },
]

export function PathPage() {
  return (
    <div className="content-page">
      <section className="page-hero page-hero--compact">
        <span className="eyebrow">学习路径</span>
        <h1>不是越难越高级，<br />而是越学越会判断。</h1>
        <p>课程按前置安全能力与技法关系组织。未完成审核或超出第一阶段边界的内容保持锁定。</p>
      </section>
      <section className="page-section learning-path">
        {stages.map((stage) => (
          <article className={`learning-stage learning-stage--${stage.status}`} key={stage.number}>
            <div className="learning-stage__number">{stage.number}</div>
            <div className="learning-stage__body">
              <div className="learning-stage__heading">
                <div><span className="eyebrow">阶段 {stage.number}</span><h2>{stage.title}</h2><p>{stage.description}</p></div>
                {stage.status === 'active' ? <span className="stage-state"><CircleDashed /> 正在建设</span> : stage.status === 'locked' ? <span className="stage-state"><LockKeyhole /> 暂不开放</span> : <span className="stage-state"><CircleDashed /> 内容筹备</span>}
              </div>
              <div className="course-chip-grid">
                {stage.courses.map(([name, status]) => (
                  <div className={`course-chip ${status === '可体验' ? 'is-available' : ''}`} key={name}>
                    {status === '可体验' ? <CheckCircle2 /> : status === '锁定' ? <LockKeyhole /> : <CircleDashed />}
                    <span><strong>{name}</strong><small>{status}</small></span>
                    {status === '可体验' && <a href="#/course/single-column-ground-demo" aria-label={`打开${name}`}><ArrowRight /></a>}
                  </div>
                ))}
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  )
}

