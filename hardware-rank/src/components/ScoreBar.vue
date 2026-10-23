<script setup lang="ts">
import { rel as fmt } from '@/utils/format'
withDefaults(defineProps<{ value: number | null | undefined; raw?: string | null; dim?: boolean; height?: number; index?: number }>(), { dim: false, height: 4, index: 0 })
</script>

<template>
  <div class="flex items-center gap-2 justify-end">
    <span v-if="raw" class="hidden 2xl:inline num text-[11px] text-faint w-16 text-right truncate">{{ raw }}</span>
    <div class="flex-1 min-w-[40px] rounded-full overflow-hidden" role="meter" aria-valuemin="0" aria-valuemax="100" :aria-valuenow="value ?? undefined" :style="{ height: height + 'px', background: 'var(--bar-track)' }">
      <div
        v-if="value !== null && value !== undefined"
        class="h-full rounded-full bar-anim"
        :style="{ width: Math.min(100, Math.max(0, value)) + '%', background: dim ? 'var(--bar-fill-dim)' : 'var(--bar-fill)', '--i': Math.min(index, 40) }"
      />
    </div>
    <span class="num w-11 text-right text-[13px]" :class="value == null ? 'text-faint' : dim ? 'text-muted' : 'text-fg font-semibold'">{{ fmt(value) }}</span>
  </div>
</template>
