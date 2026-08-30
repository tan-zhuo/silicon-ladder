import { describe, it, expect } from 'vitest'
import { relScore, relInverse, weighted, scorePool, sortRows } from '../src/utils/rank'
import type { Cpu, Gpu, Ram, Psu } from '../src/types/hardware'

const cpu = (id: string, o: Partial<Cpu> & { scores: Cpu['scores'] }): Cpu => ({
  id, name: id, nameEn: id, brand: 'AMD', form: 'desktop', series: 's', gen: 'g', socket: 'AM5', cores: '8/16', clocks: '', tdp_w: 100, cache_l3: '', mem: '', release: '2024-01', summary: '', tags: [], ...o,
})

describe('relScore / relInverse', () => {
  it('normalizes to pool max with 1 decimal', () => {
    expect(relScore(50, 100)).toBe(50)
    expect(relScore(1234, 1500)).toBe(82.3)
    expect(relScore(null, 100)).toBeNull()
    expect(relScore(10, null)).toBeNull()
  })
  it('inverse uses min / x', () => {
    expect(relInverse(60, 60)).toBe(100)
    expect(relInverse(120, 60)).toBe(50)
    expect(relInverse(null, 60)).toBeNull()
  })
})

describe('weighted', () => {
  it('redistributes weight when a part is null', () => {
    expect(weighted({ a: 100, b: null }, { a: 50, b: 50 })).toBe(100)
    expect(weighted({ a: 100, b: 0 }, { a: 50, b: 50 })).toBe(50)
    expect(weighted({ a: null }, { a: 100 })).toBeNull()
  })
})

describe('CPU pool', () => {
  const pool = [
    cpu('x3d', { scores: { cb24_st: 1300, cb24_mt: 16000, gaming_rel: 100, igpu_rel: null } }),
    cpu('big', { tdp_w: 170, scores: { cb24_st: 1400, cb24_mt: 26000, gaming_rel: 85, igpu_rel: null } }),
    cpu('none', { scores: { cb24_st: null, cb24_mt: null, gaming_rel: null, igpu_rel: null } }),
  ]
  it('gaming sort puts X3D first, multi sort puts big first', () => {
    const rows = scorePool('cpu', pool)
    expect(sortRows('cpu', rows, 'gaming')[0].item.id).toBe('x3d')
    expect(sortRows('cpu', rows, 'multi')[0].item.id).toBe('big')
  })
  it('pool max is 100 and missing scores sink to bottom', () => {
    const rows = sortRows('cpu', scorePool('cpu', pool), 'overall')
    expect(rows[0].rel.overall).toBe(100)
    expect(rows[rows.length - 1].item.id).toBe('none')
    expect(rows[rows.length - 1].rel.overall).toBeNull()
  })
  it('laptop without igpu spreads the 15% to single+multi', () => {
    const lap = [
      cpu('a', { form: 'laptop', tdp_w: 30, scores: { cb24_st: 1000, cb24_mt: 10000, gaming_rel: 50, igpu_rel: null } }),
      cpu('b', { form: 'laptop', tdp_w: 30, scores: { cb24_st: 1000, cb24_mt: 10000, gaming_rel: 50, igpu_rel: null } }),
    ]
    const rows = scorePool('cpu', lap)
    expect(rows[0].rel.overall).toBe(100)
    expect(rows[1].rel.overall).toBe(100)
  })
})

describe('GPU pool', () => {
  it('old card without RT still gets overall from raster + efficiency', () => {
    const g = (id: string, raster: number, rt: number | null, tdp: number): Gpu => ({ id, name: id, nameEn: id, brand: 'NVIDIA', form: 'desktop', series: '', gen: 'x', chip: '', vram_gb: 8, vram_type: 'G', bus_bit: 256, tdp_w: tdp, release: '2020-01', summary: '', tags: [], scores: { raster_rel: raster, rt_rel: rt } })
    const rows = scorePool('gpu', [g('new', 100, 100, 300), g('old', 50, null, 150)])
    const old = rows.find((r) => r.item.id === 'old')!
    expect(old.rel.overall).not.toBeNull()
    expect(old.rel.rt).toBeNull()
  })
})

describe('RAM latency sort', () => {
  it('sorts ascending by ns under default direction', () => {
    const r = (id: string, lat: number): Ram => ({ id, name: id, brand: 'x', form: 'kit-desktop', type: 'DDR5', spec: '', capacity_gb: 32, speed_mt: 6000, cl: 30, latency_ns: lat, release: '2024-01', summary: '', scores: { read_GBs: 90, write_GBs: 80, latency_ns: lat } })
    const rows = sortRows('ram', scorePool('ram', [r('slow', 80), r('fast', 60)]), 'latency')
    expect(rows[0].item.id).toBe('fast')
  })
})

describe('PSU order', () => {
  it('tier A→D then watt desc then name', () => {
    const p = (id: string, tier: Psu['tier'], watt: number): Psu => ({ id, name: id, brand: 'x', form: 'atx', watt, tier, efficiency: '', atx31: false, modular: 'full', oem: '', release: '2024-01', summary: '' })
    const rows = sortRows('psu', scorePool('psu', [p('b1000', 'B', 1000), p('a750', 'A', 750), p('a850', 'A', 850)]), 'tier')
    expect(rows.map((r) => r.item.id)).toEqual(['a850', 'a750', 'b1000'])
  })
})
