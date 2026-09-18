<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useIconLibrary } from '@/composables/useIconLibrary'

const { query, theme, setTheme, stats } = useIconLibrary()

const searchRef = ref<HTMLInputElement | null>(null)

/**
 * 搜索即反馈：输入关键词时自动滚到图标画廊区，
 * 让用户立刻看到筛选结果，而不是等手动往下翻才发现。
 * 清空（恢复全部）时不打扰，保持当前阅读位置。
 */
watch(query, (q, prev) => {
  if (!q.trim()) return
  if (q.trim() === prev.trim()) return
  document.querySelector('#icons')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
})

/** 「/」聚焦搜索框，「Esc」清空并失焦 —— 图标库高频操作 */
function onKeydown(e: KeyboardEvent) {
  const tag = (e.target as HTMLElement)?.tagName
  const typing = tag === 'INPUT' || tag === 'TEXTAREA'
  if (e.key === '/' && !typing) {
    e.preventDefault()
    searchRef.value?.focus()
  } else if (e.key === 'Escape' && document.activeElement === searchRef.value) {
    if (query.value) query.value = ''
    else searchRef.value?.blur()
  }
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <header class="header">
    <div class="brand">
      <div class="brand-mark" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="2" />
          <rect x="14" y="3" width="7" height="7" rx="2" />
          <rect x="3" y="14" width="7" height="7" rx="2" />
          <path d="M14 17.5h7M17.5 14v7" />
        </svg>
      </div>
      <div class="brand-text">
        <h1>RtiIcons</h1>
        <p>富文本编辑器图标库</p>
      </div>
    </div>

    <nav class="nav-links">
      <a href="#intro">介绍</a>
      <a href="#install">安装</a>
      <a href="#usage">使用</a>
      <a href="#icons">图标</a>
    </nav>

    <div class="search">
      <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
      <input
        ref="searchRef"
        v-model="query"
        type="search"
        class="search-input"
        placeholder="搜索图标…"
        spellcheck="false"
      />
      <button v-if="query" class="search-clear" type="button" title="清空" @click="query = ''">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>
      <kbd v-else class="search-kbd">/</kbd>
    </div>

    <div class="header-right">
      <div class="stats">
        <span><b>{{ stats.total }}</b> 图标</span>
        <i />
        <span><b>{{ stats.categories }}</b> 分类</span>
      </div>
      <a
        class="btn btn--ghost icon-btn"
        href="https://github.com/sutras/richtext-icons"
        target="_blank"
        rel="noopener"
        title="GitHub"
        aria-label="GitHub"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true">
          <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.09.68-.22.68-.49 0-.24-.01-.88-.01-1.72-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.63.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.28 2.75 1.05a9.36 9.36 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.8-4.57 5.05.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.59.69.49A10.02 10.02 0 0 0 22 12.25C22 6.58 17.52 2 12 2z" />
        </svg>
      </a>
      <button
        class="btn btn--ghost icon-btn"
        type="button"
        :title="theme === 'light' ? '切换到深色' : '切换到浅色'"
        @click="setTheme(theme === 'light' ? 'dark' : 'light')"
      >
        <svg v-if="theme === 'light'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        </svg>
        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      </button>
    </div>
  </header>
</template>

<style scoped>
.header {
  height: var(--header-h);
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 0 20px;
  border-bottom: 1px solid var(--border);
  background: var(--surface);
  flex-shrink: 0;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.brand-mark {
  width: 32px;
  height: 32px;
  border-radius: 9px;
  background: var(--accent-soft);
  color: var(--accent);
  display: grid;
  place-items: center;
}

.brand-mark svg {
  width: 19px;
  height: 19px;
}

.brand-text h1 {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.brand-text p {
  margin: 0;
  font-size: 11px;
  color: var(--text-faint);
  line-height: 1.2;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 4px;
}

.nav-links a {
  padding: 7px 13px;
  border-radius: var(--radius-sm);
  font-size: 14px;
  font-weight: 500;
  color: var(--text-muted);
  text-decoration: none;
  transition: all 0.12s ease;
  scroll-margin-top: calc(var(--header-h) + 12px);
}

.nav-links a:hover {
  color: var(--text);
  background: var(--surface-hover);
}

.search {
  position: relative;
  flex: 1;
  max-width: 420px;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 10px;
  width: 15px;
  height: 15px;
  color: var(--text-faint);
  pointer-events: none;
}

.search-input {
  width: 100%;
  height: 34px;
  padding: 0 32px 0 32px;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  background: var(--bg-subtle);
  outline: none;
  transition: border-color 0.14s ease, background 0.14s ease, box-shadow 0.14s ease;
}

.search-input::placeholder {
  color: var(--text-faint);
}

.search-input:focus {
  background: var(--surface);
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-soft);
}

.search-input::-webkit-search-cancel-button {
  display: none;
}

.search-clear {
  position: absolute;
  right: 8px;
  display: grid;
  place-items: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  color: var(--text-faint);
}

.search-clear:hover {
  background: var(--bg-sunken);
  color: var(--text);
}

.search-clear svg {
  width: 12px;
  height: 12px;
}

.search-kbd {
  position: absolute;
  right: 9px;
  font-family: var(--mono);
  font-size: 10px;
  color: var(--text-faint);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 1px 5px;
  pointer-events: none;
}

.header-right {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 14px;
}

.stats {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--text-muted);
  white-space: nowrap;
}

.stats b {
  color: var(--text);
  font-weight: 700;
}

.stats i {
  width: 1px;
  height: 12px;
  background: var(--border);
}

.icon-btn {
  width: 32px;
  padding: 0;
  text-decoration: none;
}

.icon-btn svg {
  width: 16px;
  height: 16px;
}

@media (max-width: 1000px) {
  .nav-links {
    display: none;
  }
}

@media (max-width: 860px) {
  .stats {
    display: none;
  }
}
</style>
