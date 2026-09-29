# ⚡ 闪填简历 · Formilot

一个**纯前端、零构建**的 Chrome / Edge (Manifest V3) 扩展：把你在本地维护的一份结构化简历，一键填进各家企业的网申表格。

- 语义识别，不靠死板的 XPath——换一家公司的系统照样能填
- 支持多段经历（2 段教育 / 3 段实习会自动按顺序对号入座）
- **永远不会替你点提交**，这是写进代码里的硬约束，不是一句宣传语
- 简历内容**从不上传**任何服务器；AI 兜底也只发送表单的字段名，不发送你的简历

---

## 安装（开发者模式加载）

1. 下载/克隆本仓库到本地任意目录。
2. 打开 `chrome://extensions`（Edge 为 `edge://extensions`）。
3. 右上角打开 **开发者模式**。
4. 点击 **加载已解压的扩展程序**，选择本仓库根目录（含 `manifest.json` 的那一层）。
5. 首次安装会自动打开设置页，先把简历填好。

没有构建步骤，改完代码在扩展页点一下「重新加载」即可生效。

## 使用

| 入口 | 操作 |
|---|---|
| 页面右下角 ⚡ 悬浮球 | 点开浮层面板 → 「一键填写本页」 |
| 工具栏图标 | 弹窗里选简历 → 填写 / 先扫描看看 |
| 快捷键 | `Alt + Shift + F` 直接填当前页 |
| 右键菜单 | 「⚡ 用闪填简历填写本页表单」 |

填完后浮层会给出三个数字：**已填写 / 待确认 / 缺必填**。

- **待确认**：把握不大的字段，列表里每条都带一个下拉框，可以当场改成正确的字段，改一次就会记住这个站点的这个字段（写入 per-origin override）。
- **缺必填**：页面上标了必填但你的简历里没这项，点「定位」跳过去手动补。
- 底部「撤销填写」可以把这一轮写入的值还原回去。

---

## 架构

零构建的代价是不能用 ES module（service worker 里要 `importScripts`），所以所有文件都是 classic script，共享一个 `globalThis.FM` 命名空间。同一份 `src/core/*.js` 在内容脚本、popup、options、service worker 四处复用。

```
manifest.json
src/core/
  schema.js       99 个标准字段键 + 可重复段定义（education/work/project/...）
  dictionary.js   每个键的正/负关键词 + 段落提示 + 取值同义词（男/女/本科/中共党员…）
  matcher.js      打分引擎：多来源线索加权 → 段落上下文加减分 → 阈值裁决
  resolver.js     键 → 值：日期格式化、手机号清洗、年龄/工作年限推导
  adapters.js     16 个站点适配器 + 通用兜底 + 永不填写的字段黑名单
  storage.js      chrome.storage.local：简历 CRUD、设置、AI 缓存、站点 override
src/content/
  scanner.js      扫描表单控件、抽取标签、识别必填/选项/重复组
  filler.js       写值：原生输入、contenteditable、select、radio、自定义下拉、日期、文件
  overlay.js      Shadow DOM 浮层面板（与站点 CSS 完全隔离）
  overlay.css     四种高亮样式（已填/待确认/缺必填/定位聚焦）
  content.js      编排：扫描 → 匹配 → AI 兜底 → 分配重复组序号 → 填写 → 汇报
src/background/service-worker.js   AI 调用代理、快捷键、右键菜单、角标
src/popup/  src/options/           弹窗 与 设置页（简历编辑器 / AI / 站点）
test/       demo-form.html + e2e.mjs + shot.mjs
```

### 识别是怎么工作的

