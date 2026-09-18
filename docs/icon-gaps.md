# 图标缺口分析

> 审计时间：2026-09-17 ｜ 现状：13 个分类 / **106 个图标**（全 stable）

## 0. 对标口径

| 来源 | 用途 |
| --- | --- |
| CKEditor 4/5 工具栏项 | 通用项 + 表格/方向/锚点/修订 |
| TinyMCE 核心按钮 + 常用插件（wordcount / accordion / visualaid / recordrtc / print） | 编辑器插件生态的标准命名 |
| wangEditor v5 默认 `toolbarKeys` | 国内编辑器的最小可用集 |
| Word / Google Docs / 飞书文档 | 文档类能力（格式刷、字数、目录、分页、脚注、文本方向） |
| 2026 年现状 | AI 助手、云文档保存状态、协作提及已是标配 |

---

## 1. 结论速览

**建议补 59 个**，分三档。其中最要紧的不是编辑器功能项，而是 **通用界面基础件（UI primitives）**——现在整个库只有 `copy / search / upload / info / spell-check` 五个能当界面件用，而任何真实工具栏的下拉箭头、溢出菜单「···」、关闭「✕」、加号、设置、下载、分享都缺，属于"做不出界面"的级别。

| 档位 | 数量 | 说明 |
| --- | --- | --- |
| **P0** | 15 | 不补就有功能说不清 / 工具栏做不出来 |
| **P1** | 18 | 主流编辑器默认就有的常用项 |
| **P2** | 26 | 场景化，按需要再画 |

补完后：**165 个图标 / 14 个分类**（新增 `ui/` 分类，见第 5 节）。

> **进度（2026-09-17 晚）：P0 15 个已全部落地**，库从 106 → **121 个 / 14 个分类**（`ui/` 分类已建成，9 个）。
> 剩余 P1 18 个 + P2 26 个。第 2 节保留原始判断依据，供后续批次参考。

---

## 2. P0 · 必须补（15 个）

| 建议 ID | 中文 | 对标 | 复用提示 |
| --- | --- | --- | --- |
| `ui/plus` | 加号 | 所有 | 表 insert 族里的 `+` 造型可抽出复用 |
| `ui/minus` | 减号 | 所有 | 表 delete 族里的 `−` 造型可抽出复用 |
| `ui/close` | 关闭 ✕ | 对话框 / 标签页 / 气泡 | — |
| `ui/check` | 对勾 | 菜单选中态 / 已保存 | `task-list`、`select-all` 里已有勾 |
| `ui/more-horizontal` | 更多 ··· | 工具栏溢出菜单 | 实心点 `r=1.2` 参数直接复用 |
| `ui/chevron-down` | 下拉指示 | 所有 dropdown | move 族定稿的 90° chevron 参数复用 |
| `ui/settings` | 设置 | 编辑器偏好 | — |
| `ui/download` | 下载 | 导出 / 附件 | — |
| `ui/share` | 分享 | 云文档协作 | — |
| `format/format-painter` | 格式刷 | CKEditor `CopyFormatting`、Word、飞书 | 刷子造型 |
| `format/text-direction-ltr` | 从左到右 | CKEditor `BidiLtr`、TinyMCE `ltr`、Word | 段落方向 |
| `format/text-direction-rtl` | 从右到左 | 同上 `BidiRtl` / `rtl` | 与上者镜像 |
| `inline/mention` | @ 提及 | 所有协作编辑器 | 协作能力目前的唯一入口是 `inline/comment` |
| `insert/ai` | AI 助手 | TinyMCE AI、飞书、Notion | 2026 年已是默认项 |
| `status/saved` | 已保存 | 云文档状态栏 | 与 `status/sync` 组成三态 |

> 「保存中」不单独画：直接复用 `status/loading` 的转圈，与 `status/saved` 组成两态即可。若一定要三态（idle / saving / saved），再加 `status/saving`。

---

## 3. P1 · 常用（18 个）

| 建议 ID | 中文 | 对标 |
| --- | --- | --- |
| `view/print` | 打印 | TinyMCE `print` |
| `view/word-count` | 字数统计 | TinyMCE wordcount、飞书 |
| `edit/replace` | 替换 | CKEditor `Replace`（现只有 `find`） |
| `insert/anchor` | 锚点 | CKEditor `Anchor`、TinyMCE |
| `insert/toc` | 目录 | Word / Google Docs / 飞书 |
| `block/heading-4` | 四级标题 | TinyMCE `h4`（现只有 H1–H3） |
| `block/accordion` | 折叠块 | TinyMCE Accordion、Notion toggle |
| `inline/inline-math` | 行内公式 | 现 `insert/formula` 只表达块级 |
| `inline/footnote` | 脚注 | Word / Docs / Tiptap |
| `media/record-screen` | 录屏录制 | TinyMCE RecordRTC、Moodle |
| `media/image-props` | 图片属性 / 替换 | CKEditor image2 |
| `list/list-restart` | 重新开始编号 | Tiptap orderedList 必配 |
| `table/table-properties` | 表格属性 | CKEditor `Table` 对话框 |
| `table/cell-vertical-align` | 单元格垂直对齐 | Word / Docs（现只有页面的 align-top/bottom） |
| `status/offline` | 离线 / 断网 | 云文档状态栏 |
| `ui/eye` | 显示 / 隐藏、只读预览 | 密码框、图层面板 |
| `ui/external-link` | 新窗口打开 | 链接气泡 |
| `ui/chevron-right` | 右向箭头 | 面包屑 / 折叠树 |

