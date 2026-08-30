<script setup lang="ts">
import { rel as fmt } from '@/utils/format'
defineProps<{ value: number | null | undefined; raw?: string | null; color?: string }>()
</script>

<template>
  <div class="flex items-center gap-2 justify-end">
    <div class="flex-1 min-w-[56px] h-1.5 rounded-full bg-line overflow-hidden">
      <div
        v-if="value !== null && value !== undefined"
        class="h-full rounded-full"
        :style="{ width: Math.min(100, Math.max(0, value)) + '%', background: color || '#5B8CFF' }"
      />
    </div>
    <span class="w-12 text-right text-sm" :class="value == null ? 'text-muted' : ''">{{ fmt(value) }}</span>
    <span v-if="raw" class="hidden lg:inline text-xs text-muted w-16 text-right">{{ raw }}</span>
  </div>
</template>
