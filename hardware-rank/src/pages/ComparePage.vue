<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import type { Category, AnyItem, Cpu, Gpu, Ram, Storage, Psu, RankedRow } from '@/types/hardware'
import { useCatalog } from '@/data/load'
import { useCompare } from '@/stores/compare'
import { scoreAllPools, SORT_DEFS } from '@/utils/rank'
import { catLabel, formLabel, ifaceLabel, modularLabel, price, num, iops, bool, capacity, vram, DASH, rel as fmtRel } from '@/utils/format'
import BrandLogo from '@/components/BrandLogo.vue'
import { useI18n, displayName } from '@/i18n'
import { useSeo } from '@/seo'

const route = useRoute()
const catalog = useCatalog()
const compare = useCompare()
const { t } = useI18n()
const CATS: Category[] = ['cpu', 'gpu', 'ram', 'storage', 'psu']

const parsed = computed<{ cat: Category | null; ids: string[] }>(() => {
  const raw = String(route.query.ids ?? '')
  if (raw) {
    const pairs = raw.split(',').map((s) => s.split(':')).filter((p) => p.length === 2)
    const cat = pairs[0]?.[0] as Category | undefined
    if (cat && CATS.includes(cat)) return { cat, ids: pairs.filter((p) => p[0] === cat).map((p) => p[1]).slice(0, 4) }
  }
  return { cat: compare.category, ids: compare.ids.slice(0, 4) }
})
onMounted(() => {
  if (parsed.value.cat && parsed.value.ids.length && route.query.ids) {
    compare.category = parsed.value.cat
    compare.ids = parsed.value.ids.filter((id) => catalog.find(parsed.value.cat!, id))
  }
})
const cat = computed(() => parsed.value.cat)
const items = computed<AnyItem[]>(() => (cat.value ? parsed.value.ids.map((id) => catalog.find(cat.value!, id)).filter((x): x is AnyItem => !!x) : []))
const scoreMap = computed(() => (cat.value ? scoreAllPools(cat.value, catalog.byCategory(cat.value)) : new Map<string, RankedRow>()))
const rows = computed(() => items.value.map((i) => scoreMap.value.get(i.id)!).filter(Boolean))
const mixedForm = computed(() => new Set(items.value.map((i) => i.form)).size > 1)

type SpecRow = { label: string; values: string[] }
const specRows = computed<SpecRow[]>(() => {
  const its = items.value
  if (!cat.value || !its.length) return []
  const L = (k: string) => t('spec.' + k)
  const mk = (label: string, f: (i: AnyItem) => string): SpecRow => ({ label, values: its.map(f) })
  const common = [mk(L('brand'), (i) => i.brand), mk(L('form'), (i) => formLabel(i.form)), mk(L('release'), (i) => i.release), mk(L('price'), (i) => price(i.price_cny))]
  switch (cat.value) {
    case 'cpu': return [...common, mk(L('cores'), (i) => (i as Cpu).cores), mk(L('clocks'), (i) => (i as Cpu).clocks), mk(L('tdp'), (i) => `${(i as Cpu).tdp_w}W`), mk(L('socket'), (i) => (i as Cpu).socket), mk(L('igpu'), (i) => (i as Cpu).igpu ?? DASH), mk(L('l3'), (i) => (i as Cpu).cache_l3), mk(L('mem'), (i) => (i as Cpu).mem)]
    case 'gpu': return [...common, mk(L('chip'), (i) => (i as Gpu).chip), mk(L('vram'), (i) => `${vram((i as Gpu).vram_gb)} ${(i as Gpu).vram_type}`), mk(L('bus'), (i) => `${(i as Gpu).bus_bit}-bit`), mk(L('tgp'), (i) => `${(i as Gpu).tgp_w ?? (i as Gpu).tdp_w}W`)]
    case 'ram': return [...common, mk(L('spec'), (i) => (i as Ram).spec), mk(L('capacity'), (i) => `${(i as Ram).capacity_gb}GB`), mk(L('speed'), (i) => `${(i as Ram).speed_mt} MT/s`), mk(L('cl'), (i) => (i as Ram).cl == null ? DASH : String((i as Ram).cl))]
    case 'storage': return [...common, mk(L('interface'), (i) => ifaceLabel((i as Storage).interface)), mk(L('capacity'), (i) => capacity((i as Storage).capacity_gb)), mk(L('dram'), (i) => bool((i as Storage).dram)), mk(L('seqRead'), (i) => `${num((i as Storage).seq_read)} MB/s`), mk(L('seqWrite'), (i) => `${num((i as Storage).seq_write)} MB/s`), mk(L('r4k'), (i) => iops((i as Storage).iops_4k_read)), mk(L('cacheOut'), (i) => (i as Storage).write_cache_out == null ? DASH : `${num((i as Storage).write_cache_out)} MB/s`), mk(L('tbw'), (i) => (i as Storage).tbw == null ? DASH : `${(i as Storage).tbw} TB`)]
    case 'psu': return [...common, mk(L('watt'), (i) => `${(i as Psu).watt}W`), mk(L('tier'), (i) => (i as Psu).tier), mk(L('eff'), (i) => (i as Psu).efficiency), mk(L('atx31'), (i) => bool((i as Psu).atx31)), mk(L('modular'), (i) => modularLabel((i as Psu).modular)), mk(L('oem'), (i) => (i as Psu).oem)]
  }
})
const scoreKeys = computed(() => (cat.value && cat.value !== 'psu' ? SORT_DEFS[cat.value].filter((s) => s.key !== 'value') : []))
const best = (key: string) => Math.max(...rows.value.map((r) => r.rel[key] ?? -1))

