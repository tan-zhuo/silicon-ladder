<script setup lang="ts">
withDefaults(defineProps<{ variant?: 'primary' | 'ghost' | 'subtle'; size?: 'md' | 'sm'; block?: boolean; type?: 'button' | 'submit' }>(), { variant: 'ghost', size: 'md', block: false, type: 'button' })
</script>

<template>
  <button
    :type="type"
    class="ui-control inline-flex items-center justify-center gap-1.5 rounded-sm font-medium whitespace-nowrap select-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 disabled:opacity-40 disabled:cursor-not-allowed"
    :class="[
      size === 'sm' ? 'h-8 px-3 text-xs' : 'h-9 px-4 text-sm',
      variant === 'primary' ? 'bg-inverse text-inverseFg hover:opacity-90 shadow-sm' : '',
      variant === 'ghost' ? 'border border-line bg-card text-muted hover:text-fg hover:border-line2 hover:bg-card2 shadow-sm' : '',
      variant === 'subtle' ? 'bg-card2 text-fg hover:bg-card3' : '',
      block ? 'w-full' : '',
    ]"
  ><slot /></button>
</template>
