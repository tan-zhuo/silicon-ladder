<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Category, Cpu, Gpu, Ram, Storage, Psu } from '@/types/hardware'
import { useCatalog } from '@/data/load'
import { useCompare } from '@/stores/compare'
import { scorePool, sortRows, SORT_DEFS } from '@/utils/rank'
import { CATEGORY_LABEL, FORM_LABEL, INTERFACE_LABEL, MODULAR_LABEL, price, num, iops, capacity, bool, DASH } from '@/utils/format'
import ScoreBar from '@/components/ScoreBar.vue'
import BrandLogo from '@/components/BrandLogo.vue'
import { cpuPlatform, gpuPlatform, ramPlatform, storagePlatform, psuPlatform, type Row } from '@/data/platforms'

const route = useRoute()
const router = useRouter()
const catalog = useCatalog()
const compare = useCompare()

const category = computed(() => route.params.category as Category)
const id = computed(() => route.params.id as string)
const item = computed(() => catalog.find(category.value, id.value))

const pool = computed(() => (item.value ? catalog.byCategory(category.value).filter((i) => i.form === item.value!.form) : []))
const scored = computed(() => scorePool(category.value, pool.value))
const row = computed(() => scored.value.find((r) => r.item.id === id.value))
const ranked = computed(() => sortRows(category.value, scored.value, SORT_DEFS[category.value][0].key))
const rankPos = computed(() => ranked.value.find((r) => r.item.id === id.value)?.rank ?? null)

const similar = computed(() => {
  if (!row.value) return []
  const me = row.value.rel.overall ?? null
  const psu = category.value === 'psu'
  return ranked.value
    .filter((r) => r.item.id !== id.value)
    .sort((a, b) => {
      if (psu) return Math.abs(a.rank - (rankPos.value ?? 0)) - Math.abs(b.rank - (rankPos.value ?? 0))
      const da = me === null || a.rel.overall === null ? 999 : Math.abs((a.rel.overall ?? 0) - me)
      const db = me === null || b.rel.overall === null ? 999 : Math.abs((b.rel.overall ?? 0) - me)
      return da - db
    })
    .slice(0, 3)
})

type Spec = [string, string]
const specs = computed<Spec[]>(() => {
  const it = item.value
  if (!it) return []
  if (category.value === 'cpu') {
    const c = it as Cpu
    return [
      ['系列', c.series], ['代数', c.gen], ['插槽', c.socket], ['核心 / 线程', c.cores], ['频率', c.clocks],
      ['TDP', c.tdp_range ? `${c.tdp_w}W (${c.tdp_range})` : `${c.tdp_w}W`], ['核显', c.igpu ?? DASH], ['L3 缓存', c.cache_l3], ['内存支持', c.mem], ['参考价', price(c.price_cny)],
    ]
  }
  if (category.value === 'gpu') {
    const g = it as Gpu
    return [
      ['系列', g.series], ['架构', g.gen], ['核心', g.chip], ['显存', `${g.vram_gb}GB ${g.vram_type}`], ['位宽', `${g.bus_bit}-bit`],
      [g.form === 'desktop' ? 'TBP' : 'TGP', g.form === 'desktop' ? `${g.tdp_w}W` : `${g.tgp_w ?? g.tdp_w}W${g.tgp_range ? ' (' + g.tgp_range + ')' : ''}`], ['参考价', price(g.price_cny)],
    ]
  }
  if (category.value === 'ram') {
    const r = it as Ram
    return [['类型', r.type], ['规格', r.spec], ['容量', `${r.capacity_gb}GB`], ['速率', `${r.speed_mt} MT/s`], ['CL', r.cl == null ? DASH : String(r.cl)], ['写带宽', r.scores.write_GBs == null ? DASH : `${r.scores.write_GBs} GB/s`], ['参考价', price(r.price_cny)]]
  }
  if (category.value === 'storage') {
    const s = it as Storage
    return [
      ['接口', INTERFACE_LABEL[s.interface]], ['容量', capacity(s.capacity_gb)], ['颗粒', s.nand ?? DASH], ['DRAM 缓存', bool(s.dram)],
      ['顺序读 / 写', `${num(s.seq_read)} / ${num(s.seq_write)} MB/s`], ['4K 随机读', iops(s.iops_4k_read) + (s.iops_4k_read ? ' IOPS' : '')],
      ['缓外写入', s.write_cache_out == null ? DASH : `${num(s.write_cache_out)} MB/s`], ['TBW', s.tbw == null ? DASH : `${num(s.tbw)} TB`], ['参考价', price(s.price_cny)],
    ]
  }
  const p = it as Psu
  return [['瓦数', `${p.watt}W`], ['品质分档', p.tier], ['认证', p.efficiency], ['ATX 3.1 / 12V-2x6', bool(p.atx31)], ['模组', MODULAR_LABEL[p.modular]], ['代工 (OEM)', p.oem], ['参考价', price(p.price_cny)]]
})

