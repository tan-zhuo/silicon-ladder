<script setup lang="ts">
// 纯 CSS 手机样机：三种屏幕（天梯 / 详情 / 对比），内容用真实数据，固定 232×480 比例，内容按高度排布不会溢出
import { computed } from 'vue'
import { useCatalog } from '@/data/load'
import { scorePool, sortRows } from '@/utils/rank'
import { brandColor } from '@/utils/format'
import { displayName, useI18n } from '@/i18n'
import type { Cpu } from '@/types/hardware'
import AppLogo from '@/components/AppLogo.vue'
import BrandLogo from '@/components/BrandLogo.vue'

withDefaults(defineProps<{ screen?: 'ladder' | 'product' | 'compare'; scale?: number }>(), { screen: 'ladder', scale: 1 })
const catalog = useCatalog()
const { t } = useI18n()
const gpus = computed(() => sortRows('gpu', scorePool('gpu', catalog.byCategory('gpu').filter((i) => i.form === 'desktop')), 'overall'))
const cpus = computed(() => sortRows('cpu', scorePool('cpu', catalog.byCategory('cpu').filter((i) => i.form === 'desktop')), 'overall'))
const ladder = computed(() => gpus.value.slice(0, 7))
const hero = computed(() => cpus.value[0])
const cmp = computed(() => cpus.value.slice(0, 2))
const rivals = computed(() => cpus.value.slice(1, 4))
const cmpRows = computed<[string, (c: Cpu) => string][]>(() => [[t('spec.cores'), (c) => c.cores], [t('spec.tdp'), (c) => c.tdp_w + 'W'], [t('spec.l3'), (c) => c.cache_l3], [t('spec.price'), (c) => (c.price_cny ? 'CN¥' + c.price_cny.toLocaleString('en-US') : '—')]])
const short = (n: string) => n.replace(/^(GeForce|Radeon)\s+/, '')
const pct = (v: number | null | undefined) => (v ?? 0) + '%'
const tabs = computed(() => [t('rank.ladder'), t('nav.compare'), t('nav.news'), t('product.home')])
</script>

