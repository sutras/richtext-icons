# RtiIcons · 富文本编辑器图标库

一套面向富文本编辑器（WYSIWYG）场景的 SVG 图标库，基于 **Vite 8 + Vue 3**，
以 **纯 ESM** 发布（仅支持 Vue 3，内置 TypeScript 类型声明）。

**核心设计：SVG 是唯一事实来源。** 你只负责往 `icons/` 里放画好的 SVG 文件，
生成器负责把它编译成 Vue 组件、类型声明和预览清单 —— 不需要手写任何包装代码。

## 快速开始（库使用者）

```bash
npm install richtext-icons
```

```vue
<script setup lang="ts">
import { RtiBold } from 'richtext-icons'
</script>

<template>
  <RtiBold style="font-size: 20px" />
</template>
```

完整文档（介绍 / 安装 / 使用 / 图标浏览）见预览站，`npm run dev` 后访问
<http://127.0.0.1:5273>。

预览站支持：分类浏览、中英文/关键词搜索（按 `/` 聚焦）、
颜色与深浅色主题切换、点击图标查看详情并一键复制 SVG / 组件用法。

## 命令

| 命令 | 说明 |
| --- | --- |
| `npm run gen` | 扫描 `icons/` → 生成组件、库入口、清单 |
| `npm run dev` | 生成 + 启动预览站 |
| `npm run build:lib` | 构建组件库 → `dist/`（纯 ESM + d.ts + 可发布 package.json） |
| `npm run build:site` | 构建预览站 → `dist-site/` |
| `npm run typecheck` | vue-tsc 类型检查 |

## 目录结构

```
richtext-icons/
├── icons/                 ★ 图标源文件，目录即分类
│   ├── format/bold.svg
│   └── color/background.svg
├── icons-meta.json        可选：中文名 / 关键词 / 状态
├── icon.config.mjs        前缀、分类清单
├── scripts/
│   ├── generate.mjs       生成器入口
│   └── lib/svg.mjs        SVG 解析与规范化
├── src/
│   ├── icons/             生成：Vue 组件（勿手改）
│   ├── generated/         生成：库入口 + 预览清单（勿手改）
│   ├── components/        预览站 UI
│   ├── composables/useIconLibrary.ts
│   ├── styles/base.css    设计令牌（亮/暗主题）
│   └── types.ts           IconMeta 等公共类型
└── dist/                  库构建产物
```

## 添加一个图标

1. 把 SVG 放进对应分类目录，例如 `icons/align/align-left.svg`
2. （可选）在 `icons-meta.json` 里补中文名和搜索关键词：

   ```json
   "align/align-left": {
     "zh": "左对齐",
     "keywords": ["align left", "左对齐", "靠左"]
   }
   ```

3. 运行 `npm run gen`，组件 `RtiAlignLeft` 自动生成并出现在预览站

新增分类：在 `icon.config.mjs` 的 `categories` 数组里加一行，并创建同名目录。

### SVG 文件约定

- 画布统一 `viewBox="0 0 24 24"`
- 颜色一律用 `currentColor`，不要写死色值（预览站的颜色调节依赖它）
- 描边风格：`fill="none" stroke="currentColor" stroke-width="1.5"`
  `stroke-linecap="round" stroke-linejoin="round"`；填充风格直接 `fill="currentColor"`
  （描边宽度统一写在源文件根节点的 `stroke-width="1.5"`，随尺寸等比缩放，生成器直接透传）
- 不要写死 `width`/`height`（会被替换为固定的 `1em`）、不要带 `id`/`class`/内联样式
- 生成器会自动丢弃无用根属性、剔除 `<title>`/`<desc>`/注释，并在
  仅描边时补 `fill="none"`、无 fill/stroke 时按 `currentColor` 填充处理

## 组件用法

```ts
import { RtiBold, RtiAlignLeft, iconList } from 'richtext-icons'
```

```vue
<RtiBold />
<RtiBold style="color: #2f6feb; font-size: 20px" />
<RtiAlignLeft style="font-size: 1.5em" />

<!-- 动态渲染：iconList 以组件名为键 -->
<component :is="iconList['RtiBold']" />
```

图标**没有 prop**：宽高固定 `1em`，尺寸跟随所在元素的 `font-size`；颜色跟随
`color`；描边宽度固定 1.5 用户单位。其余 SVG 属性（`class`、`style`、事件等）
透传到 `<svg>` 根节点。

## 构建产物

```
dist/
├── index.js               纯 ESM 组件库（vue 为 peerDependency）
├── index.d.ts             类型声明（随图标自动更新）
├── metadata.js            纯元数据入口（零 Vue 依赖，供 AI / 工具链检索）
├── metadata.d.ts          轻量元数据类型（IconMetaLite）
├── types.d.ts             公共类型（IconMeta 等）
└── package.json           可独立发布的包描述（纯 ESM）
```

### 纯元数据入口（供 AI / 工具链检索）

不引入 Vue 组件、不含 SVG 源码，可直接在 Node 中按语义检索图标：

```js
import { icons, categories, total } from 'richtext-icons/metadata'

// 按用途标签（tags）检索：找所有「行操作」的表格图标
const rowOps = icons.filter((i) => i.tags.includes('行操作'))
```

每个条目包含 `name` / `path` / `component` / `zh` / `en` / `keywords` / `tags` /
`category` / `status` / `style` / `viewBox`。`tags` 是用途语义标签（如「表格」「行操作」
「主题」「协作」），用于 AI 按场景理解图标用途，区别于 `keywords` 的近义词检索。

## 分类规划

全部 14 个分类已建成，共 **151 个图标**，统一为线性描边风格
（24×24 画布、圆角端点、`currentColor`，描边宽度固定 1.5 用户单位）。

| 分类 | 目录 | 数量 | 代表图标 |
| --- | --- | --- | --- |
| 文本格式 | `format` | 14 | 加粗、斜体、下划线、删除线、上下标、字号增减、清除格式、格式刷、文本方向 |
| 行内标记 | `inline` | 7 | 链接、行内代码、高亮、批注、表情、提及 |
| 颜色与字体 | `color` | 6 | 文字颜色、背景色、字体、取色器、渐变、透明度 |
| 对齐缩进 | `align` | 10 | 左/中/右/两端对齐、垂直方向对齐、增减缩进、行高 |
| 列表 | `list` | 3 | 无序、有序、任务列表 |
| 段落与块 | `block` | 8 | H1–H3、引用、代码块、分割线、段落、提示框 |
| 插入 | `insert` | 7 | 附件、日期、公式、特殊字符、嵌入、分页符、AI 助手 |
| 表格 | `table` | 20 | 插入/删除表格与行列、行/列插入与移动、合并/拆分单元格、表头与单元格配色 |
| 媒体 | `media` | 7 | 图片、视频、音频、拍照、图库、上传、裁剪 |
| 编辑操作 | `edit` | 8 | 复制、剪切、粘贴、删除、全选、拖拽手柄、查找、锁定 |
| 历史记录 | `history` | 5 | 撤销、重做、历史、恢复、版本 |
| 视图 | `view` | 8 | 全屏、源码、大纲、分屏、缩放、预览 |
| 状态反馈 | `status` | 9 | 成功、警告、错误、提示、帮助、加载、拼写检查、同步、已保存 |
| 界面基础件 | `ui` | 9 | 加号、减号、对勾、关闭、更多、下拉箭头、设置、下载、分享 |

缺图标时把 SVG 放进对应目录、在 `icons-meta.json` 补中文名，`npm run gen` 即可。
待补清单见 [`docs/icon-gaps.md`](docs/icon-gaps.md)。
