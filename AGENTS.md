# AGENTS.md — AI 协作指南

本文件是 AI 助手（Copilot、Claude、Codex 等）在本仓库协作时的入口说明。
**改动图标前，先读 `docs/icon-design.md`（图标设计语言规范），它是绘制规则的唯一权威来源。**

## 项目是什么

`richtext-icons` —— 面向富文本编辑器（WYSIWYG）的 Vue 3 SVG 图标库。

- 技术栈：Vite 8 (Rolldown) + Vue 3 + TypeScript，Node ≥ 22.12（用 managed node 22.22.2 路径执行 npm/node）。
- 规模：151 个图标 / 14 个分类，统一线性描边（24×24、stroke 1.5、圆角端点、`currentColor`）。
- 组件前缀 `Rti`：`icons/align/align-left.svg` → `RtiAlignLeft`。

## 核心架构：源文件即唯一事实来源

```
icons/<分类>/<名称>.svg    ← 唯一事实来源，只改这里
        │  npm run gen
        ▼
src/icons/<Name>.vue        ← 生成物，禁止手改
src/generated/*             ← 生成物（入口/清单），禁止手改
```

- 改图标 → 只改 SVG 源文件 → `npm run gen`。
- `src/icons/`、`src/generated/` 是生成物，手改会被下次 gen 覆盖。
- 生成器把 `<svg>` 的 inner 原样搬进组件，所以源文件里必须是真正的 `<path d="…"/>`（裸路径文本会渲染成空白）。

## 常用命令

| 命令 | 作用 |
| --- | --- |
| `npm run dev` | 生成 + 启动预览站（端口 5273，被占会自动 +1） |
| `npm run gen` | 从 SVG 源文件生成 Vue 组件 |
| `npm run build:lib` | 构建发布包 → `dist/`（含 d.ts） |
| `npm run typecheck` | vue-tsc 类型检查 |

## 关键约束（改图标必读，详见 docs/icon-design.md）

- **颜色一律 `currentColor`**，禁止写死色值。
- **`stroke-width="1.5"` 写在源文件根节点**，生成器透传，不再硬编码。
- 组件**没有 prop**：宽高写死 `1em`（跟随 `font-size`），颜色跟随 `color`。
- **点一律用 `<circle r="1.2" fill="currentColor" stroke="none"/>`**，禁止 `M x y h.01` 零长路径画点。
- 内容区：横向 `x 4..20 / y 6..18`，竖向 `x 6..18 / y 4..20`。
- 命名撞车：分类名与文件名同名会撞组件名（如 `table/table` 与 `insert/table` 都生成 `RtiTable`）。

## 诊断：用户报「图标不像 / 不显示」

第一步不要急着改造型，先 diff 源文件与 `src/icons/*.vue` 的 `d` 属性，
确认没有「改了源没跑 gen」或「手改生成物」的历史遗留。这是最常见的根因。

## 新增图标 checklist

1. `icons/<分类>/<名称>.svg` 建源文件（遵守 `docs/icon-design.md` 全部规则）。
2. `icons-meta.json` 补 `zh` / `en` / `keywords`（中英双语）/ `tags`（用途语义标签）/ `status`。
3. `npm run gen`。
4. 20px 真实尺寸栅格化复核（可读、无贴死/糊点）。
5. `npm run typecheck` 通过。

## 元数据（AI 检索入口）

- `icons-meta.json`：中文名 / 英文名 / 中英双语 keywords / **tags（用途语义标签）** / status，AI 可按语义检索图标。
- `src/types.ts`：`IconMeta`、`IconCategory` 类型定义。
- **纯元数据入口** `richtext-icons/metadata`：零 Vue 依赖、不含 SVG 源码，导出 `icons`（轻量 `IconMetaLite`）、`categories`、`total`，供 AI / 工具链在 Node 中直接按 `tags` 检索。
- `docs/icon-gaps.md`：图标缺口分析（已补/待补清单），规划新图标时先看这里。
