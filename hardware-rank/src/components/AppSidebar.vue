<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppLogo from '@/components/AppLogo.vue'
import { useTheme } from '@/stores/theme'
import { useUi } from '@/stores/ui'
import { useI18n, LOCALES, localizePath, stripLocale, type Locale } from '@/i18n'
import { UiSelect } from '@/components/ui'
import { useCatalog } from '@/data/load'

const theme = useTheme()
const ui = useUi()
const route = useRoute()
const router = useRouter()
const catalog = useCatalog()
const { t, locale, setLocale } = useI18n()
function switchLang(l: Locale) { setLocale(l); router.replace({ path: localizePath(route.path, l), query: route.query }) }

const I = {
  home: 'M3 10.5L12 3l9 7.5M5 9.5V21h14V9.5',
  cpu: 'M9 3v2M15 3v2M9 19v2M15 19v2M3 9h2M3 15h2M19 9h2M19 15h2M7 7h10v10H7z',
  gpu: 'M3 7h18v10H3zM7 17v3M17 17v3M9 12a3 3 0 106 0 3 3 0 00-6 0',
  ram: 'M3 9h18v6H3zM7 9V6M11 9V6M15 9V6M7 15v3M11 15v3M15 15v3',
  storage: 'M4 6h16v5H4zM4 13h16v5H4zM7 8.5h.01M7 15.5h.01',
  psu: 'M13 2L4 14h7l-1 8 9-12h-7z',
  compare: 'M4 5h6v14H4zM14 5h6v14h-6z',
  news: 'M5 4h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V7m14 13a2 2 0 002-2M8 8h6M8 12h6M8 16h4',
  guide: 'M4 5a2 2 0 012-2h12a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2zM8 7h8M8 11h8M8 15h5',
  method: 'M12 3l2 4 4.5.5-3.3 3.2.8 4.5-4-2.2-4 2.2.8-4.5L5.5 7.5 10 7z',
  app: 'M8 2h8a2 2 0 012 2v16a2 2 0 01-2 2H8a2 2 0 01-2-2V4a2 2 0 012-2zM11 18h2',
}
const nav = computed(() => [
  { to: '/', label: t('product.home'), icon: I.home, count: null as number | null },
  { to: '/rank/cpu', label: t('nav.cpu'), icon: I.cpu, count: catalog.cpus.length },
  { to: '/rank/gpu', label: t('nav.gpu'), icon: I.gpu, count: catalog.gpus.length },
  { to: '/rank/ram', label: t('nav.ram'), icon: I.ram, count: catalog.rams.length },
  { to: '/rank/storage', label: t('nav.storage'), icon: I.storage, count: catalog.storages.length },
  { to: '/rank/psu', label: t('nav.psu'), icon: I.psu, count: catalog.psus.length },
  { to: '/news', label: t('nav.news'), icon: I.news, count: null },
  { to: '/compare', label: t('nav.compare'), icon: I.compare, count: null },
  { to: '/guide', label: t('nav.guide'), icon: I.guide, count: null },
  { to: '/methodology', label: t('nav.methodology'), icon: I.method, count: null },
  { to: '/app', label: t('nav.app'), icon: I.app, count: null },
])
const isActive = (to: string) => {
  const p = stripLocale(route.path)
  if (to === '/') return p === '/'
  if (p.startsWith(to)) return true
  if (to.startsWith('/rank/')) return p.startsWith('/product/' + to.split('/')[2])
  return false
}
</script>

<template>
  <aside class="hidden lg:flex fixed inset-y-0 left-0 w-60 flex-col border-r border-line bg-bg z-40">
    <router-link to="/" class="flex items-center gap-2.5 px-4 h-16 shrink-0">
      <AppLogo :size="28" />
      <span class="leading-tight font-semibold tracking-tight">
        <span class="block text-[14px]">{{ t('site.name') }}</span>
        <span class="block text-faint font-normal text-[10.5px] tracking-wide truncate">{{ t('site.tagline') }}</span>
      </span>
    </router-link>

    <button class="mx-3 mt-1 h-9 inline-flex items-center gap-2 rounded-sm border border-line bg-card px-2.5 text-[13px] text-muted hover:text-fg hover:border-line2 transition-colors shadow-sm" @click="ui.searchOpen = true">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2" /><path d="M20 20l-3.5-3.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" /></svg>
      <span class="flex-1 text-left">{{ t('search.shortcut') }}</span>
      <kbd class="badge-mono">⌘K</kbd>
    </button>

    <nav class="flex-1 overflow-y-auto px-3 py-3 space-y-px">
      <router-link
        v-for="n in nav" :key="n.to" :to="n.to"
        class="nav-item"
        :class="isActive(n.to) ? 'nav-item-active' : ''"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" class="shrink-0 text-faint"><path :d="n.icon" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" /></svg>
        <span class="flex-1 truncate">{{ n.label }}</span>
        <span v-if="n.count" class="num text-[11px] text-faint">{{ n.count }}</span>
      </router-link>
    </nav>

    <div class="px-3 py-3 border-t border-line space-y-2 shrink-0">
      <div class="flex items-center gap-2">
        <div class="flex-1 min-w-0"><UiSelect class="w-full [&>button]:w-full" :model-value="locale" :options="LOCALES.map(l => ({ value: l.key, label: l.label }))" :aria-label="t('lang')" @update:model-value="switchLang($event as Locale)">
          <template #prefix><svg width="14" height="14" viewBox="0 0 24 24" fill="none" class="text-muted"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8" /><path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18" stroke="currentColor" stroke-width="1.8" /></svg></template>
        </UiSelect></div>
        <button class="btn-ghost !px-2.5" :title="t('theme.toggle')" :aria-label="t('theme.toggle')" @click="theme.toggle()">
          <svg v-if="theme.theme === 'light'" width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z" stroke="currentColor" stroke-width="2" stroke-linejoin="round" /></svg>
          <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="2" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" stroke="currentColor" stroke-width="2" stroke-linecap="round" /></svg>
        </button>
      </div>
      <div class="px-1 text-[10.5px] text-faint leading-relaxed num">{{ t('footer.updated') }}{{ catalog.meta.updated || '—' }} · v{{ catalog.meta.version }}</div>
    </div>
  </aside>
</template>
