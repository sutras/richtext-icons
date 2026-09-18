/**
 * 图标库公共类型
 * 手写文件，不会被 `npm run gen` 覆盖。
 */

/** 图标生命周期状态 */
export type IconStatus = 'stable' | 'draft' | 'seed' | 'deprecated'

/** 图标绘制风格：stroke = 描边线条，fill = 实心填充 */
export type IconStyle = 'stroke' | 'fill'

/** 单个图标的元数据（由生成器产出） */
export interface IconMeta {
  /** 文件名（不含扩展名），如 'bold' */
  name: string
  /** 相对 icons/ 的路径（不含扩展名），如 'format/bold' */
  path: string
  /** 导出的 Vue 组件名，如 'RtiBold' */
  component: string
  /** 短横线命名，用作 CSS class，如 'rti-bold' */
  kebab: string
  /** 所属分类目录，如 'format' */
  category: string
  /** 分类中文名 */
  categoryZh: string
  /** 中文名，在 icons-meta.json 中配置 */
  zh: string
  /** 英文名 */
  en: string
  /** 搜索关键词（中英文） */
  keywords: string[]
  /** 用途语义标签（描述「什么时候用」，供 AI / 工具链按场景检索） */
  tags: string[]
  /** 生命周期状态 */
  status: IconStatus
  /** 绘制风格 */
  style: IconStyle
  /** 原始 viewBox */
  viewBox: string
  /** 可直接复制的 SVG 源码 */
  svg: string
}

/** 分类元数据 */
export interface IconCategory {
  /** 目录名 */
  dir: string
  /** 中文名 */
  zh: string
  /** 英文名 */
  en: string
  /** 排序序号 */
  order: number
  /** 该分类下图标数量 */
  count: number
}
