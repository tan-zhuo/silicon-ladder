<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCatalog } from '@/data/load'
import { matchQuery } from '@/utils/filters'
import { catLabel, formLabel, yearOf, rel as fmtRel } from '@/utils/format'
import { scorePool, sortRows } from '@/utils/rank'
import type { Category, AnyItem } from '@/types/hardware'
import BrandLogo from '@/components/BrandLogo.vue'
import CountUp from '@/components/CountUp.vue'
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
  <section class="hero relative rounded-lg border border-line px-6 sm:px-12 2xl:px-16 py-12 sm:py-16 2xl:py-20 mb-10 overflow-hidden shadow-sm">
    <div class="relative z-[1] max-w-3xl">
      <div class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-accent" /><span class="kicker">{{ t('home.heroKicker') }}</span></div>
      <h1 class="t-display mt-4">{{ t('home.heroTitle') }}</h1>
      <p class="mt-5 text-muted text-[15px] sm:text-[17px] leading-relaxed max-w-2xl">{{ t('home.heroDesc') }}</p>
      <div class="mt-7 flex flex-wrap gap-2.5">
        <router-link :to="{ path: '/rank/cpu', query: { view: 'ladder' } }" class="btn !h-11 !px-5 !text-[15px]">{{ t('home.ctaCpu') }}</router-link>
        <router-link :to="{ path: '/rank/gpu', query: { view: 'ladder' } }" class="btn-ghost !h-11 !px-5 !text-[15px]">{{ t('home.ctaGpu') }}</router-link>
        <router-link to="/compare" class="btn-ghost !h-11 !px-5 !text-[15px]">{{ t('home.ctaCompare') }}</router-link>
      </div>
      <div class="mt-7 relative max-w-xl">
        <input v-model="q" class="input !h-12 !pl-11 !text-[15px] !rounded-md" :placeholder="t('home.searchPh')" />
        <svg class="absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none" width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2" /><path d="M20 20l-3.5-3.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" /></svg>
        <div v-if="hits.length" class="absolute z-20 mt-1.5 w-full panel overflow-hidden">
          <button v-for="h in hits" :key="h.cat + h.item.id" class="w-full text-left px-4 py-2.5 hover:bg-accent/5 flex items-center gap-3 text-sm" @click="router.push(`/product/${h.cat}/${h.item.id}`); q = ''">
            <BrandLogo :brand="h.item.brand" :size="20" />
            <span class="text-xs text-muted w-14">{{ catLabel(h.cat) }}</span>
            <span class="flex-1 font-medium">{{ displayName(h.item) }}</span>
            <span class="text-xs text-muted">{{ formLabel(h.item.form) }} · {{ yearOf(h.item.release) }}</span>
          </button>
        </div>
      </div>
    </div>
    <div class="relative z-[1] mt-10 sm:mt-12 pt-6 border-t border-line flex flex-wrap gap-x-8 sm:gap-x-12 gap-y-4">
      <div v-for="s in [[all.length, t('home.statItems')], [catalog.cpus.length, t('home.statCpu')], [catalog.gpus.length, t('home.statGpu')], [years, t('home.statSpan')], [catalog.meta.updated, t('home.statUpdated')]]" :key="String(s[1])" class="whitespace-nowrap">
        <div class="stat"><CountUp :value="s[0]" /></div>
        <div class="t-overline text-faint mt-1.5">{{ s[1] }}</div>
      </div>
    </div>
  </section>

  <!-- 品类 -->
  <section>
    <div class="flex items-baseline justify-between mb-4">
      <div><h2 class="t-h2">{{ t('home.sectionCats') }}</h2><p class="text-sm text-muted mt-0.5">{{ t('home.sectionCatsDesc') }}</p></div>
    </div>
    <div class="grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-4">
      <router-link v-for="c in cards" :key="c.key" :to="c.to" class="card card-hover p-5 group relative overflow-hidden">
        <div class="w-11 h-11 rounded-sm bg-card2 border border-line text-fg flex items-center justify-center mb-5 group-hover:text-accent group-hover:border-line2 transition-colors">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path :d="c.icon" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" /></svg>
        </div>
        <div class="flex items-baseline gap-2"><span class="t-h3">{{ c.title }}</span><span v-if="c.count" class="num text-[11px] text-faint">{{ c.count }}</span></div>
        <div class="text-sm text-muted mt-1 truncate">{{ c.desc }}</div>
      </router-link>
    </div>
  </section>

  <!-- 榜首 -->
  <section class="mt-12">
    <div class="mb-4"><h2 class="t-h2">{{ t('home.sectionTop') }}</h2><p class="text-sm text-muted mt-0.5">{{ t('home.sectionTopDesc') }}</p></div>
    <div class="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
      <div v-for="tp in tops" :key="tp.cat + tp.form" class="card p-4">
        <div class="flex items-center justify-between mb-3">
          <div class="t-h3">{{ formLabel(tp.form) }} {{ catLabel(tp.cat) }}</div>
          <router-link :to="{ path: `/rank/${tp.cat}`, query: { form: tp.form, view: 'ladder' } }" class="text-xs text-muted hover:text-fg transition-colors">{{ t('home.viewLadder') }} →</router-link>
        </div>
        <div class="space-y-2">
          <router-link v-for="r in tp.rows" :key="r.item.id" :to="`/product/${tp.cat}/${r.item.id}`" class="flex items-center gap-2.5 group">
            <span class="rank-no !w-6 !h-6 !text-xs" :class="`rank-no-${r.rank}`">{{ r.rank }}</span>
            <BrandLogo :brand="r.item.brand" :size="20" />
            <span class="flex-1 min-w-0 text-sm font-medium truncate group-hover:text-accent">{{ displayName(r.item) }}</span>
            <div class="hidden xs:block w-16 sm:w-20 h-1 rounded-full overflow-hidden shrink-0" style="background: var(--bar-track)"><div class="h-full bar-anim" :style="{ width: (r.rel.overall ?? 0) + '%', background: 'var(--bar-fill)', '--i': r.rank }" /></div>
            <span class="num text-xs w-9 text-right shrink-0">{{ fmtRel(r.rel.overall) }}</span>
          </router-link>
        </div>
      </div>
    </div>
  </section>

  <!-- 用法 -->
  <section class="mt-12">
    <h2 class="t-h2 mb-4">{{ t('home.sectionHow') }}</h2>
    <div class="grid md:grid-cols-3 gap-4">
      <div v-for="n in 3" :key="n" class="card p-5 flex gap-4">
        <div class="num w-8 h-8 rounded-sm bg-inverse text-inverseFg flex items-center justify-center text-sm font-semibold shrink-0">{{ n }}</div>
        <div><div class="font-semibold">{{ t(`home.how${n}t`) }}</div><div class="text-sm text-muted mt-1">{{ t(`home.how${n}d`) }}</div></div>
      </div>
    </div>
  </section>

  <!-- 官方动态 -->
  <section v-if="catalog.news.items.length" class="mt-12">
    <div class="flex items-baseline justify-between mb-4">
      <h2 class="t-h2">{{ t('news.home') }}</h2>
      <router-link to="/news" class="text-xs text-muted hover:text-fg transition-colors">{{ t('news.more') }} →</router-link>
    </div>
    <div class="card divide-y divide-line overflow-hidden">
      <a v-for="n in catalog.news.items.slice(0, 6)" :key="n.id" :href="n.url" target="_blank" rel="noopener" class="flex items-center gap-3 px-4 py-3 group hover:bg-card2 transition-colors">
        <BrandLogo :brand="n.brand" :size="18" />
        <span class="flex-1 min-w-0 truncate text-sm font-medium group-hover:text-accent">{{ n.title }}</span>
        <span class="num text-[11px] text-faint shrink-0">{{ n.date }}</span>
      </a>
    </div>
  </section>

  <!-- 最近更新 -->
  <section class="mt-12">
    <div class="flex items-baseline justify-between mb-4">
      <h2 class="t-h2">{{ t('home.recent') }}</h2>
      <span class="num text-xs text-faint">{{ t('home.snapshot') }} {{ catalog.meta.updated }}</span>
    </div>
    <div class="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <router-link v-for="r in recent" :key="r.item.id" :to="`/product/${r.cat}/${r.item.id}`" class="card card-hover p-4">
        <div class="flex items-center gap-2 text-xs text-faint"><BrandLogo :brand="r.item.brand" :size="18" />{{ catLabel(r.cat) }} · {{ formLabel(r.item.form) }} · {{ r.item.release }}</div>
        <div class="t-h3 mt-2.5">{{ displayName(r.item) }}</div>
        <div class="text-sm text-muted mt-1 line-clamp-2">{{ displaySummary(r.item) }}</div>
      </router-link>
    </div>
    <p class="text-xs text-faint mt-6">{{ t('home.disclaimer') }}</p>
  </section>
</template>
