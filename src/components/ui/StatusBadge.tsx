import { CheckCircle2, CircleDashed, ShieldAlert } from 'lucide-react'
import type { ReviewStatus, RiskLevel } from '../../types/course'

const reviewLabels: Record<ReviewStatus, string> = {
  draft: '内容草案',
  'technical-review': '技术审核中',
  'expert-review': '专家审核中',
  published: '已审核发布',
}

export function ReviewBadge({ status }: { status: ReviewStatus }) {
  const Icon = status === 'published' ? CheckCircle2 : CircleDashed
  return (
    <span className={`status-badge status-badge--${status}`}>
      <Icon size={14} /> {reviewLabels[status]}
    </span>
  )
}

export function RiskBadge({ level }: { level: RiskLevel }) {
  const labels: Record<RiskLevel, string> = { low: '低风险 ≠ 无风险', moderate: '中等风险', high: '高风险' }
  return (
    <span className={`status-badge risk-badge risk-badge--${level}`}>
      <ShieldAlert size={14} /> {labels[level]}
    </span>
  )
}

