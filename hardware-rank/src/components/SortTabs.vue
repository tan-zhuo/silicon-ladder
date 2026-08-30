<script setup lang="ts">
import { useI18n } from '@/i18n'
defineProps<{ options: { key: string }[]; modelValue: string }>()
const emit = defineEmits<{ 'update:modelValue': [v: string] }>()
const { t } = useI18n()
</script>

<template>
  <div class="flex items-center gap-2 overflow-x-auto pb-1">
    <span class="text-xs text-muted whitespace-nowrap">{{ t('rank.sortLabel') }}</span>
    <div class="seg">
      <button
        v-for="o in options" :key="o.key" class="seg-btn" :class="{ 'seg-active': o.key === modelValue }"
        @click="emit('update:modelValue', o.key)"
      >{{ t('sort.' + o.key) }}</button>
    </div>
  </div>
</template>
