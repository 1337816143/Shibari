import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { singleColumnDemo } from '../../data/courses/singleColumnDemo'
import { useLearningStore } from '../../store/learningStore'
import { CoursePlayer } from './CoursePlayer'

vi.mock('../../lib/device', () => ({
  detectDeviceCapability: () => ({
    tier: 'low',
    supportsWebGL: false,
    prefersReducedMotion: false,
    reason: 'webgl-unavailable',
    maxDpr: 1,
  }),
}))

describe('CoursePlayer fallback', () => {
  beforeEach(() => {
    useLearningStore.setState({ records: {} })
  })

  it('keeps the instructional fallback visible when WebGL is unavailable', () => {
    render(<CoursePlayer course={singleColumnDemo} />)

    expect(screen.getByRole('img', { name: /简化分步图/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /3D 不可用/ })).toBeDisabled()
    expect(screen.getByRole('status')).toHaveTextContent('当前浏览器无法启用 WebGL')
  })
})
