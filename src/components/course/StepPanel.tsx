import { AlertTriangle, Check, CheckCircle2, Circle, Hand, MessageCircle, Move3D, Navigation, Ruler, Route, TriangleAlert } from 'lucide-react'
import type { CourseStep } from '../../types/course'

export function StepPanel({
  step,
  totalSteps,
  completed,
  needsReview,
  note,
  onCompleted,
  onNeedsReview,
  onNote,
}: {
  step: CourseStep
  totalSteps: number
  completed: boolean
  needsReview: boolean
  note: string
  onCompleted: (value: boolean) => void
  onNeedsReview: (value: boolean) => void
  onNote: (value: string) => void
}) {
  const handLabel = step.handHint === 'both' ? '双手配合' : step.handHint === 'left' ? '左手' : step.handHint === 'right' ? '右手' : '无需操作'
  return (
    <aside className="step-panel" aria-live="polite">
      <div className="step-panel__header">
        <div><span className="eyebrow">步骤 {step.order} / {totalSteps}</span><h2>{step.title}</h2></div>
        <button type="button" className={`completion-toggle ${completed ? 'is-complete' : ''}`} onClick={() => onCompleted(!completed)} aria-pressed={completed}>{completed ? <CheckCircle2 /> : <Circle />}<span>{completed ? '已完成' : '标记完成'}</span></button>
      </div>
      <div className="step-objective"><span>当前目标</span><p>{step.objective}</p></div>
      <dl className="instruction-list">
        <div><dt><Navigation />从哪里开始</dt><dd>{step.startFrom}</dd></div>
        <div><dt><Route />绳子经过哪里</dt><dd>{step.route}</dd></div>
        <div><dt><Move3D />绳头方向</dt><dd>{step.direction}</dd></div>
        <div><dt><Ruler />松紧程度</dt><dd>{step.tension}</dd></div>
      </dl>
      <div className="step-hints"><span><Hand /> {handLabel}</span><span><Move3D /> 推荐：{step.closeupView ? '局部特写' : '整体视角'}</span></div>
      <div className="communication-callout"><MessageCircle /><div><strong>现在沟通</strong><p>{step.communication}</p></div></div>
      <details open className="step-detail step-detail--check"><summary><Check /> 完成检查点 <span>{step.checkpoints.length}</span></summary><ul>{step.checkpoints.map((item) => <li key={item}>{item}</li>)}</ul></details>
      <details className="step-detail"><summary><TriangleAlert /> 常见错误 <span>{step.commonErrors.length}</span></summary><ul>{step.commonErrors.map((item) => <li key={item}>{item}</li>)}</ul></details>
      <details open className="step-detail step-detail--risk"><summary><AlertTriangle /> 对应风险 <span>{step.risks.length}</span></summary><ul>{step.risks.map((item) => <li key={item}>{item}</li>)}</ul></details>
      <div className="practice-note">
        <div><label htmlFor="practice-note"><strong>练习备注</strong></label><button type="button" className={needsReview ? 'is-active' : ''} onClick={() => onNeedsReview(!needsReview)}>{needsReview ? '已标记复习' : '需要复习'}</button></div>
        <textarea id="practice-note" value={note} onChange={(event) => onNote(event.target.value)} placeholder="只保存在本设备，例如：回穿方向容易看错……" rows={3} />
      </div>
    </aside>
  )
}

