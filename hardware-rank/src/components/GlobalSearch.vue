<script setup lang="ts">
import { computed, ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useCatalog } from '@/data/load'
import { matchQuery } from '@/utils/filters'
import { catLabel, formLabel, yearOf } from '@/utils/format'
import type { Category, AnyItem } from '@/types/hardware'
import BrandLogo from '@/components/BrandLogo.vue'
import { useI18n, displayName } from '@/i18n'

const open = defineModel<boolean>({ default: false })
const catalog = useCatalog()
const router = useRouter()
const { t } = useI18n()
const q = ref('')
const idx = ref(0)
const input = ref<HTMLInputElement | null>(null)

const all = computed<{ cat: Category; item: AnyItem }[]>(() => (['cpu', 'gpu', 'ram', 'storage', 'psu'] as Category[]).flatMap((cat) => catalog.byCategory(cat).map((item) => ({ cat, item }))))
const hits = computed(() => {
  const s = q.value.trim()
  if (!s) return []
  // 名称开头匹配优先
  const list = all.value.filter((x) => matchQuery(x.item, s))
  const low = s.toLowerCase()
  list.sort((a, b) => Number(b.item.name.toLowerCase().includes(low)) - Number(a.item.name.toLowerCase().includes(low)) || b.item.release.localeCompare(a.item.release))
  return list.slice(0, 10)
})
watch(hits, () => { idx.value = 0 })
watch(open, async (v) => { if (v) { q.value = ''; await nextTick(); input.value?.focus() } })

function go(h: { cat: Category; item: AnyItem }) { open.value = false; router.push(`/product/${h.cat}/${h.item.id}`) }
function onKey(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); open.value = !open.value; return }
  if (!open.value) return
  if (e.key === 'Escape') open.value = false
  if (e.key === 'ArrowDown') { e.preventDefault(); idx.value = Math.min(hits.value.length - 1, idx.value + 1) }
  if (e.key === 'ArrowUp') { e.preventDefault(); idx.value = Math.max(0, idx.value - 1) }
  if (e.key === 'Enter' && hits.value[idx.value]) go(hits.value[idx.value])
}
onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <transition name="fade">
    <div v-if="open" class="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-start justify-center p-4 pt-[12vh]" @click.self="open = false">
      <div class="card w-full max-w-xl overflow-hidden" role="dialog" :aria-label="t('search.title')">
        <div class="flex items-center gap-2 px-4 border-b border-line">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" class="text-muted"><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2" /><path d="M20 20l-3.5-3.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" /></svg>
          <input ref="input" v-model="q" class="flex-1 bg-transparent py-3.5 text-base outline-none placeholder:text-muted/60" :placeholder="t('search.ph')" />
          <kbd class="badge">Esc</kbd>
        </div>
        <ul v-if="hits.length" class="max-h-[50vh] overflow-y-auto py-1">
          <li v-for="(h, i) in hits" :key="h.cat + h.item.id">
            <button class="w-full text-left px-4 py-2.5 flex items-center gap-3 text-sm" :class="i === idx ? 'bg-accent/10' : 'hover:bg-accent/5'" @mouseenter="idx = i" @click="go(h)">
              <BrandLogo :brand="h.item.brand" :size="18" />
              <span class="badge w-14 justify-center">{{ catLabel(h.cat) }}</span>
              <span class="flex-1 font-medium truncate">{{ displayName(h.item) }}</span>
              <span class="text-xs text-muted whitespace-nowrap">{{ formLabel(h.item.form) }} · {{ yearOf(h.item.release) }}</span>
            </button>
          </li>
        </ul>
        <div v-else-if="q.trim()" class="px-4 py-8 text-center text-sm text-muted">{{ t('search.empty') }}</div>
        <div class="px-4 py-2 text-[11px] text-muted border-t border-line">{{ t('search.hint') }}</div>
      </div>
    </div>
  </transition>
</template>
