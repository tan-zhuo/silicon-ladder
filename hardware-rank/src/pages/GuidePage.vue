<script setup lang="ts">
import { computed } from 'vue'
import { useI18n, displayName, locale } from '@/i18n'
import { useCatalog } from '@/data/load'
import { useSeo } from '@/seo'
import { GUIDE, type L3 } from '@/content/guide'
import { scoreAllPools } from '@/utils/rank'
import { catLabel, priceShort } from '@/utils/format'
import BrandLogo from '@/components/BrandLogo.vue'
import type { Category } from '@/types/hardware'

const { t } = useI18n()
const catalog = useCatalog()
const p = (v: L3) => v[locale.value === 'en' ? 1 : locale.value === 'ja' ? 2 : 0]
const maps = computed(() => Object.fromEntries((['cpu', 'gpu', 'ram', 'storage', 'psu', 'mobo'] as Category[]).map((c) => [c, scoreAllPools(c, catalog.byCategory(c))])))
const item = (cat: Category, id: string) => catalog.find(cat, id)
const overall = (cat: Category, id: string) => maps.value[cat]?.get(id)?.rel.overall ?? null
const tierOf = (cat: Category, id: string) => { const it = item(cat, id) as { tier?: string } | undefined; return it?.tier ?? null }
/** 参考总价：所有有价条目之和；缺价条目计数 */
const total = (picks: { cat: Category; id: string }[]) => {
  let sum = 0, missing = 0
  for (const pk of picks) { const it = item(pk.cat, pk.id); if (it?.price_cny) sum += it.price_cny; else missing++ }
  return { sum, missing }
}
useSeo(() => ({ title: t('guide.title'), description: t('guide.sub'), path: '/guide' }))
</script>

<template>
  <div class="space-y-8">
    <div>
      <div class="kicker">{{ t('nav.guide') }}</div>
      <h1 class="t-h1 mt-1.5">{{ t('guide.title') }}</h1>
      <p class="text-sm text-muted mt-1.5">{{ t('guide.sub') }}</p>
      <nav class="mt-3 flex flex-wrap gap-2"><a v-for="s in GUIDE" :key="s.id" :href="'#' + s.id" class="pill !h-8 !text-xs">{{ p(s.title) }}</a></nav>
    </div>

    <section v-for="s in GUIDE" :id="s.id" :key="s.id" class="scroll-mt-20">
      <h2 class="t-h2">{{ p(s.title) }}</h2>
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
              <BrandLogo v-if="item(pk.cat, pk.id)" :brand="item(pk.cat, pk.id)!.brand" :size="20" />
              <div class="flex-1 min-w-0">
                <router-link :to="`/product/${pk.cat}/${pk.id}`" class="font-semibold hover:text-accent">{{ item(pk.cat, pk.id) ? displayName(item(pk.cat, pk.id)!) : pk.id }}</router-link>
                <div class="text-xs text-muted">{{ p(pk.why) }}</div>
              </div>
              <span v-if="overall(pk.cat, pk.id) != null" class="num text-xs text-muted shrink-0">{{ t('sort.overall') }} <b class="text-fg">{{ overall(pk.cat, pk.id)!.toFixed(1) }}</b></span>
              <span v-else-if="tierOf(pk.cat, pk.id)" class="text-xs text-muted shrink-0">{{ t('sort.tier') }} <b class="text-fg">{{ tierOf(pk.cat, pk.id) }}</b></span>
            </li>
          </ul>
          <div v-if="b.cooler || b.case" class="mt-3 grid sm:grid-cols-2 gap-2 text-xs">
            <div v-if="b.cooler" class="rounded-sm border border-line bg-card2/60 px-3 py-2"><span class="text-faint">{{ t('guide.cooler') }}</span><div class="mt-0.5 text-fg">{{ p(b.cooler) }}</div></div>
            <div v-if="b.case" class="rounded-sm border border-line bg-card2/60 px-3 py-2"><span class="text-faint">{{ t('guide.case') }}</span><div class="mt-0.5 text-fg">{{ p(b.case) }}</div></div>
          </div>
          <div v-if="total(b.picks).sum" class="mt-3 pt-3 border-t border-line flex items-baseline justify-between text-xs text-muted">
            <span>{{ t('guide.total') }}<span v-if="total(b.picks).missing"> · {{ t('guide.totalMissing', { n: total(b.picks).missing }) }}</span></span>
            <span class="num text-sm font-semibold text-fg">≈ {{ priceShort(total(b.picks).sum) }}</span>
          </div>
        </div>
      </div>

      <div v-for="(tb, ti) in [...(s.table ? [s.table] : []), ...(s.tables ?? [])]" :key="ti" class="card overflow-hidden" :class="ti ? 'mt-4' : ''">
        <div v-if="tb.title" class="px-4 pt-4 pb-2 t-h3">{{ p(tb.title) }}</div>
        <div class="overflow-x-auto">
          <table class="data-table !table-auto min-w-[640px]">
            <thead><tr><th v-for="h in tb.head" :key="p(h)" class="text-left px-4">{{ p(h) }}</th></tr></thead>
            <tbody><tr v-for="(row, i) in tb.rows" :key="i"><td v-for="(c, j) in row" :key="j" class="px-4 py-2.5 align-top" :class="j === 0 ? 'font-semibold whitespace-nowrap' : 'text-muted'">{{ p(c) }}</td></tr></tbody>
          </table>
        </div>
      </div>

      <ol v-if="s.checklist" class="card p-5 space-y-3 text-sm">
        <li v-for="(c, i) in s.checklist" :key="i" class="flex gap-3"><span class="num w-6 h-6 rounded-sm bg-inverse text-inverseFg text-xs font-semibold inline-flex items-center justify-center shrink-0">{{ i + 1 }}</span><span class="pt-0.5 leading-relaxed">{{ p(c) }}</span></li>
      </ol>
      <ul v-if="s.bullets" class="card p-5 space-y-2.5 text-sm">
        <li v-for="b in s.bullets" :key="p(b)" class="flex gap-2"><span class="text-accent shrink-0">✕</span><span>{{ p(b) }}</span></li>
      </ul>
    </section>
  </div>
</template>
