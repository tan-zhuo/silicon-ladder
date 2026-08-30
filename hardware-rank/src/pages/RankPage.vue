<script setup lang="ts">
import { computed, watch, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Category, Cpu, Gpu } from '@/types/hardware'
import { useCatalog } from '@/data/load'
import { SORT_DEFS, FORMS, scorePool, sortRows } from '@/utils/rank'
import { parseQuery, toQuery, applyFilters, uniq, type FilterState } from '@/utils/filters'
import { catLabel, formLabel, yearOf } from '@/utils/format'
import { useI18n } from '@/i18n'
import FormTabs from '@/components/FormTabs.vue'
import SortTabs from '@/components/SortTabs.vue'
import FilterBar from '@/components/FilterBar.vue'
import RankTable from '@/components/RankTable.vue'
import LadderView from '@/components/LadderView.vue'

const route = useRoute()
const router = useRouter()
const catalog = useCatalog()
const { t } = useI18n()

const category = computed(() => route.params.category as Category)
const defaults = computed(() => ({ form: FORMS[category.value][0].key, sort: SORT_DEFS[category.value][0].key }))
const filters = ref<FilterState>(parseQuery(route.query, defaults.value))
watch(() => [route.query, route.params.category], () => { filters.value = parseQuery(route.query, defaults.value) }, { deep: true })

function update(f: FilterState) { filters.value = f; router.replace({ query: { ...toQuery(f, defaults.value), ...(route.query.view ? { view: route.query.view } : {}) } }) }
function setForm(v: string) { update({ ...filters.value, form: v, gen: '', tgpTier: '', brand: [] }) }
function setSort(v: string) { update({ ...filters.value, sort: v, dir: 'desc' }) }
function onHeaderSort(key: string) { if (filters.value.sort === key) update({ ...filters.value, dir: filters.value.dir === 'desc' ? 'asc' : 'desc' }); else setSort(key) }

const all = computed(() => catalog.byCategory(category.value))
const formCounts = computed(() => Object.fromEntries(FORMS[category.value].map((f) => [f.key, all.value.filter((i) => i.form === f.key).length])))
const poolItems = computed(() => all.value.filter((i) => i.form === filters.value.form))
const brands = computed(() => uniq(poolItems.value.map((i) => i.brand)).sort())
const gens = computed(() => {
  if (category.value === 'cpu') return uniq(poolItems.value.map((i) => (i as Cpu).gen)).sort()
  if (category.value === 'gpu') return uniq(poolItems.value.map((i) => (i as Gpu).gen)).sort()
  return []
})
const years = computed<[number, number] | null>(() => {
  if (!poolItems.value.length) return null
  const ys = poolItems.value.map((i) => yearOf(i.release))
  return [Math.min(...ys), Math.max(...ys)]
})

const scored = computed(() => scorePool(category.value, poolItems.value))
const hasPrice = computed(() => poolItems.value.some((i) => i.price_cny))
const hasIgpu = computed(() => category.value !== 'cpu' || poolItems.value.some((i) => (i as Cpu).scores.igpu_rel !== null))
const sortOptions = computed(() => SORT_DEFS[category.value].filter((s) => {
  if (s.key === 'value' && !hasPrice.value) return false
  if (s.key === 'igpu' && !hasIgpu.value) return false
  if (category.value === 'ram' && filters.value.form === 'onboard' && s.key === 'overall') return false
  return true
}))
const effectiveSort = computed(() => (sortOptions.value.some((s) => s.key === filters.value.sort) ? filters.value.sort : sortOptions.value[0].key))
const rows = computed(() => {
  const allowed = new Set(applyFilters(category.value, poolItems.value, filters.value).map((i) => i.id))
  return sortRows(category.value, scored.value.filter((r) => allowed.has(r.item.id)), effectiveSort.value, filters.value.dir)
})

const canLadder = computed(() => category.value === 'cpu' || category.value === 'gpu')
const view = computed<'list' | 'ladder'>(() => (canLadder.value && route.query.view === 'ladder' ? 'ladder' : 'list'))
function setView(v: 'list' | 'ladder') { const q = { ...route.query }; if (v === 'ladder') q.view = 'ladder'; else delete q.view; router.replace({ query: q }) }
const sortLabel = computed(() => t('sort.' + effectiveSort.value))
const title = computed(() => t('rank.title', { form: formLabel(filters.value.form), cat: catLabel(category.value) }))
const isLaptop = computed(() => filters.value.form === 'laptop' && (category.value === 'cpu' || category.value === 'gpu'))
const hasEst = computed(() => rows.value.some((r) => r.item.est))
</script>

<template>
  <div class="space-y-4">
    <div class="flex flex-wrap items-end justify-between gap-3">
      <div>
        <div class="kicker">{{ catLabel(category) }}</div>
        <h1 class="text-2xl sm:text-3xl font-bold tracking-tight mt-1">{{ title }}</h1>
        <p class="text-sm text-muted mt-1">{{ t('rank.count', { n: rows.length }) }}</p>
      </div>
      <div v-if="canLadder" class="seg">
        <button class="seg-btn" :class="{ 'seg-active': view === 'list' }" @click="setView('list')">{{ t('rank.list') }}</button>
        <button class="seg-btn" :class="{ 'seg-active': view === 'ladder' }" @click="setView('ladder')">{{ t('rank.ladder') }}</button>
      </div>
    </div>

    <div v-if="category === 'psu'" class="notice-info">{{ t('rank.psuNote') }}</div>
    <div v-if="isLaptop" class="notice-warn">{{ t('rank.laptopWarn') }}</div>
    <div v-if="category === 'ram' && filters.form === 'onboard'" class="notice-info">{{ t('rank.onboardNote') }}</div>

    <div class="flex flex-col lg:flex-row lg:items-center gap-3">
      <FormTabs :options="FORMS[category]" :model-value="filters.form" :counts="formCounts" @update:model-value="setForm" />
      <div class="lg:ml-auto">
        <SortTabs v-if="category !== 'psu'" :options="sortOptions" :model-value="effectiveSort" @update:model-value="setSort" />
        <span v-else class="text-xs text-muted">{{ t('rank.psuSort') }}</span>
      </div>
    </div>

    <FilterBar :category="category" :model-value="filters" :brands="brands" :gens="gens" :years="years" @update:model-value="update" />

    <p v-if="view === 'ladder'" class="text-xs text-muted">{{ t('rank.ladderNote', { sort: sortLabel }) }}<span v-if="hasEst"> {{ t('rank.estNote') }}</span></p>
    <p v-else-if="hasEst" class="text-xs text-muted">{{ t('rank.estNote') }}</p>
    <LadderView v-if="view === 'ladder'" :category="category" :rows="rows" :sort="effectiveSort" />
    <RankTable v-else :category="category" :rows="rows" :sort="effectiveSort" :dir="filters.dir" @sort="onHeaderSort" />
  </div>
</template>
