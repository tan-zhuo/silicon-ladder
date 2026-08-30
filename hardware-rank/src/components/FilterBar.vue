<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Category } from '@/types/hardware'
import type { FilterState } from '@/utils/filters'
import { ifaceLabel } from '@/utils/format'
import { useI18n } from '@/i18n'
import { UiInput, UiCheckbox } from '@/components/ui'

const props = defineProps<{ category: Category; modelValue: FilterState; brands: string[]; gens: string[]; years: [number, number] | null }>()
const emit = defineEmits<{ 'update:modelValue': [v: FilterState] }>()
const { t } = useI18n()
const open = ref(false)

function set<K extends keyof FilterState>(k: K, v: FilterState[K]) { emit('update:modelValue', { ...props.modelValue, [k]: v }) }
function toggleBrand(b: string) { const cur = props.modelValue.brand; set('brand', cur.includes(b) ? cur.filter((x) => x !== b) : [...cur, b]) }
function numInput(e: Event): number | null { const v = (e.target as HTMLInputElement).value; return v === '' ? null : Number(v) }
const showTdp = computed(() => props.category === 'cpu' || props.category === 'gpu')
const showTgpTier = computed(() => props.category === 'gpu' && props.modelValue.form === 'laptop')
const ERAS = computed(() => {
  if (!props.years) return []
  const [lo, hi] = props.years
  const out: { label: string; min: number | null; max: number | null }[] = [{ label: t('filter.all'), min: null, max: null }]
  for (let y = Math.floor(hi / 5) * 5; y + 4 >= lo; y -= 5) out.push({ label: y + 4 > hi ? `${y}+` : `${y}–${y + 4}`, min: y, max: y + 4 })
  return out
})
const activeCount = computed(() => {
  const f = props.modelValue
  return f.brand.length + [f.gen, f.tgpTier, f.interface, f.tier].filter(Boolean).length + [f.tdpMin, f.tdpMax, f.wattMin, f.wattMax, f.yearMin, f.yearMax].filter((x) => x !== null).length + (f.atx31 ? 1 : 0)
})
function reset() {
  emit('update:modelValue', { ...props.modelValue, brand: [], gen: '', q: '', tdpMin: null, tdpMax: null, tgpTier: '', interface: '', wattMin: null, wattMax: null, tier: '', atx31: false, yearMin: null, yearMax: null })
}
const IFACES = ['pcie5', 'pcie4', 'pcie3', 'sata', 'sata-hdd']
const chips = computed(() => {
  const f = props.modelValue
  const out: { label: string; clear: () => void }[] = []
  for (const b of f.brand) out.push({ label: b, clear: () => toggleBrand(b) })
  if (f.gen) out.push({ label: f.gen, clear: () => set('gen', '') })
  if (f.yearMin !== null || f.yearMax !== null) out.push({ label: `${t('chips.era')} ${f.yearMin ?? ''}–${f.yearMax ?? ''}`, clear: () => emit('update:modelValue', { ...f, yearMin: null, yearMax: null }) })
  if (f.tdpMin !== null || f.tdpMax !== null) out.push({ label: `${t('chips.tdp')} ${f.tdpMin ?? ''}–${f.tdpMax ?? ''}W`, clear: () => emit('update:modelValue', { ...f, tdpMin: null, tdpMax: null }) })
  if (f.tgpTier) out.push({ label: `TGP ${f.tgpTier}`, clear: () => set('tgpTier', '') })
  if (f.interface) out.push({ label: ifaceLabel(f.interface), clear: () => set('interface', '') })
  if (f.wattMin !== null || f.wattMax !== null) out.push({ label: `${t('chips.watt')} ${f.wattMin ?? ''}–${f.wattMax ?? ''}W`, clear: () => emit('update:modelValue', { ...f, wattMin: null, wattMax: null }) })
  if (f.tier) out.push({ label: `Tier ${f.tier}`, clear: () => set('tier', '') })
  if (f.atx31) out.push({ label: 'ATX 3.1', clear: () => set('atx31', false) })
  if (f.q) out.push({ label: `${t('chips.q')} “${f.q}”`, clear: () => set('q', '') })
  return out
})
</script>

