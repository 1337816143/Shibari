import { AlertTriangle, Check, MessageCircle, Move3D, Ruler, Route, ShieldAlert } from 'lucide-react'
import type { ReleasePhase, ReleasePlan } from '../../types/course'

export function ReleasePanel({
  plan,
  phase,
  phaseIndex,
  segmentLabels,
}: {
  plan: ReleasePlan
  phase: ReleasePhase
  phaseIndex: number
  segmentLabels: readonly string[]
}) {
  return (
    <aside className="step-panel release-panel" aria-live="polite">
      <div className="step-panel__header">
        <div>
          <span className="eyebrow">解除演练 {phaseIndex + 1} / {plan.phases.length}</span>
          <h2>{phase.title}</h2>
        </div>
        <span className="release-review-state"><ShieldAlert /> 技术演示 · 待审核</span>
      </div>
      <div className="release-disclaimer" role="note">
        <AlertTriangle />
        <p>{plan.disclaimer}</p>
      </div>
      <div className="step-objective step-objective--release"><span>当前操作</span><p>{phase.instruction}</p></div>
      <dl className="instruction-list">
        <div><dt><Route />当前解除对象</dt><dd>{segmentLabels.length ? segmentLabels.join('、') : '此阶段不移动绳索'}</dd></div>
        <div><dt><Move3D />移动方向</dt><dd>{phase.direction}</dd></div>
        <div><dt><Ruler />张力要求</dt><dd>{phase.tension}</dd></div>
      </dl>
      <div className="communication-callout"><MessageCircle /><div><strong>现在沟通</strong><p>{phase.communication}</p></div></div>
      <details open className="step-detail step-detail--check"><summary><Check /> 本阶段检查点 <span>1</span></summary><ul><li>{phase.checkpoint}</li></ul></details>
      <details open className="step-detail step-detail--risk"><summary><AlertTriangle /> 必须避免 <span>1</span></summary><ul><li>{phase.warning}</li></ul></details>
      <div className="release-emergency"><strong>真实不适时</strong><p>{plan.emergencyInstruction}</p></div>
    </aside>
  )
}
