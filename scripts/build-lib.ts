/**
 * 图标组件库构建脚本（纯 ESM · Vue 3 · 带 TS 类型）
 *
 *   1. 生成 Vue 组件（复用 scripts/generate.mjs，等价于 `npm run gen`）
 *   2. Vite 打包：双入口 ESM，external vue（产出 dist/index.js + metadata.js）
 *   3. vue-tsc 生成类型声明（产出 dist/index.d.ts + metadata.d.ts + types.d.ts）
 *
 * 说明：README 不复制进 dist——npm 发布时自动打包根 README.md。
 * 发布策略为「从根目录发布」（files:["dist"] + exports 指向 ./dist/*），
 * dist 内无嵌套 package.json。
 *
 * 定位：仅面向「通过 Vue 组件使用」的用户，因此不导出原始 SVG 与雪碧图。
 *
 * 用法：npm run build:lib
 *
 * 参考：/Users/tiny/projects/my/cosey/scripts/build.ts 的分步 Task 编排思路。
 */
import { execSync } from 'node:child_process'
import { cpSync, writeFileSync, existsSync, readFileSync, rmSync, mkdirSync } from 'node:fs'
import { join, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { build as viteBuild } from 'vite'
import vue from '@vitejs/plugin-vue'

import iconConfig from '../icon.config.mjs'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const p = (...s: string[]) => join(ROOT, ...s)

const OUT_DIR = 'dist'

/* ------------------------------------------------------------------ *
 * 终端输出
 * ------------------------------------------------------------------ */
const C = {
  red: (s: string) => `\x1b[31m${s}\x1b[0m`,
  green: (s: string) => `\x1b[32m${s}\x1b[0m`,
  yellow: (s: string) => `\x1b[33m${s}\x1b[0m`,
  dim: (s: string) => `\x1b[2m${s}\x1b[0m`,
  bold: (s: string) => `\x1b[1m${s}\x1b[0m`
}

function step(title: string, fn: () => void) {
  const t0 = Date.now()
  console.log(`\n${C.bold('▶')} ${title}`)
  fn()
  console.log(C.dim(`  └ 完成（${Date.now() - t0}ms）`))
}

function fail(msg: string): never {
  console.error(`\n${C.red('✖')} ${msg}\n`)
  process.exit(1)
}

/* ------------------------------------------------------------------ *
 * 1. 生成 Vue 组件
 * ------------------------------------------------------------------ */
function generateComponents() {
  execSync(`${process.execPath} scripts/generate.mjs`, {
    cwd: ROOT,
    stdio: 'inherit'
  })
}

/* ------------------------------------------------------------------ *
 * 2. Vite 打包（纯 ESM，external vue）
 * ------------------------------------------------------------------ */
async function bundleEsm() {
  // 手动清空 dist（不用 emptyOutDir，避免 Vite 在 bundle 结束后才清目录，
  // 导致后续写入的 index.d.ts / manifest.json / package.json 被误删）
  rmSync(p(OUT_DIR), { recursive: true, force: true })

  await viteBuild({
    root: ROOT,
    logLevel: 'info',
    configFile: false, // 独立配置，不读 vite.config.ts（它面向预览站/双格式）
    plugins: [vue()],
    resolve: {
      alias: { '@': p('src') }
    },
    build: {
      outDir: OUT_DIR,
      emptyOutDir: false,
      copyPublicDir: false,
      lib: {
        entry: {
          index: p('src/generated/index.ts'),
          metadata: p('src/generated/metadata.ts')
        },
        name: `${iconConfig.prefix}Icons`,
        formats: ['es'],
        fileName: (_format, entryName) => `${entryName}.js`
      },
      rollupOptions: {
        external: ['vue'],
        output: { exports: 'named' }
      }
    }
  })
}

/* ------------------------------------------------------------------ *
 * 3. 生成类型声明
 *
 * 组件统一是 DefineComponent<IconProps & SVGAttributes>，因此不需要逐组件
 * 跑 vue-tsc 推导——直接由 manifest（生成器产出）驱动生成 index.d.ts，
 * 用一个 IconComponent 类型覆盖全部图标。types.d.ts 直接复制（手写稳定文件）。
 * ------------------------------------------------------------------ */
interface ManifestItem {
  component: string
}

interface Manifest {
  items: ManifestItem[]
}

function readManifest(): Manifest {
  const file = p('src/generated/manifest.json')
  if (!existsSync(file)) fail(`缺少清单文件：${file}，请先运行 npm run gen`)
  return JSON.parse(readFileSync(file, 'utf8'))
}

function renderIndexDts(items: ManifestItem[]): string {
  const names = items.map((i) => i.component).sort()
  return `// 由构建脚本 scripts/build-lib.ts 自动生成
import type { Component, DefineComponent, SVGAttributes } from 'vue'

export type {
  IconMeta,
  IconCategory,
  IconStatus,
  IconStyle
} from './types'

/**
 * 图标组件（Rti 前缀，如 \`RtiBold\`）。无自有 prop：
 * - 宽高固定 1em，尺寸跟随所在元素的 \`font-size\`；
 * - 颜色跟随 \`color\`（内部统一 currentColor）；
 * - 描边宽度固定 1.5 用户单位，随尺寸等比缩放。
 * 其余原生 SVG 属性（class / style / 事件等）透传到 <svg> 根节点。
 *
 * @example
 * \`\`\`vue
 * <RtiBold style="font-size: 20px; color: #2f6feb" />
 * \`\`\`
 *
 * 需要「按语义找图标」时，改用零 Vue 依赖的元数据入口：
 * \`import { icons } from 'richtext-icons/metadata'\`，按 \`tags\` 检索。
 */
export type IconComponent = DefineComponent<SVGAttributes>

${names.map((n) => `export declare const ${n}: IconComponent`).join('\n')}

/** 全部图标组件，按组件名索引（如 iconList['RtiBold']，可配合 <component :is> 动态渲染） */
export declare const iconList: Record<string, Component>

/** 全部图标组件名（如 'RtiBold'） */
export declare const ICON_NAMES: readonly string[]

/** 图标总数 */
export declare const ICON_COUNT: number

declare const _default: Record<string, Component>
export default _default
`
}

/** 纯元数据入口的类型声明（零 Vue 依赖） */
function renderMetadataDts(): string {
  return `// 由构建脚本 scripts/build-lib.ts 自动生成
export type { IconMeta, IconCategory, IconStatus, IconStyle } from './types'

/**
 * 轻量图标元数据（不含 svg 源码字符串），供 AI / 工具链按语义检索图标。
 * 零 Vue 依赖，可在纯 Node 环境直接 import。
 *
 * 字段：name / path / component / zh / en / keywords / tags / category / status / style / viewBox。
 * 其中 \`tags\` 是「用途语义」标签（如「表格」「行操作」「主题」「协作」），
 * 用于按场景理解图标用途；\`keywords\` 是「近义词」检索（中英双语）。
 * 组件名 = 前缀 Rti + PascalCase（如 \`table/row-insert\` → \`RtiRowInsert\`）。
 *
 * @example
 * \`\`\`js
 * import { icons } from 'richtext-icons/metadata'
 * const rowOps = icons.filter((i) => i.tags.includes('行操作'))
 * \`\`\`
 */
export type IconMetaLite = Omit<import('./types').IconMeta, 'svg'>

/** 全部图标轻量元数据（名称 / 语义 / 分类 / 状态，不含 SVG 源码） */
export declare const icons: IconMetaLite[]

/** 全部分类（含分类 id、中英文名、图标数量） */
export declare const categories: import('./types').IconCategory[]

/** 图标总数 */
export declare const total: number

declare const _default: IconMetaLite[]
export default _default
`
}

function emitTypes() {
  mkdirSync(p(OUT_DIR), { recursive: true })

  // 入口类型声明（manifest 驱动，组件名与生成器严格一致）
  const manifest = readManifest()
  writeFileSync(p(OUT_DIR, 'index.d.ts'), renderIndexDts(manifest.items), 'utf8')

  // 纯元数据入口类型声明
  writeFileSync(p(OUT_DIR, 'metadata.d.ts'), renderMetadataDts(), 'utf8')

  // 公共类型（手写稳定文件，直接复制）
  const typesSrc = p('src/types.ts')
  if (!existsSync(typesSrc)) fail(`缺少类型源文件：${typesSrc}`)
  cpSync(typesSrc, p(OUT_DIR, 'types.d.ts'))
}

/* ------------------------------------------------------------------ *
 * 4. 主流程
 *
 * 注意：不再产出 dist/package.json。发布策略为「从根目录发布」——
 * 根 package.json 的 files:["dist"] + exports 指向 ./dist/* 即为唯一真身，
 * dist 内不再有嵌套 package.json（避免 npm 打包出双层 pkg 造成混乱）。
 * ------------------------------------------------------------------ */
async function main() {
  console.log(C.bold(`\n  ${iconConfig.prefix}Icons · 构建组件库（纯 ESM · Vue 3 · 带类型）\n`))

  step('生成 Vue 组件（npm run gen）', () => {
    generateComponents()
  })

  step('Vite 打包 ESM（external vue）', async () => {
    await bundleEsm()
  })

  step('生成类型声明（manifest 驱动）', () => {
    emitTypes()
  })

  console.log(C.bold(`\n  ✓ 构建完成 → ${C.green(OUT_DIR + '/')}`))
  console.log(C.dim('  产物：index.js（ESM）、index.d.ts（类型）、metadata.js、metadata.d.ts、types.d.ts\n'))
}

main().catch((err) => {
  console.error(C.red('\n✖ 构建失败：'), err)
  process.exit(1)
})
