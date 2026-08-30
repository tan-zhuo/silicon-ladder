/** 技术规格行生成：详情页与对比页共用。每行含分组、值、用于对比的数值与方向（higher/lower 更好）。 */
import type { Cpu, Gpu } from '@/types/hardware'
import { CPU_ARCH, GPU_ARCH, pick } from '@/data/arch'
import { t } from '@/i18n'
import { num, DASH, vram as fmtVram } from '@/utils/format'

export interface TechRow { group: string; key: string; label: string; value: string; n?: number | null; better?: 'higher' | 'lower' }
const NA = -1
const isNA = (n: number | null | undefined) => n === NA
const r = (group: string, key: string, value: string | null | undefined, n?: number | null, better?: 'higher' | 'lower'): TechRow =>
  isNA(n) ? { group, key, label: t('tech.' + key), value: t('tech.na'), n: null } : { group, key, label: t('tech.' + key), value: value == null || value === '' ? DASH : value, n: n ?? null, better }
/** 数值格式化：-1 交给 r() 处理 */
const v = <T,>(n: number | null | undefined, f: (x: number) => T): T | null => (n == null || isNA(n) ? null : f(n))
const G = (k: string) => t('tech.' + k)
const unitW = (v: number | null | undefined, u: string) => (v == null ? null : `${num(v)} ${u}`)

export function cpuTechRows(c: Cpu): TechRow[] {
  const a = CPU_ARCH[c.gen]; const x = c.tech
  const rows: TechRow[] = []
  // 架构与工艺
  rows.push(r(G('gArch'), 'cores', a?.cores))
  rows.push(r(G('gArch'), 'process', a?.process ?? null))
  rows.push(r(G('gArch'), 'design', pick(a?.design)))
  rows.push(r(G('gArch'), 'die', x?.die))
  rows.push(r(G('gArch'), 'die_mm2', v(x?.die_mm2, (d) => `${num(d)} mm²`), x?.die_mm2, 'lower'))
  rows.push(r(G('gArch'), 'transistors', v(x?.transistors_m, (m) => (m >= 1000 ? `${(m / 1000).toFixed(1)} B` : `${num(m)} M`)), x?.transistors_m, 'higher'))
  const dens = x?.transistors_m != null && x.transistors_m > 0 && x?.die_mm2 != null && x.die_mm2 > 0 ? x.transistors_m / x.die_mm2 : (isNA(x?.transistors_m) || isNA(x?.die_mm2) ? NA : null)
  rows.push(r(G('gArch'), 'density', v(dens, (d) => `${num(d, 1)} MTr/mm²`), dens, 'higher'))
  // 核心与缓存
  rows.push(r(G('gCores'), 'l1', a?.l1))
  rows.push(r(G('gCores'), 'l2', v(x?.l2_mb, (m) => `${m} MB`), x?.l2_mb, 'higher'))
  rows.push(r(G('gCores'), 'l3', c.cache_l3))
  rows.push(r(G('gCores'), 'isa', a?.isa))
  rows.push(r(G('gCores'), 'smt', pick(a?.smt)))
  // 时钟与功耗
  rows.push(r(G('gClock'), 'base', v(x?.base_ghz, (g) => `${g} GHz`), x?.base_ghz, 'higher'))
  rows.push(r(G('gClock'), 'boost', v(x?.boost_ghz, (g) => `${g} GHz`), x?.boost_ghz, 'higher'))
  rows.push(r(G('gClock'), 'tdp', c.tdp_range ? `${c.tdp_w} W (${c.tdp_range})` : `${c.tdp_w} W`, c.tdp_w, 'lower'))
  rows.push(r(G('gClock'), 'pmax', v(x?.power_max_w, (w) => `${w} W (${x?.power_label})`), x?.power_max_w, 'lower'))
  // 内存与 I/O
  rows.push(r(G('gMem'), 'memc', x?.mem_channels != null ? `${c.mem} · ${x.mem_channels}ch${x.mem_max_mt ? ` · ${x.mem_max_mt} MT/s` : ''}` : c.mem, x?.mem_max_mt, 'higher'))
  rows.push(r(G('gMem'), 'memmax', unitW(x?.mem_max_gb, 'GB'), x?.mem_max_gb, 'higher'))
  rows.push(r(G('gMem'), 'pcie', x?.pcie))
  // 核显
  rows.push(r(G('gIgpu'), 'igpu', c.igpu ?? null))
  rows.push(r(G('gIgpu'), 'igpuCu', v(x?.igpu_cu, (u) => `${u} ${c.brand === 'Intel' ? 'Xe' : c.brand === 'Apple' ? 'cores' : 'CU'}`), x?.igpu_cu, 'higher'))
  rows.push(r(G('gIgpu'), 'igpuClk', v(x?.igpu_ghz, (g) => `${g} GHz`), x?.igpu_ghz, 'higher'))
  rows.push(r(G('gPrice'), 'usd', v(x?.launch_usd, (u) => `$${num(u)}`), x?.launch_usd, 'lower'))
  return rows
}

