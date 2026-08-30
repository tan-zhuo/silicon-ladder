<script setup lang="ts">
import { useI18n } from '@/i18n'
defineProps<{ options: { key: string }[]; modelValue: string; counts?: Record<string, number> }>()
const emit = defineEmits<{ 'update:modelValue': [v: string] }>()
const { t } = useI18n()
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <button
      v-for="o in options" :key="o.key"
      class="pill" :class="{ 'pill-active': o.key === modelValue }"
      @click="emit('update:modelValue', o.key)"
    >{{ t('form.' + o.key) }}<span v-if="counts && counts[o.key] != null" class="ml-1.5 text-xs opacity-70">{{ counts[o.key] }}</span></button>
  </div>
</template>
