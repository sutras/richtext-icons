<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useIconLibrary } from '@/composables/useIconLibrary'

const { iconList, selected, color, snippets, copy } = useIconLibrary()

const activeTab = ref('vue')

const component = computed(() =>
  selected.value ? iconList[selected.value.component] : null
)

const activeCode = computed(
  () => snippets.value.find((s) => s.id === activeTab.value)?.code ?? ''
)

/** 切换图标时回到第一个标签页 */
watch(selected, () => {
  activeTab.value = 'vue'
})

function close() {
  selected.value = null
}
</script>

<template>
  <aside class="detail" :class="{ 'is-open': Boolean(selected) }">
    <template v-if="selected">
      <header class="head">
        <div class="head-text">
          <h2>{{ selected.zh || selected.name }}</h2>
          <p>
            <code>{{ selected.kebab }}</code>
          </p>
        </div>
        <button class="btn btn--ghost close" type="button" title="关闭" @click="close">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </header>

      <div class="body">
        <div class="hero">
          <span class="snap hero-snap" data-pixel-snap>
            <component :is="component" :style="{ color }" />
          </span>
        </div>

        <section class="block">
          <p class="block-title">属性</p>
          <dl class="meta">
            <div><dt>组件名</dt><dd><code>{{ selected.component }}</code></dd></div>
            <div><dt>源文件</dt><dd><code>icons/{{ selected.path }}.svg</code></dd></div>
            <div><dt>分类</dt><dd>{{ selected.categoryZh }} <code>{{ selected.category }}</code></dd></div>
            <div><dt>风格</dt><dd>{{ selected.style === 'stroke' ? '描边' : '填充' }}</dd></div>
            <div><dt>画布</dt><dd><code>{{ selected.viewBox }}</code></dd></div>
            <div><dt>状态</dt><dd><span class="chip">{{ selected.status }}</span></dd></div>
          </dl>
        </section>

        <section v-if="selected.keywords.length" class="block">
          <p class="block-title">关键词</p>
          <div class="tags">
            <span v-for="k in selected.keywords" :key="k" class="chip">{{ k }}</span>
          </div>
        </section>

        <section class="block">
          <p class="block-title">接入代码</p>
          <div class="tabs">
            <button
              v-for="tab in snippets"
              :key="tab.id"
              type="button"
              class="tab"
              :class="{ 'is-active': activeTab === tab.id }"
              @click="activeTab = tab.id"
            >
              {{ tab.label }}
            </button>
          </div>
          <div class="code">
            <pre><code>{{ activeCode }}</code></pre>
            <button class="btn btn--sm code-copy" type="button" @click="copy(activeCode, '代码已复制')">
              复制
            </button>
          </div>
        </section>

        <section class="block">
          <button
            class="btn btn--primary full"
            type="button"
            @click="copy(`<${selected.component} />`, '组件用法已复制')"
          >
            复制组件用法
          </button>
        </section>
      </div>
    </template>
  </aside>
</template>

<style scoped>
.detail {
  position: fixed;
  top: var(--header-h);
  right: 0;
  bottom: 0;
  width: var(--detail-w);
  max-width: 90vw;
  border-left: 1px solid var(--border);
  background: var(--surface);
  box-shadow: var(--shadow-md);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transform: translateX(100%);
  transition: transform 0.24s ease;
  z-index: 60;
}

.detail.is-open {
  transform: translateX(0);
}

.head {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 14px 16px;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}

.head-text {
  flex: 1;
  min-width: 0;
}

.head-text h2 {
  margin: 0 0 2px;
  font-size: 15px;
  font-weight: 700;
}

.head-text p {
  margin: 0;
  font-size: 11px;
  color: var(--text-faint);
}

.head-text code {
  font-family: var(--mono);
}

.close {
  width: 28px;
  height: 28px;
  padding: 0;
  flex-shrink: 0;
  color: var(--text-muted);
}

.close svg {
  width: 14px;
  height: 14px;
}

.body {
  flex: 1;
  overflow-y: auto;
  padding: 14px 16px 28px;
  min-height: 0;
}

.hero {
  display: grid;
  place-items: center;
  height: 132px;
  border-radius: var(--radius);
  background: var(--bg-subtle);
  border: 1px solid var(--border);
  margin-bottom: 16px;
}

.block + .block {
  margin-top: 18px;
}

.block-title {
  margin: 0 0 8px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-faint);
}

/* 图标吸附容器：收缩到图标实际大小，供像素吸附校正定位 */
.snap {
  display: block;
  width: fit-content;
  height: fit-content;
  line-height: 0;
}

/* hero 大图：图标 1em，靠 font-size 放大 */
.hero-snap {
  font-size: 56px;
}

.meta {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.meta > div {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 0;
  border-bottom: 1px dashed var(--border);
  font-size: 12px;
}

.meta > div:last-child {
  border-bottom: none;
}

.meta dt {
  width: 60px;
  flex-shrink: 0;
  color: var(--text-faint);
}

.meta dd {
  margin: 0;
  flex: 1;
  min-width: 0;
  color: var(--text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.meta code {
  font-family: var(--mono);
  font-size: 11px;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.tabs {
  display: flex;
  gap: 2px;
  padding: 2px;
  border-radius: var(--radius-sm);
  background: var(--bg-sunken);
  margin-bottom: 8px;
}

.tab {
  flex: 1;
  height: 26px;
  border-radius: 5px;
  font-size: 11px;
  color: var(--text-muted);
  transition: all 0.12s ease;
}

.tab:hover {
  color: var(--text);
}

.tab.is-active {
  background: var(--surface);
  color: var(--text);
  font-weight: 600;
  box-shadow: var(--shadow-sm);
}

.code {
  position: relative;
}

.code pre {
  margin: 0;
  padding: 11px 12px;
  background: var(--bg-sunken);
  border-radius: var(--radius-sm);
  max-height: 190px;
  overflow: auto;
}

.code code {
  font-family: var(--mono);
  font-size: 12px;
  line-height: 1.65;
  white-space: pre-wrap;
  word-break: break-all;
  color: var(--text);
}

.code-copy {
  position: absolute;
  top: 7px;
  right: 7px;
}

.full {
  width: 100%;
}
</style>
