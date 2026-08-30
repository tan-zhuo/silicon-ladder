<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCatalog } from '@/data/load'
import { matchQuery } from '@/utils/filters'
import { catLabel, formLabel, yearOf, rel as fmtRel } from '@/utils/format'
import { scorePool, sortRows } from '@/utils/rank'
import type { Category, AnyItem } from '@/types/hardware'
import AppLogo from '@/components/AppLogo.vue'
import BrandLogo from '@/components/BrandLogo.vue'
import { useI18n, displayName, displaySummary } from '@/i18n'
import { useSeo, SITE_URL, SITE_NAME } from '@/seo'

const catalog = useCatalog()
const router = useRouter()
const { t } = useI18n()
const q = ref('')

const ICONS: Record<string, string> = {
  cpu: 'M9 3v2M15 3v2M9 19v2M15 19v2M3 9h2M3 15h2M19 9h2M19 15h2M7 7h10v10H7z',
  gpu: 'M3 7h18v10H3zM7 17v3M17 17v3M9 12a3 3 0 106 0 3 3 0 00-6 0',
  ram: 'M3 9h18v6H3zM7 9V6M11 9V6M15 9V6M7 15v3M11 15v3M15 15v3',
  storage: 'M4 6h16v5H4zM4 13h16v5H4zM7 8.5h.01M7 15.5h.01',
  psu: 'M13 2L4 14h7l-1 8 9-12h-7z',
  compare: 'M4 5h6v14H4zM14 5h6v14h-6z',
}
const cards = computed(() => (['cpu', 'gpu', 'ram', 'storage', 'psu', 'compare'] as const).map((k) => ({
  key: k, to: k === 'compare' ? '/compare' : `/rank/${k}`, title: k === 'compare' ? t('nav.compare') : catLabel(k), desc: t('home.cards.' + k), icon: ICONS[k],
  count: k === 'compare' ? null : catalog.byCategory(k).length,
})))

const all = computed<{ cat: Category; item: AnyItem }[]>(() => (['cpu', 'gpu', 'ram', 'storage', 'psu'] as Category[]).flatMap((cat) => catalog.byCategory(cat).map((item) => ({ cat, item }))))
const hits = computed(() => (q.value.trim() ? all.value.filter((x) => matchQuery(x.item, q.value)).slice(0, 8) : []))
const recent = computed(() => [...all.value].sort((a, b) => b.item.release.localeCompare(a.item.release)).slice(0, 4))
const years = computed(() => { const ys = all.value.map((x) => yearOf(x.item.release)); return ys.length ? `${Math.min(...ys)}–${Math.max(...ys)}` : '—' })

const tops = computed(() => ([['cpu', 'desktop'], ['gpu', 'desktop'], ['cpu', 'laptop'], ['gpu', 'laptop']] as [Category, string][]).map(([cat, form]) => {
  const pool = catalog.byCategory(cat).filter((i) => i.form === form)
  const rows = sortRows(cat, scorePool(cat, pool), 'overall').slice(0, 3)
  return { cat, form, rows }
}))

useSeo(() => ({
  title: `${SITE_NAME} — ${t('site.tagline')} · ${t('site.sub')}`,
  description: t('home.heroDesc'),
  path: '/',
  jsonLd: [{
    '@context': 'https://schema.org', '@type': 'WebSite', name: SITE_NAME, url: SITE_URL,
    description: t('home.heroDesc'),
    author: { '@type': 'Person', name: 'tanzhuo', url: 'https://tanzhuo.xyz' },
    potentialAction: { '@type': 'SearchAction', target: `${SITE_URL}/rank/cpu?q={search_term_string}`, 'query-input': 'required name=search_term_string' },
  }],
}))
</script>

