<script setup lang="ts">
defineProps<{ options: { key: string; label: string }[]; modelValue: string }>()
const emit = defineEmits<{ 'update:modelValue': [v: string] }>()
</script>

<template>
  <div class="flex gap-2 overflow-x-auto pb-1">
    <button
      v-for="o in options" :key="o.key"
      class="pill" :class="{ 'pill-active': o.key === modelValue }"
      @click="emit('update:modelValue', o.key)"
    >{{ o.label }}</button>
  </div>
</template>
