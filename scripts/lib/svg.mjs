/**
 * SVG 解析 / 规范化工具
 * 目标：把任意来源的 SVG 文件（Figma / Illustrator / 手写）统一成
 * 一个「根属性 + 内部图形」的结构，供 Vue 组件与雪碧图复用。
 */

/** 允许保留在 <svg> 根节点上的属性（其余会被丢弃） */
const KEEP_ROOT_ATTRS = new Set([
  'viewBox',
  'fill',
  'stroke',
  'stroke-width',
  'stroke-linecap',
  'stroke-linejoin',
  'stroke-miterlimit',
  'stroke-dasharray',
  'stroke-dashoffset',
  'fill-rule',
  'clip-rule',
  'shape-rendering',
  'vector-effect'
])

/** 需要静默丢弃的根属性 */
const DROP_ROOT_ATTRS = new Set([
  'width',
  'height',
  'class',
  'id',
  'style',
  'version',
  'xmlns',
  'xmlns:xlink',
  'xml:space',
  'enable-background',
  'baseProfile',
  'x',
  'y',
  'role',
  'focusable'
])

/** 内部需要剔除的标签（<title>/<desc> 由组件按需生成） */
const STRIP_INNER = [
  /<!--[\s\S]*?-->/g,
  /<\?xml[\s\S]*?\?>/g,
  /<!DOCTYPE[\s\S]*?>/gi,
  /<title\b[^>]*>[\s\S]*?<\/title>/gi,
  /<desc\b[^>]*>[\s\S]*?<\/desc>/gi,
  /<metadata\b[^>]*>[\s\S]*?<\/metadata>/gi
]

/**
 * 解析属性字符串 => 普通对象
 * 同时兼容双引号 / 单引号 / 无引号
 */
export function parseAttrs(source) {
  const attrs = {}
  const re = /([\w:.-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g
  let m
  while ((m = re.exec(source))) {
    const key = m[1]
    const value = m[2] ?? m[3] ?? m[4] ?? ''
    // 跳过 viewBox="0 0 24 24" 里被误抓的裸词
    if (value === '' && !/^[\w:.-]+$/.test(key)) continue
    attrs[key] = value
  }
  return attrs
}

/** 把属性对象序列化回字符串 */
export function stringifyAttrs(attrs) {
  return Object.entries(attrs)
    .map(([k, v]) => (v === '' ? k : `${k}="${v}"`))
    .join(' ')
}

/**
 * 把 SVG 原文拆成 { rootAttrs, inner, viewBox }
 * @throws 缺少 viewBox / 结构不合法时抛错，由调用方汇总报错
 */
export function parseSvg(raw, filePath = '<inline>') {
  const clean = STRIP_INNER.reduce((acc, re) => acc.replace(re, ''), raw).trim()

  const openMatch = clean.match(/<svg\b[^>]*>/i)
  const closeIdx = clean.lastIndexOf('</svg>')
  if (!openMatch || closeIdx === -1) {
    throw new Error(`不是合法的 SVG 结构（缺少 <svg> 或 </svg>）`)
  }

  const attrSource = openMatch[0].replace(/^<svg\b/i, '').replace(/>$/, '')
  const rawAttrs = parseAttrs(attrSource)

  const rootAttrs = {}
  for (const [key, value] of Object.entries(rawAttrs)) {
    if (DROP_ROOT_ATTRS.has(key)) continue
    if (key.startsWith('data-') || key.startsWith('aria-')) continue
    if (KEEP_ROOT_ATTRS.has(key)) rootAttrs[key] = value
  }

  const viewBox = rootAttrs.viewBox
  if (!viewBox) {
    throw new Error(
      `缺少 viewBox —— 请在 <svg> 上补上 viewBox="0 0 24 24"（当前文件：${filePath}）`
    )
  }
  const parts = viewBox.trim().split(/[\s,]+/).map(Number)
  if (parts.length !== 4 || parts.some((n) => Number.isNaN(n))) {
    throw new Error(`viewBox="${viewBox}" 格式不正确，应为 "0 0 24 24"`)
  }

  // 未声明 fill / stroke 时，按单色填充处理（跟随 currentColor）
  if (!rootAttrs.fill && !rootAttrs.stroke) {
    rootAttrs.fill = 'currentColor'
  }
  // 只描边不填充是图标库最常见的写法，补一个显式的 fill="none"
  if (rootAttrs.stroke && !rootAttrs.fill) {
    rootAttrs.fill = 'none'
  }

  // 属性顺序：viewBox 永远在最前，方便阅读与 diff
  // （展开同名 key 只覆盖值，不改变插入位置）
  const finalAttrs = { viewBox, ...rootAttrs }

  const inner = clean.slice(clean.indexOf(openMatch[0]) + openMatch[0].length, closeIdx).trim()
  if (!inner) throw new Error('SVG 内部没有任何图形元素')

  return {
    rootAttrs: finalAttrs,
    inner,
    viewBox: parts,
    /** 该图标是否为描边风格（根节点声明了 stroke） */
    isStroke: Boolean(rootAttrs.stroke)
  }
}

/** 内部图形按行重新缩进，便于生成可读的 Vue 模板 */
export function indentInner(inner, spaces = 4) {
  const pad = ' '.repeat(spaces)
  return inner
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => pad + line)
    .join('\n')
}

/** bold / align-left / text_bold -> Bold / AlignLeft / TextBold */
export function toPascalCase(input) {
  const parts = input
    .replace(/\.svg$/i, '')
    .split(/[\s_\-.]+/)
    .filter(Boolean)
  const joined = parts
    .map((p) =>
      // 保留 h1 / h2 这类「字母+数字」片段的大写形态
      /^[a-z]\d+$/i.test(p) ? p.replace(/^([a-z])/i, (s) => s.toUpperCase()) : p.charAt(0).toUpperCase() + p.slice(1)
    )
    .join('')
  return /^\d/.test(joined) ? `Icon${joined}` : joined
}

/** 组件名：prefix + PascalCase */
export function toComponentName(name, prefix) {
  return `${prefix}${toPascalCase(name)}`
}

/** 组件名 -> 短横线命名：RtiAlignLeft -> rti-align-left */
export function toKebabCase(input) {
  return input
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .toLowerCase()
}
