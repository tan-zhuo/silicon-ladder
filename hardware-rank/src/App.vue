<script setup lang="ts">

import AppHeader from '@/components/AppHeader.vue'
import AppSidebar from '@/components/AppSidebar.vue'
import GlobalSearch from '@/components/GlobalSearch.vue'
import { useUi } from '@/stores/ui'
import { ref, onMounted, onUnmounted } from 'vue'
import AppFooter from '@/components/AppFooter.vue'
import CompareDock from '@/components/CompareDock.vue'
import { useCatalog } from '@/data/load'
import { useCompare } from '@/stores/compare'
import { useTheme } from '@/stores/theme'
import { useI18n } from '@/i18n'
import { Analytics } from '@vercel/analytics/vue'
import { SpeedInsights } from '@vercel/speed-insights/vue'

const catalog = useCatalog()
const ui = useUi()
const compare = useCompare()
useTheme()
const { t } = useI18n()
const showTop = ref(false)
const onScroll = () => { showTop.value = window.scrollY > 800 }
const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })
onMounted(() => { catalog.load(); window.addEventListener('scroll', onScroll, { passive: true }) })
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <div class="min-h-screen">
    <AppSidebar />
    <div class="lg:pl-60 min-h-screen flex flex-col">
      <AppHeader />
      <main class="flex-1 w-full max-w-[1800px] mx-auto px-4 sm:px-6 xl:px-10 2xl:px-14 py-6" :class="compare.ids.length ? 'pb-28' : 'pb-10'">
      <div v-if="catalog.error" class="notice-warn">{{ t('loadError') }}{{ catalog.error }}</div>
      <div v-else-if="!catalog.loaded" class="text-muted text-sm py-20 text-center">{{ t('loading') }}</div>
      <router-view v-else />
    </main>
      <AppFooter />
    </div>
    <CompareDock />
    <transition name="fade">
      <button
        v-if="showTop" :aria-label="t('backTop')" :title="t('backTop')"
        class="fixed right-4 z-40 w-10 h-10 rounded-full bg-card border border-line shadow-card dark:shadow-cardDark text-muted hover:text-accent hover:border-accent/60 transition-colors flex items-center justify-center"
        :class="compare.ids.length ? 'bottom-24' : 'bottom-5'"
        @click="scrollTop"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
      </button>
    </transition>
    <GlobalSearch v-model="ui.searchOpen" />
    <!-- Vercel 监控：Web Analytics（访问量/路由）+ Speed Insights（Core Web Vitals），随 vue-router 自动跟踪路由 -->
    <Analytics />
    <SpeedInsights />
    <transition name="fade">
      <div v-if="compare.notice" class="fixed top-16 left-1/2 -translate-x-1/2 z-50 card px-4 py-2 text-sm">
        {{ compare.notice }}
      </div>
    </transition>
  </div>
</template>
