import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { HomePage } from './HomePage'
import { LibraryPage } from './LibraryPage'
import { SafetyPage } from './SafetyPage'

describe('static pages', () => {
  it('renders the safety-first home call to action', () => {
    render(<HomePage />)
    expect(screen.getByRole('heading', { name: /看清每一段绳路/ })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /先学安全/ })).toHaveAttribute('href', '#/safety')
  })

  it('exposes the available demo course in the library', () => {
    render(<LibraryPage />)
    expect(screen.getByRole('heading', { name: '双圈单柱路径 · 技术示范' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /打开 3D 课程/ })).toHaveAttribute(
      'href',
      '#/course/single-column-ground-demo',
    )
  })

  it('puts stop symptoms above safety content', () => {
    render(<SafetyPage />)
    expect(screen.getByText(/出现麻木、刺痛、剧痛/)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '绳艺不是“安全的”，只能持续降低风险。' })).toBeInTheDocument()
  })
})

