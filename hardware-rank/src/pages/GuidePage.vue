<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '@/i18n'
import { useCatalog } from '@/data/load'
import { displayName } from '@/i18n'
import type { Category } from '@/types/hardware'
import { useSeo } from '@/seo'
const { t } = useI18n()
const catalog = useCatalog()
const name = (cat: Category, id: string) => { const it = catalog.find(cat, id); return it ? displayName(it) : id }
const scenes = computed(() => [
  { title: t('guide.s1'), desc: t('guide.s1d'), picks: [['cpu', 'amd-ryzen-7-9800x3d', 'a1'], ['gpu', 'nvidia-rtx-5070-ti', 'a2'], ['psu', 'super-flower-leadex-vii-gold-850', 'a3']] },
  { title: t('guide.s2'), desc: t('guide.s2d'), picks: [['cpu', 'amd-ryzen-9-9950x', 'b1'], ['gpu', 'nvidia-rtx-4090', 'b2'], ['storage', 'samsung-990-pro-2tb', 'b3']] },
  { title: t('guide.s3'), desc: t('guide.s3d'), picks: [['cpu', 'apple-m4-pro-14', 'c1'], ['cpu', 'amd-ryzen-ai-9-hx-370', 'c2'], ['gpu', 'nvidia-rtx-5070-laptop-80w', 'c3']] },
  { title: t('guide.s4'), desc: t('guide.s4d'), picks: [['cpu', 'amd-ryzen-9-9955hx', 'd1'], ['gpu', 'nvidia-rtx-5080-laptop-150w', 'd2'], ['ram', 'crucial-ddr5-5600-sodimm-32', 'd3']] },
] as { title: string; desc: string; picks: [Category, string, string][] }[])

useSeo(() => ({ title: t('guide.title'), description: t('guide.sub'), path: '/guide' }))
</script>

<template>
  <div class="space-y-6">
    <div>
      <div class="kicker">{{ t('nav.guide') }}</div>
      <h1 class="text-2xl sm:text-3xl font-bold tracking-tight mt-1">{{ t('guide.title') }}</h1>
      <p class="text-sm text-muted mt-1">{{ t('guide.sub') }}</p>
    </div>
    <div class="grid md:grid-cols-2 gap-4">
      <section v-for="s in scenes" :key="s.title" class="card p-5">
        <h2 class="font-bold text-lg">{{ s.title }}</h2>
        <p class="text-sm text-muted mt-1">{{ s.desc }}</p>
        <ul class="mt-3 space-y-2">
          <li v-for="p in s.picks" :key="p[1]" class="flex items-start gap-3 text-sm">
            <span class="badge uppercase mt-0.5 w-16 text-center shrink-0">{{ t('cat.' + p[0]) }}</span>
            <div><router-link :to="`/product/${p[0]}/${p[1]}`" class="font-semibold hover:text-accent">{{ name(p[0], p[1]) }}</router-link><div class="text-muted">{{ t('guide.why.' + p[2]) }}</div></div>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>
