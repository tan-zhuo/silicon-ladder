<script setup lang="ts">
import { AMAZON_PATHS, AMAZON_VIEWBOX } from '@/assets/amazonLogo'
defineProps<{ shop: 'amazon' | 'jd'; height?: number }>()
</script>

<template>
  <!-- Amazon：字标随主题取色，微笑保持官方橙 -->
  <svg v-if="shop === 'amazon'" :viewBox="AMAZON_VIEWBOX" :height="height ?? 16" :width="Math.round((height ?? 16) * 603 / 182)" role="img" aria-label="Amazon" class="shrink-0 text-fg">
    <path v-for="(p, i) in AMAZON_PATHS" :key="i" :d="p.d" :fill="p.orange ? '#FF9900' : 'currentColor'" />
  </svg>
  <!-- 京东：官方 Logo（PNG），浅色背景上显示 -->
  <span v-else class="inline-flex items-center justify-center rounded bg-white px-1 shrink-0" :style="{ height: (height ?? 16) + 4 + 'px' }">
    <img src="/shops/jd.png" alt="京东 JD.com" :style="{ height: (height ?? 16) + 'px' }" class="block w-auto" />
  </span>
</template>
