<script setup lang="ts">
import { computed } from 'vue'
import { useIconLibrary } from '@/composables/useIconLibrary'

const { query, activeCategory, navCategories } = useIconLibrary()

const current = computed(() => navCategories.value.find((c) => c.dir === activeCategory.value))

const isSearching = computed(() => Boolean(query.value.trim()))
</script>

<template>
  <div class="empty">
    <div class="art" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="4" />
        <path d="M9 12h6M12 9v6" />
      </svg>
    </div>

    <template v-if="isSearching">
      <h3>没有匹配「{{ query }}」的图标</h3>
      <p>换个关键词试试，或用空格组合多个条件（例如 <code>table row</code>）。</p>
    </template>

    <template v-else>
      <h3>{{ current?.zh ?? '该分类' }} 暂无图标</h3>
      <p>该分类下暂时没有图标，可以去「全部图标」看看其他分类。</p>
    </template>
  </div>
</template>

<style scoped>
.empty {
  max-width: 560px;
  margin: 8vh auto 0;
  text-align: center;
  color: var(--text-muted);
}

.art {
  width: 56px;
  height: 56px;
  margin: 0 auto 16px;
  border-radius: 16px;
  background: var(--bg-subtle);
  border: 1px dashed var(--border-strong);
  display: grid;
  place-items: center;
  color: var(--text-faint);
}

.art svg {
  width: 26px;
  height: 26px;
}

h3 {
  margin: 0 0 6px;
  font-size: 15px;
  color: var(--text);
  font-weight: 700;
}

p {
  margin: 0;
  font-size: 13px;
  line-height: 1.7;
}

code {
  font-family: var(--mono);
  font-size: 12px;
  background: var(--bg-sunken);
  border-radius: 4px;
  padding: 1px 5px;
}
</style>
