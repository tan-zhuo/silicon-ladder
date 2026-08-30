<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import type { Category, AnyItem, Cpu, Gpu, Ram, Storage, Psu, RankedRow } from '@/types/hardware'
import { useCatalog } from '@/data/load'
import { useCompare } from '@/stores/compare'
import BrandLogo from '@/components/BrandLogo.vue'
import { scoreAllPools, SORT_DEFS } from '@/utils/rank'
import { CATEGORY_LABEL, FORM_LABEL, INTERFACE_LABEL, MODULAR_LABEL, price, num, iops, bool, capacity, DASH, rel as fmtRel } from '@/utils/format'

const route = useRoute()
const catalog = useCatalog()
const compare = useCompare()

const CATS: Category[] = ['cpu', 'gpu', 'ram', 'storage', 'psu']

/** 解析 ids=cpu:a,cpu:b；若缺失则用对比篮 */
const parsed = computed<{ cat: Category | null; ids: string[] }>(() => {
  const raw = String(route.query.ids ?? '')
  if (raw) {
    const pairs = raw.split(',').map((s) => s.split(':')).filter((p) => p.length === 2)
    const cat = pairs[0]?.[0] as Category | undefined
    if (cat && CATS.includes(cat)) {
      return { cat, ids: pairs.filter((p) => p[0] === cat).map((p) => p[1]).slice(0, 4) }
    }
  }
  return { cat: compare.category, ids: compare.ids.slice(0, 4) }
})

onMounted(() => {
  // 从 URL 进入时同步到对比篮
  if (parsed.value.cat && parsed.value.ids.length && route.query.ids) {
    compare.category = parsed.value.cat
    compare.ids = parsed.value.ids.filter((id) => catalog.find(parsed.value.cat!, id))
  }
})

const cat = computed(() => parsed.value.cat)
const items = computed<AnyItem[]>(() => (cat.value ? parsed.value.ids.map((id) => catalog.find(cat.value!, id)).filter((x): x is AnyItem => !!x) : []))
const scoreMap = computed(() => (cat.value ? scoreAllPools(cat.value, catalog.byCategory(cat.value)) : new Map<string, RankedRow>()))
const rows = computed(() => items.value.map((i) => scoreMap.value.get(i.id)!).filter(Boolean))
const mixedForm = computed(() => new Set(items.value.map((i) => i.form)).size > 1)

type SpecRow = { label: string; values: string[] }
const specRows = computed<SpecRow[]>(() => {
  const its = items.value
  if (!cat.value || !its.length) return []
  const mk = (label: string, f: (i: AnyItem) => string): SpecRow => ({ label, values: its.map(f) })
  const common = [mk('品牌', (i) => i.brand), mk('形态', (i) => FORM_LABEL[i.form]), mk('发布', (i) => i.release), mk('参考价', (i) => price(i.price_cny))]
  switch (cat.value) {
    case 'cpu': return [...common, mk('核心 / 线程', (i) => (i as Cpu).cores), mk('频率', (i) => (i as Cpu).clocks), mk('TDP', (i) => `${(i as Cpu).tdp_w}W`), mk('插槽', (i) => (i as Cpu).socket), mk('核显', (i) => (i as Cpu).igpu ?? DASH), mk('L3', (i) => (i as Cpu).cache_l3), mk('内存', (i) => (i as Cpu).mem)]
    case 'gpu': return [...common, mk('核心', (i) => (i as Gpu).chip), mk('显存', (i) => `${(i as Gpu).vram_gb}GB ${(i as Gpu).vram_type}`), mk('位宽', (i) => `${(i as Gpu).bus_bit}-bit`), mk('TGP/TDP', (i) => `${(i as Gpu).tgp_w ?? (i as Gpu).tdp_w}W`)]
    case 'ram': return [...common, mk('规格', (i) => (i as Ram).spec), mk('容量', (i) => `${(i as Ram).capacity_gb}GB`), mk('速率', (i) => `${(i as Ram).speed_mt} MT/s`), mk('CL', (i) => (i as Ram).cl == null ? DASH : String((i as Ram).cl))]
    case 'storage': return [...common, mk('接口', (i) => INTERFACE_LABEL[(i as Storage).interface]), mk('容量', (i) => capacity((i as Storage).capacity_gb)), mk('DRAM', (i) => bool((i as Storage).dram)), mk('顺序读', (i) => `${num((i as Storage).seq_read)} MB/s`), mk('顺序写', (i) => `${num((i as Storage).seq_write)} MB/s`), mk('4K 随机读', (i) => iops((i as Storage).iops_4k_read)), mk('缓外写入', (i) => (i as Storage).write_cache_out == null ? DASH : `${num((i as Storage).write_cache_out)} MB/s`), mk('TBW', (i) => (i as Storage).tbw == null ? DASH : `${(i as Storage).tbw} TB`)]
    case 'psu': return [...common, mk('瓦数', (i) => `${(i as Psu).watt}W`), mk('分档', (i) => (i as Psu).tier), mk('认证', (i) => (i as Psu).efficiency), mk('ATX 3.1', (i) => bool((i as Psu).atx31)), mk('模组', (i) => MODULAR_LABEL[(i as Psu).modular]), mk('OEM', (i) => (i as Psu).oem)]
  }
})

