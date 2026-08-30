<script setup lang="ts">
import { computed } from 'vue'
import { BRAND_LOGOS } from '@/assets/brandLogos'
import { brandColor } from '@/utils/format'

const props = withDefaults(defineProps<{ brand: string; size?: number; mono?: boolean }>(), { size: 18, mono: false })
const logo = computed(() => BRAND_LOGOS[props.brand])
/** 深色背景下，黑色系官方色改为浅色 */
const fill = computed(() => {
  if (props.mono) return 'currentColor'
  const hex = logo.value?.hex ?? brandColor(props.brand)
  const dark = ['#000000', '#231F20', '#1E1E28']
  if (dark.includes(hex.toUpperCase())) return '#E7EEF6'
  if (hex.toUpperCase() === '#ED1C24') return '#FF3B3F'
  return hex
})
</script>

<template>
  <svg
    v-if="logo" :width="size" :height="size" viewBox="0 0 24 24" role="img" :aria-label="logo.title"
    class="shrink-0" :style="{ fill }"
  >
    <path :d="logo.path" />
  </svg>
  <span
    v-else
    class="shrink-0 inline-flex items-center justify-center rounded font-semibold text-[10px] uppercase"
    :style="{ width: size + 'px', height: size + 'px', background: brandColor(brand) + '33', color: brandColor(brand) }"
    :title="brand"
  >{{ brand.slice(0, 1) }}</span>
</template>
