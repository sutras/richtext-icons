# richtext-icons 项目约定

## 项目定位
富文本编辑器 SVG 图标库。Vite 8（Rolldown）+ Vue 3，Node ≥22.12，用 managed node 22.22.2 路径执行 npm/node。
当前规模：**151 个图标 / 14 个分类**，统一线性描边（24×24、圆角端点、currentColor）。
实心变体（caret/pin-filled/close-filled 等）：实心部分用 `fill="currentColor"` 路径 + `stroke="none"`，源文件里描边元素写在填充元素之前。

## 组件 API 约定（2026-09 定稿）
- **图标组件没有任何 prop**：宽高恒定 `1em`（尺寸跟随使用处 font-size）、描边恒定 `1.5`（屏幕像素，vector-effect="non-scaling-stroke" 保证跨尺寸一致），均由生成器写死进组件。
- 组件是**纯 template 文件**（无 `<script>` 块）；`IconProps` 接口已删除，`IconComponent = DefineComponent<SVGAttributes>`。
- 用户通过 CSS 控制图标：`style="font-size: 20px; color: #2f6feb"`；class/style/事件透传到 `<svg>` 根节点（默认 inheritAttrs 行为）。
- 无障碍语义（role/aria-hidden/title）已被移除——Tiny 明确决策，勿在 review 时「修复」加回来。

## 核心约定
- **SVG 源文件是唯一事实来源**：改图标只改 `icons/<分类>/<名称>.svg`，然后 `npm run gen`；`src/icons/`、`src/generated/` 均为生成物，禁止手改。
- **源文件与生成物可能脱节**：生成器把 `<svg>` 的 inner 原样搬进组件，所以源文件里必须是真正的 `<path d="…"/>`（裸路径文本会渲染成空白）。用户报「图标不像 / 不显示」时，第一步先 diff 源文件与 `src/icons/*.vue` 的 `d`，确认没有「改了源没跑 gen」或「手改生成物」的历史遗留。
- 图标规格：viewBox 24×24；描边风格 `fill="none" stroke="currentColor"` 圆角端点（源文件 stroke-width="2" 只是网格占位，组件里恒为 1.5）；颜色禁止写死，统一 currentColor（预览站颜色调节依赖）。
- 中文名写在 `icons-meta.json`（值可直接用字符串简写；key 为 `分类/名称` 不带扩展名）；分类清单和组件前缀在 `icon.config.mjs`。
- 组件名 = 前缀 `Rti` + PascalCase（如 `icons/align/align-left.svg` → `RtiAlignLeft`）。
- 库入口 `src/generated/index.ts` 导出所有组件 + `iconList`/`ICON_NAMES`/`ICON_COUNT`。

## 常用命令
- `npm run dev`（生成 + 预览站，端口 5273）
- `npm run gen`（唯一生成命令，已无 svgo/gen:opt）
- `npm run build:lib`（发布用，纯 ESM 组件库 → dist/，只含 index.js + index.d.ts + types.d.ts）
- `npm run typecheck`（vue-tsc）

## 发布定位（重要）
- **只面向「通过 Vue 组件使用」的用户**，不导出原始 SVG / 雪碧图 / manifest.json。
- 发布包 = `dist/index.js`（ESM）+ `index.d.ts` + `types.d.ts`（+ dist/package.json）；exports 只有 `.` 和 `./types`。
- 雪碧图、原始 SVG 导出、`symbolId` 字段已彻底移除（2026-09-18 瘦身）。

## 预览站调试备注
页面是**单页滚动式文档站**（Hero → 文档 → 图标画廊），body 正常滚动，不再是旧版单屏 `.scroll` 容器。
- 顶栏 sticky；搜索输入关键词会自动 `scrollIntoView('#icons')`；`.gallery { scroll-margin-top: calc(var(--header-h) - 1px) }`。
- 需并排大量图标做复核时：`agent-browser eval` 摘出每个 `svg.outerHTML` + `getComputedStyle(svg).color`，重建一张本地复验页再截图（一次拿到全部尺寸 × 主题）。