const scoreCards = computed(() => {
  if (!row.value || category.value === 'psu') return []
  const rawText = (k: string) => {
    const v = row.value!.raw[k]
    if (v == null) return DASH
    if (category.value === 'cpu' && (k === 'single' || k === 'multi')) return num(v as number)
    if (category.value === 'ram' && k === 'bandwidth') return `${v} GB/s`
    if (category.value === 'ram' && k === 'latency') return `${v} ns`
    if (category.value === 'storage' && k === 'random4k') return iops(v as number)
    if (category.value === 'storage' && (k === 'seqRead' || k === 'cacheOut')) return `${num(v as number)} MB/s`
    if (category.value === 'storage' && k === 'endurance') return `${v} TBW/GB`
    if (typeof v === 'number') return String(Math.round(v * 100) / 100)
    return String(v)
  }
  return SORT_DEFS[category.value]
    .map((s) => ({ key: s.key, label: s.label, rel: row.value!.rel[s.key] ?? null, raw: s.key === 'overall' || s.key === 'value' ? null : rawText(s.key) }))
    .filter((s) => s.rel !== null || scored.value.some((r) => r.rel[s.key] != null))
})

const platformRows = computed<Row[]>(() => {
  const it = item.value
  if (!it) return []
  switch (category.value) {
    case 'cpu': return cpuPlatform(it as Cpu)
    case 'gpu': return gpuPlatform(it as Gpu)
    case 'ram': return ramPlatform(it as Ram)
    case 'storage': return storagePlatform(it as Storage)
    case 'psu': return psuPlatform(it as Psu)
  }
})

const inCompare = computed(() => item.value ? compare.has(category.value, item.value.id) : false)
function useCase(): string {
  const it = item.value
  if (!it) return ''
  const tags = (it as { tags?: string[] }).tags ?? []
  return tags.length ? `适合：${tags.join(' / ')}` : it.summary
}
</script>

