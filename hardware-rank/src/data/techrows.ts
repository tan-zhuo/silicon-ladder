/** 技术规格行生成：详情页与对比页共用。每行含分组、值、用于对比的数值与方向（higher/lower 更好）。 */
import type { Cpu, Gpu } from '@/types/hardware'
import { CPU_ARCH, GPU_ARCH, pick } from '@/data/arch'
import { t } from '@/i18n'
import { num, DASH, vram as fmtVram } from '@/utils/format'

export interface TechRow { group: string; key: string; label: string; value: string; n?: number | null; better?: 'higher' | 'lower' }
const r = (group: string, key: string, value: string | null | undefined, n?: number | null, better?: 'higher' | 'lower'): TechRow => ({ group, key, label: t('tech.' + key), value: value == null || value === '' ? DASH : value, n: n ?? null, better })
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
  rows.push(r(G('gArch'), 'die_mm2', x?.die_mm2 != null ? `${num(x.die_mm2)} mm²` : null, x?.die_mm2, 'lower'))
  rows.push(r(G('gArch'), 'transistors', x?.transistors_m != null ? (x.transistors_m >= 1000 ? `${(x.transistors_m / 1000).toFixed(1)} B` : `${num(x.transistors_m)} M`) : null, x?.transistors_m, 'higher'))
  rows.push(r(G('gArch'), 'density', x?.transistors_m != null && x?.die_mm2 ? `${num(x.transistors_m / x.die_mm2, 1)} MTr/mm²` : null, x?.transistors_m != null && x?.die_mm2 ? x.transistors_m / x.die_mm2 : null, 'higher'))
  // 核心与缓存
  rows.push(r(G('gCores'), 'l1', a?.l1))
  rows.push(r(G('gCores'), 'l2', x?.l2_mb != null ? `${x.l2_mb} MB` : null, x?.l2_mb, 'higher'))
  rows.push(r(G('gCores'), 'l3', c.cache_l3))
  rows.push(r(G('gCores'), 'isa', a?.isa))
  rows.push(r(G('gCores'), 'smt', pick(a?.smt)))
  // 时钟与功耗
  rows.push(r(G('gClock'), 'base', x?.base_ghz != null ? `${x.base_ghz} GHz` : null, x?.base_ghz, 'higher'))
  rows.push(r(G('gClock'), 'boost', x?.boost_ghz != null ? `${x.boost_ghz} GHz` : null, x?.boost_ghz, 'higher'))
  rows.push(r(G('gClock'), 'tdp', c.tdp_range ? `${c.tdp_w} W (${c.tdp_range})` : `${c.tdp_w} W`, c.tdp_w, 'lower'))
  rows.push(r(G('gClock'), 'pmax', x?.power_max_w != null ? `${x.power_max_w} W (${x.power_label})` : null, x?.power_max_w, 'lower'))
  // 内存与 I/O
  rows.push(r(G('gMem'), 'memc', x?.mem_channels != null ? `${c.mem} · ${x.mem_channels}ch${x.mem_max_mt ? ` · ${x.mem_max_mt} MT/s` : ''}` : c.mem, x?.mem_max_mt, 'higher'))
  rows.push(r(G('gMem'), 'memmax', unitW(x?.mem_max_gb, 'GB'), x?.mem_max_gb, 'higher'))
  rows.push(r(G('gMem'), 'pcie', x?.pcie))
  // 核显
  rows.push(r(G('gIgpu'), 'igpu', c.igpu ?? null))
  rows.push(r(G('gIgpu'), 'igpuCu', x?.igpu_cu != null ? `${x.igpu_cu} ${c.brand === 'Intel' ? 'Xe' : c.brand === 'Apple' ? 'cores' : 'CU'}` : null, x?.igpu_cu, 'higher'))
  rows.push(r(G('gIgpu'), 'igpuClk', x?.igpu_ghz != null ? `${x.igpu_ghz} GHz` : null, x?.igpu_ghz, 'higher'))
  rows.push(r(G('gPrice'), 'usd', x?.launch_usd != null ? `$${num(x.launch_usd)}` : null, x?.launch_usd, 'lower'))
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
  rows.push(r(G('gArch'), 'die_mm2', x?.die_mm2 != null ? `${num(x.die_mm2)} mm²` : null, x?.die_mm2, 'lower'))
  rows.push(r(G('gArch'), 'transistors', x?.transistors_m != null ? (x.transistors_m >= 1000 ? `${(x.transistors_m / 1000).toFixed(1)} B` : `${num(x.transistors_m)} M`) : null, x?.transistors_m, 'higher'))
  rows.push(r(G('gArch'), 'density', x?.transistors_m != null && x?.die_mm2 ? `${num(x.transistors_m / x.die_mm2, 1)} MTr/mm²` : null, x?.transistors_m != null && x?.die_mm2 ? x.transistors_m / x.die_mm2 : null, 'higher'))
  rows.push(r(G('gUnits'), 'units', x?.units != null ? `${x.units} ${unit}` : null, x?.units, 'higher'))
  rows.push(r(G('gUnits'), 'shPerUnit', a?.shadersPerUnit != null ? String(a.shadersPerUnit) : null))
  rows.push(r(G('gUnits'), 'shaders', x?.shaders != null ? num(x.shaders) : null, x?.shaders, 'higher'))
  rows.push(r(G('gUnits'), 'tmus', x?.tmus != null ? num(x.tmus) : null, x?.tmus, 'higher'))
  rows.push(r(G('gUnits'), 'rops', x?.rops != null ? num(x.rops) : null, x?.rops, 'higher'))
  rows.push(r(G('gUnits'), 'rt', x?.rt_cores != null ? (x.rt_cores === 0 ? DASH : num(x.rt_cores)) : null, x?.rt_cores, 'higher'))
  rows.push(r(G('gUnits'), 'rtGen', pick(a?.rtGen)))
  rows.push(r(G('gUnits'), 'tensor', x?.tensor_cores != null ? (x.tensor_cores === 0 ? DASH : num(x.tensor_cores)) : null, x?.tensor_cores, 'higher'))
  rows.push(r(G('gUnits'), 'aiGen', pick(a?.aiGen)))
  rows.push(r(G('gClock'), 'baseClk', x?.base_mhz != null ? `${num(x.base_mhz)} MHz` : null, x?.base_mhz, 'higher'))
  rows.push(r(G('gClock'), 'boostClk', x?.boost_mhz != null ? `${num(x.boost_mhz)} MHz` : null, x?.boost_mhz, 'higher'))
  rows.push(r(G('gClock'), 'tbp', `${g.tgp_w ?? g.tdp_w} W${g.tgp_range ? ` (${g.tgp_range})` : ''}`, g.tgp_w ?? g.tdp_w, 'lower'))
  rows.push(r(G('gMemG'), 'vram', `${fmtVram(g.vram_gb)} ${g.vram_type}`, g.vram_gb, 'higher'))
  rows.push(r(G('gMemG'), 'bus', `${g.bus_bit}-bit`, g.bus_bit, 'higher'))
  rows.push(r(G('gMemG'), 'gbps', x?.mem_gbps != null ? `${x.mem_gbps} Gbps` : null, x?.mem_gbps, 'higher'))
  rows.push(r(G('gMemG'), 'bw', x?.mem_bw_gbs != null ? `${num(x.mem_bw_gbs)} GB/s` : null, x?.mem_bw_gbs, 'higher'))
  rows.push(r(G('gMemG'), 'l2g', x?.l2_mb != null ? `${x.l2_mb} MB` : null, x?.l2_mb, 'higher'))
  rows.push(r(G('gMemG'), 'ic', x?.infinity_cache_mb != null ? `${x.infinity_cache_mb} MB` : null, x?.infinity_cache_mb, 'higher'))
  rows.push(r(G('gPerf'), 'tflops', x?.tflops_fp32 != null ? `${x.tflops_fp32} TFLOPS` : null, x?.tflops_fp32, 'higher'))
  const pw = g.tgp_w ?? g.tdp_w
  rows.push(r(G('gPerf'), 'perW', x?.tflops_fp32 != null && pw ? `${num((x.tflops_fp32 * 1000) / pw, 0)} GFLOPS/W` : null, x?.tflops_fp32 != null && pw ? (x.tflops_fp32 * 1000) / pw : null, 'higher'))
  rows.push(r(G('gPrice'), 'usd', x?.launch_usd != null ? `$${num(x.launch_usd)}` : null, x?.launch_usd, 'lower'))
  return rows
}
