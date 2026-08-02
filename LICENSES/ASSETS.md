# 素材与内容许可登记

最后核验：2026-08-02

| 资产 | 位置 | 来源 | 许可 / 使用边界 |
| --- | --- | --- | --- |
| 高精度成年训练人物 | `public/models/neutral-adult-v2/` | Microsoft Rocketbox `Male_Adult_08` | MIT License，Copyright (c) 2020 Microsoft；许可证副本见 `LICENSES/MICROSOFT-ROCKETBOX-MIT.txt` |
| 低性能占位训练人物 | `src/components/three/TrainingMannequin.tsx` | 本项目原创程序化几何 | 随代码按 MIT 使用；仅在模型加载期间或低性能 3D 模式使用 |
| 示范绳路 | `src/data/courses/singleColumnDemo.ts` | 本项目为技术验证原创绘制 | 随代码按 MIT 使用；未完成人工技术审核，不得表述为权威教程 |
| 图标 | `lucide-react` | Lucide contributors | ISC License；包内提供许可 |
| 字体 | CSS 系统字体栈 | 用户设备 | 不分发字体文件 |
| 页面插图与纹理 | CSS / SVG 程序化生成 | 本项目原创 | 随代码按 MIT 使用 |
| 参考站内容 | 不进入仓库 | 仅做公开页面的产品研究 | 不抓取、不镜像、不重发图片、视频、付费课程或受保护文字 |

## 内容审核规则

- `draft`：仅可内部验证，课程库不应将其展示为可正式学习。
- `technical-review`：播放器和数据通过技术检查，但尚未有合格绳艺教师审核。
- `expert-review`：至少完成一名合格绳艺教师的逐步审核；涉及健康陈述时仍需相应专业复核。
- `published`：完成技术、内容、安全与版本记录后方可发布。

当前示范课状态为 `technical-review`，审核人字段为空，页面会持续显示“审核中”。

## Rocketbox 处理记录

- 上游仓库：<https://github.com/microsoft/Microsoft-Rocketbox>
- 上游角色：`Assets/Avatars/Adults/Male_Adult_08`
- 上游格式：FBX，完整骨骼，2K TGA 颜色、法线与透明纹理。
- 本项目修改：转换为 glTF Binary；保留 4,491 个上传顶点与 7,364 个三角形；将纹理转换为 2K / 1K WebP 两档；运行时应用经过固定坐标校验的双臂下垂训练姿势。
- 边界：人物仅用于完整衣着、成年人、非色情化的地面教学演示；课程姿势保持预设，不开放用户自由改姿势。
