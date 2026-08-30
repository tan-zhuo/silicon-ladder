import type { Category, RankedRow, Cpu, Gpu, Ram, Storage, Psu } from '@/types/hardware'
import { num, iops, ifaceLabel, modularLabel, DASH, vram } from '@/utils/format'

export interface Column {
  key: string
  /** i18n key under col.* */
  label: string
  kind: 'score' | 'text'
  sortKey?: string
  text?: (row: RankedRow) => string
  raw?: (row: RankedRow) => string | null
  align?: 'right'
}

export const COLUMNS: Record<Category, Column[]> = {
  cpu: [
    { key: 'cores', label: 'cores', kind: 'text', text: (r) => (r.item as Cpu).cores },
    { key: 'tdp', label: 'tdp', kind: 'text', align: 'right', text: (r) => `${(r.item as Cpu).tdp_w}W` },
    { key: 'single', label: 'single', kind: 'score', sortKey: 'single', raw: (r) => num((r.item as Cpu).scores.cb24_st) },
    { key: 'multi', label: 'multi', kind: 'score', sortKey: 'multi', raw: (r) => num((r.item as Cpu).scores.cb24_mt) },
    { key: 'gaming', label: 'gaming', kind: 'score', sortKey: 'gaming', raw: (r) => num((r.item as Cpu).scores.gaming_rel) },
    { key: 'overall', label: 'overall', kind: 'score', sortKey: 'overall' },
  ],
  gpu: [
    { key: 'vram', label: 'vram', kind: 'text', text: (r) => `${vram((r.item as Gpu).vram_gb)} ${(r.item as Gpu).vram_type.split(' ')[0]}` },
    { key: 'power', label: 'power', kind: 'text', align: 'right', text: (r) => `${r.raw.power}W` },
    { key: 'raster', label: 'raster', kind: 'score', sortKey: 'raster' },
    { key: 'rt', label: 'rt', kind: 'score', sortKey: 'rt' },
    { key: 'overall', label: 'overall', kind: 'score', sortKey: 'overall' },
  ],
  ram: [
    { key: 'spec', label: 'spec', kind: 'text', text: (r) => (r.item as Ram).spec },
    { key: 'bandwidth', label: 'read', kind: 'score', sortKey: 'bandwidth', raw: (r) => { const v = (r.item as Ram).scores.read_GBs; return v == null ? DASH : `${v} GB/s` } },
    { key: 'latency', label: 'latency', kind: 'score', sortKey: 'latency', raw: (r) => { const v = (r.item as Ram).scores.latency_ns; return v == null ? DASH : `${v} ns` } },
    { key: 'overall', label: 'overall', kind: 'score', sortKey: 'overall' },
  ],
  storage: [
    { key: 'interface', label: 'interface', kind: 'text', text: (r) => ifaceLabel((r.item as Storage).interface) },
    { key: 'seqRead', label: 'seqRead', kind: 'score', sortKey: 'seqRead', raw: (r) => { const v = (r.item as Storage).seq_read; return v == null ? DASH : `${num(v)} MB/s` } },
    { key: 'random4k', label: 'random4k', kind: 'score', sortKey: 'random4k', raw: (r) => iops((r.item as Storage).iops_4k_read) },
    { key: 'cacheOut', label: 'cacheOut', kind: 'score', sortKey: 'cacheOut', raw: (r) => { const v = (r.item as Storage).write_cache_out; return v == null ? DASH : `${num(v)} MB/s` } },
    { key: 'overall', label: 'overall', kind: 'score', sortKey: 'overall' },
  ],
  psu: [
    { key: 'watt', label: 'watt', kind: 'text', align: 'right', text: (r) => `${(r.item as Psu).watt}W` },
    { key: 'tier', label: 'tier', kind: 'text', text: (r) => (r.item as Psu).tier },
    { key: 'efficiency', label: 'efficiency', kind: 'text', text: (r) => (r.item as Psu).efficiency },
    { key: 'atx31', label: 'atx31', kind: 'text', text: (r) => ((r.item as Psu).atx31 ? '✓' : '—') },
    { key: 'modular', label: 'modular', kind: 'text', text: (r) => modularLabel((r.item as Psu).modular) },
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
  return ''
}

/** 代数/架构短标签 */
export function genBadge(cat: Category, row: RankedRow): string {
  if (cat === 'cpu') return (row.item as Cpu).gen
  if (cat === 'gpu') return (row.item as Gpu).gen
  return ''
}
