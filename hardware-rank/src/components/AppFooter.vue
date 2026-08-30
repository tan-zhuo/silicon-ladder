<script setup lang="ts">
import { useCatalog } from '@/data/load'
import { useI18n } from '@/i18n'
import AppLogo from '@/components/AppLogo.vue'
const catalog = useCatalog()
const { t } = useI18n()
</script>

<template>
  <footer class="border-t border-line mt-10 bg-card2/60">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-8 text-sm text-muted flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
      <div class="flex items-center gap-3">
        <AppLogo :size="26" />
        <div>
          <div class="text-fg font-medium">{{ t('site.name') }} <span class="text-muted font-normal">· {{ t('site.tagline') }}</span></div>
          <div class="text-xs">{{ t('footer.updated') }}<span class="text-fg">{{ catalog.meta.updated || '—' }}</span> · <router-link to="/methodology" class="hover:text-fg underline underline-offset-4">{{ t('footer.method') }}</router-link></div>
        </div>
      </div>
      <div class="text-xs max-w-md">{{ t('footer.disclaimer') }}</div>
    </div>
  </footer>
</template>
