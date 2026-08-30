<script setup lang="ts">
import { ref, computed } from 'vue'
import AppLogo from '@/components/AppLogo.vue'
import { useTheme } from '@/stores/theme'
import { useI18n, LOCALES } from '@/i18n'

const open = ref(false)
const theme = useTheme()
const { t, locale, setLocale } = useI18n()
const links = computed(() => [
  { to: '/rank/cpu', label: t('nav.cpu') },
  { to: '/rank/gpu', label: t('nav.gpu') },
  { to: '/rank/ram', label: t('nav.ram') },
  { to: '/rank/storage', label: t('nav.storage') },
  { to: '/rank/psu', label: t('nav.psu') },
  { to: '/compare', label: t('nav.compare') },
  { to: '/guide', label: t('nav.guide') },
  { to: '/methodology', label: t('nav.methodology') },
])
</script>

<template>
  <header class="sticky top-0 z-40 bg-bg/80 backdrop-blur-md border-b border-line">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
      <router-link to="/" class="flex items-center gap-2.5 font-semibold tracking-tight">
        <AppLogo :size="32" />
        <span class="leading-tight">
          <span class="block text-[15px]">{{ t('site.name') }}</span>
          <span class="hidden sm:block text-muted font-normal text-[11px] tracking-wide">{{ t('site.tagline') }}</span>
        </span>
      </router-link>

      <nav class="ml-auto hidden lg:flex items-center gap-0.5 text-sm">
        <router-link
          v-for="l in links" :key="l.to" :to="l.to"
          class="px-3 py-1.5 rounded-lg text-muted hover:text-fg hover:bg-card2"
          active-class="!text-accent bg-accent/10 font-medium"
        >{{ l.label }}</router-link>
      </nav>

      <div class="flex items-center gap-1.5 lg:ml-2">
        <div class="seg !p-0.5">
          <button
            v-for="l in LOCALES" :key="l.key" class="seg-btn !px-2 !py-0.5 text-xs" :class="{ 'seg-active': locale === l.key }"
            @click="setLocale(l.key)"
          >{{ l.label }}</button>
        </div>
        <button class="btn-ghost !px-2" :title="t('theme.toggle')" :aria-label="t('theme.toggle')" @click="theme.toggle()">
          <svg v-if="theme.theme === 'light'" width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z" stroke="currentColor" stroke-width="2" stroke-linejoin="round" /></svg>
          <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="2" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" stroke="currentColor" stroke-width="2" stroke-linecap="round" /></svg>
        </button>
        <button class="lg:hidden btn-ghost !px-2" :aria-label="t('nav.menu')" @click="open = !open">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="2" stroke-linecap="round" /></svg>
        </button>
      </div>
    </div>
    <nav v-if="open" class="lg:hidden border-t border-line px-4 py-2 grid grid-cols-2 gap-1 text-sm bg-bg" @click="open = false">
      <router-link v-for="l in links" :key="l.to" :to="l.to" class="px-3 py-2 rounded-lg text-muted hover:text-fg" active-class="!text-accent bg-accent/10">{{ l.label }}</router-link>
    </nav>
  </header>
</template>
