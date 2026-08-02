import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { StudioPage } from './StudioPage'

vi.mock('../components/course/CoursePlayer', () => ({
  CoursePlayer: () => <div>3D 播放器</div>,
}))

describe('StudioPage', () => {
  it('provides a page-level heading for the focused practice view', () => {
    render(<StudioPage slug="single-column-ground-demo" />)

    expect(screen.getByRole('heading', { level: 1, name: '双圈单柱路径 · 技术示范' })).toBeInTheDocument()
  })
})
