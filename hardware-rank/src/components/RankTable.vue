<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import type { Category, RankedRow } from '@/types/hardware'
import { COLUMNS, formBadge, genBadge } from '@/utils/columns'
import { rel as fmtRel, yearOf } from '@/utils/format'
import ScoreBar from '@/components/ScoreBar.vue'
import BrandLogo from '@/components/BrandLogo.vue'
import { useCompare } from '@/stores/compare'
import { UiCheckbox } from '@/components/ui'
import { useI18n, displayName } from '@/i18n'

const props = defineProps<{ category: Category; rows: RankedRow[]; sort: string; dir: 'asc' | 'desc' }>()
const emit = defineEmits<{ sort: [key: string] }>()
const router = useRouter()
const compare = useCompare()
const { t } = useI18n()
const cols = computed(() => COLUMNS[props.category])
const BATCH = 60
const shown = ref(BATCH)
watch(() => [props.rows, props.sort, props.dir], () => { shown.value = BATCH })
const visibleRows = computed(() => props.rows.slice(0, shown.value))
const remaining = computed(() => Math.max(0, props.rows.length - shown.value))
const sortLabel = computed(() => t('sort.' + props.sort))

const hideCls = (c: { hide?: 'lg' | 'xl' }) => (c.hide === 'lg' ? 'hidden lg:table-cell' : c.hide === 'xl' ? 'hidden xl:table-cell' : '')
function go(row: RankedRow) { router.push(`/product/${props.category}/${row.item.id}`) }
function currentScore(row: RankedRow): string {
  if (props.category === 'psu' || props.category === 'mobo') return `${row.raw.tier}`
  if (props.sort === 'latency') return row.raw.latency == null ? '—' : `${row.raw.latency} ns`
  return fmtRel(row.rel[props.sort])
}
</script>

