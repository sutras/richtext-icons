<script setup lang="ts">
import { useIconLibrary } from '@/composables/useIconLibrary'

const { copy } = useIconLibrary()

/** 特性亮点 */
const FEATURES = [
  {
    title: '为富文本而生',
    desc: '覆盖文本格式、段落块、表格、媒体、历史记录等编辑器高频操作，开箱即用。'
  },
  {
    title: '统一设计语言',
    desc: '24×24 网格、1.5px 线性描边、圆角端点，颜色随 currentColor 自动适配主题。'
  },
  {
    title: '按需引入',
    desc: '每个图标是独立组件，支持 Tree-shaking，只打包你用到的图标。'
  },
  {
    title: 'TypeScript 支持',
    desc: '内置完整类型声明，Props 与组件名都有智能提示。'
  }
]

/** 安装命令（按包管理器） */
const INSTALLS = [
  { name: 'npm', cmd: 'npm install richtext-icons' },
  { name: 'pnpm', cmd: 'pnpm add richtext-icons' },
  { name: 'yarn', cmd: 'yarn add richtext-icons' }
]

/** 代码片段（供复制） */
const CODE_IMPORT = `import { RtiBold, RtiTable, RtiImage } from 'richtext-icons'`
const CODE_BASIC = `<RtiBold />
<RtiBold style="color: #2f6feb; font-size: 20px" />
<RtiBold style="font-size: 1.5em" />`
const CODE_GLOBAL = `import { createApp } from 'vue'
import App from './App.vue'
import RtiIcons from 'richtext-icons'

const app = createApp(App)

// 全局注册全部图标，之后任意组件里可直接 <RtiBold />
for (const [name, comp] of Object.entries(RtiIcons)) {
  app.component(name, comp)
}

app.mount('#app')`
const CODE_DYNAMIC = `import { iconList } from 'richtext-icons'

// 按组件名动态渲染，适合工具栏这种「遍历配置项」的场景
<component :is="iconList['RtiBold']" />

// 图标宽高为 1em，用 CSS font-size 控制大小
<RtiBold style="font-size: 24px" />`
const CODE_SIZING = `<RtiBold style="font-size: 20px; color: #2f6feb" />
<RtiBold style="font-size: 1.5em" />`
</script>