const scoreKeys = computed(() => (cat.value && cat.value !== 'psu' ? SORT_DEFS[cat.value].filter((s) => s.key !== 'value') : []))
</script>

<template>
  <div class="space-y-4">
    <h1 class="text-2xl font-semibold">对比{{ cat ? ` · ${CATEGORY_LABEL[cat]}` : '' }}</h1>

    <div v-if="items.length < 2" class="card p-10 text-center text-muted">
      对比篮里至少需要 2 项。去
      <router-link :to="cat ? `/rank/${cat}` : '/rank/cpu'" class="text-accent underline underline-offset-4">排行榜</router-link>
      勾选产品（同品类最多 4 项）。
    </div>

    <template v-else>
      <div v-if="mixedForm" class="notice-warn">你正在对比不同形态的产品，性能数字不能当换机依据。不同形态不可直接比较性能。</div>

      <div class="card overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-line">
              <th class="text-left px-4 py-3 text-xs text-muted w-32">指标</th>
              <th v-for="it in items" :key="it.id" class="text-left px-4 py-3 min-w-[160px]">
                <div class="flex items-center gap-2">
                  <BrandLogo :brand="it.brand" :size="18" />
                  <router-link :to="`/product/${cat}/${it.id}`" class="font-medium hover:text-accent">{{ it.name }}</router-link>
                </div>
                <div class="text-[11px] text-muted font-normal mt-0.5">{{ FORM_LABEL[it.form] }} <button class="ml-1 hover:text-fg" @click="compare.remove(it.id)">移除</button></div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr><td :colspan="items.length + 1" class="px-4 pt-3 pb-1 text-xs font-semibold text-accent">规格</td></tr>
            <tr v-for="r in specRows" :key="r.label" class="border-b border-line/50">
              <td class="px-4 py-2.5 text-muted">{{ r.label }}</td>
              <td v-for="(v, i) in r.values" :key="i" class="px-4 py-2.5">{{ v }}</td>
            </tr>

            <template v-if="scoreKeys.length">
              <tr><td :colspan="items.length + 1" class="px-4 pt-4 pb-1 text-xs font-semibold text-accent">分数（同形态池相对分）</td></tr>
              <tr v-for="s in scoreKeys" :key="s.key" class="border-b border-line/50 last:border-0">
                <td class="px-4 py-3 text-muted">{{ s.label }}</td>
                <td v-for="row in rows" :key="row.item.id" class="px-4 py-3">
                  <div class="flex items-center gap-2">
                    <div class="flex-1 h-2 rounded-full bg-line overflow-hidden">
                      <div v-if="row.rel[s.key] != null" class="h-full rounded-full" :style="{ width: Math.min(100, row.rel[s.key] as number) + '%', background: row.rel[s.key] === Math.max(...rows.map(r => r.rel[s.key] ?? -1)) ? '#5B8CFF' : '#3B5FB8' }" />
                    </div>
                    <span class="w-12 text-right">{{ s.key === 'latency' && row.raw.latency != null ? row.raw.latency + 'ns' : fmtRel(row.rel[s.key]) }}</span>
                  </div>
                </td>
              </tr>
            </template>
            <tr v-else><td :colspan="items.length + 1" class="px-4 py-4 text-xs text-muted">电源不做性能跑分，仅比较规格与分档。</td></tr>
          </tbody>
        </table>
      </div>

      <div class="flex gap-2">
        <router-link :to="`/rank/${cat}`" class="btn-ghost">继续添加</router-link>
        <button class="btn-ghost" @click="compare.clear()">清空对比篮</button>
      </div>
    </template>
  </div>
</template>
