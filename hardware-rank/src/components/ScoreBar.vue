<script setup lang="ts">
import { rel as fmt } from '@/utils/format'
withDefaults(defineProps<{ value: number | null | undefined; raw?: string | null; dim?: boolean; height?: number }>(), { dim: false, height: 6 })
</script>

<template>
  <div class="flex items-center gap-2 justify-end">
    <span v-if="raw" class="hidden 2xl:inline text-[11px] text-muted w-16 text-right truncate">{{ raw }}</span>
    <div class="flex-1 min-w-[40px] rounded-full overflow-hidden" role="meter" aria-valuemin="0" aria-valuemax="100" :aria-valuenow="value ?? undefined" :style="{ height: height + 'px', background: 'var(--bar-track)' }">
      <div
        v-if="value !== null && value !== undefined"
        class="h-full rounded-full"
        :style="{ width: Math.min(100, Math.max(0, value)) + '%', background: dim ? 'var(--bar-fill-dim)' : 'var(--bar-fill)' }"
      />
    </div>
    <span class="w-11 text-right text-sm font-medium" :class="value == null ? 'text-muted' : ''">{{ fmt(value) }}</span>
  </div>
</template>