<template>
  <div>
    <div v-if="!rows.length" class="card p-12 text-center text-muted">{{ t('rank.empty') }}</div>

    <!-- 桌面端表格 -->
    <div v-else class="card overflow-hidden hidden md:block">
      <div>
        <table class="data-table">
          <thead>
            <tr>
              <th class="text-left pl-4 pr-2 w-14">{{ t('col.rank') }}</th>
              <th class="text-left px-2">{{ t('col.model') }}</th>
              <th
                v-for="c in cols" :key="c.key" class="px-2 whitespace-nowrap"
                :class="[c.kind === 'score' || c.align === 'right' ? 'text-right' : 'text-left', c.sortKey ? 'cursor-pointer select-none hover:text-fg' : '', hideCls(c), c.kind === 'score' ? 'w-[7.5rem] xl:w-[9.5rem] 2xl:w-[11rem]' : c.key === 'spec' ? 'w-[14rem]' : 'w-[6rem] xl:w-[8rem]']"
                @click="c.sortKey && emit('sort', c.sortKey)"
              >
                <span :class="c.sortKey === sort ? 'text-accent' : ''">{{ t('col.' + c.label) }}</span>
                <span v-if="c.sortKey === sort" class="text-accent ml-1">{{ dir === 'desc' ? '↓' : '↑' }}</span>
              </th>
              <th class="px-3 w-16 text-center">{{ t('col.compare') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(r, ri) in visibleRows" :key="r.item.id"
              :style="{ '--i': Math.min(ri, 30) }"
              class="rise-anim cursor-pointer group focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent"
              :class="compare.has(category, r.item.id) ? '!bg-accent/[.07]' : ''"
              tabindex="0" :aria-label="`#${r.rank} ${displayName(r.item)}`"
              @click="go(r)" @keydown.enter="go(r)" @keydown.space.prevent="compare.toggle(category, r.item.id)"
            >
              <td class="pl-4 pr-2 py-2.5">
                <span class="rank-no" :class="r.rank <= 3 ? `rank-no-${r.rank}` : ''">{{ r.rank }}</span>
              </td>
              <td class="px-2 py-2.5">
                <div class="flex items-center gap-2.5">
                  <BrandLogo :brand="r.item.brand" :size="26" :max-ratio="2.4" />
                  <div class="min-w-0">
                    <div class="flex items-center gap-1.5 min-w-0">
                      <router-link :to="`/product/${category}/${r.item.id}`" class="font-medium truncate group-hover:text-accent transition-colors" :title="displayName(r.item)" @click.stop>{{ displayName(r.item) }}</router-link>
                      <span v-if="formBadge(category, r)" class="badge">{{ formBadge(category, r) }}</span>
                      <span v-if="r.item.est" class="badge !text-amber-700 dark:!text-amber-300 !border-amber-500/40">{{ t('product.est') }}</span>
                    </div>
                    <div class="text-[11px] text-faint mt-0.5 flex items-center gap-1.5 whitespace-nowrap truncate">
                      <span v-if="genBadge(category, r)">{{ genBadge(category, r) }}</span>
                      <span v-if="genBadge(category, r)">·</span>
                      <span>{{ yearOf(r.item.release) }}</span>
                    </div>
                  </div>
                </div>
              </td>
              <td v-for="c in cols" :key="c.key" class="px-2 py-2.5" :class="[c.align === 'right' ? 'text-right' : '', c.kind === 'text' ? 'truncate num text-[13px]' : '', hideCls(c)]" :title="c.kind === 'text' ? c.text!(r) : undefined">
                <template v-if="c.kind === 'text'">
                  <span v-if="c.key === 'tier'" class="inline-flex w-7 h-7 items-center justify-center rounded-md font-bold text-xs" :class="{ 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300': c.text!(r) === 'A', 'bg-sky-500/15 text-sky-700 dark:text-sky-300': c.text!(r) === 'B', 'bg-amber-500/15 text-amber-700 dark:text-amber-300': c.text!(r) === 'C', 'bg-rose-500/15 text-rose-700 dark:text-rose-300': c.text!(r) === 'D' }">{{ c.text!(r) }}</span>
                  <span v-else>{{ c.text!(r) }}</span>
                </template>
                <ScoreBar v-else :value="r.rel[c.key]" :raw="c.raw ? c.raw(r) : null" :dim="c.key !== sort" :index="ri" />
              </td>
              <td class="px-3 py-2.5 text-center" @click.stop>
                <UiCheckbox size="sm" :model-value="compare.has(category, r.item.id)" :aria-label="t('col.compare')" @update:model-value="compare.toggle(category, r.item.id)" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 加载更多（桌面表格） -->
    <div v-if="rows.length && remaining" class="hidden md:flex justify-center mt-3">
      <button class="btn-ghost" @click="shown += BATCH * 2">{{ t('rank.showMore', { n: remaining }) }}</button>
    </div>

    <!-- 移动端卡片 -->
    <div v-if="rows.length" class="md:hidden space-y-2">
      <div v-for="(r, ri) in visibleRows" :key="r.item.id" class="card card-hover p-3 flex items-center gap-3 rise-anim" :style="{ '--i': Math.min(ri, 30) }" tabindex="0" @click="go(r)" @keydown.enter="go(r)">
        <div class="rank-no" :class="r.rank <= 3 ? `rank-no-${r.rank}` : ''">{{ r.rank }}</div>
        <BrandLogo :brand="r.item.brand" :size="24" :max-ratio="2.2" />
        <div class="flex-1 min-w-0">
          <div class="font-semibold truncate">{{ displayName(r.item) }}</div>
          <div class="text-[11px] text-faint mt-0.5 truncate">
            <span v-if="formBadge(category, r)">{{ formBadge(category, r) }} · </span>{{ genBadge(category, r) || yearOf(r.item.release) }}
          </div>
        </div>
        <div class="text-right shrink-0">
          <div class="t-overline text-faint">{{ sortLabel }}</div>
          <div class="num font-semibold text-fg">{{ currentScore(r) }}</div>
        </div>
        <UiCheckbox size="sm" :model-value="compare.has(category, r.item.id)" :aria-label="t('col.compare')" @update:model-value="compare.toggle(category, r.item.id)" />
      </div>
      <button v-if="remaining" class="btn-ghost w-full justify-center" @click="shown += BATCH * 2">{{ t('rank.showMore', { n: remaining }) }}</button>
    </div>
  </div>
</template>
