<script setup lang="ts">
withDefaults(defineProps<{ variant?: 'primary' | 'ghost' | 'subtle'; size?: 'md' | 'sm'; block?: boolean; type?: 'button' | 'submit' }>(), { variant: 'ghost', size: 'md', block: false, type: 'button' })
</script>

<template>
  <button
    :type="type"
    class="ui-control inline-flex items-center justify-center gap-1.5 rounded-lg font-medium whitespace-nowrap select-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 disabled:opacity-40 disabled:cursor-not-allowed"
    :class="[
      size === 'sm' ? 'h-8 px-3 text-xs' : 'h-9 px-4 text-sm',
      variant === 'primary' ? 'bg-accent text-white hover:brightness-110 shadow-[0_6px_18px_-8px_rgb(var(--c-accent)/.8)]' : '',
      variant === 'ghost' ? 'border border-line bg-card text-muted hover:text-fg hover:border-accent/60' : '',
      variant === 'subtle' ? 'bg-card2 text-fg hover:bg-line/60' : '',
      block ? 'w-full' : '',
    ]"
  ><slot /></button>
</template>
