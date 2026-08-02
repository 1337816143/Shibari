import type { CourseStep, RopeSegment } from '../types/course'

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
