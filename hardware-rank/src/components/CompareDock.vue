<script setup lang="ts">
import { computed } from 'vue'
import { useCompare, MAX_COMPARE } from '@/stores/compare'
import { useCatalog } from '@/data/load'
import { CATEGORY_LABEL } from '@/utils/format'
import { useRoute } from 'vue-router'

const compare = useCompare()
const catalog = useCatalog()
const route = useRoute()
const items = computed(() =>
  compare.category ? compare.ids.map((id) => catalog.find(compare.category!, id)).filter(Boolean) : [],
)
const visible = computed(() => compare.ids.length > 0 && route.path !== '/compare')
</script>

<template>
  <transition name="dock">
    <div v-if="visible" class="fixed bottom-0 inset-x-0 z-40 border-t border-line bg-card/95 backdrop-blur">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
        <div class="flex-1 min-w-0">
          <div class="text-xs text-muted mb-1">{{ CATEGORY_LABEL[compare.category!] }} 对比篮</div>
          <div class="flex gap-2 overflow-x-auto">
            <span v-for="it in items" :key="it!.id" class="inline-flex items-center gap-1 pill !py-1 text-fg">
              {{ it!.name }}
              <button class="text-muted hover:text-fg" aria-label="移除" @click="compare.remove(it!.id)">×</button>
            </span>
          </div>
        </div>
        <button class="btn-ghost hidden sm:inline-flex" @click="compare.clear()">清空</button>
        <router-link :to="{ path: '/compare', query: { ids: compare.queryString() } }" class="btn" :class="{ 'pointer-events-none opacity-40': compare.ids.length < 2 }">
          对比 ({{ compare.ids.length }}/{{ MAX_COMPARE }})
        </router-link>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.dock-enter-active, .dock-leave-active { transition: transform .2s, opacity .2s; }
.dock-enter-from, .dock-leave-to { transform: translateY(100%); opacity: 0; }
</style>
