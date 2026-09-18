<script setup lang="ts">
import { useIconLibrary } from '@/composables/useIconLibrary'

const { activeCategory, navCategories } = useIconLibrary()
</script>

<template>
  <nav class="nav">
    <div class="nav-scroll">
      <p class="nav-title">分类</p>
      <ul class="nav-list">
        <li v-for="cat in navCategories" :key="cat.dir">
          <button
            type="button"
            class="nav-item"
            :class="{
              'is-active': activeCategory === cat.dir,
              'is-empty': !cat.count && !cat.isAll
            }"
            @click="activeCategory = cat.dir"
          >
            <span class="nav-name">{{ cat.zh }}</span>
            <span class="nav-count">{{ cat.count }}</span>
          </button>
        </li>
      </ul>
    </div>
  </nav>
</template>

<style scoped>
.nav {
  width: var(--sidebar-w);
  flex-shrink: 0;
  border-right: 1px solid var(--border);
  background: var(--bg-subtle);
  display: flex;
  flex-direction: column;
  position: sticky;
  top: var(--header-h);
  max-height: calc(100vh - var(--header-h));
}

.nav-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 14px 10px;
  min-height: 0;
}

.nav-title {
  margin: 0 0 8px 8px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-faint);
}

.nav-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.nav-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  height: 32px;
  padding: 0 8px;
  border-radius: var(--radius-sm);
  color: var(--text-muted);
  font-size: 13px;
  text-align: left;
  transition: background 0.12s ease, color 0.12s ease;
}

.nav-item:hover {
  background: var(--surface-hover);
  color: var(--text);
}

.nav-item.is-active {
  background: var(--accent-soft);
  color: var(--accent);
  font-weight: 600;
}

.nav-item.is-empty {
  color: var(--text-faint);
}

.nav-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.nav-count {
  font-family: var(--mono);
  font-size: 11px;
  color: var(--text-faint);
  background: var(--bg-sunken);
  border-radius: 999px;
  padding: 0 6px;
  min-width: 22px;
  text-align: center;
}

.nav-item.is-active .nav-count {
  background: var(--accent);
  color: var(--accent-contrast);
}

@media (max-width: 860px) {
  /* 小屏幕隐藏分类侧边栏，图标网格占满整行 */
  .nav {
    display: none;
  }
}
</style>
