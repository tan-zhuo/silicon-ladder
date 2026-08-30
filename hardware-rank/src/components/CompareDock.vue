<script setup lang="ts">
import { computed } from 'vue'
import { useCompare, MAX_COMPARE } from '@/stores/compare'
import { useCatalog } from '@/data/load'
import { catLabel } from '@/utils/format'
import { useRoute } from 'vue-router'
import { useI18n, displayName } from '@/i18n'

const compare = useCompare()
const catalog = useCatalog()
const route = useRoute()
const { t } = useI18n()
const items = computed(() => compare.category ? compare.ids.map((id) => catalog.find(compare.category!, id)).filter(Boolean) : [])
const visible = computed(() => compare.ids.length > 0 && route.path !== '/compare')
</script>

<template>
  <transition name="dock">
    <div v-if="visible" class="fixed bottom-0 inset-x-0 z-40 border-t border-line bg-card/95 backdrop-blur shadow-[0_-8px_30px_-12px_rgb(15_23_42/.25)]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
        <div class="flex-1 min-w-0">
          <div class="text-xs text-muted mb-1">{{ t('dock.basket', { cat: catLabel(compare.category!) }) }}</div>
          <div class="flex gap-2 overflow-x-auto">
            <span v-for="it in items" :key="it!.id" class="inline-flex items-center gap-1 pill !py-1 !text-fg">
              {{ displayName(it!) }}
              <button class="text-muted hover:text-fg ml-0.5" :aria-label="t('dock.remove')" @click="compare.remove(it!.id)">×</button>
            </span>
          </div>
        </div>
        <button class="btn-ghost hidden sm:inline-flex" @click="compare.clear()">{{ t('dock.clear') }}</button>
        <router-link :to="{ path: '/compare', query: { ids: compare.queryString() } }" class="btn" :class="{ 'pointer-events-none opacity-40': compare.ids.length < 2 }">
          {{ t('dock.compare', { n: compare.ids.length, max: MAX_COMPARE }) }}
        </router-link>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.dock-enter-active, .dock-leave-active { transition: transform .2s, opacity .2s; }
.dock-enter-from, .dock-leave-to { transform: translateY(100%); opacity: 0; }
</style>
