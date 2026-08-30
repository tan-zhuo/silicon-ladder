import { describe, it, expect } from 'vitest'
import { parseQuery, toQuery, applyFilters, matchQuery, tgpTierOf } from '../src/utils/filters'
import type { Gpu } from '../src/types/hardware'

const D = { form: 'desktop', sort: 'overall' }
describe('query round-trip', () => {
  it('parses and serializes without losing state', () => {
    const q = { form: 'laptop', sort: 'raster', dir: 'asc', brand: 'NVIDIA,AMD', gen: 'ada', q: '4070', tdpMin: '80', tdpMax: '150', tgpTier: 'mid', yearMin: '2023', yearMax: '2025' }
    const f = parseQuery(q, D)
    expect(f.brand).toEqual(['NVIDIA', 'AMD']); expect(f.tdpMin).toBe(80); expect(f.dir).toBe('asc'); expect(f.yearMax).toBe(2025)
    expect(toQuery(f, D)).toEqual(q)
  })
  it('omits defaults and empty values', () => {
    expect(toQuery(parseQuery({}, D), D)).toEqual({})
    expect(parseQuery({ tdpMin: 'abc' }, D).tdpMin).toBeNull()
  })
})
describe('matching', () => {
  const g = (id: string, o: Partial<Gpu> = {}): Gpu => ({ id, name: id, nameEn: 'NVIDIA ' + id, brand: 'NVIDIA', form: 'laptop', series: '', gen: 'ada', chip: '', vram_gb: 8, vram_type: 'GDDR6', bus_bit: 128, tdp_w: 100, tgp_w: 100, release: '2023-02', summary: '', tags: [], scores: { raster_rel: 40, rt_rel: 30 }, ...o })
  it('matchQuery is case-insensitive across name / nameEn / id / brand', () => {
    expect(matchQuery(g('rtx-4070'), 'RTX')).toBe(true); expect(matchQuery(g('rtx-4070'), 'nvidia')).toBe(true); expect(matchQuery(g('rtx-4070'), 'amd')).toBe(false)
  })
  it('tgp tiers and year range filter laptop GPUs', () => {
    expect(tgpTierOf(80)).toBe('low'); expect(tgpTierOf(81)).toBe('mid'); expect(tgpTierOf(121)).toBe('high')
    const items = [g('a', { tgp_w: 80 }), g('b', { tgp_w: 140, release: '2025-03' }), g('c', { form: 'desktop' })]
    const f = { ...parseQuery({}, { form: 'laptop', sort: 'overall' }), tgpTier: 'high' }
    expect(applyFilters('gpu', items, f).map((i) => i.id)).toEqual(['b'])
    expect(applyFilters('gpu', items, { ...f, tgpTier: '', yearMin: 2024, yearMax: 2026 }).map((i) => i.id)).toEqual(['b'])
  })
})
