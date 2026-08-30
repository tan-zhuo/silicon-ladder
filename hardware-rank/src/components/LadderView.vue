<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Category, RankedRow } from '@/types/hardware'
import { formBadge } from '@/utils/columns'
import { brandColor, rel as fmtRel, yearOf } from '@/utils/format'
import { useCompare } from '@/stores/compare'
import { UiCheckbox } from '@/components/ui'
import BrandLogo from '@/components/BrandLogo.vue'
import { useI18n, displayName } from '@/i18n'

const props = defineProps<{ category: Category; rows: RankedRow[]; sort: string }>()
const router = useRouter()
const compare = useCompare()
const { t } = useI18n()
const sortLabel = computed(() => t('sort.' + props.sort))

const brands = computed(() => {
  const pref = props.category === 'gpu' ? ['NVIDIA', 'AMD', 'Intel', 'Apple', 'Qualcomm'] : ['AMD', 'Intel', 'Apple', 'Qualcomm']
  const present = new Set(props.rows.map((r) => r.item.brand))
  return [...pref.filter((b) => present.has(b)), ...[...present].filter((b) => !pref.includes(b))]
})
/** 两品牌：左右对照（镜像）；多品牌：多列 */
const mirror = computed(() => brands.value.length === 2)
const scored = computed(() => props.rows.filter((r) => r.rel[props.sort] != null))
const unscored = computed(() => props.rows.filter((r) => r.rel[props.sort] == null))
const topScore = computed(() => Math.max(0, ...scored.value.map((r) => r.rel[props.sort] as number)))
const STEP = 10

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
      if ((v <= hi && v > lo) || (hi === 100 && v >= 100)) { cells[r.item.brand].push(r); count++ }
    }
    out.push({ hi, lo, cells, count })
  }
  return out
})
const score = (r: RankedRow) => r.rel[props.sort] as number
const gap = (r: RankedRow) => topScore.value > 0 ? Math.round((score(r) / topScore.value - 1) * 100) : 0
function go(r: RankedRow) { router.push(`/product/${props.category}/${r.item.id}`) }
const gridCols = computed(() => mirror.value ? '1fr 64px 1fr' : `56px repeat(${brands.value.length}, minmax(0, 1fr))`)
</script>

