import type { Category, RankedRow, Cpu, Gpu, Ram, Storage, Psu, Mobo, Cooler } from '@/types/hardware'
import { num, iops, ifaceLabel, modularLabel, sizeLabel, coolerTypeLabel, DASH, vram } from '@/utils/format'

export interface Column {
  key: string
  /** i18n key under col.* */
  label: string
  kind: 'score' | 'text'
  sortKey?: string
  text?: (row: RankedRow) => string
  raw?: (row: RankedRow) => string | null
  align?: 'right'
  /** 小于该断点时隐藏（列表不横向滚动） */
  hide?: 'lg' | 'xl'
}

export const COLUMNS: Record<Category, Column[]> = {
  cpu: [
    { key: 'cores', label: 'cores', kind: 'text', hide: 'lg', text: (r) => (r.item as Cpu).cores },
    { key: 'tdp', label: 'tdp', kind: 'text', align: 'right', hide: 'xl', text: (r) => `${(r.item as Cpu).tdp_w}W` },
    { key: 'single', label: 'single', kind: 'score', hide: 'lg', sortKey: 'single', raw: (r) => num((r.item as Cpu).scores.cb24_st) },
    { key: 'multi', label: 'multi', kind: 'score', sortKey: 'multi', raw: (r) => num((r.item as Cpu).scores.cb24_mt) },
    { key: 'gaming', label: 'gaming', kind: 'score', sortKey: 'gaming', raw: (r) => num((r.item as Cpu).scores.gaming_rel) },
    { key: 'overall', label: 'overall', kind: 'score', sortKey: 'overall' },
  ],
  gpu: [
    { key: 'vram', label: 'vram', kind: 'text', hide: 'lg', text: (r) => `${vram((r.item as Gpu).vram_gb)} ${(r.item as Gpu).vram_type.split(' ')[0]}` },
    { key: 'power', label: 'power', kind: 'text', align: 'right', hide: 'xl', text: (r) => `${r.raw.power}W` },
    { key: 'raster', label: 'raster', kind: 'score', sortKey: 'raster' },
    { key: 'rt', label: 'rt', kind: 'score', hide: 'lg', sortKey: 'rt' },
    { key: 'overall', label: 'overall', kind: 'score', sortKey: 'overall' },
  ],
  ram: [
    { key: 'spec', label: 'spec', kind: 'text', text: (r) => (r.item as Ram).spec },
    { key: 'bandwidth', label: 'read', kind: 'score', sortKey: 'bandwidth', raw: (r) => { const v = (r.item as Ram).scores.read_GBs; return v == null ? DASH : `${v} GB/s` } },
    { key: 'latency', label: 'latency', kind: 'score', hide: 'lg', sortKey: 'latency', raw: (r) => { const v = (r.item as Ram).scores.latency_ns; return v == null ? DASH : `${v} ns` } },
    { key: 'overall', label: 'overall', kind: 'score', sortKey: 'overall' },
  ],
  storage: [
    { key: 'interface', label: 'interface', kind: 'text', hide: 'lg', text: (r) => ifaceLabel((r.item as Storage).interface) },
    { key: 'seqRead', label: 'seqRead', kind: 'score', hide: 'xl', sortKey: 'seqRead', raw: (r) => { const v = (r.item as Storage).seq_read; return v == null ? DASH : `${num(v)} MB/s` } },
    { key: 'random4k', label: 'random4k', kind: 'score', sortKey: 'random4k', raw: (r) => iops((r.item as Storage).iops_4k_read) },
    { key: 'cacheOut', label: 'cacheOut', kind: 'score', hide: 'lg', sortKey: 'cacheOut', raw: (r) => { const v = (r.item as Storage).write_cache_out; return v == null ? DASH : `${num(v)} MB/s` } },
    { key: 'overall', label: 'overall', kind: 'score', sortKey: 'overall' },
  ],
  psu: [
    { key: 'watt', label: 'watt', kind: 'text', align: 'right', text: (r) => `${(r.item as Psu).watt}W` },
    { key: 'tier', label: 'tier', kind: 'text', text: (r) => (r.item as Psu).tier },
    { key: 'efficiency', label: 'efficiency', kind: 'text', hide: 'lg', text: (r) => (r.item as Psu).efficiency },
    { key: 'atx31', label: 'atx31', kind: 'text', hide: 'xl', text: (r) => ((r.item as Psu).atx31 ? '✓' : '—') },
    { key: 'modular', label: 'modular', kind: 'text', hide: 'xl', text: (r) => modularLabel((r.item as Psu).modular) },
  ],
  mobo: [
    { key: 'chipset', label: 'chipset', kind: 'text', text: (r) => `${(r.item as Mobo).chipset} · ${sizeLabel((r.item as Mobo).size)}` },
    { key: 'tier', label: 'tier', kind: 'text', text: (r) => (r.item as Mobo).tier },
    { key: 'vrm', label: 'vrm', kind: 'text', hide: 'lg', text: (r) => (r.item as Mobo).vrm },
    { key: 'memMax', label: 'memMax', kind: 'text', align: 'right', hide: 'xl', text: (r) => `${(r.item as Mobo).mem_type}-${(r.item as Mobo).mem_max_mt}` },
    { key: 'm2', label: 'm2', kind: 'text', align: 'right', hide: 'xl', text: (r) => { const m = r.item as Mobo; return m.m2_gen5 ? `${m.m2} (${m.m2_gen5}× 5.0)` : String(m.m2) } },
    { key: 'lan', label: 'lan', kind: 'text', hide: 'xl', text: (r) => { const m = r.item as Mobo; return m.wifi ? `${m.lan} · ${m.wifi}` : m.lan } },
  ],
  cooler: [
    { key: 'ctype', label: 'coolerSize', kind: 'text', hide: 'lg', text: (r) => { const c = r.item as Cooler; return c.form === 'aio' ? `${c.radiator_mm}×${c.thickness_mm ?? '—'}mm` : `${c.height_mm}mm` } },
    { key: 'tdp', label: 'tdpRated', kind: 'text', align: 'right', hide: 'xl', text: (r) => `${(r.item as Cooler).tdp_w}W` },
    { key: 'cooling', label: 'cooling', kind: 'score', sortKey: 'cooling' },
    { key: 'quiet', label: 'quiet', kind: 'score', hide: 'lg', sortKey: 'quiet', raw: (r) => `${(r.item as Cooler).noise_db} dBA` },
    { key: 'overall', label: 'overall', kind: 'score', sortKey: 'overall' },
  ],
}

