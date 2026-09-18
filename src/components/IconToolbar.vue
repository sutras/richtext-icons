<script setup lang="ts">
import { useIconLibrary } from '@/composables/useIconLibrary'

const { color, showNames } = useIconLibrary()

const SWATCHES = ['#1f2328', '#2f6feb', '#12a594', '#e5484d', '#f59e0b', '#8b5cf6']
</script>

<template>
  <div class="toolbar">
    <div class="controls">
      <div class="field color-field">
        <label class="field-label">
          <span>颜色</span>
          <code>{{ color }}</code>
        </label>
        <div class="color-row">
          <input v-model="color" type="color" />
          <div class="swatches">
            <button
              v-for="(c, i) in SWATCHES"
              :key="i"
              type="button"
              class="swatch"
              :style="{ background: c }"
              :class="{ 'is-active': color.toLowerCase() === c.toLowerCase() }"
              @click="color = c"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="actions">
      <label class="toggle">
        <input v-model="showNames" type="checkbox" />
        <span>显示名称</span>
      </label>
    </div>
  </div>
</template>

<style scoped>
.toolbar {
  display: flex;
  align-items: flex-end;
  gap: 24px;
  padding: 14px 22px;
  border-bottom: 1px solid var(--border);
  background: var(--surface);
  flex-shrink: 0;
  flex-wrap: wrap;
}

.controls {
  display: flex;
  align-items: flex-end;
  gap: 26px;
  flex: 1;
  min-width: 0;
  flex-wrap: wrap;
}

.field {
  min-width: 150px;
}

.color-field {
  min-width: 190px;
}

.color-row {
  display: flex;
  gap: 10px;
  align-items: center;
}

.color-row input[type='color'] {
  width: 44px;
  flex-shrink: 0;
}

.swatches {
  display: flex;
  gap: 5px;
}

.swatch {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid transparent;
  box-shadow: 0 0 0 1px var(--border) inset;
  transition: transform 0.12s ease;
}

.swatch:hover {
  transform: scale(1.15);
}

.swatch.is-active {
  border-color: var(--surface);
  box-shadow: 0 0 0 2px var(--accent);
}

.actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.toggle {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--text-muted);
  cursor: pointer;
  user-select: none;
  margin-right: 4px;
}

.toggle input {
  accent-color: var(--accent);
  cursor: pointer;
}
</style>
