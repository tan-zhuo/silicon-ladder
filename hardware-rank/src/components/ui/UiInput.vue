<script setup lang="ts">
withDefaults(defineProps<{ type?: string; placeholder?: string; size?: 'md' | 'sm'; icon?: boolean }>(), { type: 'text', placeholder: '', size: 'md', icon: false })
const model = defineModel<string | number | null>()
defineEmits<{ change: [e: Event] }>()
</script>

<template>
  <div class="relative inline-flex w-full">
    <span v-if="icon" class="absolute left-2.5 inset-y-0 flex items-center text-muted pointer-events-none"><slot name="icon" /></span>
    <input
      v-model="model" :type="type" :placeholder="placeholder"
      class="ui-control w-full rounded-sm border border-line bg-card text-fg placeholder:text-faint hover:border-line2 focus:outline-none focus:border-line3 focus:ring-[3px] focus:ring-accent/20 transition-colors appearance-none"
      :class="[size === 'sm' ? 'h-8 px-2.5 text-xs' : 'h-9 px-3 text-sm', icon ? 'pl-8' : '']"
      @change="$emit('change', $event)"
    />
  </div>
</template>

<style scoped>
input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
input[type=number] { -moz-appearance: textfield; }
</style>
