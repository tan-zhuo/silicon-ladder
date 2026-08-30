<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Category, RankedRow } from '@/types/hardware'
import { COLUMNS, formBadge, genBadge } from '@/utils/columns'
import { rel as fmtRel, yearOf } from '@/utils/format'
import ScoreBar from '@/components/ScoreBar.vue'
import BrandLogo from '@/components/BrandLogo.vue'
import { useCompare } from '@/stores/compare'
import { useI18n, displayName } from '@/i18n'

const props = defineProps<{ category: Category; rows: RankedRow[]; sort: string; dir: 'asc' | 'desc' }>()
const emit = defineEmits<{ sort: [key: string] }>()
const router = useRouter()
const compare = useCompare()
const { t } = useI18n()
const cols = computed(() => COLUMNS[props.category])
const sortLabel = computed(() => t('sort.' + props.sort))

function go(row: RankedRow) { router.push(`/product/${props.category}/${row.item.id}`) }
function rankStyle(r: number) {
  if (r === 1) return { color: 'var(--gold)' }
  if (r === 2) return { color: 'var(--silver)' }
  if (r === 3) return { color: 'var(--bronze)' }
  return {}
}
function currentScore(row: RankedRow): string {
  if (props.category === 'psu') return `${row.raw.tier}`
  if (props.sort === 'latency') return row.raw.latency == null ? '—' : `${row.raw.latency} ns`
  return fmtRel(row.rel[props.sort])
}
</script>

<template>
  <div>
    <div v-if="!rows.length" class="card p-12 text-center text-muted">{{ t('rank.empty') }}</div>

    <!-- 桌面端表格 -->
    <div v-else class="card overflow-hidden hidden md:block">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="text-[11px] uppercase tracking-wider text-muted bg-card2">
            <tr class="border-b border-line">
              <th class="text-left pl-5 pr-2 py-3 w-14">{{ t('col.rank') }}</th>
              <th class="text-left px-2 py-3">{{ t('col.model') }}</th>
              <th
                v-for="c in cols" :key="c.key" class="px-3 py-3 whitespace-nowrap"
                :class="[c.kind === 'score' || c.align === 'right' ? 'text-right' : 'text-left', c.sortKey ? 'cursor-pointer select-none hover:text-fg' : '']"
                @click="c.sortKey && emit('sort', c.sortKey)"
              >
                <span :class="c.sortKey === sort ? 'text-accent' : ''">{{ t('col.' + c.label) }}</span>
                <span v-if="c.sortKey === sort" class="text-accent ml-0.5">{{ dir === 'desc' ? '▼' : '▲' }}</span>
              </th>
              <th class="px-3 py-3 w-16 text-center">{{ t('col.compare') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="r in rows" :key="r.item.id"
              class="border-b border-line/70 last:border-0 cursor-pointer group hover:bg-accent/[.04] focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
              :class="[r.rank <= 3 ? 'bg-accent/[.025]' : '', compare.has(category, r.item.id) ? '!bg-accent/10' : '']"
              tabindex="0" :aria-label="`#${r.rank} ${displayName(r.item)}`"
              @click="go(r)" @keydown.enter="go(r)" @keydown.space.prevent="compare.toggle(category, r.item.id)"
            >
              <td class="pl-5 pr-2 py-3">
                <span class="inline-flex items-center justify-center w-7 h-7 rounded-lg text-sm font-bold" :class="r.rank <= 3 ? 'bg-card2 border border-line' : 'text-muted'" :style="rankStyle(r.rank)">{{ r.rank }}</span>
              </td>
              <td class="px-2 py-3">
                <div class="flex items-center gap-2.5">
                  <BrandLogo :brand="r.item.brand" :size="20" />
                  <div class="min-w-0">
                    <div class="flex items-center gap-1.5">
                      <router-link :to="`/product/${category}/${r.item.id}`" class="font-semibold whitespace-nowrap group-hover:text-accent" @click.stop>{{ displayName(r.item) }}</router-link>
                      <span v-if="formBadge(category, r)" class="badge">{{ formBadge(category, r) }}</span>
                      <span v-if="r.item.est" class="badge !text-amber-700 dark:!text-amber-300 !border-amber-500/40">{{ t('product.est') }}</span>
                    </div>
                    <div class="text-[11px] text-muted mt-0.5 flex items-center gap-1.5">
                      <span v-if="genBadge(category, r)">{{ genBadge(category, r) }}</span>
                      <span v-if="genBadge(category, r)">·</span>
                      <span>{{ yearOf(r.item.release) }}</span>
                    </div>
                  </div>
                </div>
              </td>
              <td v-for="c in cols" :key="c.key" class="px-3 py-3" :class="[c.align === 'right' ? 'text-right' : '', c.kind === 'text' ? 'whitespace-nowrap' : '']">
                <template v-if="c.kind === 'text'">
                  <span v-if="c.key === 'tier'" class="inline-flex w-7 h-7 items-center justify-center rounded-md font-bold text-xs" :class="{ 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300': c.text!(r) === 'A', 'bg-sky-500/15 text-sky-700 dark:text-sky-300': c.text!(r) === 'B', 'bg-amber-500/15 text-amber-700 dark:text-amber-300': c.text!(r) === 'C', 'bg-rose-500/15 text-rose-700 dark:text-rose-300': c.text!(r) === 'D' }">{{ c.text!(r) }}</span>
                  <span v-else>{{ c.text!(r) }}</span>
                </template>
                <ScoreBar v-else :value="r.rel[c.key]" :raw="c.raw ? c.raw(r) : null" :dim="c.key !== sort" />
              </td>
              <td class="px-3 py-3 text-center" @click.stop>
                <input type="checkbox" class="accent-accent w-4 h-4 cursor-pointer" :checked="compare.has(category, r.item.id)" @change="compare.toggle(category, r.item.id)" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 移动端卡片 -->
    <div v-if="rows.length" class="md:hidden space-y-2">
      <div v-for="r in rows" :key="r.item.id" class="card card-hover p-3 flex items-center gap-3" tabindex="0" @click="go(r)" @keydown.enter="go(r)">
        <div class="w-7 text-lg font-bold text-center" :style="rankStyle(r.rank)">{{ r.rank }}</div>
        <BrandLogo :brand="r.item.brand" :size="20" />
        <div class="flex-1 min-w-0">
          <div class="font-semibold truncate">{{ displayName(r.item) }}</div>
          <div class="text-[11px] text-muted mt-0.5 truncate">
            <span v-if="formBadge(category, r)">{{ formBadge(category, r) }} · </span>{{ genBadge(category, r) || yearOf(r.item.release) }}
          </div>
        </div>
        <div class="text-right shrink-0">
          <div class="text-[10px] text-muted uppercase tracking-wide">{{ sortLabel }}</div>
          <div class="font-bold text-accent">{{ currentScore(r) }}</div>
        </div>
        <input type="checkbox" class="accent-accent w-5 h-5 shrink-0" :checked="compare.has(category, r.item.id)" @click.stop @change="compare.toggle(category, r.item.id)" />
      </div>
    </div>
  </div>
</template>
