<script setup lang="ts">
// 站点 Logo：蓝色圆角方块上的小芯片，带一张笑脸（与 public/favicon.svg 同源；改动后运行 npm run gen:icons 重新生成 PNG）
withDefaults(defineProps<{ size?: number }>(), { size: 28 })
</script>

<template>
  <svg :width="size" :height="size" viewBox="0 0 64 64" role="img" aria-label="CPU.News" class="shrink-0">
    <defs>
      <linearGradient id="sl-g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7DB0FF" /><stop offset="1" stop-color="#3B63E0" /></linearGradient>
      <linearGradient id="sl-s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF" /><stop offset="1" stop-color="#EEF3FF" /></linearGradient>
    </defs>
    <rect x="2" y="2" width="60" height="60" rx="17" fill="url(#sl-g)" />
    <rect x="2.75" y="2.75" width="58.5" height="58.5" rx="16.25" fill="none" stroke="#FFFFFF" stroke-opacity=".25" stroke-width="1.5" />
    <g stroke="#FFFFFF" stroke-opacity=".7" stroke-width="2.6" stroke-linecap="round"><path d="M24 17v-4M32 17v-4M40 17v-4M24 51v-4M32 51v-4M40 51v-4M17 24h-4M17 32h-4M17 40h-4M51 24h-4M51 32h-4M51 40h-4" /></g>
    <rect x="17" y="17" width="30" height="30" rx="8" fill="#1E3A8A" fill-opacity=".18" />
    <rect x="16" y="16" width="30" height="30" rx="8" fill="url(#sl-s)" />
    <circle cx="21" cy="21" r="1.4" fill="#3B63E0" fill-opacity=".5" />
    <circle cx="26" cy="29.5" r="2.7" fill="#1B2A4A" /><circle cx="36" cy="29.5" r="2.7" fill="#1B2A4A" />
    <circle cx="27" cy="28.5" r=".9" fill="#FFFFFF" /><circle cx="37" cy="28.5" r=".9" fill="#FFFFFF" />
    <circle cx="22.5" cy="34.5" r="2.3" fill="#FF8FA8" fill-opacity=".75" /><circle cx="39.5" cy="34.5" r="2.3" fill="#FF8FA8" fill-opacity=".75" />
    <path d="M27.5 36.2q3.5 3.6 7 0" fill="none" stroke="#1B2A4A" stroke-width="2.2" stroke-linecap="round" />
  </svg>
</template>
