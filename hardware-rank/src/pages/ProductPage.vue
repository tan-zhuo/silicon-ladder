<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Category, Cpu, Gpu, Ram, Storage, Psu } from '@/types/hardware'
import { useCatalog } from '@/data/load'
import { useCompare } from '@/stores/compare'
import { scorePool, sortRows, SORT_DEFS } from '@/utils/rank'
import { catLabel, formLabel, ifaceLabel, modularLabel, price, num, iops, capacity, bool, vram, DASH } from '@/utils/format'
import ScoreBar from '@/components/ScoreBar.vue'
import BrandLogo from '@/components/BrandLogo.vue'
import { cpuPlatform, gpuPlatform, ramPlatform, storagePlatform, psuPlatform, type Row } from '@/data/platforms'
import { cpuTechRows, gpuTechRows, type TechRow } from '@/data/techrows'
import { shopLinks, shopQuery } from '@/data/shops'
import ShopLogo from '@/components/ShopLogo.vue'
import { useI18n, displayName, displaySummary, tagLabel } from '@/i18n'
import { useSeo, breadcrumb, SITE_URL } from '@/seo'

const route = useRoute()
const router = useRouter()
const catalog = useCatalog()
const compare = useCompare()
const { t } = useI18n()

const category = computed(() => route.params.category as Category)
const id = computed(() => route.params.id as string)
const item = computed(() => catalog.find(category.value, id.value))
const pool = computed(() => (item.value ? catalog.byCategory(category.value).filter((i) => i.form === item.value!.form) : []))
const scored = computed(() => scorePool(category.value, pool.value))
const row = computed(() => scored.value.find((r) => r.item.id === id.value))
const ranked = computed(() => sortRows(category.value, scored.value, SORT_DEFS[category.value][0].key))
const rankPos = computed(() => ranked.value.find((r) => r.item.id === id.value)?.rank ?? null)

const similar = computed(() => {
  if (!row.value) return []
  const me = row.value.rel.overall ?? null
  const psu = category.value === 'psu'
  return ranked.value.filter((r) => r.item.id !== id.value).sort((a, b) => {
    if (psu) return Math.abs(a.rank - (rankPos.value ?? 0)) - Math.abs(b.rank - (rankPos.value ?? 0))
    const da = me === null || a.rel.overall === null ? 999 : Math.abs((a.rel.overall ?? 0) - me)
    const db = me === null || b.rel.overall === null ? 999 : Math.abs((b.rel.overall ?? 0) - me)
    return da - db
  }).slice(0, 3)
})

type Spec = [string, string]
const specs = computed<Spec[]>(() => {
  const it = item.value
  if (!it) return []
  const L = (k: string) => t('spec.' + k)
  if (category.value === 'cpu') {
    const c = it as Cpu
    return [[L('series'), c.series], [L('gen'), c.gen], [L('socket'), c.socket], [L('cores'), c.cores], [L('clocks'), c.clocks], [L('tdp'), c.tdp_range ? `${c.tdp_w}W (${c.tdp_range})` : `${c.tdp_w}W`], [L('igpu'), c.igpu ?? DASH], [L('l3'), c.cache_l3], [L('mem'), c.mem], [L('price'), price(c.price_cny)]]
  }
  if (category.value === 'gpu') {
    const g = it as Gpu
    return [[L('series'), g.series], [L('arch'), g.gen], [L('chip'), g.chip], [L('vram'), `${vram(g.vram_gb)} ${g.vram_type}`], [L('bus'), `${g.bus_bit}-bit`], [g.form === 'desktop' ? L('tbp') : L('tgp'), g.form === 'desktop' ? `${g.tdp_w}W` : `${g.tgp_w ?? g.tdp_w}W${g.tgp_range ? ' (' + g.tgp_range + ')' : ''}`], [L('price'), price(g.price_cny)]]
  }
  if (category.value === 'ram') {
    const r = it as Ram
    return [[L('type'), r.type], [L('spec'), r.spec], [L('capacity'), `${r.capacity_gb}GB`], [L('speed'), `${r.speed_mt} MT/s`], [L('cl'), r.cl == null ? DASH : String(r.cl)], [L('write'), r.scores.write_GBs == null ? DASH : `${r.scores.write_GBs} GB/s`], [L('price'), price(r.price_cny)]]
  }
  if (category.value === 'storage') {
    const s = it as Storage
    return [[L('interface'), ifaceLabel(s.interface)], [L('capacity'), capacity(s.capacity_gb)], [L('nand'), s.nand ?? DASH], [L('dram'), bool(s.dram)], [L('seq'), `${num(s.seq_read)} / ${num(s.seq_write)} MB/s`], [L('r4k'), iops(s.iops_4k_read) + (s.iops_4k_read ? ' IOPS' : '')], [L('cacheOut'), s.write_cache_out == null ? DASH : `${num(s.write_cache_out)} MB/s`], [L('tbw'), s.tbw == null ? DASH : `${num(s.tbw)} TB`], [L('price'), price(s.price_cny)]]
  }
  const p = it as Psu
  return [[L('watt'), `${p.watt}W`], [L('tier'), p.tier], [L('eff'), p.efficiency], [L('atx31'), bool(p.atx31)], [L('modular'), modularLabel(p.modular)], [L('oem'), p.oem], [L('price'), price(p.price_cny)]]
})

