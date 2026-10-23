<script setup lang="ts">
// 纯 CSS 手机样机：展示一张迷你天梯（真实前几名数据）
import { computed } from 'vue'
import { useCatalog } from '@/data/load'
import { scorePool, sortRows } from '@/utils/rank'
import { brandColor } from '@/utils/format'
import { displayName } from '@/i18n'
import AppLogo from '@/components/AppLogo.vue'
const catalog = useCatalog()
const rows = computed(() => sortRows('gpu', scorePool('gpu', catalog.byCategory('gpu').filter((i) => i.form === 'desktop')), 'overall').slice(0, 7))
</script>

<template>
  <div class="phone select-none" aria-hidden="true">
    <div class="phone-screen">
      <div class="flex items-center gap-1.5 px-3 pt-3 pb-2">
        <AppLogo :size="16" /><span class="text-[10px] font-semibold tracking-tight">CPU.News</span>
        <span class="ml-auto num text-[8px] text-faint">{{ catalog.meta.updated }}</span>
      </div>
      <div class="px-3 text-[8px] t-overline text-accent">GPU</div>
      <div class="px-3 text-[12px] font-semibold tracking-tight">Desktop ladder</div>
      <div class="px-3 mt-2 flex gap-1">
        <span class="h-4 px-1.5 rounded-full bg-fg text-bg text-[8px] inline-flex items-center">Overall</span>
        <span class="h-4 px-1.5 rounded-full border border-line text-[8px] text-muted inline-flex items-center">Raster</span>
        <span class="h-4 px-1.5 rounded-full border border-line text-[8px] text-muted inline-flex items-center">RT</span>
      </div>
      <div class="px-3 mt-2.5 space-y-1.5">
        <div v-for="(r, i) in rows" :key="r.item.id" class="flex items-center gap-1.5">
          <span class="num text-[8px] text-faint w-3">{{ r.rank }}</span>
          <div class="flex-1 min-w-0">
            <div class="text-[9px] font-medium truncate leading-tight">{{ displayName(r.item) }}</div>
            <div class="h-1.5 rounded-full overflow-hidden mt-0.5" style="background: var(--bar-track)">
              <div class="h-full rounded-full bar-anim" :style="{ width: (r.rel.overall ?? 0) + '%', background: brandColor(r.item.brand), '--i': i * 3 }" />
            </div>
          </div>
          <span class="num text-[9px] w-7 text-right">{{ (r.rel.overall ?? 0).toFixed(1) }}</span>
        </div>
      </div>
      <div class="absolute bottom-0 inset-x-0 h-10 border-t border-line bg-card/90 backdrop-blur flex items-center justify-around text-[8px] text-faint">
        <span class="text-fg font-medium">Ladder</span><span>Rank</span><span>Compare</span><span>News</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.phone { width: 232px; height: 468px; border-radius: 38px; padding: 10px; background: rgb(var(--c-fg)); box-shadow: var(--shadow-lg), 0 0 0 1px rgb(var(--c-fg) / .15); position: relative; }
.phone::before { content: ''; position: absolute; top: 18px; left: 50%; transform: translateX(-50%); width: 72px; height: 18px; border-radius: 10px; background: rgb(var(--c-fg)); z-index: 2; }
.phone-screen { position: relative; width: 100%; height: 100%; border-radius: 30px; overflow: hidden; background: rgb(var(--c-bg)); color: rgb(var(--c-fg)); padding-top: 14px; }
</style>
