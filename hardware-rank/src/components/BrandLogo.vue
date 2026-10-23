<script setup lang="ts">
// 品牌 Logo：simple-icons 单路径 / Wikimedia 矢量（单色者随文字色）/ 无来源品牌用字标回退
import { computed } from 'vue'
import { BRAND_LOGOS } from '@/assets/brandLogos'
import { brandColor } from '@/utils/format'

const props = withDefaults(defineProps<{ brand: string; size?: number; mono?: boolean; maxRatio?: number }>(), { size: 18, mono: false, maxRatio: 3.6 })
const logo = computed(() => BRAND_LOGOS[props.brand])
const fill = computed(() => {
  if (props.mono) return 'currentColor'
  const hex = (logo.value?.hex ?? brandColor(props.brand)).toUpperCase()
  if (['#000000', '#231F20', '#1E1E28', '#111113'].includes(hex)) return 'var(--logo-dark-fill)'
  if (hex === '#ED1C24') return '#E8262C'
  return hex
})
/** 横向字标最大宽度 = 3.6 倍高度（更宽的按比例缩小），避免长 Logo 把行撑爆 */
const vecStyle = computed(() => {
  const r = Math.min(logo.value?.ratio ?? 1, props.maxRatio)
  // 单一品牌色的矢量：亮色用品牌色；暗色下品牌色太深则改用前景色（.tone-dark 由 CSS 接管）
  const tone = !props.mono && logo.value?.tone ? logo.value.tone : undefined
  return { height: props.size + 'px', width: Math.round(props.size * r) + 'px', '--brand-tone': tone }
})
/** 字标回退：优先用覆盖表，其次 ≤8 字符整词大写，否则首字母缩写（最多 3 个） */
const MARKS: Record<string, string> = { 'Super Flower': 'SF', 'Great Wall': 'GW', 'Golden Field': 'GF', SilverStone: 'SST', '1STPLAYER': '1ST', Generic: '—', 'G.Skill': 'G.SKILL', Crucial: 'crucial', Solidigm: 'SLDM', Thermalright: 'TR', 'ID-COOLING': 'ID', 'Cooler Master': 'CM', PCCOOLER: 'PCC' }
const mark = computed(() => {
  const b = props.brand.trim()
  if (MARKS[b]) return MARKS[b]
  if (b.length <= 8) return b.toUpperCase()
  const parts = b.split(/[\s.-]+/).filter(Boolean)
  return (parts.length >= 2 ? parts.map((p) => p[0]).join('') : b.slice(0, 3)).toUpperCase().slice(0, 3)
})
</script>

<template>
  <svg v-if="logo?.path" :width="size" :height="size" viewBox="0 0 24 24" role="img" :aria-label="logo.title" class="shrink-0" :style="{ fill }">
    <path :d="logo.path" />
  </svg>
  <span
    v-else-if="logo?.svg && ((logo.ratio ?? 1) <= 7 || size >= 32)" class="brand-vec shrink-0 inline-flex items-center justify-start" :class="{ 'tone-dark': logo.toneDark && !mono }" role="img" :aria-label="logo.title" :title="brand"
    :style="vecStyle" v-html="logo.svg"
  />
  <span
    v-else class="brand-mark shrink-0 inline-flex items-center justify-center rounded-[4px] font-bold tracking-tight leading-none whitespace-nowrap"
    :style="{ height: size + 'px', minWidth: size + 'px', padding: `0 ${Math.max(2, Math.round(size * 0.18))}px`, fontSize: Math.round(size * (mark.length > 3 ? 0.36 : 0.5)) + 'px', background: brandColor(brand) + '1F', color: brandColor(brand) }"
    :title="brand"
  >{{ mark }}</span>
</template>

<style scoped>
.brand-vec { color: var(--brand-tone, rgb(var(--c-fg))); }
html.dark .brand-vec.tone-dark { color: rgb(var(--c-fg)); }
.brand-vec :deep(svg) { width: 100%; height: 100%; display: block; }
.brand-mark { font-family: var(--font-sans); font-feature-settings: 'ss01', 'cv11'; }
</style>
