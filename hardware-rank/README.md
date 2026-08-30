# Hardware Rank — 消费级硬件排行榜

纯前端静态站点：CPU / GPU / 内存 / 存储 / 电源排行与对比。桌面、笔记本、核显强制分池；综合分可切换为单核 / 多核 / 游戏 / 能效 / 性价比等原始维度；电源按品质 Tier 分档而非跑分。

技术栈：Vite 5 · Vue 3 `<script setup>` · TypeScript · vue-router 4 (history) · Pinia · Tailwind CSS 3。无后端、无账号、无爬虫。

## 启动

包管理器使用 **npm**。

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # 输出 dist/
npm run preview
```

## 页面

| 路径 | 说明 |
|---|---|
| `/` | 首页：6 张入口卡、全站搜索、最近更新 |
| `/rank/cpu` `/rank/gpu` `/rank/ram` `/rank/storage` `/rank/psu` | 排行榜。query：`form` `sort` `dir` `brand` `gen` `q` `tdpMin` `tdpMax` `tgpTier` `interface` `wattMin` `wattMax` `tier` `atx31` |
| `/product/:category/:id` | 产品详情 |
| `/compare?ids=cpu:amd-ryzen-7-9800x3d,cpu:amd-ryzen-9-9950x` | 对比（同品类 2–4 项） |
| `/guide` | 场景选购指南 |
| `/methodology` | 方法论与数据来源 |

## 数据

全部数据在 `public/data/`：`meta.json` `cpus.json` `gpus.json` `rams.json` `storages.json` `psus.json`。字段定义见 `src/types/hardware.ts`。

- **改分数 / 加产品**：直接编辑 JSON，刷新页面即可。
- 缺失的分数写 `null`，页面显示 `—`，不会参与归一。
- 当前分数为**示意值**（公开评测汇总、±10% 误差），正式发布前请用自己的校准表替换，并更新 `meta.json` 的 `updated`。

排序逻辑在 `src/utils/rank.ts`（分池归一 → 加权 → 排序，缺分沉底）；表格列配置在 `src/utils/columns.ts`。

## 部署

`npm run build` 后把 `dist/` 放到任意静态托管。使用 History 路由，需要把所有路径 fallback 到 `index.html`：

- Cloudflare Pages / Netlify：已附 `public/_redirects`。
- GitHub Pages：在 `vite.config.ts` 设置 `base: '/<repo>/'`，并把 `dist/index.html` 复制一份为 `404.html`；或改用 `createWebHashHistory`。
