<script setup lang="ts">
import { onMounted } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import AppSidebar from '@/components/AppSidebar.vue'
import GlobalSearch from '@/components/GlobalSearch.vue'
import { useUi } from '@/stores/ui'
import AppFooter from '@/components/AppFooter.vue'
import CompareDock from '@/components/CompareDock.vue'
import { useCatalog } from '@/data/load'
import { useCompare } from '@/stores/compare'
import { useTheme } from '@/stores/theme'
import { useI18n } from '@/i18n'

const catalog = useCatalog()
const ui = useUi()
const compare = useCompare()
useTheme()
const { t } = useI18n()
onMounted(() => catalog.load())
</script>

<template>
  <div class="min-h-screen">
    <AppSidebar />
    <div class="lg:pl-60 min-h-screen flex flex-col">
      <AppHeader />
      <main class="flex-1 w-full max-w-[1800px] mx-auto px-4 sm:px-6 xl:px-10 2xl:px-14 py-6 pb-28">
      <div v-if="catalog.error" class="notice-warn">{{ t('loadError') }}{{ catalog.error }}</div>
      <div v-else-if="!catalog.loaded" class="text-muted text-sm py-20 text-center">{{ t('loading') }}</div>
      <router-view v-else />
    </main>
      <AppFooter />
    </div>
    <CompareDock />
    <GlobalSearch v-model="ui.searchOpen" />
    <transition name="fade">
      <div v-if="compare.notice" class="fixed top-16 left-1/2 -translate-x-1/2 z-50 card px-4 py-2 text-sm">
        {{ compare.notice }}
      </div>
    </transition>
  </div>
</template>