---

## 4. P2 · 场景化，按需（26 个）

**导航与列表件**：`ui/arrow-left`、`ui/arrow-right`、`ui/filter`（筛选）、`ui/sort`（排序）、`ui/star`（收藏）、`ui/pin`（固定）、`ui/refresh`（可从 `status/sync` 拆）

**插入类**：`insert/qrcode`、`insert/chart`、`insert/signature`（签名手写）、`insert/map`（位置，wangEditor v2 有）

**视图类**：`view/ruler`（标尺）、`view/show-invisibles`（¶ 编辑标记，TinyMCE `visualaid`）、`view/dark-mode`、`view/pagination`（分页视图）、`view/panel`（侧边栏面板开合）、`view/reading-mode`

**排版类**：`align/align-none`（清除对齐，TinyMCE `alignnone`）、`block/columns`（分栏）、`inline/tag`（# 标签）、`inline/kbd`（键盘按键）、`list/definition-list`（定义列表 dl）、`edit/duplicate`（创建副本）、`edit/rename`、`table/distribute-columns`（平均分布列）、`color/no-color`（无颜色 / 透明）

---

## 5. 分类结构建议

### 新增 `ui/`（界面基础件）— 推荐

把 P0 的 9 个通用件 + P1/P2 的 eye / external-link / filter / sort / star / pin / arrow-* / refresh / chevron-right 归到一个新分类。理由：

- 这些图标与"富文本语义"无关，混进 `edit/` `view/` 会让分类语义失真（现在的 `edit/lock`、`view/zoom-in` 已有这个苗头）
- 复用率高：一个图标服务工具栏、下拉、对话框、气泡多处

规模 **19 个**，是补齐后最大的单一分类。

### `collab/`（协作）— 暂不建议单独建

协作能力目前只有 `inline/comment` + `edit/lock` 两个图标。要撑起一个分类至少需要 share / mention / users / user-online / comment-resolve / permission / draft / track-changes 八个。**建议先只补 `ui/share` 与 `inline/mention` 两个**，等真正做协作编辑器时再整体建类。

### 其余不新建分类

`format-painter` 进 `format`、`anchor`/`toc`/`ai` 进 `insert`、`accordion`/`heading-4` 进 `block`、表格三项进 `table`，都与现有分类语义一致。

---

## 6. 审计中发现的存量问题

| # | 问题 | 位置 | 处理 |
| --- | --- | --- | --- |
| 1 | 残留死数据：`insert/table` 条目，图标早已迁到 `table/table` | `icons-meta.json` | **已修** |
| 2 | 图标数写 92，实际 106 | `README.md` | **已修** |
| 3 | 三个分类数量过期：`align` 写 7 / 实际 10，`insert` 写 7 / 实际 6，`table` 写 8 / 实际 20 | `README.md` 分类规划表 | **已修** |
| 4 | "stroke 2px" 表述易误读：源文件 `stroke-width="2"` 只是占位，组件实际默认 **1.5 屏幕像素** | `README.md` | **已修（补说明）** |
| 5 | 29 个图标没有 `keywords`，预览站只能靠中英文名搜到 | `icons-meta.json` | 待补（见下） |

**缺关键词的 29 个**：`format/superscript` `format/subscript` `color/gradient` `align/align-left|center|right` `insert/table`（死数据）`table/table|table-insert|table-delete|row-insert-above|row-insert|row-delete|row-move-up|row-move-down|column-insert-left|column-insert|column-delete|column-move-left|column-move-right` `edit/copy` `history/undo|redo|restore` `view/fullscreen|fullscreen-exit|zoom-in|zoom-out` `status/info`

表格族 13 个全无关键词，而它们恰恰是「小尺寸下最需要靠搜索区分」的一族（"上面插入行" / "左边插入列"）。

**几何重复检查结果：无重复。** 逐个比对全部 106 个文件的路径 / circle / rect 集合，`table` vs `cell-header`（后者多了左上实心格）、`table-insert` vs `table-delete`（+ / − 徽标）都是有区别的，此前担心的"两个图标画得一模一样"不存在。

---

## 7. 建议落地顺序

1. **先补 `ui/` 那一批 8 个 P0 通用件** —— 收益最高、造型最简单（加号/减号/对勾/叉/箭头可直接从现有图标里抽路径），能立刻让库"可用于搭界面"。
2. **再补编辑器功能四件**：格式刷、文本方向 LTR/RTL、@提及、AI —— 这四个是"语义缺失"，不是锦上添花。
3. **顺手补 29 个 keywords** —— 零风险，直接提升预览站检索体验。
4. P1 按实际编辑器需求滚动补；P2 等有真实场景再画。

每个图标都走既有流程：放 SVG → 补 `icons-meta.json` → `npm run gen` → 小尺寸候选页复核（`svg-icon-candidate-lab`）。