<template>
  <div class="card p-3 sm:p-4">
    <div class="flex items-center gap-2">
      <div class="relative flex-1">
        <svg class="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2" /><path d="M20 20l-3.5-3.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" /></svg>
        <input class="input pl-8" :value="modelValue.q" :placeholder="t('filter.search')" @input="set('q', ($event.target as HTMLInputElement).value)" />
      </div>
      <button class="btn-ghost md:hidden" @click="open = !open">{{ t('filter.filters') }}<span v-if="activeCount" class="ml-1 text-accent">({{ activeCount }})</span></button>
      <button v-if="activeCount || modelValue.q" class="btn-ghost hidden md:inline-flex" @click="reset">{{ t('filter.clear') }}</button>
    </div>

    <div v-if="chips.length" class="mt-3 flex flex-wrap items-center gap-1.5">
      <span class="text-xs text-muted">{{ t('chips.active') }}</span>
      <button v-for="c in chips" :key="c.label" class="pill pill-active !py-0.5 !text-xs inline-flex items-center gap-1" @click="c.clear()">{{ c.label }}<span class="opacity-70">×</span></button>
      <button class="text-xs text-muted hover:text-fg underline underline-offset-2 ml-1" @click="reset">{{ t('chips.clear') }}</button>
    </div>
    <div class="mt-3 flex-col gap-2.5" :class="open ? 'flex' : 'hidden md:flex'">
      <div class="flex flex-wrap items-center gap-1.5">
        <span class="text-xs text-muted min-w-[3rem] pr-1 shrink-0 whitespace-nowrap">{{ t('filter.brand') }}</span>
        <button v-for="b in brands" :key="b" class="pill !h-8 !text-xs" :class="{ 'pill-active': modelValue.brand.includes(b) }" @click="toggleBrand(b)">{{ b }}</button>
      </div>
      <div v-if="gens.length" class="flex flex-wrap items-center gap-1.5">
        <span class="text-xs text-muted min-w-[3rem] pr-1 shrink-0 whitespace-nowrap">{{ t('filter.gen') }}</span>
        <button class="pill !h-8 !text-xs" :class="{ 'pill-active': !modelValue.gen }" @click="set('gen', '')">{{ t('filter.all') }}</button>
        <button v-for="g in gens" :key="g" class="pill !h-8 !text-xs" :class="{ 'pill-active': modelValue.gen === g }" @click="set('gen', g)">{{ g }}</button>
      </div>
      <div v-if="ERAS.length > 2" class="flex flex-wrap items-center gap-1.5">
        <span class="text-xs text-muted min-w-[3rem] pr-1 shrink-0 whitespace-nowrap">{{ t('filter.era') }}</span>
        <button v-for="e in ERAS" :key="e.label" class="pill !h-8 !text-xs" :class="{ 'pill-active': modelValue.yearMin === e.min && modelValue.yearMax === e.max }" @click="emit('update:modelValue', { ...modelValue, yearMin: e.min, yearMax: e.max })">{{ e.label }}</button>
      </div>
      <div v-if="showTdp" class="flex flex-wrap items-center gap-1.5">
        <span class="text-xs text-muted min-w-[3rem] pr-1 shrink-0 whitespace-nowrap">{{ category === 'gpu' ? t('filter.tgp') : t('filter.tdp') }}</span>
        <div class="w-24"><UiInput size="sm" type="number" :placeholder="t('filter.minW')" :model-value="modelValue.tdpMin ?? ''" @change="set('tdpMin', numInput($event))" /></div>
        <span class="text-muted">–</span>
        <div class="w-24"><UiInput size="sm" type="number" :placeholder="t('filter.maxW')" :model-value="modelValue.tdpMax ?? ''" @change="set('tdpMax', numInput($event))" /></div>
        <template v-if="showTgpTier">
          <span class="text-xs text-muted ml-2">{{ t('filter.tgpTier') }}</span>
          <button v-for="tt in [['', t('filter.all')], ['low', '≤80W'], ['mid', '81–120W'], ['high', '≥121W']]" :key="tt[0]" class="pill !h-8 !text-xs" :class="{ 'pill-active': modelValue.tgpTier === tt[0] }" @click="set('tgpTier', tt[0])">{{ tt[1] }}</button>
        </template>
      </div>
      <div v-if="category === 'storage'" class="flex flex-wrap items-center gap-1.5">
        <span class="text-xs text-muted min-w-[3rem] pr-1 shrink-0 whitespace-nowrap">{{ t('filter.interface') }}</span>
        <button class="pill !h-8 !text-xs" :class="{ 'pill-active': !modelValue.interface }" @click="set('interface', '')">{{ t('filter.all') }}</button>
        <button v-for="k in IFACES" :key="k" class="pill !h-8 !text-xs" :class="{ 'pill-active': modelValue.interface === k }" @click="set('interface', k)">{{ ifaceLabel(k) }}</button>
      </div>
      <template v-if="category === 'psu'">
        <div class="flex flex-wrap items-center gap-1.5">
          <span class="text-xs text-muted min-w-[3rem] pr-1 shrink-0 whitespace-nowrap">{{ t('filter.watt') }}</span>
          <div class="w-24"><UiInput size="sm" type="number" :placeholder="t('filter.minW')" :model-value="modelValue.wattMin ?? ''" @change="set('wattMin', numInput($event))" /></div>
          <span class="text-muted">–</span>
          <div class="w-24"><UiInput size="sm" type="number" :placeholder="t('filter.maxW')" :model-value="modelValue.wattMax ?? ''" @change="set('wattMax', numInput($event))" /></div>
        </div>
        <div class="flex flex-wrap items-center gap-1.5">
          <span class="text-xs text-muted min-w-[3rem] pr-1 shrink-0 whitespace-nowrap">{{ t('filter.tier') }}</span>
          <button class="pill !h-8 !text-xs" :class="{ 'pill-active': !modelValue.tier }" @click="set('tier', '')">{{ t('filter.all') }}</button>
          <button v-for="tt in ['A', 'B', 'C', 'D']" :key="tt" class="pill !h-8 !text-xs" :class="{ 'pill-active': modelValue.tier === tt }" @click="set('tier', tt)">{{ tt }}</button>
          <span class="ml-2"><UiCheckbox size="sm" :model-value="modelValue.atx31" :label="t('filter.atx31')" @update:model-value="set('atx31', $event)" /></span>
        </div>
      </template>
      <button v-if="activeCount || modelValue.q" class="btn-ghost md:hidden self-start" @click="reset">{{ t('filter.clearAll') }}</button>
    </div>
  </div>
</template>
