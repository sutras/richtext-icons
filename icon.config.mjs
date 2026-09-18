/**
 * 图标库全局配置
 * 生成器（scripts/generate.mjs）与 Vite 配置共享此文件。
 */
export default {
  /** Vue 组件名前缀：bold.svg -> RtiBold */
  prefix: 'Rti',

  /** 源码目录 */
  iconDir: 'icons',
  generatedDir: 'src/generated',
  componentDir: 'src/icons',

  /**
   * 图标宽高固定为 1em（由 generate.mjs 写死进组件）。
   * 描边宽度统一写在源文件根节点的 stroke-width="1.5"（viewBox 用户单位，
   * 随尺寸等比缩放），生成器直接透传，无需 prop 覆盖。
   */

  /**
   * 分类骨架。order 即侧边栏排序；未列出的目录会追加在末尾。
   * 新增分类：在此加一行 + 建同名目录即可。
   */
  categories: [
    { dir: 'format', zh: '文本格式', en: 'Format' },
    { dir: 'inline', zh: '行内标记', en: 'Inline' },
    { dir: 'color', zh: '颜色与字体', en: 'Color & Font' },
    { dir: 'align', zh: '对齐缩进', en: 'Align & Indent' },
    { dir: 'list', zh: '列表', en: 'List' },
    { dir: 'block', zh: '段落与块', en: 'Block' },
    { dir: 'insert', zh: '插入', en: 'Insert' },
    { dir: 'table', zh: '表格', en: 'Table' },
    { dir: 'media', zh: '媒体', en: 'Media' },
    { dir: 'edit', zh: '编辑操作', en: 'Edit' },
    { dir: 'history', zh: '历史记录', en: 'History' },
    { dir: 'view', zh: '视图', en: 'View' },
    { dir: 'status', zh: '状态反馈', en: 'Status' },
    { dir: 'ui', zh: '界面基础件', en: 'UI' }
  ]
}
