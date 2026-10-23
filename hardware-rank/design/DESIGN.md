# CPU.News 设计系统（Precision v2）

> 目标：把站点从「通用 Tailwind SaaS 模板」升级为**精密仪器**式的数据产品外观——参考 Vercel Geist 的灰阶角色、Linear 的字距与暗色处理、Radix 1–12 阶色板的语义分层、Refactoring UI 的层级/阴影原则。
> 唯一真相是 `design/tokens.json`；Web 端由 `scripts/gen-tokens.mjs` 生成 `src/tokens.css`，App 端（React Native / SwiftUI / Compose）读取同一 JSON 生成平台常量。

## 1. 原则
1. **少边框、多层级**：页面 `bg` → 卡片 `surface` → 次级 `surface-2` → 悬停 `surface-3`，用明度差表达层级，边框只用 1px 发丝线（`line`），交互态升到 `line-2 / line-3`。
2. **主色克制**：`accent`（蓝）只用于「数据与状态」——当前排序列、分数条、激活图标、焦点环。主按钮改为反色（亮色黑 / 暗色白，`inverse`），避免满屏蓝。
3. **数字用等宽**：所有分数、瓦数、日期、计数用 `JetBrains Mono`（`.num` / `.stat`），列对齐、扫读更快；正文用 `Inter`（启用 `cv11 ss01 ss03 tnum`）。
4. **紧凑圆角阶梯**：控件 6 / 卡片 10 / 面板 14 / 全屏 18（`--r-sm/md/lg/xl`），不再使用 16–24 的大圆角。
5. **暗色不是反色**：暗色几乎不用投影，用 `--shadow-ring-hi`（1px 内高光）和表面明度差表达抬升；底色 `#09090B`，文本 `#EDEDF0`（非纯白）。
6. **动效 120 / 180 / 280ms**，统一 `cubic-bezier(.2,.7,.2,1)`；尊重 `prefers-reduced-motion`。

## 2. 令牌速查（见 tokens.json）
| 角色 | 亮色 | 暗色 | 用途 |
|---|---|---|---|
| bg | 250 250 251 | 9 9 11 | 页面底 |
| surface / -2 / -3 | 255 / 247 / 240 | 17 / 24 / 32 | 卡片 / 次级 / 悬停 |
| line / -2 / -3 | 232 / 214 / 180 | 38 / 54 / 82 | 分隔 / 交互边框 / 焦点边 |
| fg / muted / faint | 17 / 98 / 140 | 237 / 150 / 108 | 主文 / 次文 / 弱文 |
| accent / accent-2 | 37 99 235 / 59 130 246 | 96 142 255 / 130 168 255 | 数据与状态 |
| inverse / inverse-fg | 黑 / 白 | 白 / 黑 | 主按钮、步骤序号 |

文字角色（`.t-display .t-h1 .t-h2 .t-h3 .t-overline .num .stat`）与字号/字距定义在 `type`；间距 4pt 基线；布局 `sidebar 240 / content 1800 / touch 44`。

## 3. 组件类（src/style.css）
- 表面：`.card`（surface + 发丝线 + sm 投影）、`.panel`（浮层：menu / dialog，md 投影）、`.hero`（点阵网格 + 右上角主色晕）
- 控件：`.btn`（反色主按钮）、`.btn-accent`、`.btn-ghost`、`.pill / .pill-active`（激活 = 反色）、`.seg / .seg-btn / .seg-active`、`.input`、`.badge / .badge-mono`
- 导航：`.nav-item / .nav-item-active`（激活 = surface + 发丝线 + 图标主色）
- 数据：`.data-table`（表头 overline、行 hover surface-2）、`.rank-no / .rank-no-1/2/3`（金银铜）、`ScoreBar` 4px 条 + 等宽数值
- 安全区：`.safe-t / .safe-b`（刘海 / Home 条，PWA 与未来 WebView 壳使用）

## 4. App 铺垫（已做 / 待做）
已做：
- `design/tokens.json` 单一来源，颜色为 RGB 三元组、字号为 px、动效为 ms，直接可映射到 RN `StyleSheet` / SwiftUI `Color(red:green:blue:)` / Compose `Color(0xFF…)`。
- 主题默认跟随系统（`prefers-color-scheme`），首屏内联脚本防闪白；`meta theme-color` 按模式分别声明；`viewport-fit=cover` + 安全区类。
- manifest：`standalone`、`id`、`start_url`、分类、描述；移动端触控目标 ≥ 44px（导航项、按钮高度）。
- 所有组件只依赖语义令牌（不写死色值），换肤 = 改 JSON。

待做（App 立项时）：
- `scripts/gen-tokens.mjs` 增加 `--target rn|swift|kotlin` 输出。
- 把 `src/utils/rank.ts`、`src/utils/filters.ts`、`src/types/hardware.ts` 抽到 `packages/core`（纯 TS、无 DOM 依赖），Web 与 RN 共用评分/筛选逻辑。
- `public/data/*.json` 已是静态 API；App 直接拉 `https://cpu.news/data/*.json`（已配 `s-maxage=86400`）。
- Service Worker 离线缓存数据文件（可选）。

## 5. 参考
- Vercel Geist：灰阶 100–1000 角色（背景 / 悬停 / 边框 / 文本）、Materials 圆角 6/12/16
- Linear：负字距标题、暗色近黑底 + 非纯白文本、极少投影
- Radix Colors：1–12 阶语义（1–2 背景、3–5 组件态、6–8 边框、9–10 实色、11–12 文本）
- Refactoring UI：少用边框、用层级与留白分组；两层投影；数字表格对齐
