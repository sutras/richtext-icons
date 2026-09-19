<script setup lang="ts">
import { useIconLibrary } from '@/composables/useIconLibrary'

const { copy, stats } = useIconLibrary()

const INSTALL_CMD = 'npm install richtext-icons'
const PKG_MANAGERS = [
  { name: 'npm', cmd: 'npm install richtext-icons' },
  { name: 'pnpm', cmd: 'pnpm add richtext-icons' },
  { name: 'yarn', cmd: 'yarn add richtext-icons' }
]
</script>

<template>
  <section class="hero">
    <div class="hero-inner">
      <div class="hero-copy">
        <h1 class="hero-title">
          富文本编辑器的
          <span class="hero-accent">图标库</span>
        </h1>
        <p class="hero-sub">
          一套为富文本编辑器（WYSIWYG）量身定制的 SVG 图标库。
          统一 24×24 网格、1.5px 线性描边、圆角端点，随 <code>currentColor</code> 自动适配主题。
        </p>

        <div class="hero-badges">
          <span class="badge"><b>{{ stats.total }}</b> 个图标</span>
          <span class="badge"><b>{{ stats.categories }}</b> 个分类</span>
          <span class="badge">Vue 3</span>
          <span class="badge">TypeScript</span>
          <span class="badge">Tree-shaking</span>
        </div>

        <div class="hero-actions">
          <a class="btn btn--primary btn--lg" href="#icons">浏览图标</a>
          <a class="btn btn--lg" href="#install">快速上手</a>
        </div>
      </div>

      <div class="hero-install">
        <div class="install-card">
          <div class="install-tabs" role="tablist">
            <button
              v-for="m in PKG_MANAGERS"
              :key="m.name"
              type="button"
              class="install-tab"
              @click="copy(m.cmd, '安装命令已复制')"
            >
              {{ m.name }}
            </button>
          </div>
          <div class="install-code">
            <code>{{ INSTALL_CMD }}</code>
            <button class="btn btn--sm" type="button" @click="copy(INSTALL_CMD, '安装命令已复制')">
              复制
            </button>
          </div>
        </div>
        <p class="hero-note">Vue 3 作为 peer dependency，需要你的项目已安装 Vue 3。</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  padding: 72px 24px 64px;
  background:
    radial-gradient(1200px 480px at 50% -120px, var(--accent-soft), transparent 70%),
    var(--bg);
  border-bottom: 1px solid var(--border);
}

.hero-inner {
  max-width: 1080px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 48px;
  align-items: center;
}

.hero-title {
  margin: 0 0 16px;
  font-size: 52px;
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.15;
  color: var(--text);
}

.hero-accent {
  background: linear-gradient(120deg, var(--accent), #8b5cf6);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.hero-sub {
  margin: 0 0 20px;
  font-size: 16px;
  line-height: 1.7;
  color: var(--text-muted);
  max-width: 520px;
}

.hero-sub code {
  font-family: var(--mono);
  font-size: 14px;
  background: var(--bg-sunken);
  border-radius: 5px;
  padding: 1px 6px;
  color: var(--text);
}

.hero-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 28px;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 28px;
  padding: 0 12px;
  border-radius: 999px;
  background: var(--bg-subtle);
  border: 1px solid var(--border);
  color: var(--text-muted);
  font-size: 13px;
}

.badge b {
  color: var(--text);
  font-weight: 700;
}

.hero-actions {
  display: flex;
  gap: 10px;
}

.btn--lg {
  height: 40px;
  padding: 0 20px;
  font-size: 14px;
  text-decoration: none;
}

.hero-install {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.install-card {
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  background: var(--surface);
  box-shadow: var(--shadow-md);
  overflow: hidden;
}

.install-tabs {
  display: flex;
  gap: 4px;
  padding: 8px;
  border-bottom: 1px solid var(--border);
  background: var(--bg-subtle);
}

.install-tab {
  height: 28px;
  padding: 0 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-muted);
  transition: all 0.12s ease;
}

.install-tab:hover {
  background: var(--surface);
  color: var(--text);
}

.install-code {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
}

.install-code code {
  font-family: var(--mono);
  font-size: 14px;
  color: var(--text);
}

.hero-note {
  margin: 0;
  font-size: 12px;
  color: var(--text-faint);
  text-align: center;
}

@media (max-width: 860px) {
  .hero {
    padding: 48px 20px 40px;
  }

  .hero-inner {
    grid-template-columns: 1fr;
    gap: 32px;
  }

  .hero-title {
    font-size: 40px;
  }
}
</style>
