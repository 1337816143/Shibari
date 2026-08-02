import { useEffect, useMemo, useRef, useState } from 'react'
import { Gauge, Info, Maximize2, Minimize2, MonitorCog } from 'lucide-react'
import { detectDeviceCapability } from '../../lib/device'
import { clampProgress, getStepIndexAtProgress, progressForStep, type PlaybackSpeed } from '../../lib/playback'
import { useLearningStore } from '../../store/learningStore'
import type { Course } from '../../types/course'
import { FallbackDiagram } from './FallbackDiagram'
import { PlayerControls } from './PlayerControls'
import { StepPanel } from './StepPanel'
import { ViewControls } from './ViewControls'
import { LearningScene } from '../three/LearningScene'
import { ThreeSceneBoundary } from '../three/ThreeSceneBoundary'

interface PlayerOptions {
  mirrored: boolean
  viewLocked: boolean
  modelVisible: boolean
  modelOpacity: number
  showCompleted: boolean
  focusCurrent: boolean
  showRisks: boolean
  showContact: boolean
}

const animationDurationMs = 28_000

export function CoursePlayer({ course, studio = false }: { course: Course; studio?: boolean }) {
  const savedRecord = useLearningStore((state) => state.records[course.id])
  const setPlayback = useLearningStore((state) => state.setPlayback)
  const setStepCompleted = useLearningStore((state) => state.setStepCompleted)
  const setNeedsReview = useLearningStore((state) => state.setNeedsReview)
  const setNote = useLearningStore((state) => state.setNote)
  const capability = useMemo(() => detectDeviceCapability(), [])
  const [progress, setProgress] = useState(savedRecord?.lastProgress ?? 0)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState<PlaybackSpeed>(savedRecord?.speed ?? 1)
  const [loopStep, setLoopStep] = useState(false)
  const [viewId, setViewId] = useState(savedRecord?.lastView ?? 'front')
  const [autoFollow, setAutoFollow] = useState(true)
  const [fallback, setFallback] = useState(capability.tier === 'low')
  const [sceneFailed, setSceneFailed] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const [options, setOptions] = useState<PlayerOptions>({
    mirrored: false,
    viewLocked: false,
    modelVisible: true,
    modelOpacity: 1,
    showCompleted: true,
    focusCurrent: true,
    showRisks: true,
    showContact: false,
  })
  const playerRef = useRef<HTMLDivElement>(null)
  const stepIndex = getStepIndexAtProgress(course.steps, progress)
  const step = course.steps[Math.max(0, stepIndex)]
  const effectiveViewId = autoFollow ? (step.closeupView ?? step.recommendedView) : viewId
  const preset = course.cameraPresets.find((item) => item.id === effectiveViewId) ?? course.cameraPresets[0]
  const threeUnavailable = !capability.supportsWebGL || sceneFailed
  const fallbackReason = sceneFailed
    ? '3D 初始化失败，已自动切换到简化分步图'
    : !capability.supportsWebGL
      ? '当前浏览器无法启用 WebGL，已自动使用简化分步图'
      : capability.prefersReducedMotion
        ? '已尊重系统的减少动态效果设置'
        : '低性能设备简化模式'

  useEffect(() => {
    if (!playing) return
    let frame = 0
    let previous = performance.now()
    const tick = (now: number) => {
      const delta = Math.min(64, now - previous)
      previous = now
      setProgress((current) => {
        const currentIndex = getStepIndexAtProgress(course.steps, current)
        const currentStep = course.steps[Math.max(0, currentIndex)]
        const next = current + (delta * speed) / animationDurationMs
        if (loopStep && next >= currentStep.timeline[1]) return currentStep.timeline[0]
        if (next >= 1) {
          setPlaying(false)
          return 1
        }
        return next
      })
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [course.steps, loopStep, playing, speed])

  useEffect(() => {
    const timer = window.setTimeout(() => setPlayback(course.id, progress, preset.id, speed), 450)
    return () => window.clearTimeout(timer)
  }, [course.id, preset.id, progress, setPlayback, speed])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      if (target?.matches('input, textarea, select, button')) return
      if (event.key === ' ') {
        event.preventDefault()
        setPlaying((value) => !value)
      }
      if (event.key === 'ArrowLeft') setProgress(progressForStep(course.steps[Math.max(0, stepIndex - 1)]))
      if (event.key === 'ArrowRight') setProgress(progressForStep(course.steps[Math.min(course.steps.length - 1, stepIndex + 1)]))
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [course.steps, stepIndex])

  useEffect(() => {
    const onFullscreen = () => setFullscreen(document.fullscreenElement === playerRef.current)
    document.addEventListener('fullscreenchange', onFullscreen)
    return () => document.removeEventListener('fullscreenchange', onFullscreen)
  }, [])

  const updateOption = (key: keyof Omit<PlayerOptions, 'modelOpacity'>, value: boolean) => {
    setOptions((current) => ({ ...current, [key]: value }))
  }

  const jumpToStep = (index: number) => {
    setPlaying(false)
    setProgress(progressForStep(course.steps[index]))
  }

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) await playerRef.current?.requestFullscreen()
    else await document.exitFullscreen()
  }

  const toggleFallback = () => {
    if (fallback && threeUnavailable) return
    setFallback((value) => !value)
  }

  const handleSceneError = () => {
    setPlaying(false)
    setSceneFailed(true)
    setFallback(true)
  }

  return (
    <div ref={playerRef} className={`course-player ${studio ? 'course-player--studio' : ''} ${fullscreen ? 'is-fullscreen' : ''}`}>
      <div className="player-stage-column">
        <div className="player-toolbar">
          <div className="player-toolbar__status"><span className="active-segment-dot" /> 当前绳段：<strong>{step.activeSegmentIds.length ? course.ropeSegments.find((segment) => step.activeSegmentIds.includes(segment.id))?.label : '安全与检查'}</strong></div>
          <div className="player-toolbar__actions">
            <button type="button" className={autoFollow ? 'is-active' : ''} onClick={() => setAutoFollow((value) => !value)} aria-pressed={autoFollow}><Gauge /> 自动跟随</button>
            <button
              type="button"
              className={fallback ? 'is-active' : ''}
              onClick={toggleFallback}
              disabled={fallback && threeUnavailable}
              title={threeUnavailable ? fallbackReason : undefined}
            >
              <MonitorCog /> {fallback ? (threeUnavailable ? '3D 不可用' : '启用 3D') : '简化模式'}
            </button>
            <button type="button" onClick={() => void toggleFullscreen()}>{fullscreen ? <Minimize2 /> : <Maximize2 />} {fullscreen ? '退出全屏' : '全屏'}</button>
          </div>
        </div>
        <div className="scene-wrap">
          {fallback ? (
            <FallbackDiagram step={step} progress={progress} reason={fallbackReason} />
          ) : (
            <ThreeSceneBoundary onError={handleSceneError}>
              <LearningScene
                course={course}
                step={step}
                progress={progress}
                preset={preset}
                playing={playing}
                options={{ ...options, quality: capability.tier, maxDpr: capability.maxDpr }}
              />
            </ThreeSceneBoundary>
          )}
          <div className="scene-legend"><span><i className="legend-current" /> 当前</span><span><i className="legend-complete" /> 已完成</span><span><i className="legend-risk" /> 风险区</span><span><i className="legend-contact" /> 接触点</span></div>
          <div className="scene-help"><Info /> 拖动旋转 · 滚轮/双指缩放 · 空格播放 · ← → 切换步骤</div>
        </div>
        <ViewControls
          presets={course.cameraPresets}
          activeView={preset.id}
          options={options}
          onView={(id) => { setAutoFollow(false); setViewId(id) }}
          onOption={updateOption}
          onOpacity={(value) => setOptions((current) => ({ ...current, modelOpacity: value }))}
        />
        <PlayerControls
          progress={progress}
          estimatedMinutes={course.estimatedMinutes}
          playing={playing}
          speed={speed}
          loopStep={loopStep}
          currentStepIndex={stepIndex}
          steps={course.steps}
          onProgress={(value) => { setPlaying(false); setProgress(clampProgress(value)) }}
          onPlayToggle={() => setPlaying((value) => !value)}
          onSpeed={setSpeed}
          onLoopToggle={() => setLoopStep((value) => !value)}
          onPrevious={() => jumpToStep(Math.max(0, stepIndex - 1))}
          onNext={() => jumpToStep(Math.min(course.steps.length - 1, stepIndex + 1))}
          onReplay={() => { setProgress(0); setPlaying(true) }}
          onReplayStep={() => { setProgress(progressForStep(step)); setPlaying(true) }}
          onStep={jumpToStep}
        />
      </div>
      <StepPanel
        step={step}
        totalSteps={course.steps.length}
        completed={savedRecord?.completedStepIds.includes(step.id) ?? false}
        needsReview={savedRecord?.needsReview ?? false}
        note={savedRecord?.note ?? ''}
        onCompleted={(value) => setStepCompleted(course.id, step.id, value)}
        onNeedsReview={(value) => setNeedsReview(course.id, value)}
        onNote={(value) => setNote(course.id, value)}
      />
    </div>
  )
}
