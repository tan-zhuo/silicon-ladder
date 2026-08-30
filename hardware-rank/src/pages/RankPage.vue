<script setup lang="ts">
import { computed, watch, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Category, Cpu, Gpu } from '@/types/hardware'
import { useCatalog } from '@/data/load'
import { SORT_DEFS, FORMS, scorePool, sortRows } from '@/utils/rank'
import { parseQuery, toQuery, applyFilters, uniq, type FilterState } from '@/utils/filters'
import { CATEGORY_LABEL, FORM_LABEL } from '@/utils/format'
import FormTabs from '@/components/FormTabs.vue'
import SortTabs from '@/components/SortTabs.vue'
import FilterBar from '@/components/FilterBar.vue'
import RankTable from '@/components/RankTable.vue'
import LadderView from '@/components/LadderView.vue'

const route = useRoute()
const router = useRouter()
const catalog = useCatalog()

const category = computed(() => route.params.category as Category)
const defaults = computed(() => ({
  form: FORMS[category.value][0].key,
  sort: SORT_DEFS[category.value][0].key,
}))

const filters = ref<FilterState>(parseQuery(route.query, defaults.value))
watch(() => [route.query, route.params.category], () => {
  filters.value = parseQuery(route.query, defaults.value)
}, { deep: true })

function update(f: FilterState) {
  filters.value = f
  router.replace({ query: toQuery(f, defaults.value) })
}
function setForm(v: string) {
  update({ ...filters.value, form: v, gen: '', tgpTier: '', brand: [] })
}
function setSort(v: string) {
  update({ ...filters.value, sort: v, dir: 'desc' })
}
function onHeaderSort(key: string) {
  if (filters.value.sort === key) update({ ...filters.value, dir: filters.value.dir === 'desc' ? 'asc' : 'desc' })
  else setSort(key)
}

const all = computed(() => catalog.byCategory(category.value))
const poolItems = computed(() => all.value.filter((i) => i.form === filters.value.form))
const brands = computed(() => uniq(poolItems.value.map((i) => i.brand)).sort())
const gens = computed(() => {
  if (category.value === 'cpu') return uniq(poolItems.value.map((i) => (i as Cpu).gen)).sort()
  if (category.value === 'gpu') return uniq(poolItems.value.map((i) => (i as Gpu).gen)).sort()
  return []
})

/** 先在完整池内打分（保证相对分稳定），再按筛选取子集 */
const scored = computed(() => scorePool(category.value, poolItems.value))
const hasPrice = computed(() => poolItems.value.some((i) => i.price_cny))
const hasIgpu = computed(() => category.value !== 'cpu' || poolItems.value.some((i) => (i as Cpu).scores.igpu_rel !== null))
const sortOptions = computed(() =>
  SORT_DEFS[category.value].filter((s) => {
    if (s.key === 'value' && !hasPrice.value) return false
    if (s.key === 'igpu' && !hasIgpu.value) return false
    if (category.value === 'ram' && filters.value.form === 'onboard' && s.key === 'overall') return false
    return true
  }),
)
const effectiveSort = computed(() => (sortOptions.value.some((s) => s.key === filters.value.sort) ? filters.value.sort : sortOptions.value[0].key))

const rows = computed(() => {
  const allowed = new Set(applyFilters(category.value, poolItems.value, filters.value).map((i) => i.id))
  const subset = scored.value.filter((r) => allowed.has(r.item.id))
  return sortRows(category.value, subset, effectiveSort.value, filters.value.dir)
})

const canLadder = computed(() => category.value === 'cpu' || category.value === 'gpu')
const view = computed<'list' | 'ladder'>(() => (canLadder.value && route.query.view === 'ladder' ? 'ladder' : 'list'))
function setView(v: 'list' | 'ladder') {
  const q = { ...route.query }
  if (v === 'ladder') q.view = 'ladder'
  else delete q.view
  router.replace({ query: q })
}
const sortLabel = computed(() => sortOptions.value.find((s) => s.key === effectiveSort.value)?.label ?? '')

const title = computed(() => `${FORM_LABEL[filters.value.form] ?? ''} ${CATEGORY_LABEL[category.value]} 排行榜`)
const isLaptop = computed(() => filters.value.form === 'laptop' && (category.value === 'cpu' || category.value === 'gpu'))
</script>

<template>
  <div class="space-y-4">
    <div>
      <h1 class="text-2xl font-semibold">{{ title }}</h1>
      <p class="text-sm text-muted mt-1">共 {{ rows.length }} 项 · 相对分在同形态池内归一，池内最高为 100</p>
    </div>

    <div v-if="category === 'psu'" class="notice-info">本榜按电气品质与规格分档，不是功率输出跑分。80Plus 认证不等于用料一流。</div>
    <div v-if="isLaptop" class="notice-warn">笔记本与桌面分数按形态分池，不可直接比较。同名 GPU 会因 TGP 不同出现 20–40% 差距。</div>
    <div v-if="category === 'ram' && filters.form === 'onboard'" class="notice-info">板载 LPDDR 不可更换，此处仅展示带宽与规格，不计算综合分。</div>

    <div class="flex flex-col lg:flex-row lg:items-center gap-3">
      <FormTabs :options="FORMS[category]" :model-value="filters.form" @update:model-value="setForm" />
      <div class="lg:ml-auto flex flex-wrap items-center gap-3">
        <div v-if="canLadder" class="inline-flex bg-card border border-line rounded-full p-0.5 text-sm">
          <button class="px-3 py-1 rounded-full transition-colors" :class="view === 'list' ? 'bg-line text-fg' : 'text-muted hover:text-fg'" @click="setView('list')">列表</button>
          <button class="px-3 py-1 rounded-full transition-colors" :class="view === 'ladder' ? 'bg-line text-fg' : 'text-muted hover:text-fg'" @click="setView('ladder')">天梯图</button>
        </div>
        <SortTabs v-if="category !== 'psu'" :options="sortOptions" :model-value="effectiveSort" @update:model-value="setSort" />
        <span v-else class="text-xs text-muted">排序：分档 A→D，同档按瓦数降序</span>
      </div>
    </div>

    <FilterBar :category="category" :model-value="filters" :brands="brands" :gens="gens" @update:model-value="update" />

    <div v-if="view === 'ladder'" class="text-xs text-muted -mt-1">天梯图按「{{ sortLabel }}」相对分分带（每 5 分一档），品牌并列，同一档内按排名先后。切换排序可换维度。</div>
    <LadderView v-if="view === 'ladder'" :category="category" :rows="rows" :sort="effectiveSort" :sort-label="sortLabel" />
    <RankTable v-else :category="category" :rows="rows" :sort="effectiveSort" :dir="filters.dir" @sort="onHeaderSort" />
  </div>
</template>
