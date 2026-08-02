import { useRef, useState } from 'react'
import { BookOpenCheck, Download, FileUp, RotateCcw } from 'lucide-react'
import { singleColumnDemo } from '../data/courses/singleColumnDemo'
import { useLearningStore } from '../store/learningStore'

export function ProgressPage() {
  const records = useLearningStore((state) => state.records)
  const exportProgress = useLearningStore((state) => state.exportProgress)
  const importProgress = useLearningStore((state) => state.importProgress)
  const clearProgress = useLearningStore((state) => state.clearProgress)
  const inputRef = useRef<HTMLInputElement>(null)
  const [message, setMessage] = useState('')
  const record = records[singleColumnDemo.id]
  const completed = record?.completedStepIds.length ?? 0
  const percent = Math.round((completed / singleColumnDemo.steps.length) * 100)

  const download = () => {
    const blob = new Blob([exportProgress()], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `绳路学习记录-${new Date().toISOString().slice(0, 10)}.json`
    anchor.click()
    URL.revokeObjectURL(url)
  }

  const upload = async (file?: File) => {
    if (!file) return
    const result = importProgress(await file.text())
    setMessage(result.ok ? `已导入 ${result.courseCount} 门课程的记录。` : result.error)
  }

  return (
    <div className="content-page">
      <section className="page-hero page-hero--compact"><span className="eyebrow">我的学习</span><h1>记录留在你的设备上。</h1><p>无需账号。收藏、步骤、备注、速度和上次视角默认保存在浏览器本地，可随时导出备份。</p></section>
      <section className="page-section progress-layout">
        <div className="progress-overview">
          <div className="progress-ring" style={{ '--progress': `${percent * 3.6}deg` } as React.CSSProperties}><span><strong>{percent}%</strong><small>示范课步骤</small></span></div>
          <div><span className="eyebrow">本地进度</span><h2>{completed ? '继续刚才的练习' : '还没有完成步骤'}</h2><p>{record?.lastOpenedAt && record.lastOpenedAt !== new Date(0).toISOString() ? `最近打开：${new Date(record.lastOpenedAt).toLocaleString('zh-CN')}` : '打开示范课后，系统会记住进度与视角。'}</p><a className="button button--primary" href="#/course/single-column-ground-demo">{completed ? '继续课程' : '开始示范课'}</a></div>
        </div>
        <article className="progress-course-card">
          <BookOpenCheck />
          <div><span className="eyebrow">当前课程</span><h3>{singleColumnDemo.title}</h3><p>{completed} / {singleColumnDemo.steps.length} 步完成 · {record?.favorite ? '已收藏' : '未收藏'} · {record?.needsReview ? '需要复习' : '未标记复习'}</p></div>
          <div className="mini-progress"><span style={{ width: `${percent}%` }} /></div>
        </article>
        <div className="data-panel">
          <div><span className="eyebrow">导入 / 导出</span><h2>自己掌握学习记录</h2><p>导出的 JSON 只包含课程 ID、步骤、备注和播放器偏好，不包含账号或服务器数据。</p>{message && <p className="form-message" role="status">{message}</p>}</div>
          <div className="data-panel__actions">
            <button className="button button--quiet" type="button" onClick={download}><Download /> 导出 JSON</button>
            <button className="button button--quiet" type="button" onClick={() => inputRef.current?.click()}><FileUp /> 导入 JSON</button>
            <input ref={inputRef} type="file" accept="application/json,.json" hidden onChange={(event) => void upload(event.target.files?.[0])} />
            <button className="text-button text-button--danger" type="button" onClick={() => { if (window.confirm('确定清除本设备上的全部学习记录吗？')) { clearProgress(); setMessage('本地记录已清除。') } }}><RotateCcw /> 清除本地记录</button>
          </div>
        </div>
      </section>
    </div>
  )
}