<template>
  <div v-if="!item" class="card p-10 text-center text-muted">
    未找到该产品。<router-link :to="`/rank/${category}`" class="text-accent underline underline-offset-4">返回排行榜</router-link>
  </div>
  <div v-else class="space-y-6">
    <nav class="text-xs text-muted">
      <router-link to="/" class="hover:text-fg">首页</router-link> /
      <router-link :to="{ path: `/rank/${category}`, query: { form: item.form } }" class="hover:text-fg">{{ FORM_LABEL[item.form] }} {{ CATEGORY_LABEL[category] }}</router-link> /
      <span class="text-fg">{{ item.name }}</span>
    </nav>

    <header class="card p-5 sm:p-6">
      <div class="flex flex-wrap items-start gap-4">
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 flex-wrap">
            <BrandLogo :brand="item.brand" :size="22" />
            <span class="text-sm text-muted">{{ item.brand }}</span>
            <span class="text-[11px] px-1.5 py-0.5 rounded bg-line text-muted">{{ FORM_LABEL[item.form] }}</span>
            <span class="text-xs text-muted">发布 {{ item.release }}</span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-semibold mt-2">{{ item.name }}</h1>
          <div v-if="item.nameEn && item.nameEn !== item.name" class="text-sm text-muted">{{ item.nameEn }}</div>
          <p class="mt-3 text-fg/90">{{ item.summary }}</p>
          <p class="text-sm text-muted mt-1">{{ useCase() }}</p>
        </div>
        <div class="text-right">
          <div v-if="rankPos" class="text-xs text-muted">同池{{ category === 'psu' ? '分档' : '综合' }}排名</div>
          <div v-if="rankPos" class="text-3xl font-semibold" :class="rankPos === 1 ? 'text-yellow-400' : ''">#{{ rankPos }}</div>
          <button class="btn mt-2" :class="inCompare ? '!bg-line !text-fg' : ''" @click="compare.toggle(category, item.id)">
            {{ inCompare ? '已在对比篮' : '加入对比' }}
          </button>
        </div>
      </div>
    </header>

    <div class="grid lg:grid-cols-5 gap-4">
      <section class="card p-5 lg:col-span-3">
        <h2 class="font-semibold mb-3">关键规格</h2>
        <dl class="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3 text-sm">
          <div v-for="[k, v] in specs" :key="k">
            <dt class="text-xs text-muted">{{ k }}</dt>
            <dd class="mt-0.5">{{ v }}</dd>
          </div>
        </dl>
      </section>

      <section class="card p-5 lg:col-span-2">
        <h2 class="font-semibold mb-3">分数</h2>
        <div v-if="category === 'psu'" class="text-sm text-muted">电源不做性能跑分。分档 <span class="text-fg font-semibold text-lg">{{ (item as Psu).tier }}</span> 表示电气品质与用料等级（A 最佳）。</div>
        <div v-else class="space-y-3">
          <div v-for="s in scoreCards" :key="s.key">
            <div class="flex justify-between text-xs text-muted mb-1">
              <span>{{ s.label }}</span>
              <span v-if="s.raw">原始值 {{ s.raw }}</span>
            </div>
            <ScoreBar :value="s.rel" :color="s.key === 'overall' ? '#5B8CFF' : '#3B5FB8'" />
          </div>
          <p class="text-xs text-muted pt-2">相对分在同形态池内归一，池内最高为 100。</p>
        </div>
      </section>
    </div>

    <section v-if="platformRows.length" class="card p-5">
      <h2 class="font-semibold">平台与兼容性</h2>
      <p class="text-xs text-muted mt-1 mb-3">按插槽 / 架构整理的公开规格，装机前请以主板厂商支持列表为准。</p>
      <dl class="divide-y divide-line/60">
        <div v-for="r in platformRows" :key="r.label" class="grid grid-cols-[7rem_1fr] sm:grid-cols-[9rem_1fr] gap-3 py-2.5 text-sm">
          <dt class="text-muted">{{ r.label }}</dt>
          <dd>
            <div>{{ r.value }}</div>
            <div v-if="r.note" class="text-xs text-muted mt-0.5">{{ r.note }}</div>
          </dd>
        </div>
      </dl>
    </section>

    <section v-if="similar.length">
      <h2 class="font-semibold mb-3">同类推荐</h2>
      <div class="grid sm:grid-cols-3 gap-3">
        <button v-for="r in similar" :key="r.item.id" class="card card-hover p-4 text-left" @click="router.push(`/product/${category}/${r.item.id}`)">
          <div class="flex items-center gap-2">
            <BrandLogo :brand="r.item.brand" :size="16" />
            <span class="font-medium">{{ r.item.name }}</span>
          </div>
          <div class="text-xs text-muted mt-1">#{{ r.rank }}<span v-if="r.rel.overall != null"> · 综合 {{ r.rel.overall?.toFixed(1) }}</span></div>
          <div class="text-sm text-muted mt-1">{{ r.item.summary }}</div>
        </button>
      </div>
    </section>
  </div>
</template>
