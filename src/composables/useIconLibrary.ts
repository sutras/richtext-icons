import { computed, ref, watchEffect } from 'vue'
import { iconList } from '@/generated/index'
import { icons as allIcons, categories as allCategories } from '@/generated/manifest'
import type { IconCategory, IconMeta } from '@/types'

/* ------------------------------------------------------------------ *
 * 全局共享状态（单例 composable）
 * ------------------------------------------------------------------ */
export type ThemeName = 'light' | 'dark'

const THEME_DEFAULT_COLOR: Record<ThemeName, string> = {
  light: '#1f2328',
  dark: '#e7e9ec'
}

const query = ref('')
const activeCategory = ref('all')
const theme = ref<ThemeName>('light')
const color = ref(THEME_DEFAULT_COLOR.light)
const showNames = ref(true)
const selected = ref<IconMeta | null>(null)
const toast = ref('')
let toastTimer: ReturnType<typeof setTimeout> | undefined

/** 主题切换：同步 <html data-theme>，并让默认图标色跟随主题 */
function setTheme(next: ThemeName) {
  const wasDefault = color.value === THEME_DEFAULT_COLOR[theme.value]
  theme.value = next
  if (wasDefault) color.value = THEME_DEFAULT_COLOR[next]
}

watchEffect(() => {
  document.documentElement.dataset.theme = theme.value
})

function notify(message: string) {
  toast.value = message
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => (toast.value = ''), 1800)
}

async function copy(text: string, label = '已复制') {
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    // 非安全上下文（如 http 访问）降级为 execCommand
    const ta = document.createElement('textarea')
    ta.value = text
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    document.body.removeChild(ta)
  }
  notify(label)
}

/* ------------------------------------------------------------------ *
 * 检索
 * ------------------------------------------------------------------ */
const filtered = computed<IconMeta[]>(() => {
  const q = query.value.trim().toLowerCase()
  let list = allIcons
  if (activeCategory.value !== 'all') {
    list = list.filter((icon) => icon.category === activeCategory.value)
  }
  if (!q) return list
  const terms = q.split(/\s+/).filter(Boolean)
  return list.filter((icon) => {
    const haystack = [
      icon.name,
      icon.zh,
      icon.en,
      icon.path,
      icon.categoryZh,
      icon.component,
      icon.kebab,
      ...icon.keywords
    ]
      .join(' ')
      .toLowerCase()
    return terms.every((t) => haystack.includes(t))
  })
})

/** 当前结果按分类分组，用于浏览时插入分组标题 */
const groups = computed(() => {
  const byCat = new Map<string, IconMeta[]>()
  for (const icon of filtered.value) {
    const arr = byCat.get(icon.category) ?? []
    arr.push(icon)
    byCat.set(icon.category, arr)
  }
  const order = new Map(allCategories.map((c) => [c.dir, c.order]))
  return [...byCat.entries()]
    .map(([dir, items]) => ({
      dir,
      meta: allCategories.find((c) => c.dir === dir),
      title: allCategories.find((c) => c.dir === dir)?.zh ?? dir,
      items
    }))
    .sort((a, b) => (order.get(a.dir) ?? 999) - (order.get(b.dir) ?? 999))
})

/** 侧边栏分类（含「全部」），搜索结果为空时自动从列表隐藏 */
const navCategories = computed<Array<IconCategory & { isAll?: boolean }>>(() => {
  const searching = Boolean(query.value.trim())
  const counts = new Map<string, number>()
  for (const icon of filtered.value) {
    counts.set(icon.category, (counts.get(icon.category) ?? 0) + 1)
  }
  const list = allCategories.map((c) => ({ ...c, count: counts.get(c.dir) ?? 0 }))
  return [
    {
      dir: 'all',
      zh: '全部图标',
      en: 'All',
      order: -1,
      count: filtered.value.length,
      isAll: true
    },
    ...(searching ? list.filter((c) => c.count > 0) : list)
  ]
})

const stats = computed(() => ({
  total: allIcons.length,
  categories: allCategories.filter((c) => c.count > 0).length,
  planned: allCategories.length
}))

/* ------------------------------------------------------------------ *
 * 代码片段
 * ------------------------------------------------------------------ */
const snippets = computed(() => {
  const icon = selected.value
  if (!icon) return []
  return [
    {
      id: 'vue',
      label: 'Vue 组件',
      code: `<${icon.component} />`
    },
    {
      id: 'import',
      label: '按需引入',
      code: `import { ${icon.component} } from 'richtext-icons'\n\n<${icon.component} />`
    },
    { id: 'svg', label: 'SVG 源码', code: icon.svg }
  ]
})

export function useIconLibrary() {
  return {
    // 组件表
    iconList,
    // 状态
    query,
    activeCategory,
    color,
    theme,
    showNames,
    selected,
    toast,
    // 派生
    filtered,
    groups,
    navCategories,
    stats,
    snippets,
    // 操作
    setTheme,
    copy,
    notify
  }
}
