import type { Category, AnyItem, Cpu, Gpu, Ram, Storage, Psu, RankedRow } from '@/types/hardware'

/** 相对分：round(x / max * 1000) / 10，缺失 -> null */
export function relScore(x: number | null | undefined, max: number | null): number | null {
  if (x === null || x === undefined || max === null || max <= 0) return null
  return Math.round((x / max) * 1000) / 10
}

/** 延迟等“越低越好”：rel = min / x * 100 */
export function relInverse(x: number | null | undefined, min: number | null): number | null {
  if (x === null || x === undefined || min === null || x <= 0) return null
  return Math.round((min / x) * 1000) / 10
}

function maxOf(vals: (number | null | undefined)[]): number | null {
  const v = vals.filter((x): x is number => typeof x === 'number' && !Number.isNaN(x))
  return v.length ? Math.max(...v) : null
}
function minOf(vals: (number | null | undefined)[]): number | null {
  const v = vals.filter((x): x is number => typeof x === 'number' && x > 0)
  return v.length ? Math.min(...v) : null
}

/** 加权：权重表中值为 null 的项，其权重按剩余键均摊 */
export function weighted(parts: Record<string, number | null>, weights: Record<string, number>): number | null {
  const keys = Object.keys(weights).filter((k) => parts[k] !== null && parts[k] !== undefined)
  if (!keys.length) return null
  const total = keys.reduce((s, k) => s + weights[k], 0)
  if (total <= 0) return null
  return keys.reduce((s, k) => s + (parts[k] as number) * (weights[k] / total), 0)
}

export interface SortDef {
  key: string
  label: string
  /** 升序（延迟）；默认降序 */
  asc?: boolean
}

export const SORT_DEFS: Record<Category, SortDef[]> = {
  cpu: [
    { key: 'overall', label: '综合' },
    { key: 'gaming', label: '游戏' },
    { key: 'single', label: '单核' },
    { key: 'multi', label: '生产力' },
    { key: 'efficiency', label: '能效' },
    { key: 'igpu', label: '核显' },
    { key: 'value', label: '性价比' },
  ],
  gpu: [
    { key: 'overall', label: '综合' },
    { key: 'raster', label: '光栅' },
    { key: 'rt', label: '光追' },
    { key: 'efficiency', label: '能效' },
    { key: 'value', label: '性价比' },
  ],
  ram: [
    { key: 'overall', label: '综合' },
    { key: 'bandwidth', label: '带宽' },
    { key: 'latency', label: '延迟', asc: true },
  ],
  storage: [
    { key: 'overall', label: '综合' },
    { key: 'random4k', label: '4K 随机' },
    { key: 'cacheOut', label: '缓外写入' },
    { key: 'seqRead', label: '顺序读' },
    { key: 'endurance', label: '耐久' },
  ],
  psu: [{ key: 'tier', label: '品质分档' }],
}

/** 每个品类可用的 form 枚举 */
export const FORMS: Record<Category, { key: string; label: string }[]> = {
  cpu: [
    { key: 'desktop', label: '桌面' },
    { key: 'laptop', label: '笔记本' },
  ],
  gpu: [
    { key: 'desktop', label: '桌面' },
    { key: 'laptop', label: '笔记本' },
    { key: 'igpu', label: '核显' },
  ],
  ram: [
    { key: 'kit-desktop', label: '台式套装' },
    { key: 'sodimm', label: '笔记本条' },
    { key: 'onboard', label: '板载' },
  ],
  storage: [
    { key: 'nvme', label: 'NVMe' },
    { key: 'sata', label: 'SATA' },
    { key: 'hdd', label: 'HDD' },
  ],
  psu: [
    { key: 'atx', label: 'ATX' },
    { key: 'sfx', label: 'SFX' },
  ],
}

/** 归一到 0–100（池内最高 100） */
function normalizeAll(vals: (number | null)[]): (number | null)[] {
  const m = maxOf(vals)
  return vals.map((v) => relScore(v, m))
}

