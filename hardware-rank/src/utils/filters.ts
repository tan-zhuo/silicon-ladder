import type { Category, AnyItem, Cpu, Gpu, Storage, Psu } from '@/types/hardware'
import type { LocationQuery } from 'vue-router'

export interface FilterState {
  form: string
  sort: string
  dir: 'asc' | 'desc'
  brand: string[]
  gen: string
  q: string
  tdpMin: number | null
  tdpMax: number | null
  tgpTier: string
  interface: string
  wattMin: number | null
  wattMax: number | null
  tier: string
  atx31: boolean
  yearMin: number | null
  yearMax: number | null
}

function str(v: unknown): string {
  return Array.isArray(v) ? String(v[0] ?? '') : v == null ? '' : String(v)
}
function numOrNull(v: unknown): number | null {
  const s = str(v)
  if (!s) return null
  const n = Number(s)
  return Number.isFinite(n) ? n : null
}

export function parseQuery(q: LocationQuery, defaults: { form: string; sort: string }): FilterState {
  return {
    form: str(q.form) || defaults.form,
    sort: str(q.sort) || defaults.sort,
    dir: str(q.dir) === 'asc' ? 'asc' : 'desc',
    brand: str(q.brand) ? str(q.brand).split(',').filter(Boolean) : [],
    gen: str(q.gen),
    q: str(q.q),
    tdpMin: numOrNull(q.tdpMin),
    tdpMax: numOrNull(q.tdpMax),
    tgpTier: str(q.tgpTier),
    interface: str(q.interface),
    wattMin: numOrNull(q.wattMin),
    wattMax: numOrNull(q.wattMax),
    tier: str(q.tier),
    atx31: str(q.atx31) === 'true',
    yearMin: numOrNull(q.yearMin),
    yearMax: numOrNull(q.yearMax),
  }
}

export function toQuery(f: FilterState, defaults: { form: string; sort: string }): Record<string, string> {
  const out: Record<string, string> = {}
  if (f.form && f.form !== defaults.form) out.form = f.form
  if (f.sort && f.sort !== defaults.sort) out.sort = f.sort
  if (f.dir === 'asc') out.dir = 'asc'
  if (f.brand.length) out.brand = f.brand.join(',')
  if (f.gen) out.gen = f.gen
  if (f.q) out.q = f.q
  if (f.tdpMin !== null) out.tdpMin = String(f.tdpMin)
  if (f.tdpMax !== null) out.tdpMax = String(f.tdpMax)
  if (f.tgpTier) out.tgpTier = f.tgpTier
  if (f.interface) out.interface = f.interface
  if (f.wattMin !== null) out.wattMin = String(f.wattMin)
  if (f.wattMax !== null) out.wattMax = String(f.wattMax)
  if (f.tier) out.tier = f.tier
  if (f.atx31) out.atx31 = 'true'
  if (f.yearMin !== null) out.yearMin = String(f.yearMin)
  if (f.yearMax !== null) out.yearMax = String(f.yearMax)
  return out
}

/** 首页与排行页共用的模糊搜索 */
export function matchQuery(item: AnyItem, q: string): boolean {
  if (!q) return true
  const s = q.trim().toLowerCase()
  if (!s) return true
  const hay = [item.name, item.nameEn ?? '', item.id, item.brand].join(' ').toLowerCase()
  return hay.includes(s)
}

export function tgpTierOf(w: number): 'low' | 'mid' | 'high' {
  if (w <= 80) return 'low'
  if (w <= 120) return 'mid'
  return 'high'
}

export function applyFilters(cat: Category, items: AnyItem[], f: FilterState): AnyItem[] {
  return items.filter((it) => {
    if (it.form !== f.form) return false
    if (f.brand.length && !f.brand.includes(it.brand)) return false
    if (!matchQuery(it, f.q)) return false
    const y = Number(it.release.slice(0, 4))
    if (f.yearMin !== null && y < f.yearMin) return false
    if (f.yearMax !== null && y > f.yearMax) return false
    if (cat === 'cpu') {
      const c = it as Cpu
      if (f.gen && c.gen !== f.gen) return false
      if (f.tdpMin !== null && c.tdp_w < f.tdpMin) return false
      if (f.tdpMax !== null && c.tdp_w > f.tdpMax) return false
    }
    if (cat === 'gpu') {
      const g = it as Gpu
      const p = g.tgp_w ?? g.tdp_w
      if (f.gen && g.gen !== f.gen) return false
      if (f.tdpMin !== null && p < f.tdpMin) return false
      if (f.tdpMax !== null && p > f.tdpMax) return false
      if (f.tgpTier && g.form === 'laptop' && tgpTierOf(p) !== f.tgpTier) return false
    }
    if (cat === 'storage') {
      const s = it as Storage
      if (f.interface && s.interface !== f.interface) return false
    }
    if (cat === 'psu') {
      const p = it as Psu
      if (f.wattMin !== null && p.watt < f.wattMin) return false
      if (f.wattMax !== null && p.watt > f.wattMax) return false
      if (f.tier && p.tier !== f.tier) return false
      if (f.atx31 && !p.atx31) return false
    }
    return true
  })
}

export function uniq<T>(arr: T[]): T[] {
  return Array.from(new Set(arr))
}
