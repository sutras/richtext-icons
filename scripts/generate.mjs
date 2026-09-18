#!/usr/bin/env node
/**
 * 图标生成器
 *
 *   icons/<category>/<name>.svg   ──┐
 *   icons-meta.json（可选，中文名/关键词）─┤──► src/icons/<Name>.vue      （Vue 组件）
 *                                   │    src/generated/index.ts    （库入口）
 *                                   │    src/generated/manifest.ts （预览站清单）
 *                                   └──► src/generated/manifest.json（机器可读）
 *
 * 用法：npm run gen           普通生成
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, rmSync, existsSync } from 'node:fs'
import { join, dirname, relative, basename, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import config from '../icon.config.mjs'
import {
  parseSvg,
  indentInner,
  toComponentName,
  toKebabCase,
  stringifyAttrs
} from './lib/svg.mjs'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')

const p = (...s) => join(ROOT, ...s)
const C = {
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`
}

/* ------------------------------------------------------------------ *
 * 1. 扫描
 * ------------------------------------------------------------------ */

/** 递归收集 icons/ 下所有 .svg 的绝对路径 */
function walkSvg(dir) {
  if (!existsSync(dir)) return []
  const out = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue
    const full = join(dir, entry.name)
    if (entry.isDirectory()) out.push(...walkSvg(full))
    else if (entry.isFile() && entry.name.toLowerCase().endsWith('.svg')) out.push(full)
  }
  return out.sort()
}

/* ------------------------------------------------------------------ *
 * 2. 解析
 * ------------------------------------------------------------------ */
const meta = existsSync(p('icons-meta.json'))
  ? JSON.parse(readFileSync(p('icons-meta.json'), 'utf8'))
  : {}

const categoryIndex = new Map(config.categories.map((c, i) => [c.dir, i]))
const categoryMap = new Map(config.categories.map((c) => [c.dir, c]))

const files = walkSvg(p(config.iconDir))
const icons = []
const errors = []
const warnings = []
const seen = new Set()

for (const file of files) {
  const rel = relative(p(config.iconDir), file).split('\\').join('/')
  const relNoExt = rel.replace(/\.svg$/i, '')
  const segments = relNoExt.split('/')
  const name = segments.pop()
  const category = segments.join('/') || 'uncategorized'

  if (seen.has(relNoExt)) {
    errors.push(`${rel} —— 路径重复`)
    continue
  }
  seen.add(relNoExt)

  let parsed
  try {
    parsed = parseSvg(readFileSync(file, 'utf8'), rel)
  } catch (err) {
    errors.push(`${rel} —— ${err.message}`)
    continue
  }

  const component = toComponentName(name, config.prefix)
  if (icons.some((i) => i.component === component)) {
    errors.push(`${rel} —— 组件名 ${component} 与已有图标冲突，请重命名文件`)
    continue
  }

  // 元数据支持两种写法：
  //   "format/bold": "加粗"
  //   "format/bold": { "zh": "加粗", "keywords": [...] }
  const rawMeta = meta[relNoExt]
  const m = typeof rawMeta === 'string' ? { zh: rawMeta } : rawMeta ?? {}
  const catZh = categoryMap.get(category)?.zh ?? category
  const strokeWidthAttr = parsed.rootAttrs['stroke-width']
  if (strokeWidthAttr !== undefined && !parsed.isStroke) {
    warnings.push(`${rel} —— 声明了 stroke-width 但没有 stroke，该属性将被忽略`)
  }

  icons.push({
    name,
    path: relNoExt,
    component,
    kebab: toKebabCase(component),
    category,
    categoryZh: catZh,
    zh: m.zh ?? '',
    en: m.en ?? name,
    keywords: Array.from(new Set([...(m.keywords ?? []), name.replace(/-/g, ' ')])),
    tags: m.tags ?? [],
    status: m.status ?? 'stable',
    style: parsed.isStroke ? 'stroke' : 'fill',
    viewBox: parsed.rootAttrs.viewBox,
    rootAttrs: parsed.rootAttrs,
    inner: parsed.inner,
    isStroke: parsed.isStroke
  })
}

/* ------------------------------------------------------------------ *
 * 4. 生成 Vue 组件
 * ------------------------------------------------------------------ */

