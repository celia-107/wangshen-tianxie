---
last_updated: 2026-09-29T08:39:13Z
---

# Architecture Design

## System Overview
前后端分离的单页产品网站；React 前端负责产品展示、教程交互和触发下载，Atoms Cloud Object Storage 托管用户原始插件 ZIP。

## Tech Stack
- Frontend: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, lucide-react
- Backend capability: Atoms Cloud Object Storage
- Download client: @metagptx/web-sdk `client.storage.download`

## Module Design
| Module | Responsibility | Key Files |
|--------|---------------|-----------|
| Landing Page | 品牌介绍、卖点、安全承诺与下载行动 | app/frontend/src/pages/Index.tsx |
| Tutorial | Chrome/Edge 安装、使用与状态说明 | app/frontend/src/pages/Index.tsx |
| Download | 从公共桶解析并下载原始 ZIP | app/frontend/src/pages/Index.tsx |
| Styling | 品牌 tokens、响应式布局和交互状态 | app/frontend/src/index.css |

## Tech Decisions
| Decision | Choice | Rationale |
|----------|--------|-----------|
| 下载存储 | 公共对象桶 formilot-downloads | 无需登录即可完成新手核心下载流程 |
| 下载调用 | Web SDK storage.download | 遵循 Atoms Cloud 对象存储规范并触发保存文件 |
| 教程结构 | 单页锚点 + 浏览器切换 | 保持步骤连续且降低新手认知负担 |

## File Tree Plan
- app/frontend/DESIGN.md
- app/frontend/src/pages/Index.tsx
- app/frontend/src/index.css
- Object Storage: formilot-downloads/formilot.zip

## Implementation Guide
首页直接公开浏览；下载按钮调用 `client.storage.download({ bucket_name: 'formilot-downloads', object_key: 'formilot.zip' })`。教程文案逐条映射 README，不需要数据库、登录或自定义后端路由。

