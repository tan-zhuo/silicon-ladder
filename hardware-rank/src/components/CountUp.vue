<script setup lang="ts">
// 数字计数动画：纯数字（可含千分位）从 0 滚到目标值；非数字原样输出。尊重 prefers-reduced-motion。
import { ref, watch, onMounted } from 'vue'
const props = withDefaults(defineProps<{ value: string | number | null | undefined; duration?: number; decimals?: number }>(), { duration: 900, decimals: 0 })
const shown = ref<string>('')
const target = () => { const n = Number(String(props.value ?? '').replace(/,/g, '')); return Number.isFinite(n) && String(props.value ?? '').trim() !== '' ? n : null }
const fmt = (n: number) => n.toLocaleString('en-US', { minimumFractionDigits: props.decimals, maximumFractionDigits: props.decimals })
let raf = 0
function run() {
  cancelAnimationFrame(raf)
  const to = target()
  if (to === null) { shown.value = String(props.value ?? ''); return }
  if (typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches) { shown.value = fmt(to); return }
  const t0 = performance.now()
  const step = (t: number) => {
    const p = Math.min(1, (t - t0) / props.duration)
    const e = 1 - Math.pow(1 - p, 3)
    shown.value = fmt(to * e)
    if (p < 1) raf = requestAnimationFrame(step)
  }
  raf = requestAnimationFrame(step)
}
onMounted(run)
watch(() => props.value, run)
</script>

<template><span>{{ shown }}</span></template>
