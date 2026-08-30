<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Category, RankedRow } from '@/types/hardware'
import { formBadge } from '@/utils/columns'
import { brandColor, rel as fmtRel } from '@/utils/format'
import { useCompare } from '@/stores/compare'
import BrandLogo from '@/components/BrandLogo.vue'

const props = defineProps<{
  category: Category
  rows: RankedRow[]
  sort: string
  sortLabel: string
}>()

const router = useRouter()
const compare = useCompare()
const STEP = 5

/** 列顺序：CPU 固定 AMD / Intel 在前，GPU 固定 NVIDIA / AMD 在前，其余按出现顺序追加 */
const brands = computed(() => {
  const pref = props.category === 'gpu' ? ['NVIDIA', 'AMD', 'Intel', 'Apple'] : ['AMD', 'Intel', 'Apple', 'Qualcomm']
  const present = new Set(props.rows.map((r) => r.item.brand))
  return [...pref.filter((b) => present.has(b)), ...[...present].filter((b) => !pref.includes(b))]
})

const scored = computed(() => props.rows.filter((r) => r.rel[props.sort] != null))
const unscored = computed(() => props.rows.filter((r) => r.rel[props.sort] == null))

const bands = computed(() => {
  if (!scored.value.length) return []
  const min = Math.min(...scored.value.map((r) => r.rel[props.sort] as number))
  const floor = Math.max(0, Math.floor(min / STEP) * STEP)
  const out: { hi: number; lo: number; cells: Record<string, RankedRow[]>; count: number }[] = []
  for (let hi = 100; hi > floor; hi -= STEP) {
    const lo = hi - STEP
    const cells: Record<string, RankedRow[]> = {}
    let count = 0
    for (const b of brands.value) cells[b] = []
    for (const r of scored.value) {
      const v = r.rel[props.sort] as number
      if (v <= hi && v > lo || (hi === 100 && v >= 100)) { cells[r.item.brand].push(r); count++ }
    }
    out.push({ hi, lo, cells, count })
  }
  return out
})
</script>

<template>
  <div class="card overflow-x-auto">
    <div class="min-w-[560px]">
      <!-- 表头 -->
      <div class="grid border-b border-line bg-bg/40" :style="{ gridTemplateColumns: `72px repeat(${brands.length}, minmax(0, 1fr))` }">
        <div class="px-3 py-3 text-xs text-muted">{{ sortLabel }}分</div>
        <div v-for="b in brands" :key="b" class="px-3 py-3 flex items-center gap-2 font-semibold border-l border-line/60">
          <BrandLogo :brand="b" :size="26" />
          <span>{{ b }}</span>
          <span class="text-xs text-muted font-normal">{{ rows.filter(r => r.item.brand === b).length }}</span>
        </div>
      </div>

      <!-- 分数带 -->
      <div
        v-for="band in bands" :key="band.hi"
        class="grid border-b border-line/50 last:border-0"
        :class="band.count ? '' : 'h-2.5'"
        :style="{ gridTemplateColumns: `72px repeat(${brands.length}, minmax(0, 1fr))` }"
      >
        <div class="px-3 py-2 text-xs text-muted flex items-start" :class="band.count ? '' : 'py-0'">
          <span v-if="band.count">{{ band.hi }}<span class="text-muted/50">–{{ band.lo }}</span></span>
        </div>
        <div v-for="b in brands" :key="b" class="border-l border-line/60 px-2 flex flex-col gap-1.5" :class="band.count ? 'py-2' : ''">
          <div
            v-for="r in band.cells[b]" :key="r.item.id"
            class="group flex items-center gap-2 rounded-lg border border-line bg-bg/60 px-2.5 py-1.5 hover:border-accent/70 cursor-pointer transition-colors"
            :style="{ borderLeftColor: brandColor(b), borderLeftWidth: '3px' }"
            @click="router.push(`/product/${category}/${r.item.id}`)"
          >
            <span class="w-5 text-xs text-muted text-right shrink-0">{{ r.rank }}</span>
            <span class="font-medium text-sm truncate">{{ r.item.name }}</span>
            <span v-if="formBadge(category, r)" class="hidden xl:inline text-[10px] px-1 py-0.5 rounded bg-line text-muted whitespace-nowrap">{{ formBadge(category, r) }}</span>
            <span class="ml-auto text-sm font-semibold shrink-0">{{ fmtRel(r.rel[sort]) }}</span>
            <input
              type="checkbox" class="accent-accent w-3.5 h-3.5 shrink-0 opacity-60 group-hover:opacity-100" title="加入对比"
              :checked="compare.has(category, r.item.id)" @click.stop @change="compare.toggle(category, r.item.id)"
            />
          </div>
        </div>
      </div>

      <div v-if="unscored.length" class="px-3 py-2 text-xs text-muted border-t border-line">
        无「{{ sortLabel }}」分数、未列入天梯：{{ unscored.map(r => r.item.name).join('、') }}
      </div>
      <div v-if="!scored.length" class="p-10 text-center text-muted">没有符合筛选的产品</div>
    </div>
  </div>
</template>
