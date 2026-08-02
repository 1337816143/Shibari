import type { CourseStep, ReleasePhase, RopeSegment } from '../types/course'

export const PLAYBACK_SPEEDS = [0.25, 0.5, 1, 1.5] as const
export type PlaybackSpeed = (typeof PLAYBACK_SPEEDS)[number]

export function clampProgress(value: number): number {
  if (!Number.isFinite(value)) return 0
  return Math.min(1, Math.max(0, value))
}

export function getStepIndexAtProgress(steps: readonly CourseStep[], progress: number): number {
  if (steps.length === 0) return -1
  const safeProgress = clampProgress(progress)
  const index = steps.findIndex(({ timeline: [start, end] }) => safeProgress >= start && safeProgress < end)
  return index === -1 ? steps.length - 1 : index
}

export function getStepLocalProgress(step: CourseStep, progress: number): number {
  const [start, end] = step.timeline
  return clampProgress((clampProgress(progress) - start) / (end - start))
}

export function getSegmentReveal(segment: RopeSegment, progress: number): number {
  const span = segment.endProgress - segment.startProgress
  return clampProgress((clampProgress(progress) - segment.startProgress) / span)
}

function getReleaseTotalDuration(phases: readonly ReleasePhase[]): number {
  return phases.reduce((total, phase) => total + Math.max(0, phase.durationSeconds), 0)
}

export function getReleasePhaseBounds(phases: readonly ReleasePhase[], index: number): readonly [number, number] {
  if (phases.length === 0) return [0, 1]
  const safeIndex = Math.min(phases.length - 1, Math.max(0, index))
  const totalDuration = getReleaseTotalDuration(phases)
  if (totalDuration <= 0) return [safeIndex / phases.length, (safeIndex + 1) / phases.length]
  const elapsed = phases.slice(0, safeIndex).reduce((total, phase) => total + Math.max(0, phase.durationSeconds), 0)
  const duration = Math.max(0, phases[safeIndex].durationSeconds)
  return [elapsed / totalDuration, (elapsed + duration) / totalDuration]
}

export function getReleasePhaseIndexAtProgress(phases: readonly ReleasePhase[], progress: number): number {
  if (phases.length === 0) return -1
  const safeProgress = clampProgress(progress)
  const index = phases.findIndex((_, phaseIndex) => {
    const [start, end] = getReleasePhaseBounds(phases, phaseIndex)
    return safeProgress >= start && safeProgress < end
  })
  return index === -1 ? phases.length - 1 : index
}

export function getReleasePhaseLocalProgress(phases: readonly ReleasePhase[], index: number, progress: number): number {
  const [start, end] = getReleasePhaseBounds(phases, index)
  return clampProgress((clampProgress(progress) - start) / Math.max(Number.EPSILON, end - start))
}

export function getReleaseSegmentReveal(segmentId: string, phases: readonly ReleasePhase[], progress: number): number {
  const phaseIndex = phases.findIndex((phase) => phase.segmentIds.includes(segmentId))
  if (phaseIndex === -1) return 1
  const phase = phases[phaseIndex]
  const segmentIndex = phase.segmentIds.indexOf(segmentId)
  const phaseProgress = getReleasePhaseLocalProgress(phases, phaseIndex, progress)
  const segmentProgress = clampProgress(phaseProgress * phase.segmentIds.length - segmentIndex)
  return 1 - segmentProgress
}

export function progressForReleasePhase(phases: readonly ReleasePhase[], index: number): number {
  return getReleasePhaseBounds(phases, index)[0]
}

export function progressForStep(step: CourseStep, position: 'start' | 'middle' | 'end' = 'start'): number {
  const [start, end] = step.timeline
  if (position === 'middle') return (start + end) / 2
  if (position === 'end') return end
  return start
}

export function formatElapsed(progress: number, estimatedMinutes: number): string {
  const seconds = Math.round(clampProgress(progress) * estimatedMinutes * 60)
  const minutesPart = Math.floor(seconds / 60)
  const secondsPart = String(seconds % 60).padStart(2, '0')
  return `${minutesPart}:${secondsPart}`
}