/** 渲染 <svg> 根节点的属性行 */
function renderRootAttrs(icon) {
  const lines = []
  lines.push(`    viewBox="${icon.viewBox}"`)
  for (const [key, value] of Object.entries(icon.rootAttrs)) {
    if (key === 'viewBox') continue
    if (key === 'fill' || key === 'stroke') {
      // 颜色统一走 currentColor，便于用 CSS color 控制
      lines.push(`    ${key}="${value === 'currentColor' ? 'currentColor' : value}"`)
      continue
    }
    lines.push(`    ${key}="${value}"`)
  }
  lines.push(`    width="1em"`)
  lines.push(`    height="1em"`)
  return lines.join('\n')
}

function renderComponent(icon) {
  const rootAttrs = renderRootAttrs(icon)
  const inner = icon.inner
  return `<!-- 由 \`npm run gen\` 自动生成，请勿手动修改；源文件：${config.iconDir}/${icon.path}.svg -->
<template>
  <svg
${rootAttrs}
  >
${indentInner(inner, 4)}
  </svg>
</template>
`
}

/* ------------------------------------------------------------------ *
 * 5. 生成库入口 / 清单
 * ------------------------------------------------------------------ */
function renderLibEntry() {
  const banner = `// 由 \`npm run gen\` 自动生成，请勿手动修改。\n`
  const imports = icons
    .map((i) => `import ${i.component} from '../icons/${i.component}.vue'`)
    .join('\n')
  const listBody = icons.map((i) => `  ${i.component}`).join(',\n')
  return `${banner}
import type { Component } from 'vue'
${imports ? imports + '\n' : ''}
export type { IconMeta, IconCategory } from '../types'

/** 全部图标组件，按名称索引 */
export const iconList: Record<string, Component> = {
${listBody}${listBody ? '\n' : ''}}

/** 全部图标组件名 */
export const ICON_NAMES = [${icons.map((i) => `'${i.component}'`).join(', ')}] as const

/** 图标总数 */
export const ICON_COUNT = ${icons.length}

${icons.map((i) => `export { default as ${i.component} } from '../icons/${i.component}.vue'`).join('\n')}

export default iconList
`
}

/**
 * 生成纯元数据入口（供 AI / 工具链按场景检索，不依赖 Vue 组件）
 * 直接从 icons 数组序列化轻量字段（不含 svg 源码字符串），
 * 零 Vue 依赖、零 svg 体积，可被 Node 直接 import。
 */
function renderMetadataEntry() {
  const banner = `// 由 \`npm run gen\` 自动生成，请勿手动修改。\n`
  const liteItems = icons.map((i) => ({
    name: i.name,
    path: i.path,
    component: i.component,
    kebab: i.kebab,
    category: i.category,
    categoryZh: i.categoryZh,
    zh: i.zh,
    en: i.en,
    keywords: i.keywords,
    tags: i.tags,
    status: i.status,
    style: i.style,
    viewBox: i.viewBox
  }))
  const cats = config.categories.map((c, idx) => ({
    dir: c.dir,
    zh: c.zh,
    en: c.en,
    order: idx,
    count: icons.filter((i) => i.category === c.dir).length
  }))
  return `${banner}
import type { IconMeta, IconCategory } from '../types'

/** 轻量图标元数据（不含 svg 源码字符串），供 AI / 工具链检索 */
export type IconMetaLite = Omit<IconMeta, 'svg'>

/** 全部图标轻量元数据（名称 / 语义 / 分类 / 状态，不含 SVG 源码） */
export const icons: IconMetaLite[] = ${JSON.stringify(liteItems, null, 2)}

/** 全部分类 */
export const categories: IconCategory[] = ${JSON.stringify(cats, null, 2)}

/** 图标总数 */
export const total = ${icons.length}

export default icons
`
}

