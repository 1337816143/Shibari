import { Activity, AlertTriangle, CheckCircle2, HeartPulse, MessageCircle, Scissors, ShieldAlert } from 'lucide-react'
import { SectionHeading } from '../components/ui/SectionHeading'

const preparation = [
  ['同意是持续过程', '开始前说明动作、风险和解除方案；过程中每一步都可以撤回同意。'],
  ['停止信号要可执行', '准备口头信号和无法说话时的替代信号；听到后立即停，不追问理由。'],
  ['安全剪必须可及', '操作者用任一只手都能取得，剪切面朝外，不能压在任何人身体下方。'],
  ['保持清醒和沟通', '不在酒精、药物、疲劳或情绪失控影响判断与感觉反馈时练习。'],
]

export function SafetyPage() {
  return (
    <div className="content-page">
      <section className="page-hero page-hero--safety">
        <span className="eyebrow">必修 · 安全入门</span>
        <h1>绳艺不是“安全的”，<br />只能持续降低风险。</h1>
        <p>在线教程无法观察你的身体、绳索和现场变化。以下原则必须先于任何技法，并在每一步重新检查。</p>
        <div className="safety-alert">
          <AlertTriangle size={22} />
          <p><strong>出现麻木、刺痛、剧痛、无力、明显颜色或温度变化、头晕或呼吸不适：</strong>立即停止并解除。症状持续、严重或出现明显功能异常时，寻求医疗帮助。</p>
        </div>
      </section>

      <section className="page-section">
        <SectionHeading eyebrow="开始之前" title="四项不可跳过的准备" />
        <div className="safety-grid">
          {preparation.map(([title, text], index) => {
            const Icon = [MessageCircle, ShieldAlert, Scissors, HeartPulse][index]
            return <article className="safety-card" key={title}><Icon /><h3>{title}</h3><p>{text}</p></article>
          })}
        </div>
      </section>

      <section className="page-section check-sequence">
        <div>
          <span className="eyebrow">循环检查</span>
          <h2>不是绑完才检查。</h2>
          <p>每次改变绳路或张力，都是一个新的沟通节点。主动让对方反馈，不要只问“还好吗”。</p>
        </div>
        <ol>
          <li><span>01</span><div><strong>感觉</strong><small>麻、刺、痛、灼热或左右差异</small></div></li>
          <li><span>02</span><div><strong>活动</strong><small>手指或肢体能否自然完成指定动作</small></div></li>
          <li><span>03</span><div><strong>颜色与温度</strong><small>与未受影响一侧比较，而不是依赖单一阈值</small></div></li>
          <li><span>04</span><div><strong>呼吸与整体状态</strong><small>头晕、恶心、意识或呼吸变化都需要停止</small></div></li>
        </ol>
      </section>

      <section className="page-section two-column-info">
        <article>
          <Activity />
          <h2>关于“两指检查”</h2>
          <p>它只能帮助发现明显过紧或缺少检查空间，不能证明神经与循环没有风险。不同身体、姿势、绳材和持续时间会改变压力；持续沟通与功能检查更重要。</p>
        </article>
        <article>
          <Scissors />
          <h2>快速解除顺序</h2>
          <ol className="compact-list">
            <li>停止动作并稳定身体</li>
            <li>确认不适位置和最短解除路径</li>
            <li>能快速徒手解则解，不能则立即安全剪切</li>
            <li>完全移除、复查并持续观察</li>
          </ol>
        </article>
      </section>

      <section className="page-section disclaimer-panel">
        <CheckCircle2 />
        <div><h2>本阶段明确不教学</h2><p>悬吊、倒吊、颈部受力、呼吸限制、高风险关节姿势、无人看管的自缚，以及未经过专业审核的高风险教程。</p></div>
      </section>
    </div>
  )
}

