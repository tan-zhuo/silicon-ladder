# 每日排行更新作业手册

每天 07:00 (Asia/Shanghai) 自动执行。**只有 `git push` 成功才算完成** —— 改了数据没推送 = 没做。

## 为什么改价格就能动榜

站内没有「排行文件」。名次由前端 `src/utils/rank.ts` 实时计算，输入只有三类：

| 入口 | 影响 | 每日优先级 |
| --- | --- | --- |
| `price_cny` | 直接驱动性价比榜 | **高** —— 行情天天变 |
| 新增条目 | 改变同池归一化基准，可连带掀翻所有名次 | 中 —— 有新品才动 |
| `scores.*` | 性能榜本体 | 低 —— 只在新评测出炉时动 |

`*_rel` 是池内归一化结果，**不准手改**；要改走 `scripts/calibrate.mjs`（见 `README.md`）。

## 五步流程

### 1. 检索

信源优先级：厂商官方 > TechPowerUp / Tom's Hardware / 3DCenter / TrendForce > 国内电商实价页 + 中关村在线 / IT之家 > 聚合行情帖（smzdm、什么值得买、知乎周报）。

每天要抓四类事实：

- **价格**：国内电商在售街价，尽量拿到具体 SKU 报价截图/链接
- **新品**：消费级 CPU / GPU / 内存 / 固态 / 机械 / 电源的发布与上市
- **评测**：主流媒体出了新基准（才动 `scores`）
- **口径变化**：涨价函、合约价、厂商停产/EOL

聚合帖只能当线索，落盘前回溯到一手报价。

### 2. 落数据

改 `public/data/` 下的 `cpus.json` `gpus.json` `rams.json` `storages.json` `psus.json`。

**价格口径必须同池一致** —— 同一类硬件里混用「散片价」和「盒装价」会直接扭曲性价比排序。当前口径：

- CPU：国内散片街价
- 内存 / 固态 / 机械：电商在售街价

换口径要整池一起换，并在当日日志里写明。

validate 的雷：

- `price_cny` 不能为 `0`，缺失写 `null`
- `scores.*` 不能为 `0`，缺失写 `null`
- `summary` ≤ 60 字符
- `id` 小写 kebab-case、全局唯一（跨文件也查重）
- `release` 必须 `YYYY-MM` 或 `YYYY-MM-DD`
- `form` / `brand` / `tier` / `modular` 走枚举，越界直接报错

最后把 `meta.json` 的 `updated` 改成当天、`version` +1。`fx` 没有可靠汇率源时不要动。

### 3. 校验

```
node scripts/validate-data.mjs
npm test
npm run build
```

推 main 会触发 CI 跑同样三步 + 检查 prerender 产物，所以本地先跑全套，别把红灯推上去。

顺手 `git diff --stat` 确认只改了该改的行 —— JSON 被整文件重排说明缩进写错了（仓库用 2 空格 + 末尾换行）。

### 4. 提交并推送

```
git -C <repo> add hardware-rank/public/data
git -C <repo> commit -m "data: 每日行情更新 YYYY-MM-DD"
git -C <repo> push origin main
git -C <repo> status -sb
```

- 最后那条 `status -sb` 是硬性收尾：必须看到干净的 `## main...origin/main`，**不准 ahead 挂着就跑路**
- push 失败**不许** `--force`，老实报错
- 无变动不产生空提交

注意：审批系统不给命令链和 `cd` 绑定授权，命令要一条一条跑，用 `git -C <path>` 代替 `cd`。

### 5. 汇报

当天写一份日志到 `data-src/logs/YYYY-MM-DD.md`：改了哪些条目、每条的新旧值、信源、口径说明、以及**哪些想改但因缺可靠信源没改**。

## 硬性约束

- 没可靠信源就不写，宁可留 `null`
- 无变动不产生空提交
- 一次只动数据文件（+ 当日日志），别顺手重构代码
- 估算值必须在日志里标明是估算、锚定了哪条报价
