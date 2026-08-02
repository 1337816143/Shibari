# 绳路 Shibari 3D Learning

一个面向成年人的、安全优先的 3D 绳艺学习原型。核心体验是“可旋转的中性成年训练模型 + 预校验绳路 + 分步骤动画 + 就地风险提示”，不是图片或付费视频资源聚合站。

> 当前状态：Phase 2 技术实现，内容仍处于技术审核。示范课程尚未经过独立绳艺教师与相关专业人员的人工审核，因此明确标记为“审核中”，不能替代现场教学，也不包含悬吊、颈部受力、呼吸限制或其他高风险内容。

## 本地运行

```bash
npm ci
npm run dev
```

质量检查：

```bash
npm run check
npm run build
```

## 技术栈

- React 19 + TypeScript + Vite
- Three.js + React Three Fiber
- 课程数据、3D 引擎、播放器、学习记录和安全规则分层
- 数据驱动的绑缚与解除阶段，支持 3D 和 SVG 降级播放
- Hash 路由与 GitHub Pages 静态部署
- 本地学习记录，可导入和导出

## 许可与内容边界

代码按 [MIT License](LICENSE) 发布。课程文字、程序化训练模型、绳路与视觉素材的来源和使用边界见 [LICENSES/ASSETS.md](LICENSES/ASSETS.md)。任何尚未完成人工复核的课程都不会被标记为正式课程。