1. **扫描**：`CONTROL_SEL` 抓 input/textarea/select/contenteditable/`role=combobox`，外加 antd / element / arco 那种「外壳里没有原生 input」的下拉容器。穿透 Shadow DOM（深度 6）。
2. **抽标签**：七级瀑布 —— `label[for]` → 外包 `<label>` → `aria-labelledby` / `aria-label` → `.ant-form-item-label` / `.el-form-item__label` → 表格左侧单元格 → 前序兄弟节点 → 父节点裸文本。
3. **定段**：向上找真正的标题元素（`h1..h6`/`legend`/`.title` 等），用 `SECTION_HINTS` 判成 basic / education / work / family …
4. **打分**：每条线索按来源加权（label 1.0 > aria 0.96 > placeholder 0.82 > name 0.74 > id 0.72 > 邻近文本 0.6），与词典里的正向词做精确/包含/反包含匹配；命中负向词直接打 0.12 折；段落一致 +14，重复段错配 −22。
5. **裁决**：得分 ≥ 42 才接受；第二名逼近第一名时置信度打 0.78 折 → 落进「待确认」列表。
6. **AI 兜底**（可选）：没匹上或置信度低的字段，把**字段名/占位符/所属段落**批量发给你自己的 API Key（一次最多 60 个），返回的键要通过 schema 校验才采用，结果按 `origin::字段指纹` 缓存，同一个站点只问一次。

### 多段经历怎么对号入座

先试 DOM：找出结构签名相同的兄弟容器（如两个 `.edu-block`），同一容器内的字段归为同一段，容器顺序即数组下标。DOM 结构不规整时退化为**按键计数**——页面上第 2 次出现「毕业院校」就取 `educations[1]`。下标越界时钳到最后一条，不会写空。

---

## 安全与隐私

这几条是代码级约束，不是配置项：

- `filler.safeClick()` 遇到文本匹配 `提交|submit|确认投递|投递简历|apply now|支付|删除` 的元素直接拒绝点击。
- `storage.saveSettings()` 每次保存都强制写回 `neverSubmit: true`，设置页里这个开关是勾选且禁用状态。
- AI 提示词由 `buildPrompt()` 构造，只包含 label / placeholder / name / id / 邻近文本 / 段落 / 控件类型 / 选项文本，**不含任何简历字段值**。
- API Key 只存在 `chrome.storage.local`，只发往你自己配置的 endpoint。
- 验证码、搜索框、密码框在 `COMMON_SKIP` 里，永不填写。

## 配置 AI 兜底（可选）

设置页 →「AI 与设置」：

- **Anthropic**：填 API Key 即可，默认模型 `claude-sonnet-5`。请求带 `anthropic-dangerous-direct-browser-access: true`（浏览器直连必需）。
- **OpenAI 兼容**：填 endpoint（如 `https://api.openai.com/v1/chat/completions`）+ Key + 模型名，任何兼容 `/chat/completions` 的服务都行。

填完点「测试连接」。不开 AI 也能正常用，只是生僻字段会落进「待确认」。

---

## 扩展它

**加一个字段**：在 `src/core/schema.js` 的 `KEYS` 里加一行，再到 `src/core/dictionary.js` 加对应的 `{pos, neg}`。设置页的简历编辑器是**由 schema 自动生成**的，不需要改任何 HTML。

**加一个站点适配器**：在 `src/core/adapters.js` 的 `ADAPTERS` 数组里追加：

```js
{ id: 'yourco', test: /(^|\.)yourco\.com$/i, ui: 'antd', waitAfterClick: 300,
  selectorHints: { '.resume-upload input[type=file]': 'other.resumeFile' } }
```

`ui` 可选 `antd` / `element` / `arco` / `react-select` / `workday` / `beisen` / `native` / `auto`，决定自定义下拉的操作方式；`waitAfterClick` 是点开下拉后等待选项渲染的毫秒数。

**调某个词的识别**：优先给 `neg` 加负向词或依赖段落上下文，而不是无限堆 `pos`。「工作单位」在家庭成员段和工作经历段是两个不同的字段，靠的就是段落加减分而非关键词。

## 测试

```bash
ego-browser nodejs < test/e2e.mjs    # 在真实 Chromium 里跑完整填写流程
ego-browser nodejs < test/shot.mjs   # 打开浮层面板并截图
```

`test/demo-form.html` 是一份仿真的中文校招表单：7 个段落、2 段教育 + 2 段实习、表格布局的家庭成员、antd 风格自定义下拉、一个必须被跳过的验证码、一个绝不能被点击的提交按钮。当前基线：**51/51 全部填对，0 待确认，0 缺必填，提交按钮未被点击**。

## 兼容性

Chrome / Edge 88+（Manifest V3）。iframe 内的表单也会填（`all_frames: true`），但浮层只在顶层窗口显示。
