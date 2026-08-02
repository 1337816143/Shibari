import { Box, Crosshair, Eye, EyeOff, FlipHorizontal2, Focus, Lock, ScanEye, ShieldAlert, Unlock } from 'lucide-react'
import type { CameraPreset } from '../../types/course'

interface ViewOptions {
  mirrored: boolean
  viewLocked: boolean
  modelVisible: boolean
  modelOpacity: number
  showCompleted: boolean
  focusCurrent: boolean
  showRisks: boolean
  showContact: boolean
}

export function ViewControls({
  presets,
  activeView,
  options,
  onView,
  onOption,
  onOpacity,
}: {
  presets: readonly CameraPreset[]
  activeView: string
  options: ViewOptions
  onView: (id: string) => void
  onOption: (key: keyof Omit<ViewOptions, 'modelOpacity'>, value: boolean) => void
  onOpacity: (value: number) => void
}) {
  return (
    <div className="view-controls">
      <div className="view-presets" aria-label="预设视角">
        {presets.map((preset) => <button type="button" key={preset.id} className={activeView === preset.id ? 'is-active' : ''} onClick={() => onView(preset.id)}>{preset.isCloseup && <Focus />}{preset.label}</button>)}
      </div>
      <div className="layer-controls">
        <button type="button" className={options.mirrored ? 'is-active' : ''} onClick={() => onOption('mirrored', !options.mirrored)} aria-pressed={options.mirrored} title="左右镜像"><FlipHorizontal2 /></button>
        <button type="button" className={options.viewLocked ? 'is-active' : ''} onClick={() => onOption('viewLocked', !options.viewLocked)} aria-pressed={options.viewLocked} title={options.viewLocked ? '解锁视角' : '锁定视角'}>{options.viewLocked ? <Lock /> : <Unlock />}</button>
        <button type="button" className={!options.modelVisible ? 'is-active' : ''} onClick={() => onOption('modelVisible', !options.modelVisible)} aria-pressed={!options.modelVisible} title="显示或隐藏人物">{options.modelVisible ? <Eye /> : <EyeOff />}</button>
        <label className="opacity-control" title="人物透明度"><Box /><input type="range" min="0.12" max="1" step="0.04" value={options.modelOpacity} onChange={(event) => onOpacity(Number(event.target.value))} aria-label="人物透明度" /></label>
        <button type="button" className={options.showCompleted ? 'is-active' : ''} onClick={() => onOption('showCompleted', !options.showCompleted)} aria-pressed={options.showCompleted} title="显示或隐藏已完成绳段"><ScanEye /></button>
        <button type="button" className={options.focusCurrent ? 'is-active' : ''} onClick={() => onOption('focusCurrent', !options.focusCurrent)} aria-pressed={options.focusCurrent} title="只突出当前绳段"><Crosshair /></button>
        <button type="button" className={options.showRisks ? 'is-active is-risk' : ''} onClick={() => onOption('showRisks', !options.showRisks)} aria-pressed={options.showRisks} title="风险区域"><ShieldAlert /></button>
        <button type="button" className={options.showContact ? 'is-active is-contact' : ''} onClick={() => onOption('showContact', !options.showContact)} aria-pressed={options.showContact} title="接触位置"><span className="contact-icon" /></button>
      </div>
    </div>
  )
}

