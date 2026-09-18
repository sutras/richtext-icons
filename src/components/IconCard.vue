<script setup lang="ts">
import { computed } from 'vue'
import { useIconLibrary } from '@/composables/useIconLibrary'
import type { IconMeta } from '@/types'

const props = defineProps<{ icon: IconMeta }>()

const { iconList, color, showNames, selected, copy } = useIconLibrary()

const component = computed(() => iconList[props.icon.component])
const isSelected = computed(() => selected.value?.path === props.icon.path)
</script>

<template>
  <div
    class="cell"
    :class="{ 'is-selected': isSelected }"
    @click="selected = icon"
  >
    <div class="stage">
      <span class="snap" data-pixel-snap>
        <component :is="component" :style="{ color }" />
      </span>
      <div class="quick">
        <button
          class="quick-btn"
          type="button"
          title="复制 SVG 源码"
          @click.stop="copy(icon.svg, 'SVG 已复制')"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="9" y="9" width="11" height="11" rx="2" />
            <path d="M5 15V5a2 2 0 0 1 2-2h8" />
          </svg>
        </button>
        <button
          class="quick-btn"
          type="button"
          title="复制组件名"
          @click.stop="copy(icon.component, '组件名已复制')"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 7V5h16v2M12 5v14M9 19h6" />
          </svg>
        </button>
      </div>
    </div>

    <div v-if="showNames" class="caption">
      <span class="caption-name">{{ icon.zh || icon.name }}</span>
      <code class="caption-code">{{ icon.component }}</code>
    </div>
  </div>
</template>

<style scoped>
.cell {
  width: 100%;
  border-radius: var(--radius);
  border: 1px solid transparent;
  transition: border-color 0.14s ease, background 0.14s ease;
  cursor: pointer;
  padding: 4px;
}

.cell:hover {
  background: var(--surface-hover);
  border-color: var(--border);
}

.cell.is-selected {
  background: var(--accent-soft);
  border-color: var(--accent);
}

.stage {
  position: relative;
  min-height: 88px;
  display: grid;
  place-items: center;
  padding: 12px;
}

.quick {
  position: absolute;
  top: 2px;
  right: 2px;
  display: flex;
  gap: 3px;
  opacity: 0;
  transform: translateY(-2px);
  transition: opacity 0.14s ease, transform 0.14s ease;
}

.cell:hover .quick,
.cell:focus-within .quick {
  opacity: 1;
  transform: none;
}

.quick-btn {
  width: 22px;
  height: 22px;
  display: grid;
  place-items: center;
  border-radius: 6px;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text-muted);
  box-shadow: var(--shadow-sm);
}

.quick-btn:hover {
  color: var(--accent);
  border-color: var(--accent);
}

.quick-btn svg {
  width: 12px;
  height: 12px;
}

/* 图标吸附容器：收缩到图标实际大小，供像素吸附校正定位 */
.snap {
  display: block;
  width: fit-content;
  height: fit-content;
  line-height: 0;
  /* 图标宽高为 1em，靠此处的 font-size 决定展示大小 */
  font-size: 24px;
}

.caption {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
  padding: 2px 4px 6px;
  overflow: hidden;
}

.caption-name {
  font-size: 12px;
  color: var(--text);
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.caption-code {
  font-family: var(--mono);
  font-size: 11px;
  color: var(--text-faint);
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
