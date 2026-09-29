---
last_updated: 2026-09-29T08:39:13Z
status: active
---

# Project Context

## Project Overview
闪填简历（Formilot）插件的销售承接与新手自助教学网站，提供原始 ZIP 下载、Chrome/Edge 安装指导、使用说明及隐私安全承诺。

## Key Decisions
| Date | Decision | By | Rationale |
|------|----------|-----|-----------|
| 2026-09-29 | 使用 Atoms Cloud 公共对象存储托管原始 formilot.zip | Alex | 提供稳定、真实的下载链路，不修改用户插件包 |
| 2026-09-29 | 教程内容严格以插件 README.md 为唯一事实来源 | Alex | 避免臆造新手操作或缺失步骤 |
| 2026-09-29 | 本轮不实现支付、账号和授权码 | Alex | 已确认计划只建设售卖承接页和下载教程 |

## Constraints
- 保留并分发用户提供的原始压缩包，不重打包、不改动插件源码。
- 安装与使用步骤不得超出 README.md 已描述内容。
- 兼容性按原文限定为 Chrome / Edge 88+（Manifest V3）。


