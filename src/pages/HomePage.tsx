import { ArrowRight, Check, Eye, Gauge, MousePointer2, Play, Rotate3D, ShieldCheck, Sparkles } from 'lucide-react'
import { SectionHeading } from '../components/ui/SectionHeading'

export function HomePage() {
  return (
    <>
      <section className="hero page-section">
        <div className="hero__content">
          <div className="hero__eyebrows">
            <span className="pill pill--accent">仅面向成年人</span>
            <span className="pill">Phase 1 技术验证</span>
          </div>
          <h1>
            看清每一段绳路，<br />
            <em>再动手。</em>
          </h1>
          <p className="hero__lead">
            自由旋转的中性成年训练模型、逐段绳索动画和随步骤出现的风险提示，让被遮挡的走向、接触位置和解除方向都能看见。
          </p>
          <div className="hero__actions">
            <a className="button button--primary" href="#/course/single-column-ground-demo">
              进入 3D 示范课 <ArrowRight size={18} />
            </a>
            <a className="button button--quiet" href="#/safety">
              先学安全
            </a>
          </div>
          <p className="hero__note">
            <ShieldCheck size={17} /> 示例课程尚在技术审核，不替代合格教师的现场指导。
          </p>
        </div>
        <div className="hero-visual" aria-label="3D 教学界面示意图">
          <div className="hero-visual__topbar">
            <span>双圈单柱路径</span>
            <span className="live-dot">技术演示</span>
          </div>
          <div className="hero-visual__stage">
            <div className="model-silhouette" aria-hidden="true">
              <span className="model-silhouette__head" />
              <span className="model-silhouette__torso" />
              <span className="model-silhouette__arm model-silhouette__arm--left" />
              <span className="model-silhouette__arm model-silhouette__arm--right" />
              <span className="model-silhouette__legs" />
              <svg className="model-silhouette__rope" viewBox="0 0 150 120">
                <path d="M128 81c-22-8-38-4-40 7-2 12 17 18 30 11 17-9 7-28-9-26-18 2-23 24-9 34" />
                <circle cx="128" cy="81" r="3.5" />
              </svg>
            </div>
            <div className="view-chip view-chip--top"><Rotate3D size={15} /> 360°</div>
            <div className="view-chip view-chip--bottom"><Eye size={15} /> 当前绳段</div>
            <div className="risk-ping" aria-hidden="true"><span /></div>
          </div>
          <div className="hero-visual__timeline">
            <button type="button" aria-label="播放示意"><Play size={16} fill="currentColor" /></button>
            <div><span style={{ width: '58%' }} /></div>
            <small>步骤 4 / 7</small>
          </div>
        </div>
      </section>

      <section className="trust-strip" aria-label="产品原则">
        <span><ShieldCheck size={18} /> 安全提示进入每一步</span>
        <span><Rotate3D size={18} /> 预校验 3D 绳路</span>
        <span><Gauge size={18} /> 低性能设备可降级</span>
        <span><Check size={18} /> 审核状态可追溯</span>
      </section>

      <section className="page-section feature-section">
        <SectionHeading eyebrow="不是视频播放器" title="围绕“看懂动作”设计的 3D 课堂" align="center">
          随时停下、换角度、隐藏干扰层，只看此刻真正需要操作的绳段。
        </SectionHeading>
        <div className="feature-grid">
          <article className="feature-card feature-card--large">
            <div className="feature-card__icon"><Rotate3D /></div>
            <span className="eyebrow">空间可读性</span>
            <h3>被身体挡住的绳路，也能转过去看</h3>
            <p>正面、背面、左右侧和局部特写一键切换；自由旋转、缩放、镜像与视角锁定互不冲突。</p>
            <div className="angle-orbit" aria-hidden="true">
              <span>正</span><span>左</span><span>后</span><span>右</span>
            </div>
          </article>
          <article className="feature-card">
            <div className="feature-card__icon"><MousePointer2 /></div>
            <span className="eyebrow">逐段解释</span>
            <h3>每一步都回答七个问题</h3>
            <p>目标、起点、经过位置、运动方向、松紧、完成检查、常见错误与对应风险同时出现。</p>
          </article>
          <article className="feature-card feature-card--dark">
            <div className="feature-card__icon"><ShieldCheck /></div>
            <span className="eyebrow">就地安全</span>
            <h3>风险不藏在页脚</h3>
            <p>风险区、检查点、停止症状和解除方向成为 3D 场景中的独立提示层。</p>
          </article>
        </div>
      </section>

      <section className="page-section path-preview">
        <div className="path-preview__intro">
          <span className="eyebrow">渐进式路径</span>
          <h2>先会停，才开始绑。</h2>
          <p>不是按“看起来简单”排序，而是按安全能力与前置技能逐步解锁。</p>
          <a href="#/path" className="text-link">查看完整学习路径 <ArrowRight size={17} /></a>
        </div>
        <ol className="path-preview__steps">
          <li className="is-active"><span>01</span><div><small>入门准备</small><strong>同意、停止与快速解除</strong></div></li>
          <li><span>02</span><div><small>基础技术</small><strong>绳索操作与单柱路径</strong></div></li>
          <li><span>03</span><div><small>后续课程</small><strong>经审核的地面组合技法</strong></div></li>
        </ol>
      </section>

      <section className="page-section cta-panel">
        <div>
          <Sparkles size={22} />
          <span className="eyebrow">第一门示范课</span>
          <h2>用 12 分钟验证这种学习方式。</h2>
          <p>7 个独立步骤、6 个预设视角、活动绳段高亮、风险区域和本地进度记录。</p>
        </div>
        <a className="button button--light" href="#/course/single-column-ground-demo">
          打开示范课 <ArrowRight size={18} />
        </a>
      </section>
    </>
  )
}