/* ---------------- CPU ---------------- */
function rankCpu(pool: Cpu[]): RankedRow<Cpu>[] {
  const stMax = maxOf(pool.map((c) => c.scores.cb24_st))
  const mtMax = maxOf(pool.map((c) => c.scores.cb24_mt))
  const gmMax = maxOf(pool.map((c) => c.scores.gaming_rel))
  const igMax = maxOf(pool.map((c) => c.scores.igpu_rel))
  const isLaptop = pool[0]?.form === 'laptop'

  const effRaw = pool.map((c) => {
    const base = isLaptop ? c.scores.cb24_mt : c.scores.gaming_rel
    return base !== null && c.tdp_w > 0 ? base / c.tdp_w : null
  })
  const effRel = normalizeAll(effRaw)

  const overallRaw = pool.map((c, i) => {
    const single = relScore(c.scores.cb24_st, stMax)
    const multi = relScore(c.scores.cb24_mt, mtMax)
    const gaming = relScore(c.scores.gaming_rel, gmMax)
    const igpu = relScore(c.scores.igpu_rel, igMax)
    const eff = effRel[i]
    if (isLaptop) {
      // 单核 25% + 多核 30% + 能效 30% + iGPU 15%（无 iGPU 分则均摊到单核+多核）
      if (igpu === null) {
        return weighted({ single, multi, eff }, { single: 32.5, multi: 37.5, eff: 30 })
      }
      return weighted({ single, multi, eff, igpu }, { single: 25, multi: 30, eff: 30, igpu: 15 })
    }
    return weighted({ gaming, single, multi, eff }, { gaming: 40, single: 25, multi: 25, eff: 10 })
  })
  const overallRel = normalizeAll(overallRaw)

  const valueRaw = pool.map((c, i) => (overallRel[i] !== null && c.price_cny ? (overallRel[i] as number) / c.price_cny : null))
  const valueRel = normalizeAll(valueRaw)

  return pool.map((c, i) => ({
    item: c,
    rank: 0,
    sortValue: null,
    raw: {
      single: c.scores.cb24_st,
      multi: c.scores.cb24_mt,
      gaming: c.scores.gaming_rel,
      igpu: c.scores.igpu_rel,
      efficiency: effRaw[i] !== null ? Math.round((effRaw[i] as number) * 100) / 100 : null,
      value: valueRaw[i],
      tdp: c.tdp_w,
    },
    rel: {
      single: relScore(c.scores.cb24_st, stMax),
      multi: relScore(c.scores.cb24_mt, mtMax),
      gaming: relScore(c.scores.gaming_rel, gmMax),
      igpu: relScore(c.scores.igpu_rel, igMax),
      efficiency: effRel[i],
      overall: overallRel[i],
      value: valueRel[i],
    },
  }))
}

/* ---------------- GPU ---------------- */
function rankGpu(pool: Gpu[]): RankedRow<Gpu>[] {
  const rMax = maxOf(pool.map((g) => g.scores.raster_rel))
  const rtMax = maxOf(pool.map((g) => g.scores.rt_rel))
  const power = (g: Gpu) => (g.form === 'laptop' ? g.tgp_w ?? g.tdp_w : g.tgp_w ?? g.tdp_w)
  const effRaw = pool.map((g) => (g.scores.raster_rel !== null && power(g) > 0 ? g.scores.raster_rel / power(g) : null))
  const effRel = normalizeAll(effRaw)
  const overallRaw = pool.map((g, i) =>
    weighted(
      { raster: relScore(g.scores.raster_rel, rMax), rt: relScore(g.scores.rt_rel, rtMax), eff: effRel[i] },
      { raster: 55, rt: 25, eff: 20 },
    ),
  )
  const overallRel = normalizeAll(overallRaw)
  const valueRaw = pool.map((g, i) => (overallRel[i] !== null && g.price_cny ? (overallRel[i] as number) / g.price_cny : null))
  const valueRel = normalizeAll(valueRaw)

  return pool.map((g, i) => ({
    item: g,
    rank: 0,
    sortValue: null,
    raw: {
      raster: g.scores.raster_rel,
      rt: g.scores.rt_rel,
      efficiency: effRaw[i] !== null ? Math.round((effRaw[i] as number) * 1000) / 1000 : null,
      value: valueRaw[i],
      power: power(g),
    },
    rel: {
      raster: relScore(g.scores.raster_rel, rMax),
      rt: relScore(g.scores.rt_rel, rtMax),
      efficiency: effRel[i],
      overall: overallRel[i],
      value: valueRel[i],
    },
  }))
}

/* ---------------- RAM ---------------- */
function rankRam(pool: Ram[]): RankedRow<Ram>[] {
  const bwMax = maxOf(pool.map((r) => r.scores.read_GBs))
  const latMin = minOf(pool.map((r) => r.scores.latency_ns))
  const isOnboard = pool[0]?.form === 'onboard'
  const overallRaw = pool.map((r) => {
    if (isOnboard) return null // 板载只提供规格表
    return weighted(
      { bw: relScore(r.scores.read_GBs, bwMax), lat: relInverse(r.scores.latency_ns, latMin) },
      { bw: 50, lat: 50 },
    )
  })
  const overallRel = normalizeAll(overallRaw)
  return pool.map((r, i) => ({
    item: r,
    rank: 0,
    sortValue: null,
    raw: { bandwidth: r.scores.read_GBs, latency: r.scores.latency_ns, write: r.scores.write_GBs },
    rel: {
      bandwidth: relScore(r.scores.read_GBs, bwMax),
      latency: relInverse(r.scores.latency_ns, latMin),
      overall: overallRel[i],
    },
  }))
}

