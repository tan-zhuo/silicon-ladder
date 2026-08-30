<script setup lang="ts">
import { useCatalog } from '@/data/load'
const catalog = useCatalog()
</script>

<template>
  <article class="max-w-3xl space-y-8">
    <div>
      <h1 class="text-2xl font-semibold">方法论与数据来源</h1>
      <p class="text-sm text-muted mt-1">数据版本 v{{ catalog.meta.version }} · 更新于 {{ catalog.meta.updated }}</p>
    </div>

    <section class="card p-5 space-y-2">
      <h2 class="font-semibold">数据从哪来、怎么更新</h2>
      <p class="text-sm text-fg/90">本站是纯静态站点。所有产品与分数保存在 <code class="text-accent">public/data/*.json</code>，随版本发布一起更新，不做运行时爬虫、不接价格 API。</p>
      <p class="text-sm text-muted">{{ catalog.meta.note }}</p>
      <p class="text-sm text-fg/90">JSON 里没有的分数一律显示 <code>—</code>，不估算、不用 0 填充。</p>
    </section>

    <section class="card p-5 space-y-2">
      <h2 class="font-semibold">分池：桌面 / 笔记本 / 核显永远分开</h2>
      <p class="text-sm text-fg/90">每个产品都有 <code>form</code> 字段。排行、相对分、同类推荐都只在「同品类 + 同形态」的池内计算。同名的 RTX 5070 Laptop 因 TGP 不同会是两条独立记录。</p>
    </section>

    <section class="card p-5 space-y-2">
      <h2 class="font-semibold">相对分怎么算</h2>
      <p class="text-sm text-fg/90">每个数值分数在池内用最高者归一：</p>
      <pre class="bg-bg border border-line rounded-lg p-3 text-sm overflow-x-auto">rel(x) = round(x / max(pool) × 1000) / 10</pre>
      <p class="text-sm text-muted">保留 1 位小数，池内最高为 100。缺失值不参与 max，也不展示相对分。延迟这类「越低越好」的指标用 <code>min / x × 100</code>。</p>
    </section>

    <section class="card p-5 space-y-3">
      <h2 class="font-semibold">综合分权重</h2>
      <p class="text-sm text-muted">综合分只是默认排序之一，随时可以切换到单项维度。计算时先把各分项在同池归一到 0–100，再加权，最后再归一一次。</p>
      <div class="text-sm space-y-2">
        <div><span class="text-accent font-medium">桌面 CPU</span>：游戏 40% + 单核 25% + 多核 25% + 能效 10%。能效 = 游戏分 / TDP。</div>
        <div><span class="text-accent font-medium">笔记本 CPU</span>：单核 25% + 多核 30% + 能效 30% + 核显 15%。能效 = 多核分 / 典型功耗。无核显分则把 15% 均摊到单核与多核。</div>
        <div><span class="text-accent font-medium">GPU</span>：光栅 55% + 光追 25% + 能效 20%。能效 = 光栅分 / TGP（笔记本）或 TBP（桌面）。</div>
        <div><span class="text-accent font-medium">内存</span>：带宽 50% + 延迟（反向）50%。板载 LPDDR 只提供规格表，不计综合分。</div>
        <div><span class="text-accent font-medium">存储（NVMe）</span>：4K 随机读 40% + 缓外写入 30% + 顺序读 20% + 耐久 (TBW/GB) 10%。顺序读写不是唯一榜。</div>
        <div><span class="text-accent font-medium">性价比</span>：综合分 / 参考价。池内无价格时隐藏该排序。</div>
      </div>
    </section>

    <section class="card p-5 space-y-2">
      <h2 class="font-semibold">电源为什么没有分数</h2>
      <p class="text-sm text-fg/90">电源榜是品质与规格分档，不是性能跑分。默认按 Tier A→D，同档按瓦数降序，同瓦数按名称。Tier 综合考虑纹波、保护、用料与代工厂口碑，仅作展示。80Plus 认证只说明转换效率，不等于用料一流。</p>
    </section>

    <section class="card p-5 space-y-2">
      <h2 class="font-semibold">免责声明</h2>
      <p class="text-sm text-muted">数据为静态快照，分数用于相对排序，不构成购买建议。笔记本与桌面分数按形态分池，不可直接比较；同名 GPU 会因 TGP 不同出现 20–40% 差距。</p>
    </section>
  </article>
</template>
