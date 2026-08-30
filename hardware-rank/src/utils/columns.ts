import type { Category, RankedRow, Cpu, Gpu, Ram, Storage, Psu } from '@/types/hardware'
import { num, iops, INTERFACE_LABEL, MODULAR_LABEL, DASH } from '@/utils/format'

export interface Column {
  key: string
  label: string
  /** 'score' 用 ScoreBar；'text' 直接文本 */
  kind: 'score' | 'text'
  /** 可点击排序对应的 sort key（有则表头可点） */
  sortKey?: string
  /** 文本列取值 */
  text?: (row: RankedRow) => string
  /** 分数列的原始值文本 */
  raw?: (row: RankedRow) => string | null
  /** 文本列右对齐 */
  align?: 'right'
}

export const COLUMNS: Record<Category, Column[]> = {
  cpu: [
    { key: 'cores', label: '核心', kind: 'text', text: (r) => (r.item as Cpu).cores },
    { key: 'tdp', label: 'TDP', kind: 'text', align: 'right', text: (r) => `${(r.item as Cpu).tdp_w}W` },
    { key: 'single', label: '单核', kind: 'score', sortKey: 'single', raw: (r) => num((r.item as Cpu).scores.cb24_st) },
    { key: 'multi', label: '多核', kind: 'score', sortKey: 'multi', raw: (r) => num((r.item as Cpu).scores.cb24_mt) },
    { key: 'gaming', label: '游戏', kind: 'score', sortKey: 'gaming', raw: (r) => num((r.item as Cpu).scores.gaming_rel) },
    { key: 'overall', label: '综合', kind: 'score', sortKey: 'overall' },
  ],
  gpu: [
    { key: 'vram', label: '显存', kind: 'text', text: (r) => `${(r.item as Gpu).vram_gb}GB ${(r.item as Gpu).vram_type.split(' ')[0]}` },
    { key: 'power', label: 'TGP/TDP', kind: 'text', align: 'right', text: (r) => `${r.raw.power}W` },
    { key: 'raster', label: '光栅', kind: 'score', sortKey: 'raster' },
    { key: 'rt', label: '光追', kind: 'score', sortKey: 'rt' },
    { key: 'overall', label: '综合', kind: 'score', sortKey: 'overall' },
  ],
  ram: [
    { key: 'spec', label: '规格', kind: 'text', text: (r) => (r.item as Ram).spec },
    { key: 'bandwidth', label: '读带宽', kind: 'score', sortKey: 'bandwidth', raw: (r) => { const v = (r.item as Ram).scores.read_GBs; return v == null ? DASH : `${v} GB/s` } },
    { key: 'latency', label: '延迟', kind: 'score', sortKey: 'latency', raw: (r) => { const v = (r.item as Ram).scores.latency_ns; return v == null ? DASH : `${v} ns` } },
    { key: 'overall', label: '综合', kind: 'score', sortKey: 'overall' },
  ],
  storage: [
    { key: 'interface', label: '接口', kind: 'text', text: (r) => INTERFACE_LABEL[(r.item as Storage).interface] },
    { key: 'seqRead', label: '顺序读', kind: 'score', sortKey: 'seqRead', raw: (r) => { const v = (r.item as Storage).seq_read; return v == null ? DASH : `${num(v)} MB/s` } },
    { key: 'random4k', label: '4K 随机', kind: 'score', sortKey: 'random4k', raw: (r) => iops((r.item as Storage).iops_4k_read) },
    { key: 'cacheOut', label: '缓外写入', kind: 'score', sortKey: 'cacheOut', raw: (r) => { const v = (r.item as Storage).write_cache_out; return v == null ? DASH : `${num(v)} MB/s` } },
    { key: 'overall', label: '综合', kind: 'score', sortKey: 'overall' },
  ],
  psu: [
    { key: 'watt', label: '瓦数', kind: 'text', align: 'right', text: (r) => `${(r.item as Psu).watt}W` },
    { key: 'tier', label: '分档', kind: 'text', text: (r) => (r.item as Psu).tier },
    { key: 'efficiency', label: '认证', kind: 'text', text: (r) => (r.item as Psu).efficiency },
    { key: 'atx31', label: 'ATX 3.1', kind: 'text', text: (r) => ((r.item as Psu).atx31 ? '✓' : '—') },
    { key: 'modular', label: '模组', kind: 'text', text: (r) => MODULAR_LABEL[(r.item as Psu).modular] },
  ],
}

/** name 列旁的小徽章 */
export function formBadge(cat: Category, row: RankedRow): string {
  const it = row.item
  if (cat === 'gpu') {
    const g = it as Gpu
    if (g.form === 'laptop') return `Laptop · ${g.tgp_w ?? g.tdp_w}W`
    if (g.form === 'igpu') return '核显'
    return ''
  }
  if (cat === 'cpu') {
    const c = it as Cpu
    return c.form === 'laptop' ? `Laptop${c.tdp_range ? ' · ' + c.tdp_range : ''}` : ''
  }
  if (cat === 'ram') {
    const r = it as Ram
    return r.form === 'sodimm' ? 'SO-DIMM' : r.form === 'onboard' ? '板载' : r.type
  }
  if (cat === 'storage') {
    const s = it as Storage
    return s.form === 'nvme' ? (s.dram ? 'DRAM' : '无 DRAM') : ''
  }
  if (cat === 'psu') {
    const p = it as Psu
    return p.form === 'sfx' ? 'SFX' : ''
  }
  return ''
}
