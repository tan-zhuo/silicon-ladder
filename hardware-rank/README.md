# Silicon Ladder — 消费级硬件排行榜 / 天梯图

纯前端静态站点：CPU / GPU / 内存 / 存储 / 电源排行、天梯图与对比。收录 2007–2026 年 660+ 条硬件（CPU 263 · GPU 271 · 内存 36 · 存储 49 · 电源 45）。桌面、笔记本、核显强制分池；综合分可切换为单核 / 多核 / 游戏 / 能效 / 性价比；电源按品质 Tier 分档而非跑分。

- 默认**明亮主题**，右上角可切换深色（`localStorage['sl-theme']`）
- 界面支持 **中文 / English / 日本語**（`src/i18n/*.ts`，`localStorage['sl-lang']`，首次按浏览器语言）
- 技术栈：Vite 5 · Vue 3 `<script setup>` · TypeScript · vue-router 4 (history) · Pinia · Tailwind CSS 3。无后端、无账号、无爬虫。

## 启动

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # 输出 dist/
npm run gen:logos  # 从 simple-icons 重新生成品牌 Logo 路径
npm test           # Vitest：分池归一 / 加权 / 排序用例
npm run validate   # 数据校验（build 前自动执行）
npm run calibrate  # 用 data-src/calibration.csv 回写真实评测分数
```

## 价格与购买链接

- `price_cny` 为人民币快照；详情页同时显示 USD / JPY，汇率在 `public/data/meta.json` 的 `fx`（1 CNY 折合值 + `asOf`），改汇率只需改这一处。
- 详情页「购买 / 比价」为京东、京东国际（全球购）、Amazon.com、Amazon.co.jp 的搜索页链接（`src/data/shops.ts`），不接商城 API。复制 `.env.example` 为 `.env` 并填写 `VITE_AMZN_TAG` 可挂亚马逊联盟标签。

## 数据管线

1. `public/data/*.json` 是站点唯一数据源；`scripts/validate-data.mjs` 在每次 build 前校验 id 唯一/格式、枚举、`null` 而非 0 等。
2. 分数校准：把公开评测数据填入 `data-src/calibration.csv`（模板见 `data-src/README.md`），`npm run calibrate` 按池内比例回写并清除 `est` 标记、`meta.version` +1。
3. 构建后 `scripts/gen-og.mjs` 用 `@resvg/resvg-js` + 内置 DejaVu 字体为每个产品生成 1200×630 OG 图（`dist/og/<cat>/<id>.png`），再由 `scripts/prerender.mjs` 生成每个路由 × 三语的静态 HTML、sitemap、robots。
4. 天梯图右下角「导出图片」用 `html-to-image` 在浏览器端生成 2× PNG。

## 页面

| 路径 | 说明 |
|---|---|
| `/` | 首页：Hero、品类、各池榜首、用法、最近更新 |
| `/rank/:category` | 排行（`cpu gpu ram storage psu`）。query：`form sort dir brand gen q tdpMin tdpMax tgpTier interface wattMin wattMax tier atx31 yearMin yearMax view=ladder` |
| `/product/:category/:id` | 详情：规格、分数、平台与兼容性、同类推荐 |
| `/compare?ids=cpu:a,cpu:b` | 对比（同品类 2–4 项） |
| `/guide` `/methodology` | 选购指南 / 方法论 |

## 数据

`public/data/*.json`，字段定义见 `src/types/hardware.ts`。

- 直接编辑 JSON 即可；缺失分数写 `null`（显示 `—`，不参与归一）。
- `est: true` 表示历史硬件估算分（按公开评测比例换算），详情页与列表会显示「估算」标记。
- 追加脚本：`scripts/seed-more.mjs`（2020+ 主流）、`scripts/seed-history.mjs`（2007–2023）、`scripts/seed-more2-cpu.mjs` / `seed-more2-gpu.mjs`（第二批补录），按 id 幂等。
- 平台兼容知识表（插槽 / 芯片组 / 架构 / 供电 / 推荐电源等）在 `src/data/platforms.ts`，按 `socket` / `gen` 派生。
- 技术规格：架构级（核心微架构、制程、芯片设计、L1、指令集、SMT；GPU 单元名/每单元着色器/RT·AI 世代）在 `src/data/arch.ts` 按 `gen` 派生；产品级（晶片布局/面积/晶体管、L2、基础/加速频率、PPT·PL2、内存控制器、PCIe、核显；GPU 的 SM/CU、着色器/TMU/ROP/RT/Tensor、时钟、显存速率与带宽、L2/Infinity Cache、FP32 算力、首发价）以 `tech` 字段存于 JSON，由 `scripts/seed-tech.mjs` 写入，行生成逻辑在 `src/data/techrows.ts`（详情页与对比页共用，对比页按 higher/lower 标 ★）。
- 排序逻辑 `src/utils/rank.ts`，列配置 `src/utils/columns.ts`。

- 产品 `summary_en` / `summary_ja` 由 `scripts/i18n/summaries-*.mjs` 维护，`node scripts/i18n/merge-summaries.mjs` 合并进 JSON；平台兼容文案在 `src/data/platforms.ts` 内以 (zh, en, ja) 三元组维护；标签翻译在 `src/i18n/*.ts` 的 `tags`。
- 统一控件在 `src/components/ui/`（UiButton / UiInput / UiSelect / UiCheckbox），高度 md 36px / sm 32px，不使用浏览器原生样式。

## 部署

`npm run build` 后把 `dist/` 放到任意静态托管。History 路由需 fallback 到 `index.html`：已附 `vercel.json` 与 `public/_redirects`（Netlify / Cloudflare Pages）。GitHub Pages 需设 `base` 或改 Hash 路由。
