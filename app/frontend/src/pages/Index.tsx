import { useState } from 'react';
import { createClient } from '@metagptx/web-sdk';
import {
  ArrowDown,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  Clipboard,
  CloudDownload,
  FileArchive,
  FolderOpen,
  Keyboard,
  LockKeyhole,
  MousePointerClick,
  RotateCcw,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  WandSparkles,
  Zap,
} from 'lucide-react';

const client = createClient();
const BUCKET = 'formilot-downloads';
const OBJECT_KEY = 'formilot.zip';

type Browser = 'Chrome' | 'Edge';

const features = [
  ['语义识别', '不靠死板 XPath，换一家公司的系统照样能填。', ScanSearch],
  ['多段经历', '教育、实习、项目会按照页面顺序自动对号入座。', Sparkles],
  ['绝不代提交', '提交、投递、支付与删除按钮都受代码级保护。', ShieldCheck],
];

const entryPoints = [
  ['页面右下角 ⚡ 悬浮球', '点开浮层面板 →「一键填写本页」', MousePointerClick],
  ['工具栏图标', '弹窗里选简历 → 填写 / 先扫描看看', Zap],
  ['快捷键', 'Alt + Shift + F 直接填当前页', Keyboard],
  ['右键菜单', '选择「⚡ 用闪填简历填写本页表单」', Clipboard],
];