const scoreCards = computed(() => {
  if (!row.value || category.value === 'psu') return []
  const rawText = (k: string) => {
    const v = row.value!.raw[k]
    if (v == null) return DASH
    if (category.value === 'cpu' && (k === 'single' || k === 'multi')) return num(v as number)
    if (category.value === 'ram' && k === 'bandwidth') return `${v} GB/s`
    if (category.value === 'ram' && k === 'latency') return `${v} ns`
    if (category.value === 'storage' && k === 'random4k') return iops(v as number)
    if (category.value === 'storage' && (k === 'seqRead' || k === 'cacheOut')) return `${num(v as number)} MB/s`
    if (category.value === 'storage' && k === 'endurance') return `${v} TBW/GB`
    if (typeof v === 'number') return String(Math.round(v * 100) / 100)
    return String(v)
  }
  return SORT_DEFS[category.value]
    .map((s) => ({ key: s.key, rel: row.value!.rel[s.key] ?? null, raw: s.key === 'overall' || s.key === 'value' ? null : rawText(s.key) }))
    .filter((s) => s.rel !== null || scored.value.some((r) => r.rel[s.key] != null))
})

const platformRows = computed<Row[]>(() => {
  const it = item.value
  if (!it) return []
  switch (category.value) {
    case 'cpu': return cpuPlatform(it as Cpu)
    case 'gpu': return gpuPlatform(it as Gpu)
    case 'ram': return ramPlatform(it as Ram)
    case 'storage': return storagePlatform(it as Storage)
    case 'psu': return psuPlatform(it as Psu)
  }
})
/** 直接竞品：同池、其他品牌优先、发布 ±1 年、综合分差 ≤ 10 */
const rivals = computed(() => {
  const me = row.value
  if (!me || me.rel.overall == null) return []
  const y = Number(me.item.release.slice(0, 4))
  const cand = ranked.value.filter((r) => r.item.id !== me.item.id && r.rel.overall != null && Math.abs(Number(r.item.release.slice(0, 4)) - y) <= 1 && Math.abs((r.rel.overall as number) - (me.rel.overall as number)) <= 10)
  cand.sort((a, b) => Number(a.item.brand === me.item.brand) - Number(b.item.brand === me.item.brand) || Math.abs((a.rel.overall as number) - (me.rel.overall as number)) - Math.abs((b.rel.overall as number) - (me.rel.overall as number)))
  return cand.slice(0, 4)
})
/** 同系列前后代：同品牌 + 同 series，按发布排序 */
const lineage = computed(() => {
  const it = item.value as (Cpu | Gpu) | undefined
  if (!it || !('series' in it)) return { prev: null, next: null }
  const same = (catalog.byCategory(category.value) as (Cpu | Gpu)[]).filter((x) => x.form === it.form && x.brand === it.brand && x.series === it.series).sort((a, b) => a.release.localeCompare(b.release))
  const i = same.findIndex((x) => x.id === it.id)
  return { prev: i > 0 ? same[i - 1] : null, next: i >= 0 && i < same.length - 1 ? same[i + 1] : null }
})
const rowOf = (id: string) => scored.value.find((r) => r.item.id === id)

