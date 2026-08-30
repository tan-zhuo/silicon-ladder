<script setup lang="ts">
withDefaults(defineProps<{ modelValue: boolean; size?: 'md' | 'sm'; ariaLabel?: string; label?: string }>(), { size: 'md', ariaLabel: '', label: '' })
const emit = defineEmits<{ 'update:modelValue': [v: boolean] }>()
</script>

<template>
  <label class="inline-flex items-center gap-2 cursor-pointer select-none" @click.stop>
    <span class="relative inline-flex" :class="size === 'sm' ? 'w-4 h-4' : 'w-[18px] h-[18px]'">
      <input type="checkbox" class="peer absolute inset-0 opacity-0 cursor-pointer" :checked="modelValue" :aria-label="ariaLabel || label" @change="emit('update:modelValue', ($event.target as HTMLInputElement).checked)" />
      <span class="w-full h-full rounded-[5px] border border-line bg-card transition-colors peer-checked:bg-accent peer-checked:border-accent peer-focus-visible:ring-2 peer-focus-visible:ring-accent/40 peer-hover:border-accent/60 flex items-center justify-center">
        <svg v-if="modelValue" width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L20 7" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" /></svg>
      </span>
    </span>
    <span v-if="label" class="text-xs text-muted">{{ label }}</span>
  </label>
</template>