function renderManifest() {
  const cats = config.categories.map((c, idx) => ({
    dir: c.dir,
    zh: c.zh,
    en: c.en,
    order: idx,
    count: icons.filter((i) => i.category === c.dir).length
  }))
  for (const icon of icons) {
    if (!cats.some((c) => c.dir === icon.category)) {
      cats.push({
        dir: icon.category,
        zh: icon.category,
        en: icon.category,
        order: 1000 + cats.length,
        count: icons.filter((i) => i.category === icon.category).length
      })
    }
  }

  const items = icons.map((i) => ({
    name: i.name,
    path: i.path,
    component: i.component,
    kebab: i.kebab,
    category: i.category,
    categoryZh: i.categoryZh,
    zh: i.zh,
    en: i.en,
    keywords: i.keywords,
    tags: i.tags,
    status: i.status,
    style: i.style,
    viewBox: i.viewBox,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" ${stringifyAttrs(
      i.rootAttrs
    )}>\n${indentInner(i.inner, 2)}\n</svg>`
  }))

  return { items, categories: cats }
}

function renderManifestTs(manifest) {
  return `// 由 \`npm run gen\` 自动生成，请勿手动修改。
import type { IconMeta, IconCategory } from '../types'

export const icons: IconMeta[] = ${JSON.stringify(manifest.items, null, 2)}

export const categories: IconCategory[] = ${JSON.stringify(manifest.categories, null, 2)}

export const total = ${manifest.items.length}
`
}

/* ------------------------------------------------------------------ *
 * 6. 落盘
 * ------------------------------------------------------------------ */
const written = []
const unchanged = []

function emit(absPath, content, { force = false } = {}) {
  mkdirSync(dirname(absPath), { recursive: true })
  if (!force && existsSync(absPath) && readFileSync(absPath, 'utf8') === content) {
    unchanged.push(absPath)
    return
  }
  writeFileSync(absPath, content, 'utf8')
  written.push(absPath)
}

// 6.1 Vue 组件
const validNames = new Set(icons.map((i) => `${i.component}.vue`))
if (existsSync(p(config.componentDir))) {
  for (const f of readdirSync(p(config.componentDir))) {
    if (f.endsWith('.vue') && !validNames.has(f)) {
      rmSync(p(config.componentDir, f))
      console.log(C.dim(`  · 清理失效组件 src/icons/${f}`))
    }
  }
}
for (const icon of icons) {
  emit(p(config.componentDir, `${icon.component}.vue`), renderComponent(icon))
}

// 6.2 库入口
emit(p(config.generatedDir, 'index.ts'), renderLibEntry())

// 6.3 纯元数据入口（AI / 工具链，零 Vue 依赖）
emit(p(config.generatedDir, 'metadata.ts'), renderMetadataEntry())

// 6.4 预览清单
const manifest = renderManifest()
emit(p(config.generatedDir, 'manifest.ts'), renderManifestTs(manifest))
emit(p(config.generatedDir, 'manifest.json'), JSON.stringify(manifest, null, 2), { force: true })

/* ------------------------------------------------------------------ *
 * 7. 报告
 * ------------------------------------------------------------------ */
console.log('')
console.log(C.bold(`  ${config.prefix}Icons · 图标生成完成`))
console.log(C.dim('  ─'.repeat(25)))

if (icons.length) {
  const byCat = new Map()
  for (const i of icons) byCat.set(i.category, (byCat.get(i.category) ?? 0) + 1)
  for (const c of config.categories) {
    const n = byCat.get(c.dir) ?? 0
    const bar = n ? C.green('█'.repeat(Math.min(n, 24))) : C.dim('·')
    console.log(`  ${c.zh.padEnd(6, '　')} ${String(n).padStart(3)}  ${bar}`)
  }
}

console.log(C.dim('  ─'.repeat(25)))
console.log(`  图标 ${C.bold(String(icons.length))} 个 · 分类 ${new Set(icons.map((i) => i.category)).size} 个`)
console.log(
  `  写入 ${C.green(String(written.length))} 个文件` +
    (unchanged.length ? C.dim(` · ${unchanged.length} 个无变化`) : '')
)

if (warnings.length) {
  console.log('')
  for (const w of warnings) console.log(C.yellow(`  ⚠  ${w}`))
}
if (errors.length) {
  console.log('')
  for (const e of errors) console.log(C.red(`  ✖  ${e}`))
  console.log(C.red(`\n  有 ${errors.length} 个图标解析失败，已跳过。\n`))
  process.exitCode = 1
} else {
  console.log('')
}
