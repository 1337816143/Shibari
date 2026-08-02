import { fireEvent, render, screen } from '@testing-library/react'
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

  it('runs the data-driven release rehearsal without requiring WebGL', () => {
    render(<CoursePlayer course={singleColumnDemo} />)

    fireEvent.click(screen.getByRole('button', { name: '解除演练' }))
    expect(screen.getByRole('heading', { name: '停止动作并稳定手臂' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /简化解除图：停止稳定/ })).toBeInTheDocument()
    expect(screen.getByText(/不代表出现症状时必须等待或按动画顺序操作/)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: '下一个解除阶段' }))
    expect(screen.getByRole('heading', { name: '确认并释放外侧工作端' })).toBeInTheDocument()
    expect(screen.getByText(/徒手解除有任何延迟时使用可及的安全剪/)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: '退出解除演练' }))
    expect(screen.getByRole('heading', { name: '先确认同意、状态与解除方案' })).toBeInTheDocument()
  })
})
