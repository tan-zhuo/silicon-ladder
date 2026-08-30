<script setup lang="ts">
import { computed } from 'vue'
import { useI18n, displayName, locale } from '@/i18n'
import { useCatalog } from '@/data/load'
import { useSeo } from '@/seo'
import { GUIDE, type L3 } from '@/content/guide'
import { scoreAllPools } from '@/utils/rank'
import { catLabel } from '@/utils/format'
import BrandLogo from '@/components/BrandLogo.vue'
import type { Category } from '@/types/hardware'

const { t } = useI18n()
const catalog = useCatalog()
const p = (v: L3) => v[locale.value === 'en' ? 1 : locale.value === 'ja' ? 2 : 0]
const maps = computed(() => Object.fromEntries((['cpu', 'gpu', 'ram', 'storage', 'psu'] as Category[]).map((c) => [c, scoreAllPools(c, catalog.byCategory(c))])))
const item = (cat: Category, id: string) => catalog.find(cat, id)
const overall = (cat: Category, id: string) => maps.value[cat]?.get(id)?.rel.overall ?? null
useSeo(() => ({ title: t('guide.title'), description: t('guide.sub'), path: '/guide' }))
</script>

<template>
  <div class="space-y-8">
    <div>
      <div class="kicker">{{ t('nav.guide') }}</div>
      <h1 class="text-2xl sm:text-3xl font-bold tracking-tight mt-1">{{ t('guide.title') }}</h1>
      <p class="text-sm text-muted mt-1">{{ t('guide.sub') }}</p>
      <nav class="mt-3 flex flex-wrap gap-2"><a v-for="s in GUIDE" :key="s.id" :href="'#' + s.id" class="pill !h-8 !text-xs">{{ p(s.title) }}</a></nav>
    </div>

    <section v-for="s in GUIDE" :id="s.id" :key="s.id" class="scroll-mt-20">
      <h2 class="text-xl font-bold">{{ p(s.title) }}</h2>
      <p class="text-sm text-muted mt-1 mb-4 max-w-3xl">{{ p(s.intro) }}</p>

      <div v-if="s.builds" class="grid md:grid-cols-2 gap-4">
        <div v-for="b in s.builds" :key="p(b.title)" class="card p-5">
          <div class="flex items-baseline justify-between gap-2">
            <h3 class="font-bold">{{ p(b.title) }}</h3>
            <span v-if="p(b.budget) !== '—'" class="badge">{{ p(b.budget) }}</span>
          </div>
          <p class="text-sm text-muted mt-1">{{ p(b.desc) }}</p>
          <ul class="mt-3 divide-y divide-line/60">
            <li v-for="pk in b.picks" :key="pk.cat + pk.id" class="py-2 flex items-center gap-3 text-sm">
              <span class="badge w-16 justify-center shrink-0">{{ catLabel(pk.cat) }}</span>
              <BrandLogo v-if="item(pk.cat, pk.id)" :brand="item(pk.cat, pk.id)!.brand" :size="16" />
              <div class="flex-1 min-w-0">
                <router-link :to="`/product/${pk.cat}/${pk.id}`" class="font-semibold hover:text-accent">{{ item(pk.cat, pk.id) ? displayName(item(pk.cat, pk.id)!) : pk.id }}</router-link>
                <div class="text-xs text-muted">{{ p(pk.why) }}</div>
              </div>
              <span v-if="overall(pk.cat, pk.id) != null" class="text-xs text-muted shrink-0">{{ t('sort.overall') }} <b class="text-fg">{{ overall(pk.cat, pk.id)!.toFixed(1) }}</b></span>
            </li>
          </ul>
        </div>
      </div>

      <div v-if="s.table" class="card overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-card2 text-xs text-muted"><tr><th v-for="h in s.table.head" :key="p(h)" class="text-left px-4 py-2.5 whitespace-nowrap">{{ p(h) }}</th></tr></thead>
          <tbody><tr v-for="(row, i) in s.table.rows" :key="i" class="border-t border-line/60"><td v-for="(c, j) in row" :key="j" class="px-4 py-2.5" :class="j === 0 ? 'font-semibold' : ''">{{ p(c) }}</td></tr></tbody>
        </table>
      </div>

      <ul v-if="s.bullets" class="card p-5 space-y-2.5 text-sm">
        <li v-for="b in s.bullets" :key="p(b)" class="flex gap-2"><span class="text-accent shrink-0">✕</span><span>{{ p(b) }}</span></li>
      </ul>
    </section>
  </div>
</template>