/* ---------------- Storage ---------------- */
function rankStorage(pool: Storage[]): RankedRow<Storage>[] {
  const r4kMax = maxOf(pool.map((s) => s.iops_4k_read))
  const coMax = maxOf(pool.map((s) => s.write_cache_out))
  const srMax = maxOf(pool.map((s) => s.seq_read))
  const endRaw = pool.map((s) => (s.tbw !== null && s.capacity_gb > 0 ? s.tbw / s.capacity_gb : null))
  const endMax = maxOf(endRaw)
  const isNvme = pool[0]?.form === 'nvme'
  const overallRaw = pool.map((s, i) => {
    const parts = {
      r4k: relScore(s.iops_4k_read, r4kMax),
      co: relScore(s.write_cache_out, coMax),
      sr: relScore(s.seq_read, srMax),
      end: relScore(endRaw[i], endMax),
    }
    // NVMe 权重固定；SATA/HDD 用同样权重但缺项均摊
    return weighted(parts, isNvme ? { r4k: 40, co: 30, sr: 20, end: 10 } : { r4k: 40, co: 30, sr: 20, end: 10 })
  })
  const overallRel = normalizeAll(overallRaw)
  return pool.map((s, i) => ({
    item: s,
    rank: 0,
    sortValue: null,
    raw: {
      random4k: s.iops_4k_read,
      cacheOut: s.write_cache_out,
      seqRead: s.seq_read,
      endurance: endRaw[i] !== null ? Math.round((endRaw[i] as number) * 100) / 100 : null,
    },
    rel: {
      random4k: relScore(s.iops_4k_read, r4kMax),
      cacheOut: relScore(s.write_cache_out, coMax),
      seqRead: relScore(s.seq_read, srMax),
      endurance: relScore(endRaw[i], endMax),
      overall: overallRel[i],
    },
  }))
}

/* ---------------- PSU ---------------- */
function rankPsu(pool: Psu[]): RankedRow<Psu>[] {
  const tierNum: Record<string, number> = { A: 4, B: 3, C: 2, D: 1 }
  return pool.map((p) => ({
    item: p,
    rank: 0,
    sortValue: null,
    raw: { watt: p.watt, tier: p.tier, tierNum: tierNum[p.tier] },
    rel: {},
  }))
}

/** 对同 category + 同 form 的池计算全部相对分（不排序） */
export function scorePool(cat: Category, pool: AnyItem[]): RankedRow[] {
  if (!pool.length) return []
  switch (cat) {
    case 'cpu': return rankCpu(pool as Cpu[])
    case 'gpu': return rankGpu(pool as Gpu[])
    case 'ram': return rankRam(pool as Ram[])
    case 'storage': return rankStorage(pool as Storage[])
    case 'psu': return rankPsu(pool as Psu[])
  }
}

/** 按 sort 键排序，缺分沉底，并写入 rank */
export function sortRows(cat: Category, rows: RankedRow[], sortKey: string, dir: 'asc' | 'desc' = 'desc'): RankedRow[] {
  if (cat === 'psu') {
    const sorted = [...rows].sort((a, b) => {
      const ta = a.item as Psu, tb = b.item as Psu
      if (ta.tier !== tb.tier) return ta.tier < tb.tier ? -1 : 1
      if (ta.watt !== tb.watt) return tb.watt - ta.watt
      return ta.name.localeCompare(tb.name)
    })
    if (dir === 'asc') sorted.reverse()
    return sorted.map((r, i) => ({ ...r, sortValue: null, rank: i + 1 }))
  }
  const def = SORT_DEFS[cat].find((s) => s.key === sortKey)
  const withVal = rows.map((r) => {
    // 延迟排序使用原始 ns 升序；其余用相对分
    const v = sortKey === 'latency' ? (r.raw.latency as number | null) : r.rel[sortKey] ?? null
    return { ...r, sortValue: v }
  })
  // 延迟（asc 定义）：dir=desc 时按 ns 升序（越低越好）；dir=asc 时反向
  const finalAsc = def?.asc ? dir === 'desc' : dir === 'asc'
  withVal.sort((a, b) => {
    if (a.sortValue === null && b.sortValue === null) return a.item.name.localeCompare(b.item.name)
    if (a.sortValue === null) return 1
    if (b.sortValue === null) return -1
    return finalAsc ? a.sortValue - b.sortValue : b.sortValue - a.sortValue
  })
  return withVal.map((r, i) => ({ ...r, rank: i + 1 }))
}

/** 通用：对某品类全体数据按 form 分池并打分，返回 id -> row */
export function scoreAllPools(cat: Category, items: AnyItem[]): Map<string, RankedRow> {
  const map = new Map<string, RankedRow>()
  const forms = new Set(items.map((i) => i.form))
  for (const f of forms) {
    const pool = items.filter((i) => i.form === f)
    for (const row of scorePool(cat, pool)) map.set(row.item.id, row)
  }
  return map
}