## 设计语言（跨图标族约定）
- **内容区**：横向图标占 x 4..20 / y 6..18；竖向图标占 x 6..18 / y 4..20（即横向族的 90° 版本）。
- **家族化造型**：list 三图标 + line-height =「左标记 + 右三横」；align 六图标 =「三条平行线」或「参考线 + 线条元素」。
- **表格族**（table 分类 20 个）：
  - 通用表框 = 24 网格内 `box(3,3,18,18,r2)` + 2×2 网格线（x=12、y=12）；**2×2 密度是 20px 下的最优解**，3×3 太密。
  - 行/列操作 = 表框 18×12（2 行）/ 12×18（2 列）+ 保留槽内 5×5 徽标；徽标字形 `+` 插入 / `−` 删除 / `↑↓←→` 移动，**位置与字形共同指示方向**。
  - 实心表达「标头/选中」一律用 `fill="currentColor"` 的路径（随主题自动反色），不要靠加粗描边。
  - 颜色类沿用 color 分类的**底部色条**语言（`M4 19.5h16`）。
- **叠层图标**（`media/gallery` = RtiImage 基图 + 右上角横折，表达「多个/图库」）：
  - 主图形要从 3..21 网格里**主动让出 3 单位**给附属元素，尺寸上限随之降到 **15×15**（缺口 2 时净空只剩 0.17px，两线视觉贴死）。
  - 附属元素的圆角半径取**与主框 rx 相同**（2.5），直段长度 4–4.5 单位（≤3 读成小钩、≥5 喧宾夺主）。
  - 主图形缩小后，内部小元素**不按比例缩**：小圆环内孔 = 2r − 1.8，太阳保持 r=1.8（等比缩到 1.55 会在 20px 糊成实心点）。
- **尺寸红线**：实心点半径 ≥1.2 单位；20px 下能放字形的容器需 ≥14 单位高；`non-scaling-stroke` 下描边在路径两侧各外扩 0.9 用户单位 → **任何两线之间的可见净空 = 路径缺口 − 1.8**，缺口 ≥3.8 单位才留得下 2px 可见缝，≥3 单位才有 1px（叠层/徽标/缺口的通用判据）。
- **禁止用零长路径画点**：`M x y h.01` + 圆头端点的直径恒等于 stroke-width（1.5px），因为描边注入了 `non-scaling-stroke`，**尺寸放大时点不会变大**。所有"点"（列表符号、抓手点、`!`/`i`/`?` 的句点、emoji 眼睛）一律用 `<circle r="1.2" fill="currentColor" stroke="none"/>`——`r=1.2` 是 `list/bullet-list` 定下的全库基准值，不要另造数值。
  排查命令：`grep -n 'h\.01' icons/`（应为空）。源文件里描边元素写在填充元素之前。
- **命名**：分类名与文件名同名会撞组件名（`insert/table` vs `table/table` 都生成 `RtiTable`），新增图标时注意。
- **ui/captcha（验证码）**：无通用第三方字形，自定造型 = `rect(3,6,18,12,r2)` + 两行**参差**波浪（段宽 3、振幅控制点 1.2，行高 9.3 / 14.7，上行跨 6..18、下行跨 6..15）。波浪幅度不能再平（amp 0.9 会读成普通文本行）；两行必须不等长，才读得出"两行验证码字符"。**该族已被占用的表达**：圆+勾（success）、方框+勾（task-list）、A+勾（spell-check）、三条带圆点滑杆（settings-adjust）——验证码类新图标都要避开。
- **图钉族（ui/pin · ui/pin-filled）**：造型沿用 IBM Carbon 的 pushpin，斜置（钉头在右上、针尖在左下）。32 网格 bbox(2..30) 映射到本库 3.2..20.8（scale 0.6286 / offset +1.943），坐标烘焙进 24 网格、不用 transform 包裹。`pin` = 同一剪影 + 钉身镂空窗（`fill-rule="evenodd"`），`pin-filled` = 去掉窗的纯实心；两者共享剪影，只差一个孔，天然构成「未固定 / 已固定」的 toggle 状态对。镂空环厚约 0.94px（20px），比库里 1.5px 描边略轻，属造型自带、已知取舍。