export function gpuTechRows(g: Gpu): TechRow[] {
  const a = GPU_ARCH[g.gen]; const x = g.tech
  const rows: TechRow[] = []
  const unit = pick(a?.unitName) ?? 'SM'
  rows.push(r(G('gArch'), 'cores', a?.arch))
  rows.push(r(G('gArch'), 'process', a?.process ?? null))
  rows.push(r(G('gArch'), 'design', pick(a?.design)))
  rows.push(r(G('gArch'), 'die', g.chip))
  rows.push(r(G('gArch'), 'die_mm2', v(x?.die_mm2, (d) => `${num(d)} mm²`), x?.die_mm2, 'lower'))
  rows.push(r(G('gArch'), 'transistors', v(x?.transistors_m, (m) => (m >= 1000 ? `${(m / 1000).toFixed(1)} B` : `${num(m)} M`)), x?.transistors_m, 'higher'))
  const dens = x?.transistors_m != null && x.transistors_m > 0 && x?.die_mm2 != null && x.die_mm2 > 0 ? x.transistors_m / x.die_mm2 : (isNA(x?.transistors_m) || isNA(x?.die_mm2) ? NA : null)
  rows.push(r(G('gArch'), 'density', v(dens, (d) => `${num(d, 1)} MTr/mm²`), dens, 'higher'))
  rows.push(r(G('gUnits'), 'units', v(x?.units, (u) => `${u} ${unit}`), x?.units, 'higher'))
  rows.push(r(G('gUnits'), 'shPerUnit', a?.shadersPerUnit != null ? String(a.shadersPerUnit) : null))
  rows.push(r(G('gUnits'), 'shaders', v(x?.shaders, (n) => num(n)), x?.shaders, 'higher'))
  rows.push(r(G('gUnits'), 'tmus', v(x?.tmus, (n) => num(n)), x?.tmus, 'higher'))
  rows.push(r(G('gUnits'), 'rops', v(x?.rops, (n) => num(n)), x?.rops, 'higher'))
  rows.push(r(G('gUnits'), 'rt', v(x?.rt_cores, (n) => (n === 0 ? DASH : num(n))), x?.rt_cores, 'higher'))
  rows.push(r(G('gUnits'), 'rtGen', pick(a?.rtGen)))
  rows.push(r(G('gUnits'), 'tensor', v(x?.tensor_cores, (n) => (n === 0 ? DASH : num(n))), x?.tensor_cores, 'higher'))
  rows.push(r(G('gUnits'), 'aiGen', pick(a?.aiGen)))
  rows.push(r(G('gClock'), 'baseClk', v(x?.base_mhz, (n) => `${num(n)} MHz`), x?.base_mhz, 'higher'))
  rows.push(r(G('gClock'), 'boostClk', v(x?.boost_mhz, (n) => `${num(n)} MHz`), x?.boost_mhz, 'higher'))
  rows.push(r(G('gClock'), 'tbp', `${g.tgp_w ?? g.tdp_w} W${g.tgp_range ? ` (${g.tgp_range})` : ''}`, g.tgp_w ?? g.tdp_w, 'lower'))
  rows.push(r(G('gMemG'), 'vram', `${fmtVram(g.vram_gb)} ${g.vram_type}`, g.vram_gb, 'higher'))
  rows.push(r(G('gMemG'), 'bus', `${g.bus_bit}-bit`, g.bus_bit, 'higher'))
  rows.push(r(G('gMemG'), 'gbps', v(x?.mem_gbps, (n) => `${n} Gbps`), x?.mem_gbps, 'higher'))
  rows.push(r(G('gMemG'), 'bw', v(x?.mem_bw_gbs, (n) => `${num(n)} GB/s`), x?.mem_bw_gbs, 'higher'))
  rows.push(r(G('gMemG'), 'l2g', v(x?.l2_mb, (n) => `${n} MB`), x?.l2_mb, 'higher'))
  rows.push(r(G('gMemG'), 'ic', v(x?.infinity_cache_mb, (n) => `${n} MB`), x?.infinity_cache_mb, 'higher'))
  rows.push(r(G('gPerf'), 'tflops', v(x?.tflops_fp32, (n) => `${n} TFLOPS`), x?.tflops_fp32, 'higher'))
  const pw = g.tgp_w ?? g.tdp_w
  const perw = x?.tflops_fp32 != null && x.tflops_fp32 > 0 && pw ? (x.tflops_fp32 * 1000) / pw : null
  rows.push(r(G('gPerf'), 'perW', v(perw, (n) => `${num(n, 0)} GFLOPS/W`), perw, 'higher'))
  rows.push(r(G('gPrice'), 'usd', v(x?.launch_usd, (u) => `$${num(u)}`), x?.launch_usd, 'lower'))
  return rows
}
