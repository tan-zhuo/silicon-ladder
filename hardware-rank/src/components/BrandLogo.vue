<script setup lang="ts">
import { computed } from 'vue'
import { BRAND_LOGOS } from '@/assets/brandLogos'
import { brandColor } from '@/utils/format'

const props = withDefaults(defineProps<{ brand: string; size?: number; mono?: boolean }>(), { size: 18, mono: false })
const logo = computed(() => BRAND_LOGOS[props.brand])
const fill = computed(() => {
  if (props.mono) return 'currentColor'
  const hex = (logo.value?.hex ?? brandColor(props.brand)).toUpperCase()
  if (['#000000', '#231F20', '#1E1E28'].includes(hex)) return 'var(--logo-dark-fill)'
  if (hex === '#ED1C24') return '#E8262C'
  return hex
})
</script>

<template>
  <svg v-if="logo" :width="size" :height="size" viewBox="0 0 24 24" role="img" :aria-label="logo.title" class="shrink-0" :style="{ fill }">
    <path :d="logo.path" />
  </svg>
  <span
    v-else class="shrink-0 inline-flex items-center justify-center rounded-md font-semibold uppercase"
    :style="{ width: size + 'px', height: size + 'px', fontSize: Math.round(size * 0.5) + 'px', background: brandColor(brand) + '22', color: brandColor(brand) }"
    :title="brand"
  >{{ brand.slice(0, 1) }}</span>
</template>