<template>
  <div class="docs">
    <!-- 介绍 / 特性 -->
    <section id="intro" class="doc-section">
      <h2 class="doc-title">介绍</h2>
      <p class="doc-lead">
        一套面向富文本编辑器（WYSIWYG）场景的 SVG 图标库，基于 <b>Vue 3</b> 构建。
        每个图标都是一个独立的 Vue 组件，可单独引入、按需打包。
      </p>

      <div class="feature-grid">
        <div v-for="f in FEATURES" :key="f.title" class="feature-card">
          <h3>{{ f.title }}</h3>
          <p>{{ f.desc }}</p>
        </div>
      </div>
    </section>

    <!-- 安装 -->
    <section id="install" class="doc-section">
      <h2 class="doc-title">安装</h2>
      <p class="doc-lead">
        Vue 3 作为 <code>peerDependency</code>，需要你的项目已经使用 Vue 3。
      </p>

      <div class="install-tabs">
        <div v-for="m in INSTALLS" :key="m.name" class="install-block">
          <div class="install-tab-label">{{ m.name }}</div>
          <div class="code-block">
            <code>{{ m.cmd }}</code>
            <button class="btn btn--sm" type="button" @click="copy(m.cmd, '安装命令已复制')">复制</button>
          </div>
        </div>
      </div>
    </section>

    <!-- 使用 -->
    <section id="usage" class="doc-section">
      <h2 class="doc-title">使用</h2>

      <h3 class="doc-h3">按需引入</h3>
      <p class="doc-p">每个图标都是独立组件，直接按名导入即可。得益于 Tree-shaking，未使用的图标不会进入产物。</p>
      <div class="code-block">
        <code>{{ CODE_IMPORT }}</code>
        <button class="btn btn--sm" type="button" @click="copy(CODE_IMPORT, '代码已复制')">复制</button>
      </div>
      <div class="code-block">
        <code>{{ CODE_BASIC }}</code>
        <button class="btn btn--sm" type="button" @click="copy(CODE_BASIC, '代码已复制')">复制</button>
      </div>

      <h3 class="doc-h3">全局注册</h3>
      <p class="doc-p">如果希望所有图标在任意组件里直接使用，可以一次性全局注册。</p>
      <div class="code-block">
        <code>{{ CODE_GLOBAL }}</code>
        <button class="btn btn--sm" type="button" @click="copy(CODE_GLOBAL, '代码已复制')">复制</button>
      </div>

      <h3 class="doc-h3">动态渲染</h3>
      <p class="doc-p"><code>iconList</code> 以组件名为键，适合「遍历工具栏配置」这类场景。</p>
      <div class="code-block">
        <code>{{ CODE_DYNAMIC }}</code>
        <button class="btn btn--sm" type="button" @click="copy(CODE_DYNAMIC, '代码已复制')">复制</button>
      </div>

      <h3 class="doc-h3">尺寸与颜色</h3>
      <p class="doc-p">
        图标宽高固定为 <code>1em</code>，尺寸跟随所在元素的 <code>font-size</code>；颜色跟随
        <code>color</code>。用 CSS 即可控制，无需额外 prop。
      </p>
      <div class="code-block">
        <code>{{ CODE_SIZING }}</code>
        <button class="btn btn--sm" type="button" @click="copy(CODE_SIZING, '代码已复制')">复制</button>
      </div>
      <p class="doc-p doc-muted">
        其余 SVG 属性（<code>class</code>、<code>style</code>、事件等）会透传到 <code>&lt;svg&gt;</code> 根节点。
      </p>
    </section>
  </div>
</template>

<style scoped>
.docs {
  max-width: 860px;
  margin: 0 auto;
  padding: 8px 24px 72px;
}

.doc-section {
  padding: 60px 0;
}

.doc-section + .doc-section {
  border-top: 1px solid var(--border);
}

.doc-title {
  margin: 0 0 16px;
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--text);
}

.doc-lead {
  margin: 0 0 24px;
  font-size: 15px;
  line-height: 1.7;
  color: var(--text-muted);
  max-width: 680px;
}

.doc-lead b {
  color: var(--text);
}

.doc-lead code,
.doc-p code {
  font-family: var(--mono);
  font-size: 13px;
  background: var(--bg-sunken);
  border-radius: 4px;
  padding: 1px 6px;
  color: var(--text);
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 14px;
}

.feature-card {
  padding: 18px 20px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--surface);
}

.feature-card h3 {
  margin: 0 0 6px;
  font-size: 15px;
  font-weight: 700;
  color: var(--text);
}

.feature-card p {
  margin: 0;
  font-size: 13px;
  line-height: 1.65;
  color: var(--text-muted);
}

.install-tabs {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.install-tab-label {
  font-size: 12px;
  font-weight: 700;
  color: var(--text-muted);
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.code-block {
  position: relative;
  margin: 14px 0;
  padding: 14px 16px;
  background: var(--bg-sunken);
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.code-block code {
  display: block;
  font-family: var(--mono);
  font-size: 13px;
  line-height: 1.7;
  color: var(--text);
  white-space: pre-wrap;
  word-break: break-word;
  padding-right: 60px;
}

.code-block .btn {
  position: absolute;
  top: 10px;
  right: 10px;
}

.doc-h3 {
  margin: 32px 0 8px;
  font-size: 21px;
  font-weight: 700;
  color: var(--text);
}

.doc-h3:first-of-type {
  margin-top: 0;
}

.doc-p {
  margin: 0 0 4px;
  font-size: 16px;
  line-height: 1.7;
  color: var(--text-muted);
}

.doc-muted {
  font-size: 14px;
}

.props-table {
  margin: 14px 0;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  overflow: auto;
}
</style>
