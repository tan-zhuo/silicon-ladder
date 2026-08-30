<script setup lang="ts">
import { onMounted } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import CompareDock from '@/components/CompareDock.vue'
import { useCatalog } from '@/data/load'
import { useCompare } from '@/stores/compare'
import { useTheme } from '@/stores/theme'
import { useI18n } from '@/i18n'

const catalog = useCatalog()
const compare = useCompare()
useTheme()
const { t } = useI18n()
onMounted(() => catalog.load())
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader />
    <main class="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-28">
      <div v-if="catalog.error" class="notice-warn">{{ t('loadError') }}{{ catalog.error }}</div>
      <div v-else-if="!catalog.loaded" class="text-muted text-sm py-20 text-center">{{ t('loading') }}</div>
      <router-view v-else />
    </main>
    <AppFooter />
    <CompareDock />
    <transition name="fade">
      <div v-if="compare.notice" class="fixed top-16 left-1/2 -translate-x-1/2 z-50 card px-4 py-2 text-sm">
        {{ compare.notice }}
      </div>
    </transition>
  </div>
</template>