useSeo(() => ({
  title: items.value.length >= 2 ? `${items.value.map((i) => displayName(i)).join(' vs ')} · ${t('compare.title')}` : t('compare.title'),
  description: items.value.length >= 2 ? `${items.value.map((i) => displayName(i)).join(' vs ')} — ${t('compare.scores')}` : t('home.cards.compare'),
  path: '/compare',
}))
</script>

<template>
  <div class="space-y-4">
    <div>
      <div class="kicker">{{ t('nav.compare') }}</div>
      <h1 class="text-2xl sm:text-3xl font-bold tracking-tight mt-1">{{ t('compare.title') }}{{ cat ? ` · ${catLabel(cat)}` : '' }}</h1>
    </div>

    <div v-if="items.length < 2" class="card p-12 text-center text-muted">
      {{ t('compare.needTwo') }} <router-link :to="cat ? `/rank/${cat}` : '/rank/cpu'" class="text-accent underline underline-offset-4">{{ t('compare.goRank') }}</router-link> {{ t('compare.pick') }}
    </div>

    <template v-else>
      <div v-if="mixedForm" class="notice-warn">{{ t('compare.mixed') }}</div>
      <div class="card overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-line bg-card2">
              <th class="text-left px-4 py-3 text-xs text-muted w-36">{{ t('compare.metric') }}</th>
              <th v-for="it in items" :key="it.id" class="text-left px-4 py-3 min-w-[170px]">
                <div class="flex items-center gap-2"><BrandLogo :brand="it.brand" :size="18" /><router-link :to="`/product/${cat}/${it.id}`" class="font-semibold hover:text-accent">{{ displayName(it) }}</router-link></div>
                <div class="text-[11px] text-muted font-normal mt-0.5">{{ formLabel(it.form) }} <button class="ml-1 hover:text-fg underline" @click="compare.remove(it.id)">{{ t('compare.remove') }}</button></div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr><td :colspan="items.length + 1" class="px-4 pt-3 pb-1 kicker">{{ t('compare.specs') }}</td></tr>
            <tr v-for="r in specRows" :key="r.label" class="border-b border-line/50">
              <td class="px-4 py-2.5 text-muted">{{ r.label }}</td>
              <td v-for="(v, i) in r.values" :key="i" class="px-4 py-2.5 font-medium">{{ v }}</td>
            </tr>
            <template v-if="scoreKeys.length">
              <tr><td :colspan="items.length + 1" class="px-4 pt-4 pb-1 kicker">{{ t('compare.scores') }}</td></tr>
              <tr v-for="s in scoreKeys" :key="s.key" class="border-b border-line/50 last:border-0">
                <td class="px-4 py-3 text-muted">{{ t('sort.' + s.key) }}</td>
                <td v-for="row in rows" :key="row.item.id" class="px-4 py-3">
                  <div class="flex items-center gap-2">
                    <div class="flex-1 h-2.5 rounded-full overflow-hidden" style="background: var(--bar-track)">
                      <div v-if="row.rel[s.key] != null" class="h-full rounded-full" :style="{ width: Math.min(100, row.rel[s.key] as number) + '%', background: row.rel[s.key] === best(s.key) ? 'var(--bar-fill)' : 'var(--bar-fill-dim)' }" />
                    </div>
                    <span class="w-12 text-right font-medium" :class="row.rel[s.key] === best(s.key) ? 'text-accent' : ''">{{ s.key === 'latency' && row.raw.latency != null ? row.raw.latency + 'ns' : fmtRel(row.rel[s.key]) }}</span>
                  </div>
                </td>
              </tr>
            </template>
            <tr v-else><td :colspan="items.length + 1" class="px-4 py-4 text-xs text-muted">{{ t('compare.psuNoScore') }}</td></tr>
          </tbody>
        </table>
      </div>
      <div class="flex gap-2">
        <router-link :to="`/rank/${cat}`" class="btn-ghost">{{ t('compare.addMore') }}</router-link>
        <button class="btn-ghost" @click="compare.clear()">{{ t('compare.clear') }}</button>
      </div>
    </template>
  </div>
</template>
