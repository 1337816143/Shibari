import { useState, type ReactNode } from 'react'
import { BookOpen, HeartPulse, Map, Menu, Search, X } from 'lucide-react'
import { Brand } from './Brand'

interface ShellProps {
  children: ReactNode
  currentPage: string
}

const navItems = [
  { href: '#/safety', label: '安全入门', id: 'safety' },
  { href: '#/path', label: '学习路径', id: 'path' },
  { href: '#/library', label: '课程库', id: 'library' },
  { href: '#/glossary', label: '术语', id: 'glossary' },
]

export function Shell({ children, currentPage }: ShellProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        跳到主要内容
      </a>
      <header className="site-header">
        <a href="#/" className="site-header__brand" onClick={() => setMenuOpen(false)}>
          <Brand />
        </a>
        <nav className="site-nav" aria-label="主导航">
          {navItems.map((item) => (
            <a key={item.id} href={item.href} aria-current={currentPage === item.id ? 'page' : undefined}>
              {item.label}
            </a>
          ))}
        </nav>
        <div className="site-header__actions">
          <a href="#/library" className="icon-button header-search" aria-label="搜索课程">
            <Search size={19} />
          </a>
          <a href="#/progress" className="button button--quiet button--small">
            我的学习
          </a>
          <button
            className="icon-button mobile-menu-button"
            type="button"
            aria-label={menuOpen ? '关闭导航' : '打开导航'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((value) => !value)}
          >
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
        {menuOpen && (
          <nav className="mobile-nav" aria-label="移动端导航">
            {navItems.map((item) => (
              <a key={item.id} href={item.href} onClick={() => setMenuOpen(false)}>
                {item.label}
              </a>
            ))}
            <a href="#/progress" onClick={() => setMenuOpen(false)}>
              我的学习
            </a>
          </nav>
        )}
      </header>
      <main id="main-content">{children}</main>
      <footer className="site-footer">
        <div className="site-footer__main">
          <div>
            <Brand />
            <p>用可验证的视角、步骤与安全节点，帮助成年人更清楚地学习绳路。</p>
          </div>
          <div className="site-footer__links">
            <a href="#/safety">
              <HeartPulse size={17} /> 安全原则
            </a>
            <a href="#/path">
              <Map size={17} /> 学习路径
            </a>
            <a href="#/library">
              <BookOpen size={17} /> 课程库
            </a>
          </div>
        </div>
        <div className="site-footer__legal">
          <span>仅面向成年人 · 在线 3D 教程不能替代合格教师的现场指导</span>
          <span>Phase 2 · 高精度模型 · 内容审核中</span>
        </div>
      </footer>
    </div>
  )
}