const techGroups = computed<{ group: string; rows: TechRow[] }[]>(() => {
  const it = item.value
  if (!it) return []
  const rows = category.value === 'cpu' ? cpuTechRows(it as Cpu) : category.value === 'gpu' ? gpuTechRows(it as Gpu) : []
  const out: { group: string; rows: TechRow[] }[] = []
  for (const row of rows) { const g = out.find((x) => x.group === row.group); if (g) g.rows.push(row); else out.push({ group: row.group, rows: [row] }) }
  return out.filter((g) => g.rows.some((x) => x.value !== '—'))
})

const inCompare = computed(() => item.value ? compare.has(category.value, item.value.id) : false)
const tags = computed(() => ((item.value as { tags?: string[] } | undefined)?.tags ?? []).filter((x) => x !== '历史'))

useSeo(() => {
  const it = item.value
  if (!it) return null
  const name = displayName(it)
  const specText = specs.value.slice(0, 5).map(([k, v]) => `${k} ${v}`).join(' · ')
  const rank = rankPos.value ? ` #${rankPos.value} ${formLabel(it.form)} ${catLabel(category.value)}` : ''
  return {
    title: `${name} ${t('product.specs')}、${t('product.scores')}、${t('product.platform')}`,
    description: `${it.brand} ${name}（${it.release}）${rank}。${it.summary} ${specText}`,
    path: `/product/${category.value}/${it.id}`,
    image: `${SITE_URL}/og/${category.value}/${it.id}.png`,
    jsonLd: [
      breadcrumb([{ name: t('product.home'), path: '/' }, { name: `${formLabel(it.form)} ${catLabel(category.value)}`, path: `/rank/${category.value}` }, { name, path: `/product/${category.value}/${it.id}` }]),
      {
        '@context': 'https://schema.org', '@type': 'Product', name, brand: { '@type': 'Brand', name: it.brand },
        description: it.summary, category: `${formLabel(it.form)} ${catLabel(category.value)}`, releaseDate: it.release,
        url: `${SITE_URL}/product/${category.value}/${it.id}`, sku: it.id,
        additionalProperty: specs.value.map(([k, v]) => ({ '@type': 'PropertyValue', name: k, value: v })),
        ...(it.price_cny ? { offers: { '@type': 'Offer', priceCurrency: 'CNY', price: it.price_cny, availability: 'https://schema.org/InStock' } } : {}),
      },
    ],
  }
})
</script>

