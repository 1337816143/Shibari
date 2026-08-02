import type { CourseStep } from '../../types/course'

export function FallbackDiagram({
  step,
  progress,
  reason,
  label,
  mode = 'tie',
}: {
  step: CourseStep
  progress: number
  reason?: string
  label?: string
  mode?: 'tie' | 'release'
}) {
  const activeColor = mode === 'release' ? '#35a998' : '#ff7257'
  return (
    <div className={`fallback-diagram ${mode === 'release' ? 'fallback-diagram--release' : ''}`} role="img" aria-label={`${mode === 'release' ? '简化解除图' : '简化分步图'}：${label ?? step.title}`}>
      <svg viewBox="0 0 620 480" aria-hidden="true">
        <defs>
          <linearGradient id="shirt" x1="0" x2="1"><stop stopColor="#35564e" /><stop offset="1" stopColor="#466a61" /></linearGradient>
        </defs>
        <circle cx="310" cy="92" r="46" fill="#b7a99b" />
        <rect x="230" y="140" width="160" height="210" rx="72" fill="url(#shirt)" />
        <rect x="132" y="164" width="64" height="222" rx="30" fill="#456a61" transform="rotate(4 164 275)" />
        <rect x="424" y="164" width="64" height="222" rx="30" fill="#456a61" transform="rotate(-4 456 275)" />
        <ellipse cx="164" cy="362" rx="38" ry="28" fill="#b7a99b" />
        <g fill="none" strokeLinecap="round" strokeWidth="13">
          <path d="M48 354C85 342 118 344 143 355" stroke="#b58b62" opacity={Math.min(1, progress * 4)} />
          <ellipse cx="164" cy="354" rx="53" ry="33" stroke={activeColor} strokeDasharray="280" strokeDashoffset={280 * (1 - progress)} />
          <path d="M196 358c42-22 77-14 96 12" stroke={activeColor} opacity={progress > 0.52 ? 1 : 0.18} />
        </g>
        <circle cx="164" cy="354" r="66" fill="none" stroke="#ef6c5a" strokeWidth="3" strokeDasharray="8 9" opacity=".7" />
      </svg>
      <div className="fallback-diagram__label">
        <span>{mode === 'release' ? '当前解除阶段' : '当前步骤'}</span>
        <strong>{label ?? step.shortLabel}</strong>
        <small role="status">{reason ?? '低性能 / 减少动态效果模式'}</small>
      </div>
    </div>
  )
}
