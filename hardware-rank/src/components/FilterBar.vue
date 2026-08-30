<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Category } from '@/types/hardware'
import type { FilterState } from '@/utils/filters'
import { INTERFACE_LABEL } from '@/utils/format'

const props = defineProps<{
  category: Category
  modelValue: FilterState
  brands: string[]
  gens: string[]
}>()
const emit = defineEmits<{ 'update:modelValue': [v: FilterState] }>()

const open = ref(false)
function set<K extends keyof FilterState>(k: K, v: FilterState[K]) {
  emit('update:modelValue', { ...props.modelValue, [k]: v })
}
function toggleBrand(b: string) {
  const cur = props.modelValue.brand
  set('brand', cur.includes(b) ? cur.filter((x) => x !== b) : [...cur, b])
}
function numInput(e: Event): number | null {
  const v = (e.target as HTMLInputElement).value
  return v === '' ? null : Number(v)
}
const showTdp = computed(() => props.category === 'cpu' || props.category === 'gpu')
const showTgpTier = computed(() => props.category === 'gpu' && props.modelValue.form === 'laptop')
const activeCount = computed(() => {
  const f = props.modelValue
  let n = f.brand.length + (f.gen ? 1 : 0) + (f.tdpMin !== null ? 1 : 0) + (f.tdpMax !== null ? 1 : 0)
  n += (f.tgpTier ? 1 : 0) + (f.interface ? 1 : 0) + (f.wattMin !== null ? 1 : 0) + (f.wattMax !== null ? 1 : 0) + (f.tier ? 1 : 0) + (f.atx31 ? 1 : 0)
  return n
})
function reset() {
  emit('update:modelValue', {
    ...props.modelValue, brand: [], gen: '', q: '', tdpMin: null, tdpMax: null, tgpTier: '', interface: '', wattMin: null, wattMax: null, tier: '', atx31: false,
  })
}
</script>

<template>
  <div class="card p-3 sm:p-4">
    <div class="flex items-center gap-2">
      <div class="relative flex-1">
        <svg class="absolute left-2.5 top-2 text-muted" width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2" /><path d="M20 20l-3.5-3.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" /></svg>
        <input class="input pl-8" :value="modelValue.q" placeholder="搜索型号 / 品牌 / id" @input="set('q', ($event.target as HTMLInputElement).value)" />
      </div>
      <button class="btn-ghost md:hidden" @click="open = !open">
        筛选<span v-if="activeCount" class="ml-1 text-accent">({{ activeCount }})</span>
      </button>
      <button v-if="activeCount || modelValue.q" class="btn-ghost hidden md:inline-flex" @click="reset">清除</button>
    </div>

    <div class="mt-3 flex-col gap-3" :class="open ? 'flex' : 'hidden md:flex'">
      <div class="flex flex-wrap items-center gap-2">
        <span class="text-xs text-muted w-10">品牌</span>
        <button v-for="b in brands" :key="b" class="pill !py-1" :class="{ 'pill-active': modelValue.brand.includes(b) }" @click="toggleBrand(b)">{{ b }}</button>
      </div>

      <div v-if="gens.length" class="flex flex-wrap items-center gap-2">
        <span class="text-xs text-muted w-10">代数</span>
        <button class="pill !py-1" :class="{ 'pill-active': !modelValue.gen }" @click="set('gen', '')">全部</button>
        <button v-for="g in gens" :key="g" class="pill !py-1" :class="{ 'pill-active': modelValue.gen === g }" @click="set('gen', g)">{{ g }}</button>
      </div>

      <div v-if="showTdp" class="flex flex-wrap items-center gap-2">
        <span class="text-xs text-muted w-10">{{ category === 'gpu' ? 'TGP/TDP' : 'TDP' }}</span>
        <input class="input !w-24" type="number" placeholder="最小 W" :value="modelValue.tdpMin ?? ''" @change="set('tdpMin', numInput($event))" />
        <span class="text-muted">–</span>
        <input class="input !w-24" type="number" placeholder="最大 W" :value="modelValue.tdpMax ?? ''" @change="set('tdpMax', numInput($event))" />
        <template v-if="showTgpTier">
          <span class="text-xs text-muted ml-2">TGP 档</span>
          <button v-for="t in [['', '全部'], ['low', '≤80W'], ['mid', '81–120W'], ['high', '≥121W']]" :key="t[0]" class="pill !py-1" :class="{ 'pill-active': modelValue.tgpTier === t[0] }" @click="set('tgpTier', t[0])">{{ t[1] }}</button>
        </template>
      </div>

      <div v-if="category === 'storage'" class="flex flex-wrap items-center gap-2">
        <span class="text-xs text-muted w-10">接口</span>
        <button class="pill !py-1" :class="{ 'pill-active': !modelValue.interface }" @click="set('interface', '')">全部</button>
        <button v-for="(label, k) in INTERFACE_LABEL" :key="k" class="pill !py-1" :class="{ 'pill-active': modelValue.interface === k }" @click="set('interface', k)">{{ label }}</button>
      </div>

      <template v-if="category === 'psu'">
        <div class="flex flex-wrap items-center gap-2">
          <span class="text-xs text-muted w-10">瓦数</span>
          <input class="input !w-24" type="number" placeholder="最小 W" :value="modelValue.wattMin ?? ''" @change="set('wattMin', numInput($event))" />
          <span class="text-muted">–</span>
          <input class="input !w-24" type="number" placeholder="最大 W" :value="modelValue.wattMax ?? ''" @change="set('wattMax', numInput($event))" />
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <span class="text-xs text-muted w-10">分档</span>
          <button class="pill !py-1" :class="{ 'pill-active': !modelValue.tier }" @click="set('tier', '')">全部</button>
          <button v-for="t in ['A', 'B', 'C', 'D']" :key="t" class="pill !py-1" :class="{ 'pill-active': modelValue.tier === t }" @click="set('tier', t)">{{ t }}</button>
          <label class="ml-2 inline-flex items-center gap-2 text-sm text-muted cursor-pointer">
            <input type="checkbox" class="accent-accent" :checked="modelValue.atx31" @change="set('atx31', ($event.target as HTMLInputElement).checked)" />
            仅 ATX 3.1 / 12V-2x6
          </label>
        </div>
      </template>

      <button v-if="activeCount || modelValue.q" class="btn-ghost md:hidden self-start" @click="reset">清除筛选</button>
    </div>
  </div>
</template>