<template>
  <div class="phone select-none" :style="{ '--s': scale }" aria-hidden="true">
    <div class="phone-screen flex flex-col">
      <!-- 状态栏 -->
      <div class="flex items-center justify-between px-4 pt-2 text-[9px] num font-medium">
        <span>9:41</span>
        <span class="flex items-center gap-1"><span class="inline-block w-3 h-2 border border-current rounded-[2px] relative"><span class="absolute inset-[1px] right-[2px] bg-current rounded-[1px]" /></span></span>
      </div>

      <!-- 天梯 -->
      <template v-if="screen === 'ladder'">
        <div class="flex items-center gap-1.5 px-3 pt-2.5">
          <AppLogo :size="14" /><span class="text-[10px] font-semibold tracking-tight">CPU.News</span>
          <span class="ml-auto num text-[8px] text-faint">{{ catalog.meta.updated }}</span>
        </div>
        <div class="px-3 mt-2 text-[8px] t-overline text-accent">GPU · Desktop</div>
        <div class="px-3 text-[12px] font-semibold tracking-tight leading-tight">{{ t('rank.ladder') }}</div>
        <div class="px-3 mt-2 flex gap-1">
          <span class="h-4 px-1.5 rounded-full bg-fg text-bg text-[8px] inline-flex items-center">{{ t('sort.overall') }}</span>
          <span class="h-4 px-1.5 rounded-full border border-line text-[8px] text-muted inline-flex items-center">{{ t('sort.raster') }}</span>
          <span class="h-4 px-1.5 rounded-full border border-line text-[8px] text-muted inline-flex items-center">{{ t('sort.rt') }}</span>
        </div>
        <div class="px-3 mt-2.5 flex-1 min-h-0 flex flex-col justify-start gap-[7px] overflow-hidden">
          <div v-for="(r, i) in ladder" :key="r.item.id" class="flex items-center gap-1.5">
            <span class="num text-[8px] text-faint w-3 shrink-0">{{ r.rank }}</span>
            <div class="flex-1 min-w-0">
              <div class="text-[9px] font-medium truncate leading-tight">{{ short(displayName(r.item)) }}</div>
              <div class="h-[5px] rounded-full overflow-hidden mt-[3px]" style="background: var(--bar-track)">
                <div class="h-full rounded-full bar-anim" :style="{ width: pct(r.rel.overall), background: brandColor(r.item.brand), '--i': i * 3 }" />
              </div>
            </div>
            <span class="num text-[9px] w-7 text-right shrink-0">{{ (r.rel.overall ?? 0).toFixed(1) }}</span>
          </div>
        </div>
      </template>

      <!-- 详情 -->
      <template v-else-if="screen === 'product'">
        <div class="flex items-center gap-1.5 px-3 pt-2.5 text-[9px] text-muted"><span>‹</span><span>{{ t('nav.cpu') }} · Desktop</span></div>
        <div v-if="hero" class="px-3 mt-2.5">
          <div class="flex items-center gap-1.5"><BrandLogo :brand="hero.item.brand" :size="12" /><span class="text-[8px] text-muted">{{ hero.item.brand }}</span><span class="badge !h-3.5 !text-[7px] !px-1">{{ (hero.item as Cpu).socket }}</span></div>
          <div class="text-[13px] font-semibold tracking-tight leading-tight mt-1.5">{{ displayName(hero.item) }}</div>
          <div class="mt-2 flex items-end gap-2">
            <div><div class="t-overline text-faint !text-[7px]">{{ t('product.rankIn') }}</div><div class="num text-[22px] font-semibold leading-none mt-0.5" style="color: var(--gold)">#1</div></div>
            <div class="ml-auto h-6 px-2 rounded-sm bg-fg text-bg text-[8px] inline-flex items-center font-medium">{{ t('product.addCompare') }}</div>
          </div>
          <div class="mt-3 space-y-[6px]">
            <div v-for="k in ['overall', 'gaming', 'single', 'multi', 'efficiency']" :key="k">
              <div class="flex justify-between text-[8px]"><span class="text-muted">{{ t('sort.' + k) }}</span><span class="num">{{ (hero.rel[k] ?? 0).toFixed(1) }}</span></div>
              <div class="h-[5px] rounded-full overflow-hidden mt-[2px]" style="background: var(--bar-track)"><div class="h-full rounded-full bar-anim" :style="{ width: pct(hero.rel[k]), background: k === 'overall' ? 'var(--bar-fill)' : 'var(--bar-fill-dim)' }" /></div>
            </div>
          </div>
          <div class="mt-3 grid grid-cols-3 gap-1.5 text-[8px]">
            <div class="rounded-sm border border-line p-1.5"><div class="text-faint">{{ t('spec.cores') }}</div><div class="num font-medium truncate">{{ (hero.item as Cpu).cores }}</div></div>
            <div class="rounded-sm border border-line p-1.5"><div class="text-faint">TDP</div><div class="num font-medium">{{ (hero.item as Cpu).tdp_w }}W</div></div>
            <div class="rounded-sm border border-line p-1.5"><div class="text-faint">L3</div><div class="num font-medium truncate">{{ (hero.item as Cpu).cache_l3 }}</div></div>
          </div>
          <div class="mt-3 t-overline text-faint !text-[7px]">{{ t('rel.rivals') }}</div>
          <div class="mt-1 divide-y divide-line">
            <div v-for="r in rivals" :key="r.item.id" class="flex items-center gap-1.5 py-[5px] text-[8.5px]">
              <BrandLogo :brand="r.item.brand" :size="10" /><span class="flex-1 truncate font-medium">{{ displayName(r.item) }}</span><span class="num text-faint">#{{ r.rank }}</span><span class="num w-7 text-right">{{ (r.rel.overall ?? 0).toFixed(1) }}</span>
            </div>
          </div>
        </div>
        <div class="flex-1" />
      </template>

      <!-- 对比 -->
      <template v-else>
        <div class="px-3 pt-2.5 text-[12px] font-semibold tracking-tight">{{ t('nav.compare') }} · {{ t('nav.cpu') }}</div>
        <div class="px-3 mt-2.5 grid grid-cols-2 gap-1.5">
          <div v-for="r in cmp" :key="r.item.id" class="rounded-sm border border-line p-1.5">
            <div class="flex items-center gap-1"><BrandLogo :brand="r.item.brand" :size="10" /><span class="num text-[7px] text-faint">#{{ r.rank }}</span></div>
            <div class="text-[8.5px] font-medium leading-tight mt-1 line-clamp-2">{{ displayName(r.item) }}</div>
          </div>
        </div>
        <div class="px-3 mt-2.5 space-y-[7px]">
          <div v-for="k in ['overall', 'gaming', 'single', 'multi', 'efficiency', 'value']" :key="k">
            <div class="text-[8px] text-muted">{{ t('sort.' + k) }}</div>
            <div class="grid grid-cols-2 gap-1.5 mt-[2px]">
              <div v-for="(r, j) in cmp" :key="r.item.id" class="flex items-center gap-1">
                <div class="flex-1 h-[5px] rounded-full overflow-hidden" style="background: var(--bar-track)"><div class="h-full rounded-full bar-anim" :style="{ width: pct(r.rel[k]), background: j === 0 ? 'var(--bar-fill)' : brandColor(r.item.brand) }" /></div>
                <span class="num text-[8px] w-6 text-right">{{ (r.rel[k] ?? 0).toFixed(0) }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="px-3 mt-3 divide-y divide-line text-[8px]">
          <div v-for="[k, f] in cmpRows" :key="k" class="grid grid-cols-[3.2rem_1fr_1fr] gap-1.5 py-[4px]">
            <span class="text-faint truncate">{{ k }}</span><span v-for="r in cmp" :key="r.item.id" class="num truncate">{{ f(r.item as Cpu) }}</span>
          </div>
        </div>
        <div class="flex-1" />
      </template>

      <!-- 底部 Tab -->
      <div class="shrink-0 h-10 border-t border-line bg-card/90 backdrop-blur flex items-center justify-around text-[8px] text-faint">
        <span v-for="(tb, i) in tabs" :key="tb" :class="(screen === 'ladder' && i === 0) || (screen === 'compare' && i === 1) ? 'text-fg font-medium' : ''">{{ tb }}</span>
      </div>
      <div class="shrink-0 h-3 flex items-center justify-center"><span class="w-16 h-[3px] rounded-full bg-fg/60" /></div>
    </div>
  </div>
</template>

<style scoped>
.phone { width: calc(232px * var(--s, 1)); height: calc(480px * var(--s, 1)); border-radius: calc(38px * var(--s, 1)); padding: calc(10px * var(--s, 1)); background: rgb(var(--c-fg)); box-shadow: var(--shadow-lg), 0 0 0 1px rgb(var(--c-fg) / .15); position: relative; }
.phone::before { content: ''; position: absolute; top: calc(18px * var(--s, 1)); left: 50%; transform: translateX(-50%); width: calc(72px * var(--s, 1)); height: calc(18px * var(--s, 1)); border-radius: 10px; background: rgb(var(--c-fg)); z-index: 2; }
.phone-screen { position: relative; width: 100%; height: 100%; border-radius: calc(30px * var(--s, 1)); overflow: hidden; background: rgb(var(--c-bg)); color: rgb(var(--c-fg)); font-size: calc(10px * var(--s, 1)); }
.phone-screen > * { zoom: var(--s, 1); }
</style>