export function formBadge(cat: Category, row: RankedRow): string {
  const it = row.item
  if (cat === 'gpu') {
    const g = it as Gpu
    if (g.form === 'laptop') return `${g.tgp_w ?? g.tdp_w}W`
    return ''
  }
  if (cat === 'cpu') {
    const c = it as Cpu
    return c.form === 'laptop' && c.tdp_range ? c.tdp_range : ''
  }
  if (cat === 'ram') {
    const r = it as Ram
    return r.form === 'sodimm' ? 'SO-DIMM' : r.form === 'onboard' ? 'LPDDR' : r.type
  }
  if (cat === 'storage') {
    const s = it as Storage
    return s.form === 'nvme' ? (s.dram ? 'DRAM' : 'HMB') : ''
  }
  if (cat === 'psu') return (it as Psu).form === 'sfx' ? 'SFX' : ''
  if (cat === 'mobo') return sizeLabel((it as Mobo).size)
  if (cat === 'cooler') { const c = it as Cooler; return c.lcd ? 'LCD' : c.form === 'air' && c.type === 'top-down' ? 'ITX' : '' }
  return ''
}

/** 代数/架构短标签 */
export function genBadge(cat: Category, row: RankedRow): string {
  if (cat === 'cpu') return (row.item as Cpu).gen
  if (cat === 'gpu') return (row.item as Gpu).gen
  if (cat === 'mobo') return (row.item as Mobo).chipset
  if (cat === 'cooler') return coolerTypeLabel((row.item as Cooler).type)
  return ''
}
