<script setup lang="ts">
import { ref } from 'vue'
import AppLogo from '@/components/AppLogo.vue'
const open = ref(false)
const links = [
  { to: '/rank/cpu', label: 'CPU' },
  { to: '/rank/gpu', label: 'GPU' },
  { to: '/rank/ram', label: '内存' },
  { to: '/rank/storage', label: '存储' },
  { to: '/rank/psu', label: '电源' },
  { to: '/compare', label: '对比' },
  { to: '/guide', label: '选购指南' },
  { to: '/methodology', label: '方法论' },
]
</script>

<template>
  <header class="sticky top-0 z-40 bg-bg/85 backdrop-blur-md border-b border-line/80">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-4">
      <router-link to="/" class="flex items-center gap-2.5 font-semibold tracking-tight">
        <AppLogo :size="30" />
        <span class="leading-tight">
          <span class="block">Silicon Ladder</span>
          <span class="hidden sm:block text-muted font-normal text-[11px] tracking-wide">消费级硬件排行榜</span>
        </span>
      </router-link>
      <nav class="ml-auto hidden md:flex items-center gap-1 text-sm">
        <router-link
          v-for="l in links" :key="l.to" :to="l.to"
          class="px-3 py-1.5 rounded-lg text-muted hover:text-fg"
          active-class="!text-fg bg-card"
        >{{ l.label }}</router-link>
      </nav>
      <button class="ml-auto md:hidden btn-ghost" aria-label="菜单" @click="open = !open">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="2" stroke-linecap="round" /></svg>
      </button>
    </div>
    <nav v-if="open" class="md:hidden border-t border-line px-4 py-2 grid grid-cols-2 gap-1 text-sm" @click="open = false">
      <router-link v-for="l in links" :key="l.to" :to="l.to" class="px-3 py-2 rounded-lg text-muted hover:text-fg" active-class="!text-fg bg-card">{{ l.label }}</router-link>
    </nav>
  </header>
</template>
