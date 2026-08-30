<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Category, RankedRow } from '@/types/hardware'
import { COLUMNS, formBadge } from '@/utils/columns'
import { brandColor, rel as fmtRel } from '@/utils/format'
import ScoreBar from '@/components/ScoreBar.vue'
import { useCompare } from '@/stores/compare'
import { SORT_DEFS } from '@/utils/rank'

const props = defineProps<{
  category: Category
  rows: RankedRow[]
  sort: string
  dir: 'asc' | 'desc'
}>()
const emit = defineEmits<{ sort: [key: string] }>()

const router = useRouter()
const compare = useCompare()
const cols = computed(() => COLUMNS[props.category])
const sortLabel = computed(() => SORT_DEFS[props.category].find((s) => s.key === props.sort)?.label ?? '')

function go(row: RankedRow) {
  router.push(`/product/${props.category}/${row.item.id}`)
}
function rankClass(r: number) {
  return r === 1 ? 'text-yellow-400' : r === 2 ? 'text-slate-300' : r === 3 ? 'text-amber-600' : 'text-muted'
}
function currentScore(row: RankedRow): string {
  if (props.category === 'psu') return `${row.raw.tier} 档`
  if (props.sort === 'latency') return row.raw.latency == null ? '—' : `${row.raw.latency} ns`
  return fmtRel(row.rel[props.sort])
}
</script>

<template>
  <div>
    <div v-if="!rows.length" class="card p-10 text-center text-muted">没有符合筛选的产品</div>

    <!-- 桌面端表格 -->
    <div v-else class="card overflow-x-auto hidden md:block">
      <table class="w-full text-sm">
        <thead class="text-xs text-muted">
          <tr class="border-b border-line">
            <th class="text-left px-4 py-3 w-12">#</th>
            <th class="text-left px-2 py-3">型号</th>
            <th
              v-for="c in cols" :key="c.key"
              class="px-3 py-3 whitespace-nowrap"
              :class="[c.kind === 'score' || c.align === 'right' ? 'text-right' : 'text-left', c.sortKey ? 'cursor-pointer select-none hover:text-fg' : '']"
              @click="c.sortKey && emit('sort', c.sortKey)"
            >
              {{ c.label }}
              <span v-if="c.sortKey === sort" class="text-accent">{{ dir === 'desc' ? '▼' : '▲' }}</span>
            </th>
            <th class="px-3 py-3 w-14 text-center">对比</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="r in rows" :key="r.item.id"
            class="border-b border-line/60 last:border-0 hover:bg-white/[.03] cursor-pointer"
            @click="go(r)"
          >
            <td class="px-4 py-3.5 font-semibold" :class="rankClass(r.rank)">{{ r.rank }}</td>
            <td class="px-2 py-3.5">
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full shrink-0" :style="{ background: brandColor(r.item.brand) }" :title="r.item.brand" />
                <router-link :to="`/product/${category}/${r.item.id}`" class="font-medium hover:text-accent whitespace-nowrap" @click.stop>{{ r.item.name }}</router-link>
                <span v-if="formBadge(category, r)" class="text-[11px] px-1.5 py-0.5 rounded bg-line text-muted whitespace-nowrap">{{ formBadge(category, r) }}</span>
              </div>
            </td>
            <td v-for="c in cols" :key="c.key" class="px-3 py-3.5" :class="[c.align === 'right' ? 'text-right' : '', c.kind === 'text' ? 'whitespace-nowrap' : '']">
              <template v-if="c.kind === 'text'">
                <span :class="c.key === 'tier' ? 'font-semibold' : ''">{{ c.text!(r) }}</span>
              </template>
              <ScoreBar v-else :value="r.rel[c.key]" :raw="c.raw ? c.raw(r) : null" :color="c.key === 'overall' ? '#5B8CFF' : '#3B5FB8'" />
            </td>
            <td class="px-3 py-3.5 text-center" @click.stop>
              <input type="checkbox" class="accent-accent w-4 h-4 cursor-pointer" :checked="compare.has(category, r.item.id)" @change="compare.toggle(category, r.item.id)" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 移动端卡片 -->
    <div v-if="rows.length" class="md:hidden space-y-2">
      <div
        v-for="r in rows" :key="r.item.id"
        class="card p-3 flex items-center gap-3"
        @click="go(r)"
      >
        <div class="w-7 text-lg font-semibold text-center" :class="rankClass(r.rank)">{{ r.rank }}</div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 min-w-0">
            <span class="w-2 h-2 rounded-full shrink-0" :style="{ background: brandColor(r.item.brand) }" />
            <span class="font-medium truncate">{{ r.item.name }}</span>
          </div>
          <div class="text-xs text-muted mt-0.5 truncate">
            <span v-if="formBadge(category, r)">{{ formBadge(category, r) }} · </span>{{ r.item.summary }}
          </div>
        </div>
        <div class="text-right shrink-0">
          <div class="text-[11px] text-muted">{{ sortLabel }}</div>
          <div class="font-semibold">{{ currentScore(r) }}</div>
        </div>
        <input type="checkbox" class="accent-accent w-5 h-5 shrink-0" :checked="compare.has(category, r.item.id)" @click.stop @change="compare.toggle(category, r.item.id)" />
      </div>
    </div>
  </div>
</template>
