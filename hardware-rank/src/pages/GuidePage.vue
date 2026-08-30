<script setup lang="ts">
const scenes = [
  {
    title: '纯游戏台式机',
    desc: '优先高缓存 CPU + 光栅强的显卡，电源留 30% 余量。',
    picks: [
      { cat: 'cpu', id: 'amd-ryzen-7-9800x3d', name: 'Ryzen 7 9800X3D', why: '游戏帧率第一，功耗温和' },
      { cat: 'gpu', id: 'nvidia-rtx-5070-ti', name: 'RTX 5070 Ti', why: '2K 高刷甜点，16GB 显存' },
      { cat: 'psu', id: 'super-flower-leadex-vii-gold-850', name: 'Leadex VII Gold 850', why: 'A 档、ATX 3.1、够 5070 Ti' },
    ],
  },
  {
    title: '生产力 / 视频剪辑',
    desc: '多核与显存优先，存储要看缓外写入。',
    picks: [
      { cat: 'cpu', id: 'amd-ryzen-9-9950x', name: 'Ryzen 9 9950X', why: '16 核多线程最强' },
      { cat: 'gpu', id: 'nvidia-rtx-4090', name: 'RTX 4090', why: '24GB 显存，CUDA 生态' },
      { cat: 'storage', id: 'samsung-990-pro-2tb', name: 'Samsung 990 PRO 2TB', why: '缓外写入稳，素材盘可靠' },
    ],
  },
  {
    title: '轻薄本（续航优先）',
    desc: '看能效与核显，不看桌面榜。',
    picks: [
      { cat: 'cpu', id: 'apple-m4-pro-14', name: 'Apple M4 Pro', why: '单核与能效双第一' },
      { cat: 'cpu', id: 'amd-ryzen-ai-9-hx-370', name: 'Ryzen AI 9 HX 370', why: 'x86 阵营核显最强' },
      { cat: 'gpu', id: 'nvidia-rtx-5070-laptop-80w', name: 'RTX 5070 Laptop 80W', why: '低 TGP 也能 1080p 畅玩' },
    ],
  },
  {
    title: '游戏本（性能优先）',
    desc: '一定看 TGP，同名显卡差 20–40%。',
    picks: [
      { cat: 'cpu', id: 'amd-ryzen-9-9955hx', name: 'Ryzen 9 9955HX', why: '桌面级 16 核' },
      { cat: 'gpu', id: 'nvidia-rtx-5080-laptop-150w', name: 'RTX 5080 Laptop 150W', why: '高 TGP 满血版' },
      { cat: 'ram', id: 'crucial-ddr5-5600-sodimm-32', name: 'Crucial DDR5-5600 SO-DIMM 32GB', why: '可升级机型的稳妥选择' },
    ],
  },
]
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-semibold">场景选购指南</h1>
      <p class="text-sm text-muted mt-1">四个常见场景，各给 3 条推荐。推荐来自本站静态数据，不含价格比价。</p>
    </div>
    <div class="grid md:grid-cols-2 gap-4">
      <section v-for="s in scenes" :key="s.title" class="card p-5">
        <h2 class="font-semibold text-lg">{{ s.title }}</h2>
        <p class="text-sm text-muted mt-1">{{ s.desc }}</p>
        <ul class="mt-3 space-y-2">
          <li v-for="p in s.picks" :key="p.id" class="flex items-start gap-3 text-sm">
            <span class="text-[11px] px-1.5 py-0.5 rounded bg-line text-muted uppercase mt-0.5 w-14 text-center shrink-0">{{ p.cat }}</span>
            <div>
              <router-link :to="`/product/${p.cat}/${p.id}`" class="font-medium hover:text-accent">{{ p.name }}</router-link>
              <div class="text-muted">{{ p.why }}</div>
            </div>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>
