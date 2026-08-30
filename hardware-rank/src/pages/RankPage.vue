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
      <div class="lg:ml-auto">
        <SortTabs v-if="category !== 'psu'" :options="sortOptions" :model-value="effectiveSort" @update:model-value="setSort" />
        <span v-else class="text-xs text-muted">排序：分档 A→D，同档按瓦数降序</span>
      </div>
    </div>

    <FilterBar :category="category" :model-value="filters" :brands="brands" :gens="gens" @update:model-value="update" />

    <RankTable :category="category" :rows="rows" :sort="effectiveSort" :dir="filters.dir" @sort="onHeaderSort" />
  </div>
</template>
