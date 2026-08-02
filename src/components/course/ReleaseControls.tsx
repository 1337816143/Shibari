import { ChevronLeft, ChevronRight, LogOut, Pause, Play, RotateCcw } from 'lucide-react'
import { getReleasePhaseBounds, PLAYBACK_SPEEDS, type PlaybackSpeed } from '../../lib/playback'
import type { ReleasePhase } from '../../types/course'

function formatReleaseTime(progress: number, phases: readonly ReleasePhase[]): string {
  const totalSeconds = phases.reduce((total, phase) => total + phase.durationSeconds, 0)
  const seconds = Math.round(progress * totalSeconds)
  return `0:${String(seconds).padStart(2, '0')}`
}

export function ReleaseControls({
  progress,
  playing,
  speed,
  currentPhaseIndex,
  phases,
  onProgress,
  onPlayToggle,
  onSpeed,
  onPrevious,
  onNext,
  onRestart,
  onPhase,
  onExit,
}: {
  progress: number
  playing: boolean
  speed: PlaybackSpeed
  currentPhaseIndex: number
  phases: readonly ReleasePhase[]
  onProgress: (value: number) => void
  onPlayToggle: () => void
  onSpeed: (value: PlaybackSpeed) => void
  onPrevious: () => void
  onNext: () => void
  onRestart: () => void
  onPhase: (index: number) => void
  onExit: () => void
}) {
  const totalSeconds = phases.reduce((total, phase) => total + phase.durationSeconds, 0)
  return (
    <div className="player-controls release-controls">
      <div className="timeline-wrap">
        <input
          className="timeline-range"
          type="range"
          min="0"
          max="1"
          step="0.001"
          value={progress}
          onChange={(event) => onProgress(Number(event.target.value))}
          aria-label="解除演练时间轴"
          style={{ '--timeline-progress': `${progress * 100}%` } as React.CSSProperties}
        />
        <div className="timeline-steps" aria-hidden="true">
          {phases.slice(1).map((phase, index) => <span key={phase.id} style={{ left: `${getReleasePhaseBounds(phases, index + 1)[0] * 100}%` }} />)}
        </div>
      </div>
      <div className="player-controls__row">
        <div className="player-controls__primary">
          <button type="button" className="icon-button" onClick={onPrevious} aria-label="上一个解除阶段" disabled={currentPhaseIndex === 0}><ChevronLeft /></button>
          <button type="button" className="play-button" onClick={onPlayToggle} aria-label={playing ? '暂停解除演练' : '播放解除演练'}>{playing ? <Pause fill="currentColor" /> : <Play fill="currentColor" />}</button>
          <button type="button" className="icon-button" onClick={onNext} aria-label="下一个解除阶段" disabled={currentPhaseIndex === phases.length - 1}><ChevronRight /></button>
          <span className="player-time">{formatReleaseTime(progress, phases)} <small>/ 0:{String(totalSeconds).padStart(2, '0')}</small></span>
        </div>
        <div className="player-controls__secondary">
          <button type="button" className="tool-button" onClick={onRestart}><RotateCcw /> <span>重新演练</span></button>
          <label className="speed-control"><span className="sr-only">解除演练速度</span><select value={speed} onChange={(event) => onSpeed(Number(event.target.value) as PlaybackSpeed)}>{PLAYBACK_SPEEDS.map((value) => <option key={value} value={value}>{value}×</option>)}</select></label>
          <button type="button" className="tool-button release-exit" onClick={onExit} aria-label="退出解除演练"><LogOut /> <span>退出解除</span></button>
        </div>
      </div>
      <div className="step-jump release-phase-jump" aria-label="跳转解除阶段">
        {phases.map((phase, index) => (
          <button type="button" key={phase.id} className={index === currentPhaseIndex ? 'is-active' : ''} onClick={() => onPhase(index)} aria-label={`解除阶段 ${index + 1}：${phase.title}`}>
            <span>{index + 1}</span><small>{phase.shortLabel}</small>
          </button>
        ))}
      </div>
    </div>
  )
}
