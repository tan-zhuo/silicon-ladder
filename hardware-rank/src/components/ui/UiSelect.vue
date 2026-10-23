<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
export interface UiOption { value: string; label: string }
const props = withDefaults(defineProps<{ options: UiOption[]; size?: 'md' | 'sm'; ariaLabel?: string; align?: 'left' | 'right'; direction?: 'down' | 'up' | 'auto' }>(), { size: 'md', ariaLabel: '', align: 'left', direction: 'auto' })
const model = defineModel<string>({ default: '' })
const open = ref(false)
const root = ref<HTMLElement | null>(null)
const idx = ref(0)
const current = computed(() => props.options.find((o) => o.value === model.value) ?? props.options[0])
function choose(o: UiOption) { model.value = o.value; open.value = false }
const dropUp = ref(false)
function toggle() {
  open.value = !open.value
  idx.value = Math.max(0, props.options.findIndex((o) => o.value === model.value))
  if (open.value) {
    if (props.direction === 'auto') {
      const r = root.value?.getBoundingClientRect()
      // 预估菜单高度：每项约 34px + padding；放不下则向上弹
      dropUp.value = !!r && window.innerHeight - r.bottom < props.options.length * 34 + 16
    } else dropUp.value = props.direction === 'up'
  }
}
function onDoc(e: MouseEvent) { if (root.value && !root.value.contains(e.target as Node)) open.value = false }
function onKey(e: KeyboardEvent) {
  if (!open.value) { if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle() } return }
  if (e.key === 'Escape') open.value = false
  if (e.key === 'ArrowDown') { e.preventDefault(); idx.value = Math.min(props.options.length - 1, idx.value + 1) }
  if (e.key === 'ArrowUp') { e.preventDefault(); idx.value = Math.max(0, idx.value - 1) }
  if (e.key === 'Enter') { e.preventDefault(); choose(props.options[idx.value]) }
}
onMounted(() => document.addEventListener('mousedown', onDoc))
onUnmounted(() => document.removeEventListener('mousedown', onDoc))
</script>

<template>
  <div ref="root" class="relative inline-block" @keydown="onKey">
    <button
      type="button" role="combobox" :aria-expanded="open" :aria-label="ariaLabel"
      class="ui-control inline-flex items-center gap-1.5 rounded-sm border border-line bg-card text-fg hover:border-line2 hover:bg-card2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 transition-colors whitespace-nowrap shadow-sm"
      :class="size === 'sm' ? 'h-8 pl-2.5 pr-2 text-xs' : 'h-9 pl-3 pr-2.5 text-sm'"
      @click="toggle"
    >
      <slot name="prefix" />
      <span>{{ current?.label }}</span>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" class="text-muted transition-transform" :class="open ? 'rotate-180' : ''"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
    </button>
    <transition name="fade">
      <ul v-if="open" role="listbox" class="absolute z-50 min-w-full py-1 panel !rounded-md overflow-hidden" :class="[align === 'right' ? 'right-0' : 'left-0', dropUp ? 'bottom-full mb-1' : 'top-full mt-1']">
        <li
          v-for="(o, i) in options" :key="o.value" role="option" :aria-selected="o.value === model"
          class="px-3 py-1.5 text-sm cursor-pointer whitespace-nowrap flex items-center gap-2"
          :class="[i === idx ? 'bg-card2' : '', o.value === model ? 'font-medium' : '']"
          @mouseenter="idx = i" @click="choose(o)"
        >
          <span class="w-3.5 text-accent">{{ o.value === model ? '✓' : '' }}</span>{{ o.label }}
        </li>
      </ul>
    </transition>
  </div>
</template>