<template>
  <div class="card overflow-hidden">
    <!-- 移动端：单列紧凑天梯 -->
    <div class="md:hidden">
      <div v-for="(band, bi) in bands" :key="'m' + band.hi" class="border-b border-line/60 last:border-0" :class="band.count ? 'px-3 py-2' : 'h-2'" :style="{ background: `rgb(var(--c-accent) / ${(0.06 * (1 - bi / bands.length)).toFixed(3)})` }">
        <div v-if="band.count" class="text-[11px] text-muted mb-1.5"><b class="text-fg">{{ band.hi }}</b> – {{ band.lo }}</div>
        <div class="space-y-1.5">
          <div v-for="r in brands.flatMap(b => band.cells[b]).sort((a, b) => a.rank - b.rank)" :key="r.item.id" class="flex items-center gap-2" @click="go(r)">
            <span class="text-[11px] text-muted w-7">#{{ r.rank }}</span>
            <BrandLogo :brand="r.item.brand" :size="14" />
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-1.5 text-sm"><span class="font-semibold truncate">{{ displayName(r.item) }}</span><span v-if="formBadge(category, r)" class="badge !py-0">{{ formBadge(category, r) }}</span></div>
              <div class="h-2 rounded-full overflow-hidden mt-1" style="background: var(--bar-track)"><div class="h-full rounded-full" :style="{ width: score(r) + '%', background: brandColor(r.item.brand) }" /></div>
            </div>
            <span class="text-sm font-bold w-10 text-right">{{ fmtRel(score(r)) }}</span>
            <UiCheckbox size="sm" :model-value="compare.has(category, r.item.id)" :aria-label="t('col.compare')" @update:model-value="compare.toggle(category, r.item.id)" />
          </div>
        </div>
      </div>
    </div>
    <div class="overflow-x-auto hidden md:block">
      <div class="min-w-[640px]">
        <!-- 品牌表头 -->
        <div class="grid border-b border-line bg-card2" :style="{ gridTemplateColumns: gridCols }">
          <template v-if="mirror">
            <div class="px-4 py-3 flex items-center justify-end gap-2.5 font-semibold">
              <span class="text-xs text-muted font-normal">{{ t('ladder.items', { n: rows.filter(r => r.item.brand === brands[0]).length }) }}</span>
              <span class="text-lg">{{ brands[0] }}</span><BrandLogo :brand="brands[0]" :size="28" />
            </div>
            <div class="py-3 text-center text-[11px] uppercase tracking-wider text-muted">{{ sortLabel }}</div>
            <div class="px-4 py-3 flex items-center gap-2.5 font-semibold">
              <BrandLogo :brand="brands[1]" :size="28" /><span class="text-lg">{{ brands[1] }}</span>
              <span class="text-xs text-muted font-normal">{{ t('ladder.items', { n: rows.filter(r => r.item.brand === brands[1]).length }) }}</span>
            </div>
          </template>
          <template v-else>
            <div class="px-3 py-3 text-[11px] uppercase tracking-wider text-muted">{{ sortLabel }}</div>
            <div v-for="b in brands" :key="b" class="px-3 py-3 flex items-center gap-2 font-semibold border-l border-line/60">
              <BrandLogo :brand="b" :size="24" /><span>{{ b }}</span>
              <span class="text-xs text-muted font-normal">{{ rows.filter(r => r.item.brand === b).length }}</span>
            </div>
          </template>
        </div>

        <!-- 分数带 -->
        <div
          v-for="(band, bi) in bands" :key="band.hi"
          class="grid border-b border-line/60 last:border-0 relative"
          :class="band.count ? '' : 'h-3'"
          :style="{ gridTemplateColumns: gridCols, background: `linear-gradient(90deg, rgb(var(--c-accent) / ${(0.07 * (1 - bi / bands.length)).toFixed(3)}), transparent 30%, transparent 70%, rgb(var(--c-accent) / ${(0.07 * (1 - bi / bands.length)).toFixed(3)}))` }"
        >
          <template v-if="mirror">
            <!-- 左列：条形向左生长 -->
            <div class="flex flex-col gap-1.5 items-end" :class="band.count ? 'py-2 pl-4 pr-2' : ''">
              <div
                v-for="r in band.cells[brands[0]]" :key="r.item.id"
                class="ladder-item group w-full flex items-center justify-end" tabindex="0" @click="go(r)" @keydown.enter="go(r)"
              >
                <div class="flex items-center gap-2 pr-2 shrink-0">
                  <UiCheckbox size="sm" :model-value="compare.has(category, r.item.id)" :aria-label="t('col.compare')" @update:model-value="compare.toggle(category, r.item.id)" />
                  <span v-if="r.item.est" class="badge !py-0">{{ t('product.est') }}</span>
                  <span v-if="formBadge(category, r)" class="badge !py-0">{{ formBadge(category, r) }}</span>
                  <span class="text-[11px] text-muted">{{ yearOf(r.item.release) }}</span>
                  <span class="text-sm font-semibold whitespace-nowrap group-hover:text-accent">{{ displayName(r.item) }}</span>
                  <span class="text-[11px] text-muted w-8 text-right">#{{ r.rank }}</span>
                </div>
                <div class="relative h-7 flex items-center justify-end rounded-l-md" :style="{ width: score(r) + '%', minWidth: '52px', background: `linear-gradient(270deg, ${brandColor(brands[0])}, ${brandColor(brands[0])}88)` }">
                  <span class="text-white text-xs font-bold pr-2 drop-shadow">{{ fmtRel(score(r)) }}</span>
                </div>
              </div>
            </div>
            <!-- 中轴 -->
            <div class="flex flex-col items-center justify-center text-center border-x border-line/60 bg-card2/70">
              <template v-if="band.count">
                <span class="text-sm font-bold">{{ band.hi }}</span>
                <span class="text-[10px] text-muted">{{ band.lo }}</span>
              </template>
            </div>
            <!-- 右列：条形向右生长 -->
            <div class="flex flex-col gap-1.5" :class="band.count ? 'py-2 pr-4 pl-2' : ''">
              <div v-for="r in band.cells[brands[1]]" :key="r.item.id" class="ladder-item group w-full flex items-center" tabindex="0" @click="go(r)" @keydown.enter="go(r)">
                <div class="relative h-7 flex items-center rounded-r-md" :style="{ width: score(r) + '%', minWidth: '52px', background: `linear-gradient(90deg, ${brandColor(brands[1])}, ${brandColor(brands[1])}88)` }">
                  <span class="text-white text-xs font-bold pl-2 drop-shadow">{{ fmtRel(score(r)) }}</span>
                </div>
                <div class="flex items-center gap-2 pl-2 shrink-0">
                  <span class="text-[11px] text-muted w-8">#{{ r.rank }}</span>
                  <span class="text-sm font-semibold whitespace-nowrap group-hover:text-accent">{{ displayName(r.item) }}</span>
                  <span class="text-[11px] text-muted">{{ yearOf(r.item.release) }}</span>
                  <span v-if="formBadge(category, r)" class="badge !py-0">{{ formBadge(category, r) }}</span>
                  <span v-if="r.item.est" class="badge !py-0">{{ t('product.est') }}</span>
                  <UiCheckbox size="sm" :model-value="compare.has(category, r.item.id)" :aria-label="t('col.compare')" @update:model-value="compare.toggle(category, r.item.id)" />
                </div>
              </div>
            </div>
          </template>

          <template v-else>
            <div class="px-3 text-xs text-muted flex items-start" :class="band.count ? 'py-2' : ''">
              <span v-if="band.count"><b class="text-fg">{{ band.hi }}</b><br />{{ band.lo }}</span>
            </div>
            <div v-for="b in brands" :key="b" class="border-l border-line/60 px-2 flex flex-col gap-1.5" :class="band.count ? 'py-2' : ''">
              <div v-for="r in band.cells[b]" :key="r.item.id" class="ladder-item group" tabindex="0" @click="go(r)" @keydown.enter="go(r)">
                <div class="flex items-center gap-2 text-sm mb-1">
                  <span class="text-[11px] text-muted w-6">#{{ r.rank }}</span>
                  <span class="font-semibold truncate group-hover:text-accent">{{ displayName(r.item) }}</span>
                  <span v-if="formBadge(category, r)" class="badge !py-0">{{ formBadge(category, r) }}</span>
                  <span class="ml-auto text-xs text-muted">{{ gap(r) === 0 ? t('ladder.top') : gap(r) + '%' }}</span>
                  <UiCheckbox size="sm" :model-value="compare.has(category, r.item.id)" :aria-label="t('col.compare')" @update:model-value="compare.toggle(category, r.item.id)" />
                </div>
                <div class="h-5 rounded-md overflow-hidden" style="background: var(--bar-track)">
                  <div class="h-full flex items-center rounded-md" :style="{ width: score(r) + '%', minWidth: '44px', background: `linear-gradient(90deg, ${brandColor(b)}, ${brandColor(b)}99)` }">
                    <span class="text-white text-[11px] font-bold pl-1.5 drop-shadow">{{ fmtRel(score(r)) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>

        <div class="px-4 py-2 text-[11px] text-muted border-t border-line flex flex-wrap gap-x-4 gap-y-1">
          <span>{{ t('ladder.legend') }}</span>
          <span v-if="unscored.length">{{ t('ladder.unscored', { sort: sortLabel }) }}{{ unscored.map(r => displayName(r.item)).join(', ') }}</span>
        </div>
        <div v-if="!scored.length" class="p-10 text-center text-muted">{{ t('rank.empty') }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ladder-item { cursor: pointer; border-radius: 6px; }
.ladder-item:focus-visible { outline: 2px solid rgb(var(--c-accent)); outline-offset: 2px; }
.ladder-item:hover > div:first-child, .ladder-item:hover > div:last-child { filter: saturate(1.2); }
</style>