<template>
  <!-- Hero -->
  <section class="hero relative rounded-3xl border border-line px-6 sm:px-12 py-12 sm:py-20 mb-8 overflow-hidden">
    <div class="absolute -right-24 -top-24 opacity-[.07] pointer-events-none"><AppLogo :size="420" /></div>
    <div class="relative max-w-3xl">
      <div class="kicker">{{ t('home.heroKicker') }}</div>
      <h1 class="text-4xl sm:text-6xl font-bold tracking-tight mt-3 leading-[1.08]">{{ t('home.heroTitle') }}</h1>
      <p class="mt-5 text-muted text-base sm:text-lg leading-relaxed max-w-2xl">{{ t('home.heroDesc') }}</p>
      <div class="mt-7 flex flex-wrap gap-2.5">
        <router-link :to="{ path: '/rank/cpu', query: { view: 'ladder' } }" class="btn !px-5 !py-2.5 !text-base">{{ t('home.ctaCpu') }}</router-link>
        <router-link :to="{ path: '/rank/gpu', query: { view: 'ladder' } }" class="btn-ghost !px-5 !py-2.5 !text-base">{{ t('home.ctaGpu') }}</router-link>
        <router-link to="/compare" class="btn-ghost !px-5 !py-2.5 !text-base">{{ t('home.ctaCompare') }}</router-link>
      </div>
      <div class="mt-7 relative max-w-xl">
        <input v-model="q" class="input !py-3 !pl-10 !text-base" :placeholder="t('home.searchPh')" />
        <svg class="absolute left-3.5 top-3.5 text-muted" width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2" /><path d="M20 20l-3.5-3.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" /></svg>
        <div v-if="hits.length" class="absolute z-20 mt-1 w-full card overflow-hidden">
          <button v-for="h in hits" :key="h.cat + h.item.id" class="w-full text-left px-4 py-2.5 hover:bg-accent/5 flex items-center gap-3 text-sm" @click="router.push(`/product/${h.cat}/${h.item.id}`); q = ''">
            <BrandLogo :brand="h.item.brand" :size="16" />
            <span class="text-xs text-muted w-14">{{ catLabel(h.cat) }}</span>
            <span class="flex-1 font-medium">{{ displayName(h.item) }}</span>
            <span class="text-xs text-muted">{{ formLabel(h.item.form) }} · {{ yearOf(h.item.release) }}</span>
          </button>
        </div>
      </div>
    </div>
    <div class="relative mt-10 flex flex-wrap gap-x-10 gap-y-4">
      <div v-for="s in [[all.length, t('home.statItems')], [catalog.cpus.length, t('home.statCpu')], [catalog.gpus.length, t('home.statGpu')], [years, t('home.statSpan')], [catalog.meta.updated, t('home.statUpdated')]]" :key="String(s[1])" class="whitespace-nowrap">
        <div class="text-2xl sm:text-3xl font-bold tracking-tight tabular-nums">{{ s[0] }}</div>
        <div class="text-xs text-muted mt-0.5">{{ s[1] }}</div>
      </div>
    </div>
  </section>

  <!-- 品类 -->
  <section>
    <div class="flex items-baseline justify-between mb-4">
      <div><h2 class="text-xl font-bold">{{ t('home.sectionCats') }}</h2><p class="text-sm text-muted">{{ t('home.sectionCatsDesc') }}</p></div>
    </div>
    <div class="grid grid-cols-2 lg:grid-cols-3 gap-4">
      <router-link v-for="c in cards" :key="c.key" :to="c.to" class="card card-hover p-5 sm:p-6 group relative overflow-hidden">
        <div class="w-11 h-11 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path :d="c.icon" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg>
        </div>
        <div class="flex items-baseline gap-2"><span class="font-bold text-lg group-hover:text-accent transition-colors">{{ c.title }}</span><span v-if="c.count" class="text-xs text-muted">{{ c.count }}</span></div>
        <div class="text-sm text-muted mt-1 truncate">{{ c.desc }}</div>
      </router-link>
    </div>
  </section>

  <!-- 榜首 -->
  <section class="mt-12">
    <div class="mb-4"><h2 class="text-xl font-bold">{{ t('home.sectionTop') }}</h2><p class="text-sm text-muted">{{ t('home.sectionTopDesc') }}</p></div>
    <div class="grid md:grid-cols-2 2xl:grid-cols-4 gap-4">
      <div v-for="tp in tops" :key="tp.cat + tp.form" class="card p-4">
        <div class="flex items-center justify-between mb-3">
          <div class="font-semibold">{{ formLabel(tp.form) }} {{ catLabel(tp.cat) }}</div>
          <router-link :to="{ path: `/rank/${tp.cat}`, query: { form: tp.form, view: 'ladder' } }" class="text-xs text-accent hover:underline">{{ t('home.viewLadder') }} →</router-link>
        </div>
        <div class="space-y-2">
          <router-link v-for="r in tp.rows" :key="r.item.id" :to="`/product/${tp.cat}/${r.item.id}`" class="flex items-center gap-2.5 group">
            <span class="w-5 text-sm font-bold" :style="{ color: r.rank === 1 ? 'var(--gold)' : r.rank === 2 ? 'var(--silver)' : 'var(--bronze)' }">{{ r.rank }}</span>
            <BrandLogo :brand="r.item.brand" :size="16" />
            <span class="flex-1 text-sm font-medium truncate group-hover:text-accent">{{ displayName(r.item) }}</span>
            <div class="w-20 h-1.5 rounded-full overflow-hidden shrink-0" style="background: var(--bar-track)"><div class="h-full" :style="{ width: (r.rel.overall ?? 0) + '%', background: 'var(--bar-fill)' }" /></div>
            <span class="text-xs w-9 text-right shrink-0 tabular-nums">{{ fmtRel(r.rel.overall) }}</span>
          </router-link>
        </div>
      </div>
    </div>
  </section>

  <!-- 用法 -->
  <section class="mt-12">
    <h2 class="text-xl font-bold mb-4">{{ t('home.sectionHow') }}</h2>
    <div class="grid md:grid-cols-3 gap-4">
      <div v-for="n in 3" :key="n" class="card p-5 flex gap-4">
        <div class="w-9 h-9 rounded-full bg-accent text-white flex items-center justify-center font-bold shrink-0">{{ n }}</div>
        <div><div class="font-semibold">{{ t(`home.how${n}t`) }}</div><div class="text-sm text-muted mt-1">{{ t(`home.how${n}d`) }}</div></div>
      </div>
    </div>
  </section>

  <!-- 最近更新 -->
  <section class="mt-12">
    <div class="flex items-baseline justify-between mb-4">
      <h2 class="text-xl font-bold">{{ t('home.recent') }}</h2>
      <span class="text-xs text-muted">{{ t('home.snapshot') }} {{ catalog.meta.updated }}</span>
    </div>
    <div class="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <router-link v-for="r in recent" :key="r.item.id" :to="`/product/${r.cat}/${r.item.id}`" class="card card-hover p-4">
        <div class="flex items-center gap-2 text-xs text-muted"><BrandLogo :brand="r.item.brand" :size="14" />{{ catLabel(r.cat) }} · {{ formLabel(r.item.form) }} · {{ r.item.release }}</div>
        <div class="font-semibold mt-2">{{ displayName(r.item) }}</div>
        <div class="text-sm text-muted mt-1 line-clamp-2">{{ displaySummary(r.item) }}</div>
      </router-link>
    </div>
    <p class="text-xs text-muted mt-6">{{ t('home.disclaimer') }}</p>
  </section>
</template>
