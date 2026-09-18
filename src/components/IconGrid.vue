<script setup lang="ts">
import { computed } from 'vue'
import IconCard from './IconCard.vue'
import EmptyState from './EmptyState.vue'
import { useIconLibrary } from '@/composables/useIconLibrary'

const { groups, filtered } = useIconLibrary()

/** 网格列宽（图标固定 1em=24px，卡片留足内边距） */
const cellWidth = computed(() => '104px')
</script>

<template>
  <div class="scroll">
    <EmptyState v-if="!filtered.length" />

    <template v-else>
      <section v-for="group in groups" :key="group.dir" class="group">
        <header class="group-head">
          <h2>{{ group.title }}</h2>
          <code>{{ group.dir }}</code>
          <span class="bar" />
          <span class="count">{{ group.items.length }}</span>
        </header>
        <div class="grid" :style="{ '--cell-w': cellWidth }">
          <IconCard v-for="icon in group.items" :key="icon.path" :icon="icon" />
        </div>
      </section>
    </template>
  </div>
</template>

<style scoped>
.scroll {
  padding: 18px 22px 60px;
  min-height: 0;
}

.group + .group {
  margin-top: 26px;
}

.group-head {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-bottom: 10px;
}

.group-head h2 {
  margin: 0;
  font-size: 13px;
  font-weight: 700;
  color: var(--text);
}

.group-head code {
  font-family: var(--mono);
  font-size: 11px;
  color: var(--text-faint);
}

.bar {
  flex: 1;
  height: 1px;
  background: var(--border);
}

.count {
  font-family: var(--mono);
  font-size: 11px;
  color: var(--text-faint);
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(var(--cell-w), 1fr));
  gap: 4px;
}
</style>