<template>
  <div v-if="!item" class="card p-10 text-center text-muted">
    {{ t('product.notFound') }} <router-link :to="`/rank/${category}`" class="text-accent underline underline-offset-4">{{ t('product.backRank') }}</router-link>
  </div>
  <div v-else class="space-y-5">
    <nav class="text-xs text-muted">
      <router-link to="/" class="hover:text-fg">{{ t('product.home') }}</router-link> /
      <router-link :to="{ path: `/rank/${category}`, query: { form: item.form } }" class="hover:text-fg">{{ formLabel(item.form) }} {{ catLabel(category) }}</router-link> /
      <span class="text-fg">{{ displayName(item) }}</span>
    </nav>

    <header class="card p-6 sm:p-8 relative overflow-hidden">
      <div class="absolute -right-10 -top-10 opacity-[.06] pointer-events-none"><BrandLogo :brand="item.brand" :size="260" mono /></div>
      <div class="relative flex flex-wrap items-start gap-4">
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 flex-wrap">
            <BrandLogo :brand="item.brand" :size="24" />
            <span class="text-sm font-medium">{{ item.brand }}</span>
            <span class="badge">{{ formLabel(item.form) }}</span>
            <span v-if="item.est" class="badge !text-amber-700 dark:!text-amber-300 !border-amber-500/40">{{ t('product.est') }}</span>
            <span class="text-xs text-muted">{{ t('product.released', { d: item.release }) }}</span>
          </div>
          <h1 class="text-3xl sm:text-4xl font-bold tracking-tight mt-3">{{ displayName(item) }}</h1>
          <div v-if="item.nameEn && item.nameEn !== displayName(item)" class="text-sm text-muted mt-0.5">{{ item.nameEn }}</div>
          <p class="mt-3 text-fg/90">{{ displaySummary(item) }}</p>
          <p v-if="tags.length" class="text-sm text-muted mt-1">{{ t('product.fit', { tags: tags.map(tagLabel).join(' / ') }) }}</p>
          <p v-if="item.est" class="text-xs text-muted mt-2">{{ t('product.estNote') }}</p>
        </div>
        <div class="text-right">
          <div v-if="rankPos" class="text-xs text-muted">{{ category === 'psu' ? t('product.rankTier') : t('product.rankIn') }}</div>
          <div v-if="rankPos" class="text-4xl font-bold tracking-tight" :style="rankPos === 1 ? { color: 'var(--gold)' } : {}">#{{ rankPos }}</div>
          <button class="btn mt-2" :class="inCompare ? '!bg-card2 !text-fg !shadow-none border border-line' : ''" @click="compare.toggle(category, item.id)">{{ inCompare ? t('product.inCompare') : t('product.addCompare') }}</button>
        </div>
      </div>
    </header>

    <div class="grid lg:grid-cols-5 gap-4">
      <section class="card p-5 lg:col-span-3">
        <h2 class="font-bold mb-3">{{ t('product.specs') }}</h2>
        <dl class="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3 text-sm">
          <div v-for="[k, v] in specs" :key="k" :class="k === t('spec.price') ? 'col-span-2 sm:col-span-3' : ''"><dt class="text-xs text-muted">{{ k }}</dt><dd class="mt-0.5 font-medium">{{ v }}</dd></div>
        </dl>
        <p v-if="item.price_cny" class="text-[11px] text-muted mt-3">{{ t('spec.priceNote', { d: catalog.meta.fx?.asOf ?? catalog.meta.updated }) }}</p>
      </section>
      <section class="card p-5 lg:col-span-2">
        <h2 class="font-bold mb-3">{{ t('product.scores') }}</h2>
        <div v-if="category === 'psu'" class="text-sm text-muted">{{ t('product.psuScoreNote', { tier: (item as Psu).tier }) }}</div>
        <div v-else class="space-y-3">
          <div v-for="s in scoreCards" :key="s.key">
            <div class="flex justify-between text-xs text-muted mb-1"><span>{{ t('sort.' + s.key) }}</span><span v-if="s.raw">{{ t('product.raw') }} {{ s.raw }}</span></div>
            <ScoreBar :value="s.rel" :dim="s.key !== 'overall'" :height="8" />
          </div>
          <p class="text-xs text-muted pt-2">{{ t('product.relNote') }}</p>
        </div>
      </section>
    </div>

    <section class="card p-5">
      <div class="flex flex-wrap items-baseline justify-between gap-2">
        <h2 class="font-bold">{{ t('shop.title') }}</h2>
        <span class="text-xs text-muted">{{ t('shop.search', { q: shopQuery(item) }) }}</span>
      </div>
      <div class="mt-3 flex flex-wrap gap-2">
        <a v-for="l in shopLinks(item)" :key="l.key" :href="l.url" target="_blank" rel="noopener nofollow sponsored" class="btn-ghost !h-10 !pl-2.5">
          <ShopLogo :shop="l.key.startsWith('amz') ? 'amazon' : 'jd'" :height="18" />
          <span class="text-fg">{{ l.label }}</span><span class="badge !py-0">{{ l.region }}</span>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M7 17L17 7M9 7h8v8" stroke="currentColor" stroke-width="2" stroke-linecap="round" /></svg>
        </a>
      </div>
      <p class="text-[11px] text-muted mt-3">{{ t('shop.note') }}</p>
    </section>

    <section v-if="techGroups.length" class="card p-5">
      <h2 class="font-bold">{{ t('tech.title') }}</h2>
      <p class="text-xs text-muted mt-1 mb-4">{{ t('tech.note') }}</p>
      <div class="grid md:grid-cols-2 gap-x-8 gap-y-5">
        <div v-for="g in techGroups" :key="g.group">
          <div class="kicker mb-2">{{ g.group }}</div>
          <dl class="divide-y divide-line/60">
            <div v-for="row in g.rows" :key="row.key" class="grid grid-cols-[8.5rem_1fr] gap-3 py-1.5 text-sm">
              <dt class="text-muted">{{ row.label }}</dt>
              <dd :class="row.value === '—' ? 'text-muted' : 'font-medium'">{{ row.value }}</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>

    <section v-if="platformRows.length" class="card p-5">
      <h2 class="font-bold">{{ t('product.platform') }}</h2>
      <p class="text-xs text-muted mt-1 mb-3">{{ t('product.platformNote') }}</p>
      <dl class="divide-y divide-line/60">
        <div v-for="r in platformRows" :key="r.label" class="grid grid-cols-[7rem_1fr] sm:grid-cols-[9rem_1fr] gap-3 py-2.5 text-sm">
          <dt class="text-muted">{{ r.label }}</dt>
          <dd><div>{{ r.value }}</div><div v-if="r.note" class="text-xs text-muted mt-0.5">{{ r.note }}</div></dd>
        </div>
      </dl>
    </section>

    <section v-if="rivals.length || lineage.prev || lineage.next" class="grid lg:grid-cols-3 gap-4">
      <div v-if="rivals.length" class="card p-5 lg:col-span-2">
        <h2 class="font-bold">{{ t('rel.rivals') }}</h2>
        <p class="text-xs text-muted mt-0.5 mb-3">{{ t('rel.rivalsDesc') }}</p>
        <div class="divide-y divide-line/60">
          <router-link v-for="r in rivals" :key="r.item.id" :to="`/product/${category}/${r.item.id}`" class="flex items-center gap-3 py-2 group text-sm">
            <BrandLogo :brand="r.item.brand" :size="16" />
            <span class="font-medium group-hover:text-accent flex-1 truncate">{{ displayName(r.item) }}</span>
            <span class="text-xs text-muted">{{ r.item.release }}</span>
            <span class="text-xs text-muted">#{{ r.rank }}</span>
            <span class="w-24 h-1.5 rounded-full overflow-hidden" style="background: var(--bar-track)"><span class="block h-full" :style="{ width: (r.rel.overall ?? 0) + '%', background: 'var(--bar-fill)' }" /></span>
            <span class="w-10 text-right font-medium">{{ r.rel.overall?.toFixed(1) }}</span>
            <span class="w-14 text-right text-xs" :class="(r.rel.overall ?? 0) >= (row!.rel.overall ?? 0) ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'">{{ ((r.rel.overall ?? 0) - (row!.rel.overall ?? 0) >= 0 ? '+' : '') + ((r.rel.overall ?? 0) - (row!.rel.overall ?? 0)).toFixed(1) }}</span>
          </router-link>
        </div>
      </div>
      <div v-if="lineage.prev || lineage.next" class="card p-5">
        <h2 class="font-bold mb-3">{{ t('rel.lineage') }}</h2>
        <div class="space-y-3 text-sm">
          <div v-for="[k, x] in [['prev', lineage.prev], ['next', lineage.next]] as const" :key="k">
            <div class="text-[11px] text-muted uppercase tracking-wide">{{ t('rel.' + k) }}</div>
            <router-link v-if="x" :to="`/product/${category}/${x.id}`" class="flex items-center gap-2 mt-1 group">
              <BrandLogo :brand="x.brand" :size="16" /><span class="font-medium group-hover:text-accent flex-1 truncate">{{ displayName(x) }}</span>
              <span class="text-xs text-muted">{{ x.release }}</span><span class="w-10 text-right">{{ rowOf(x.id)?.rel.overall?.toFixed(1) ?? '—' }}</span>
            </router-link>
            <div v-else class="text-muted mt-1">—</div>
          </div>
        </div>
      </div>
    </section>

    <section v-if="similar.length">
      <h2 class="font-bold mb-3">{{ t('product.similar') }}</h2>
      <div class="grid sm:grid-cols-3 gap-3">
        <button v-for="r in similar" :key="r.item.id" class="card card-hover p-4 text-left" @click="router.push(`/product/${category}/${r.item.id}`)">
          <div class="flex items-center gap-2"><BrandLogo :brand="r.item.brand" :size="16" /><span class="font-semibold">{{ displayName(r.item) }}</span></div>
          <div class="text-xs text-muted mt-1">#{{ r.rank }}<span v-if="r.rel.overall != null"> · {{ t('sort.overall') }} {{ r.rel.overall?.toFixed(1) }}</span></div>
          <div class="text-sm text-muted mt-1 line-clamp-2">{{ displaySummary(r.item) }}</div>
        </button>
      </div>
    </section>
  </div>
</template>
