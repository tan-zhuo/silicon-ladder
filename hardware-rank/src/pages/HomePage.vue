<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCatalog } from '@/data/load'
import { matchQuery } from '@/utils/filters'
import { CATEGORY_LABEL, FORM_LABEL } from '@/utils/format'
import type { Category, AnyItem } from '@/types/hardware'

const catalog = useCatalog()
const router = useRouter()
const q = ref('')

const cards: { to: string; title: string; desc: string; icon: string }[] = [
  { to: '/rank/cpu', title: 'CPU', desc: '单核、多核、游戏分池看', icon: 'M9 3v2M15 3v2M9 19v2M15 19v2M3 9h2M3 15h2M19 9h2M19 15h2M7 7h10v10H7z' },
  { to: '/rank/gpu', title: 'GPU', desc: '桌面卡与笔记本 TGP 分开排', icon: 'M3 7h18v10H3zM7 17v3M17 17v3M9 12a3 3 0 106 0 3 3 0 00-6 0' },
  { to: '/rank/ram', title: '内存', desc: '看延迟和带宽，不只看频率', icon: 'M3 9h18v6H3zM7 9V6M11 9V6M15 9V6M7 15v3M11 15v3M15 15v3' },
  { to: '/rank/storage', title: '存储', desc: '4K 与缓外比顺序读写更重要', icon: 'M4 6h16v5H4zM4 13h16v5H4zM7 8.5h.01M7 15.5h.01' },
  { to: '/rank/psu', title: '电源', desc: '品质分档，不是瓦数越大越好', icon: 'M13 2L4 14h7l-1 8 9-12h-7z' },
  { to: '/compare', title: '对比', desc: '同品类最多 4 项并排', icon: 'M4 5h6v14H4zM14 5h6v14h-6z' },
]

const all = computed<{ cat: Category; item: AnyItem }[]>(() => [
  ...catalog.cpus.map((item) => ({ cat: 'cpu' as Category, item })),
  ...catalog.gpus.map((item) => ({ cat: 'gpu' as Category, item })),
  ...catalog.rams.map((item) => ({ cat: 'ram' as Category, item })),
  ...catalog.storages.map((item) => ({ cat: 'storage' as Category, item })),
  ...catalog.psus.map((item) => ({ cat: 'psu' as Category, item })),
])
const hits = computed(() => (q.value.trim() ? all.value.filter((x) => matchQuery(x.item, q.value)).slice(0, 8) : []))

const recent = computed(() =>
  [...all.value].sort((a, b) => b.item.release.localeCompare(a.item.release)).slice(0, 3),
)
</script>

<template>
  <section class="py-6 sm:py-10">
    <h1 class="text-3xl sm:text-4xl font-semibold tracking-tight">Hardware Rank <span class="text-muted font-normal text-xl sm:text-2xl">消费级硬件排行榜</span></h1>
    <p class="mt-3 text-muted max-w-2xl leading-relaxed">
      按桌面、笔记本、移动芯片分池排名。可切换游戏、生产力、能效与性价比。分数来自静态数据集，不是实时爬虫。
    </p>

    <div class="mt-6 relative max-w-xl">
      <input v-model="q" class="input !py-2.5" placeholder="搜索 7800X3D / RTX 5070 / 990 PRO …" />
      <div v-if="hits.length" class="absolute z-20 mt-1 w-full card overflow-hidden shadow-xl">
        <button
          v-for="h in hits" :key="h.cat + h.item.id"
          class="w-full text-left px-4 py-2.5 hover:bg-white/[.04] flex items-center gap-3 text-sm"
          @click="router.push(`/product/${h.cat}/${h.item.id}`); q = ''"
        >
          <span class="text-xs text-muted w-10">{{ CATEGORY_LABEL[h.cat] }}</span>
          <span class="flex-1">{{ h.item.name }}</span>
          <span class="text-xs text-muted">{{ FORM_LABEL[h.item.form] }}</span>
        </button>
      </div>
    </div>
  </section>

  <section class="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
    <router-link v-for="c in cards" :key="c.to" :to="c.to" class="card p-4 sm:p-5 hover:border-accent/60 transition-colors group">
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" class="text-accent mb-3"><path :d="c.icon" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg>
      <div class="font-semibold text-lg group-hover:text-accent transition-colors">{{ c.title }}</div>
      <div class="text-sm text-muted mt-1">{{ c.desc }}</div>
    </router-link>
  </section>

  <section class="mt-10">
    <div class="flex items-baseline justify-between">
      <h2 class="text-lg font-semibold">最近更新</h2>
      <span class="text-xs text-muted">数据快照 {{ catalog.meta.updated }}</span>
    </div>
    <div class="mt-3 grid sm:grid-cols-3 gap-3">
      <router-link v-for="r in recent" :key="r.item.id" :to="`/product/${r.cat}/${r.item.id}`" class="card p-4 hover:border-accent/60 transition-colors">
        <div class="text-xs text-muted">{{ CATEGORY_LABEL[r.cat] }} · {{ FORM_LABEL[r.item.form] }} · {{ r.item.release }}</div>
        <div class="font-medium mt-1">{{ r.item.name }}</div>
        <div class="text-sm text-muted mt-1">{{ r.item.summary }}</div>
      </router-link>
    </div>
  </section>
</template>
