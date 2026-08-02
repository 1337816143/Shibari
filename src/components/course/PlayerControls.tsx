import { ChevronLeft, ChevronRight, Pause, Play, Redo2, Repeat1, RotateCcw } from 'lucide-react'
import { formatElapsed, PLAYBACK_SPEEDS, type PlaybackSpeed } from '../../lib/playback'
import type { CourseStep } from '../../types/course'

export function PlayerControls({
  progress,
  estimatedMinutes,
  playing,
  speed,
  loopStep,
  currentStepIndex,
  steps,
  onProgress,
  onPlayToggle,
  onSpeed,
  onLoopToggle,
  onPrevious,
  onNext,
  onReplay,
  onReplayStep,
  onStep,
}: {
  progress: number
  estimatedMinutes: number
  playing: boolean
  speed: PlaybackSpeed
  loopStep: boolean
  currentStepIndex: number
  steps: readonly CourseStep[]
  onProgress: (value: number) => void
  onPlayToggle: () => void
  onSpeed: (value: PlaybackSpeed) => void
  onLoopToggle: () => void
  onPrevious: () => void
  onNext: () => void
  onReplay: () => void
  onReplayStep: () => void
  onStep: (index: number) => void
}) {
  return (
    <div className="player-controls">
      <div className="timeline-wrap">
        <input
          className="timeline-range"
          type="range"
          min="0"
          max="1"
          step="0.001"
          value={progress}
          onChange={(event) => onProgress(Number(event.target.value))}
          aria-label="课程时间轴"
          style={{ '--timeline-progress': `${progress * 100}%` } as React.CSSProperties}
        />
        <div className="timeline-steps" aria-hidden="true">
          {steps.slice(1).map((step) => <span key={step.id} style={{ left: `${step.timeline[0] * 100}%` }} />)}
        </div>
      </div>
      <div className="player-controls__row">
        <div className="player-controls__primary">
          <button type="button" className="icon-button" onClick={onPrevious} aria-label="上一步" disabled={currentStepIndex === 0}><ChevronLeft /></button>
          <button type="button" className="play-button" onClick={onPlayToggle} aria-label={playing ? '暂停' : '播放'}>{playing ? <Pause fill="currentColor" /> : <Play fill="currentColor" />}</button>
          <button type="button" className="icon-button" onClick={onNext} aria-label="下一步" disabled={currentStepIndex === steps.length - 1}><ChevronRight /></button>
          <span className="player-time">{formatElapsed(progress, estimatedMinutes)} <small>/ {estimatedMinutes}:00</small></span>
        </div>
        <div className="player-controls__secondary">
          <button type="button" className="tool-button" onClick={onReplayStep} title="重新播放当前步骤"><Redo2 /> <span>本步重播</span></button>
          <button type="button" className={`tool-button ${loopStep ? 'is-active' : ''}`} onClick={onLoopToggle} aria-pressed={loopStep}><Repeat1 /> <span>单步循环</span></button>
          <button type="button" className="tool-button" onClick={onReplay} title="从头播放"><RotateCcw /> <span>从头</span></button>
          <label className="speed-control"><span className="sr-only">播放速度</span><select value={speed} onChange={(event) => onSpeed(Number(event.target.value) as PlaybackSpeed)}>{PLAYBACK_SPEEDS.map((value) => <option key={value} value={value}>{value}×</option>)}</select></label>
        </div>
      </div>
      <div className="step-jump" aria-label="跳转步骤">
        {steps.map((step, index) => (
          <button type="button" key={step.id} className={index === currentStepIndex ? 'is-active' : ''} onClick={() => onStep(index)} aria-label={`步骤 ${index + 1}：${step.title}`}>
            <span>{index + 1}</span><small>{step.shortLabel}</small>
          </button>
        ))}
      </div>
    </div>
  )
}

