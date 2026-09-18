<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'
import AppHeader from './components/AppHeader.vue'
import SiteHero from './components/SiteHero.vue'
import DocsSection from './components/DocsSection.vue'
import CategoryNav from './components/CategoryNav.vue'
import IconToolbar from './components/IconToolbar.vue'
import IconGrid from './components/IconGrid.vue'
import IconDetail from './components/IconDetail.vue'
import { useIconLibrary } from '@/composables/useIconLibrary'
import { usePixelSnap } from '@/lib/pixelSnap'

const { toast, selected, showNames, query, activeCategory, groups } = useIconLibrary()

/* 图标像素吸附：布局状态变化后重新校正到整数像素，避免亚像素渲染发虚 */
usePixelSnap([showNames, query, activeCategory, groups, selected])

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && selected.value) selected.value = null
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <div class="app">
    <AppHeader />

    <SiteHero />
    <DocsSection />

    <!-- 图标画廊 -->
    <section id="icons" class="gallery">
      <div class="gallery-head">
        <h2 class="gallery-title">全部图标</h2>
        <p class="gallery-sub">点击任意图标查看详情与接入代码，也可以搜索、按分类浏览。</p>
      </div>

      <div class="gallery-body">
        <CategoryNav />
        <main class="content">
          <IconToolbar />
          <IconGrid />
        </main>
      </div>
    </section>

    <IconDetail />

    <footer class="site-footer">
      <p>RtiIcons · 富文本编辑器图标库</p>
      <p>MIT License · 随主题自动适配的 SVG 图标</p>
    </footer>

    <Transition name="toast">
      <div v-if="toast" class="toast" role="status">{{ toast }}</div>
    </Transition>
  </div>
</template>

<style scoped>
.app {
  width: 100%;
}

/* 顶栏 sticky 悬浮 */
.app :deep(.header) {
  position: sticky;
  top: 0;
  z-index: 50;
}

/* 图标画廊区 */
.gallery {
  border-top: 1px solid var(--border);
  /* sticky 顶栏高度补偿：锚点跳转与搜索自动滚动都停在顶栏正下方 */
  scroll-margin-top: calc(var(--header-h) - 1px);
}

.gallery-head {
  max-width: 1080px;
  margin: 0 auto;
  padding: 56px 24px 20px;
}

.gallery-title {
  margin: 0 0 6px;
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--text);
}

.gallery-sub {
  margin: 0;
  font-size: 14px;
  color: var(--text-muted);
}

.gallery-body {
  max-width: 1080px;
  margin: 0 auto;
  display: flex;
  align-items: flex-start;
  gap: 0;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.site-footer {
  margin-top: 64px;
  padding: 32px 24px;
  border-top: 1px solid var(--border);
  text-align: center;
  color: var(--text-faint);
  font-size: 13px;
}

.site-footer p {
  margin: 0;
}

.site-footer p + p {
  margin-top: 4px;
}

.toast {
  position: fixed;
  left: 50%;
  bottom: 28px;
  transform: translateX(-50%);
  padding: 8px 16px;
  border-radius: 999px;
  background: var(--text);
  color: var(--bg);
  font-size: 12px;
  font-weight: 600;
  box-shadow: var(--shadow-md);
  z-index: 100;
}

.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translate(-50%, 8px);
}
</style>
