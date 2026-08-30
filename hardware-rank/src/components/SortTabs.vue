<script setup lang="ts">
defineProps<{ options: { key: string; label: string }[]; modelValue: string }>()
const emit = defineEmits<{ 'update:modelValue': [v: string] }>()
</script>

<template>
  <div class="flex items-center gap-2 overflow-x-auto pb-1">
    <span class="text-xs text-muted whitespace-nowrap">排序</span>
    <div class="inline-flex bg-card border border-line rounded-full p-0.5">
      <button
        v-for="o in options" :key="o.key"
        class="px-3 py-1 rounded-full text-sm whitespace-nowrap transition-colors"
        :class="o.key === modelValue ? 'bg-accent text-white' : 'text-muted hover:text-fg'"
        @click="emit('update:modelValue', o.key)"
      >{{ o.label }}</button>
    </div>
  </div>
</template>