export default function Index() {
  const [browser, setBrowser] = useState<Browser>('Chrome');
  const [copyState, setCopyState] = useState('复制地址');
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState('');
  const extensionUrl = browser === 'Chrome' ? 'chrome://extensions' : 'edge://extensions';

  const downloadPlugin = async () => {
    setDownloading(true);
    setDownloadError('');
    try {
      await client.storage.download({ bucket_name: BUCKET, object_key: OBJECT_KEY });
    } catch {
      setDownloadError('下载没有开始，请检查网络后重试。');
    } finally {
      setDownloading(false);
    }
  };

  const copyUrl = async () => {
    await navigator.clipboard.writeText(extensionUrl);
    setCopyState('已复制');
    window.setTimeout(() => setCopyState('复制地址'), 1600);
  };

  const scrollToTutorial = () => document.getElementById('install')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F6F7F2] text-[#17302D]">
      <header className="sticky top-0 z-40 border-b border-[#D8E2DE] bg-[#F6F7F2]/95">
        <div className="mx-auto flex h-18 max-w-[1180px] items-center justify-between px-5 md:px-8">
          <a href="#top" className="flex items-center gap-2.5 font-extrabold tracking-tight" aria-label="闪填简历首页">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0B7A68] text-white"><Zap className="h-5 w-5 fill-current" /></span>
            <span>闪填简历</span>
          </a>
          <nav className="hidden items-center gap-8 text-sm font-semibold md:flex" aria-label="主导航">
            <a href="#features" className="hover:text-[#0B7A68]">功能</a>
            <a href="#install" className="hover:text-[#0B7A68]">安装教程</a>
            <a href="#usage" className="hover:text-[#0B7A68]">使用方法</a>
            <a href="#privacy" className="hover:text-[#0B7A68]">隐私</a>
          </nav>
          <button onClick={downloadPlugin} disabled={downloading} className="primary-button h-11 px-5">
            <CloudDownload className="h-4 w-4" /> {downloading ? '正在下载…' : '下载插件'}
          </button>
        </div>
      </header>

      <main id="top">
        <section className="hero-grid mx-auto grid max-w-[1180px] gap-12 px-5 pb-20 pt-16 md:px-8 lg:grid-cols-[1.2fr_.8fr] lg:pb-28 lg:pt-24">
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#0B7A68]/20 bg-white px-4 py-2 text-sm font-bold text-[#075E52] shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[#F4B942]" /> Chrome / Edge 88+ · Manifest V3
            </div>
            <h1 className="max-w-3xl text-[42px] font-black leading-[1.12] tracking-[-0.04em] md:text-[60px]">
              网申填表，<br /><span className="text-[#0B7A68]">快一点，也稳一点。</span>
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-[#5C706C] md:text-xl">
              在本地维护一份结构化简历，一键填写不同企业的网申表格。支持多段经历，自动识别字段，但永远不会替你点击提交。
            </p>
            <div className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <button onClick={downloadPlugin} disabled={downloading} className="primary-button h-14 px-7 text-base">
                <CloudDownload className="h-5 w-5" /> {downloading ? '正在准备下载…' : '下载 ZIP 插件包'}
              </button>
              <button onClick={scrollToTutorial} className="secondary-button h-14 px-7 text-base">
                我是新手，先看教程 <ArrowDown className="h-5 w-5" />
              </button>
            </div>
            {downloadError && <p role="alert" className="mt-3 text-sm font-semibold text-[#B93832]">{downloadError}</p>}
            <p className="mt-5 flex items-center gap-2 text-sm text-[#5C706C]"><LockKeyhole className="h-4 w-4" /> 简历只保存在你的浏览器本地</p>
          </div>

          <div className="relative flex items-center justify-center lg:justify-end">
            <div className="absolute -left-6 top-10 h-32 w-32 rounded-full bg-[#F4B942]/25 blur-3xl" />
            <div className="relative w-full max-w-[450px] rotate-[1.5deg] rounded-[24px] border border-[#D8E2DE] bg-white p-4 shadow-[0_24px_70px_rgba(16,42,42,.14)]">
              <div className="flex items-center gap-2 border-b border-[#E7EEEB] pb-3"><i className="h-2.5 w-2.5 rounded-full bg-[#FF6B61]" /><i className="h-2.5 w-2.5 rounded-full bg-[#F4B942]" /><i className="h-2.5 w-2.5 rounded-full bg-[#38A77C]" /><span className="ml-2 text-xs text-[#8A9996]">某企业 · 校园招聘申请</span></div>
              <div className="space-y-4 p-3 pt-6">
                {['姓名', '毕业院校', '最近一段实习'].map((label, index) => (
                  <div key={label}><div className="mb-2 flex items-center justify-between text-sm font-semibold"><span>{label}</span><span className="flex items-center gap-1 text-xs text-[#18835E]"><Check className="h-3.5 w-3.5" /> 已填写</span></div><div className="h-11 rounded-lg border border-[#D8E2DE] bg-[#F8FAF8] px-3 py-2.5 text-sm text-[#8A9996]">{index === 0 ? '你的简历信息' : '自动匹配对应内容'}</div></div>
                ))}
                <div className="flex items-center justify-between rounded-xl bg-[#E7F5F0] p-4"><div><p className="text-xs font-bold text-[#0B7A68]">本页填写完成</p><p className="mt-1 text-2xl font-black">12 <span className="text-sm font-medium text-[#5C706C]">项已填写</span></p></div><span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0B7A68] text-white"><Zap className="h-6 w-6 fill-current" /></span></div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="border-y border-[#D8E2DE] bg-white py-16 md:py-20">
          <div className="mx-auto grid max-w-[1180px] gap-5 px-5 md:grid-cols-3 md:px-8">
            {features.map(([title, desc, Icon]) => <article key={String(title)} className="feature-card"><Icon className="mb-7 h-7 w-7 text-[#0B7A68]" /><h2 className="text-xl font-extrabold">{title as string}</h2><p className="mt-3 leading-7 text-[#5C706C]">{desc as string}</p></article>)}
          </div>
        </section>

        <section id="install" className="mx-auto max-w-[1180px] px-5 py-20 md:px-8 md:py-28">
          <div className="mb-12 max-w-2xl"><p className="eyebrow">新手安装指南</p><h2 className="section-title">下载后，跟着做 5 步</h2><p className="section-copy">没有构建步骤。请先把 ZIP 解压，再选择含有 <code>manifest.json</code> 的那一层目录。</p></div>
          <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
            <aside className="h-fit rounded-[20px] bg-[#102A2A] p-6 text-white lg:sticky lg:top-28">
              <p className="text-sm font-bold text-[#A8C9C2]">你使用哪个浏览器？</p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {(['Chrome', 'Edge'] as Browser[]).map(item => <button key={item} onClick={() => setBrowser(item)} className={`h-11 rounded-xl text-sm font-bold transition ${browser === item ? 'bg-[#F4B942] text-[#17302D]' : 'bg-white/10 text-white hover:bg-white/15'}`}>{item}</button>)}
              </div>
              <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-4"><p className="text-xs text-[#A8C9C2]">扩展管理地址</p><code className="mt-2 block break-all text-sm text-white">{extensionUrl}</code><button onClick={copyUrl} className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-white/20 text-sm font-bold hover:bg-white/10"><Clipboard className="h-4 w-4" /> {copyState}</button></div>
            </aside>
            <div className="steps-track">
              <Step n="01" title="下载并解压插件包" icon={FileArchive}><p>点击页面上的下载按钮，把压缩包保存到本地任意目录，然后解压。</p><button onClick={downloadPlugin} className="inline-action"><CloudDownload className="h-4 w-4" /> 下载 formilot.zip</button></Step>
              <Step n="02" title={`打开 ${browser} 扩展管理页`} icon={ChevronRight}><p>在浏览器地址栏输入并打开：</p><code className="code-line">{extensionUrl}</code></Step>
              <Step n="03" title="打开开发者模式" icon={WandSparkles}><p>在扩展管理页右上角，打开 <strong>开发者模式</strong>。</p></Step>
              <Step n="04" title="加载已解压的扩展程序" icon={FolderOpen}><p>点击 <strong>加载已解压的扩展程序</strong>，选择插件根目录，也就是含有 <code>manifest.json</code> 的那一层。</p><div className="folder-hint"><FolderOpen className="h-5 w-5 text-[#F4B942]" /><span>formilot / <strong>manifest.json</strong></span></div></Step>
              <Step n="05" title="首次填写简历" icon={CheckCircle2}><p>首次安装会自动打开设置页。先把你的简历信息填好，之后就可以开始使用。</p><p className="note">如果修改了插件代码，只需回到扩展管理页点击「重新加载」即可生效。</p></Step>
            </div>
          </div>
        </section>

        <section id="usage" className="bg-[#E7F0EC] py-20 md:py-28">
          <div className="mx-auto max-w-[1180px] px-5 md:px-8">
            <p className="eyebrow">开始使用</p><div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end"><h2 className="section-title max-w-xl">四种入口，选你顺手的</h2><p className="max-w-md leading-7 text-[#5C706C]">填写后，浮层会给出“已填写 / 待确认 / 缺必填”三个数字。</p></div>
            <div className="grid gap-4 md:grid-cols-2">{entryPoints.map(([title, desc, Icon], i) => <article key={String(title)} className="usage-card"><span className="usage-icon"><Icon className="h-5 w-5" /></span><div><p className="text-xs font-black text-[#0B7A68]">方式 0{i + 1}</p><h3 className="mt-1 text-lg font-extrabold">{title as string}</h3><p className="mt-2 leading-7 text-[#5C706C]">{desc as string}</p></div></article>)}</div>
            <div className="mt-12 grid gap-4 md:grid-cols-3">
              <Status title="已填写" tone="green" icon={CheckCircle2}>插件已经写入的字段。</Status>
              <Status title="待确认" tone="amber" icon={CircleAlert}>把握不大的字段。可在列表下拉框中改成正确字段；修改后会记住这个站点的字段映射。</Status>
              <Status title="缺必填" tone="red" icon={CircleAlert}>页面标了必填、但简历里没有的内容。点击「定位」后手动补上。</Status>
            </div>
            <div className="mt-5 flex items-start gap-3 rounded-xl border border-[#CBDCD6] bg-white p-5"><RotateCcw className="mt-0.5 h-5 w-5 shrink-0 text-[#0B7A68]" /><p className="leading-7"><strong>填错了也能回退：</strong>底部点击「撤销填写」，可以把这一轮写入的值还原回去。</p></div>
          </div>
        </section>

        <section id="privacy" className="bg-[#102A2A] py-20 text-white md:py-28">
          <div className="mx-auto grid max-w-[1180px] gap-12 px-5 md:px-8 lg:grid-cols-[.85fr_1.15fr]">
            <div><p className="text-sm font-black uppercase tracking-[.2em] text-[#F4B942]">安全与隐私</p><h2 className="mt-4 text-4xl font-black leading-tight md:text-5xl">你的简历，<br />留在你的设备里。</h2><p className="mt-6 max-w-md leading-8 text-[#BBD0CB]">这些是代码级约束，不是一个随时能关掉的宣传开关。</p></div>
            <div className="grid gap-3">
              {['遇到“提交、确认投递、投递简历、Apply now、支付、删除”等按钮会直接拒绝点击。','设置每次保存都会强制保持 neverSubmit: true。','AI 兜底只发送字段名、占位符、段落等表单线索，不包含任何简历字段值。','API Key 只存在 chrome.storage.local，并只发往你自己配置的 endpoint。','验证码、搜索框和密码框永不填写。'].map(text => <div key={text} className="flex gap-3 rounded-xl border border-white/10 bg-white/5 p-4 leading-7 text-[#D8E7E3]"><Check className="mt-1 h-5 w-5 shrink-0 text-[#F4B942]" /><span>{text}</span></div>)}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1180px] px-5 py-20 md:px-8 md:py-28">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-[24px] border border-[#D8E2DE] bg-white p-7 md:p-9"><p className="eyebrow">可选设置</p><h2 className="text-2xl font-black">配置 AI 兜底</h2><p className="mt-4 leading-7 text-[#5C706C]">设置页 →「AI 与设置」。不开 AI 也能正常使用，只是生僻字段会进入「待确认」。</p><ul className="mt-6 space-y-4 text-sm leading-7"><li><strong>Anthropic：</strong>填 API Key，默认模型 <code>claude-sonnet-5</code>，浏览器直连请求带 <code>anthropic-dangerous-direct-browser-access: true</code>。</li><li><strong>OpenAI 兼容：</strong>填 endpoint、Key 和模型名，支持兼容 <code>/chat/completions</code> 的服务。</li></ul><p className="note mt-6">填完后点击「测试连接」。</p></div>
            <div className="rounded-[24px] border border-[#D8E2DE] bg-[#F0F3EE] p-7 md:p-9"><p className="eyebrow">兼容性</p><h2 className="text-2xl font-black">Chrome / Edge 88+</h2><p className="mt-4 leading-7 text-[#5C706C]">插件基于 Manifest V3。iframe 内的表单也会填写（<code>all_frames: true</code>），但浮层只在顶层窗口显示。</p><div className="mt-8 flex items-center gap-3 rounded-xl bg-white p-4"><ShieldCheck className="h-9 w-9 text-[#0B7A68]" /><div><p className="font-extrabold">当前插件测试基线</p><p className="text-sm text-[#5C706C]">51/51 全部填对，0 待确认，0 缺必填，提交按钮未被点击。</p></div></div></div>
          </div>
        </section>

        <section className="px-5 pb-20 md:px-8"><div className="mx-auto flex max-w-[1180px] flex-col items-start justify-between gap-8 rounded-[28px] bg-[#0B7A68] p-8 text-white md:flex-row md:items-center md:p-12"><div><p className="text-sm font-bold text-[#BDE1D9]">准备好开始了吗？</p><h2 className="mt-2 text-3xl font-black md:text-4xl">下载插件，照着教程安装。</h2></div><button onClick={downloadPlugin} disabled={downloading} className="flex h-14 shrink-0 items-center gap-2 rounded-xl bg-[#F4B942] px-7 font-extrabold text-[#17302D] shadow-lg transition hover:-translate-y-0.5"><CloudDownload className="h-5 w-5" /> 下载插件包 <ArrowRight className="h-5 w-5" /></button></div></section>
      </main>

      <footer className="border-t border-[#D8E2DE] py-8"><div className="mx-auto flex max-w-[1180px] flex-col gap-3 px-5 text-sm text-[#5C706C] md:flex-row md:items-center md:justify-between md:px-8"><span className="flex items-center gap-2 font-bold text-[#17302D]"><Zap className="h-4 w-4 fill-[#F4B942] text-[#F4B942]" /> 闪填简历 · Formilot</span><span>纯前端 · 零构建 · 不自动提交</span></div></footer>
    </div>
  );
}

function Step({ n, title, icon: Icon, children }: { n: string; title: string; icon: typeof Zap; children: React.ReactNode }) {
  return <article className="step-card"><div className="step-number">{n}</div><div className="step-body"><div className="mb-3 flex items-center gap-3"><Icon className="h-5 w-5 text-[#0B7A68]" /><h3 className="text-xl font-extrabold">{title}</h3></div><div className="space-y-3 leading-7 text-[#5C706C]">{children}</div></div></article>;
}

function Status({ title, tone, icon: Icon, children }: { title: string; tone: string; icon: typeof Zap; children: React.ReactNode }) {
  return <article className={`status-card status-${tone}`}><Icon className="h-6 w-6" /><h3 className="mt-5 text-lg font-extrabold">{title}</h3><p className="mt-2 text-sm leading-6 text-[#5C706C]">{children}</p></article>;
}
