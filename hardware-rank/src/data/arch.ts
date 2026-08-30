/** 架构级技术事实（按 gen 派生），三语 */
import { locale } from '@/i18n'
type L3 = [string, string, string]
const L = (zh: string, en: string, ja: string): L3 => [zh, en, ja]
export const pick = (v: L3 | string | null | undefined): string | null => (v == null ? null : typeof v === 'string' ? v : v[locale.value === 'en' ? 1 : locale.value === 'ja' ? 2 : 0])

export interface CpuArch {
  cores: string           // 核心微架构（P / E）
  process: string
  design: L3              // 单片 / Chiplet
  l1: string              // 每核 L1
  isa: string             // 指令集要点
  smt: L3
  node_note?: L3
}
const MONO = L('单片（Monolithic）', 'Monolithic', 'モノリシック')
const CHIPLET = L('Chiplet：CCD 计算晶片 + IOD I/O 晶片', 'Chiplet: CCD compute dies + IOD I/O die', 'チップレット：CCD 演算ダイ + IOD I/O ダイ')
const TILE = L('Foveros 3D 封装：Compute / GPU / SoC / IO Tile', 'Foveros 3D packaging: Compute / GPU / SoC / IO tiles', 'Foveros 3D パッケージ：Compute / GPU / SoC / IO タイル')
const SMT2 = L('SMT ×2（每核 2 线程）', 'SMT ×2 (2 threads per core)', 'SMT ×2（コアあたり 2 スレッド）')
const HT_P = L('P 核 HT ×2，E 核无', 'HT ×2 on P-cores, none on E-cores', 'P コア HT ×2、E コアなし')
const NO_SMT = L('无 SMT', 'No SMT', 'SMT なし')
const NO_HT_ALL = L('无超线程（全部单线程核心）', 'No Hyper-Threading (all cores single-threaded)', 'Hyper-Threading なし（全コア 1 スレッド）')

export const CPU_ARCH: Record<string, CpuArch> = {
  zen5: { cores: 'Zen 5 (Nirvana)', process: 'TSMC N4P (CCD) + N6 (IOD)', design: CHIPLET, l1: '48 KB D + 32 KB I', isa: 'AVX-512（全宽 512-bit 数据通路）, AVX2, VNNI, SHA', smt: SMT2 },
  zen4: { cores: 'Zen 4 (Persephone)', process: 'TSMC N5 (CCD) + N6 (IOD)', design: CHIPLET, l1: '32 KB D + 32 KB I', isa: 'AVX-512（双周期 256-bit）, AVX2, VNNI, SHA', smt: SMT2 },
  zen3: { cores: 'Zen 3 (Cezanne / Vermeer)', process: 'TSMC N7', design: CHIPLET, l1: '32 KB D + 32 KB I', isa: 'AVX2, SHA（无 AVX-512）', smt: SMT2 },
  'zen3+': { cores: 'Zen 3+ (Rembrandt)', process: 'TSMC N6', design: MONO, l1: '32 KB D + 32 KB I', isa: 'AVX2, SHA', smt: SMT2 },
  zen2: { cores: 'Zen 2 (Matisse / Renoir)', process: 'TSMC N7 (CCD) + GF 12nm (IOD)', design: CHIPLET, l1: '32 KB D + 32 KB I', isa: 'AVX2（首次全宽 256-bit）, SHA', smt: SMT2 },
  'zen+': { cores: 'Zen+ (Pinnacle Ridge)', process: 'GF 12nm LP', design: MONO, l1: '32 KB D + 64 KB I', isa: 'AVX2（128-bit 拆分）, SHA', smt: SMT2 },
  zen: { cores: 'Zen (Summit Ridge)', process: 'GF 14nm LPP', design: MONO, l1: '32 KB D + 64 KB I', isa: 'AVX2（128-bit 拆分）, SHA', smt: SMT2 },
  k10: { cores: 'K10 (Stars)', process: 'AMD 65nm / 45nm SOI', design: MONO, l1: '64 KB D + 64 KB I', isa: 'SSE4a, 3DNow!', smt: NO_SMT },
  bulldozer: { cores: 'Bulldozer（模块化：2 整数核共享 1 浮点单元）', process: 'GF 32nm SOI', design: MONO, l1: '16 KB D / 核 + 64 KB I / 模块', isa: 'AVX, FMA4, XOP', smt: L('CMT 模块（2 整数核 / 模块）', 'CMT module (2 integer cores per module)', 'CMT モジュール（モジュールあたり整数コア 2）') },
  piledriver: { cores: 'Piledriver（模块化）', process: 'GF 32nm SOI', design: MONO, l1: '16 KB D / 核 + 64 KB I / 模块', isa: 'AVX, FMA3/4, XOP', smt: L('CMT 模块（2 整数核 / 模块）', 'CMT module (2 integer cores per module)', 'CMT モジュール（モジュールあたり整数コア 2）') },
  'arrow-lake': { cores: 'Lion Cove (P) + Skymont (E)', process: 'TSMC N3B (Compute) + N5/N6 Tiles', design: TILE, l1: 'P: 48 KB D + 64 KB I', isa: 'AVX2, AVX-VNNI（无 AVX-512）', smt: NO_HT_ALL },
  'arrow-lake-hx': { cores: 'Lion Cove (P) + Skymont (E)', process: 'TSMC N3B', design: TILE, l1: 'P: 48 KB D + 64 KB I', isa: 'AVX2, AVX-VNNI', smt: NO_HT_ALL },
  'arrow-lake-h': { cores: 'Lion Cove (P) + Skymont (E) + LP-E', process: 'TSMC N3B', design: TILE, l1: 'P: 48 KB D + 64 KB I', isa: 'AVX2, AVX-VNNI', smt: NO_HT_ALL },
  'lunar-lake': { cores: 'Lion Cove (P) + Skymont (LP-E)', process: 'TSMC N3B + N6', design: L('Compute + Platform Controller Tile，LPDDR5X 封装内', 'Compute + Platform Controller tiles, LPDDR5X on package', 'Compute + Platform Controller タイル、LPDDR5X パッケージ内'), l1: 'P: 48 KB D + 64 KB I', isa: 'AVX2, AVX-VNNI', smt: NO_HT_ALL },
  'meteor-lake': { cores: 'Redwood Cove (P) + Crestmont (E)', process: 'Intel 4 + TSMC N5/N6 Tiles', design: TILE, l1: 'P: 48 KB D + 32 KB I', isa: 'AVX2, AVX-VNNI', smt: HT_P },
  'raptor-lake': { cores: 'Raptor Cove (P) + Gracemont (E)', process: 'Intel 7', design: MONO, l1: 'P: 48 KB D + 32 KB I', isa: 'AVX2, AVX-VNNI（AVX-512 熔断）', smt: HT_P },
  'raptor-lake-hx': { cores: 'Raptor Cove (P) + Gracemont (E)', process: 'Intel 7', design: MONO, l1: 'P: 48 KB D + 32 KB I', isa: 'AVX2, AVX-VNNI', smt: HT_P },
  'alder-lake': { cores: 'Golden Cove (P) + Gracemont (E)', process: 'Intel 7', design: MONO, l1: 'P: 48 KB D + 32 KB I', isa: 'AVX2, AVX-VNNI', smt: HT_P },
  'tiger-lake': { cores: 'Willow Cove', process: 'Intel 10nm SuperFin', design: MONO, l1: '48 KB D + 32 KB I', isa: 'AVX-512, AVX2', smt: SMT2 },
  'rocket-lake': { cores: 'Cypress Cove（Sunny Cove 回移 14nm）', process: 'Intel 14nm', design: MONO, l1: '48 KB D + 32 KB I', isa: 'AVX-512, AVX2', smt: SMT2 },
  'comet-lake': { cores: 'Skylake（第 5 次迭代）', process: 'Intel 14nm++', design: MONO, l1: '32 KB D + 32 KB I', isa: 'AVX2', smt: SMT2 },
  'coffee-lake': { cores: 'Skylake（第 3/4 次迭代）', process: 'Intel 14nm++', design: MONO, l1: '32 KB D + 32 KB I', isa: 'AVX2', smt: L('部分型号 HT（i7/i9 有，i5 无）', 'HT on some SKUs (i7/i9 yes, i5 no)', '一部 SKU のみ HT（i7/i9 あり、i5 なし）') },
  'kaby-lake': { cores: 'Skylake（第 2 次迭代）', process: 'Intel 14nm+', design: MONO, l1: '32 KB D + 32 KB I', isa: 'AVX2', smt: SMT2 },
  skylake: { cores: 'Skylake', process: 'Intel 14nm', design: MONO, l1: '32 KB D + 32 KB I', isa: 'AVX2', smt: SMT2 },
  'haswell-e': { cores: 'Haswell', process: 'Intel 22nm', design: MONO, l1: '32 KB D + 32 KB I', isa: 'AVX2, FMA3', smt: SMT2 },
  haswell: { cores: 'Haswell', process: 'Intel 22nm', design: MONO, l1: '32 KB D + 32 KB I', isa: 'AVX2, FMA3', smt: L('i7 有 HT，i5 无', 'HT on i7, none on i5', 'i7 は HT あり、i5 なし') },
  'ivy-bridge': { cores: 'Ivy Bridge', process: 'Intel 22nm Tri-Gate', design: MONO, l1: '32 KB D + 32 KB I', isa: 'AVX', smt: L('i7 有 HT，i5 无', 'HT on i7, none on i5', 'i7 は HT あり、i5 なし') },
  'sandy-bridge': { cores: 'Sandy Bridge', process: 'Intel 32nm', design: MONO, l1: '32 KB D + 32 KB I', isa: 'AVX（首发）', smt: L('i7 有 HT，i5 无', 'HT on i7, none on i5', 'i7 は HT あり、i5 なし') },
  nehalem: { cores: 'Nehalem / Lynnfield', process: 'Intel 45nm', design: MONO, l1: '32 KB D + 32 KB I', isa: 'SSE4.2', smt: L('i7 有 HT，i5 无', 'HT on i7, none on i5', 'i7 は HT あり、i5 なし') },
  core2: { cores: 'Core (Conroe / Penryn)', process: 'Intel 65nm / 45nm', design: L('单片或双晶片 MCM（四核 = 2× 双核）', 'Monolithic or dual-die MCM (quad = 2× dual-core)', 'モノリシックまたは 2 ダイ MCM（クアッド = デュアル ×2）'), l1: '32 KB D + 32 KB I', isa: 'SSE4.1（Penryn）', smt: NO_SMT },
  steamroller: { cores: 'Steamroller（模块化）', process: 'GF 28nm', design: MONO, l1: '16 KB D / 核 + 96 KB I / 模块', isa: 'AVX, FMA3, HSA', smt: L('CMT 模块（2 整数核 / 模块）', 'CMT module (2 integer cores per module)', 'CMT モジュール') },
  'whiskey-lake': { cores: 'Skylake（U 系第 4 次迭代）', process: 'Intel 14nm++', design: MONO, l1: '32 KB D + 32 KB I', isa: 'AVX2', smt: SMT2 },
  'kaby-lake-r': { cores: 'Skylake（U 系四核）', process: 'Intel 14nm+', design: MONO, l1: '32 KB D + 32 KB I', isa: 'AVX2', smt: SMT2 },
  'cascade-lake-x': { cores: 'Skylake-SP（Cascade Lake）', process: 'Intel 14nm++', design: MONO, l1: '32 KB D + 32 KB I', isa: 'AVX-512, VNNI', smt: SMT2 },
  'skylake-x': { cores: 'Skylake-SP', process: 'Intel 14nm+', design: MONO, l1: '32 KB D + 32 KB I', isa: 'AVX-512', smt: SMT2 },
  'broadwell-e': { cores: 'Broadwell', process: 'Intel 14nm', design: MONO, l1: '32 KB D + 32 KB I', isa: 'AVX2, FMA3', smt: SMT2 },
  'ivy-bridge-e': { cores: 'Ivy Bridge-E', process: 'Intel 22nm', design: MONO, l1: '32 KB D + 32 KB I', isa: 'AVX', smt: SMT2 },
  'apple-m4': { cores: 'Apple P + E（ARMv9.2）', process: 'TSMC N3E', design: L('单片 SoC，统一内存封装', 'Monolithic SoC, unified memory on package', 'モノリシック SoC、ユニファイドメモリ同梱'), l1: 'P: 128 KB D + 192 KB I', isa: 'ARMv9.2, SME, AMX', smt: NO_SMT },
  'apple-m3': { cores: 'Apple P + E（ARMv8.6）', process: 'TSMC N3B', design: L('单片 SoC，统一内存封装', 'Monolithic SoC, unified memory on package', 'モノリシック SoC、ユニファイドメモリ同梱'), l1: 'P: 128 KB D + 192 KB I', isa: 'ARMv8.6, AMX', smt: NO_SMT },
  'apple-m2': { cores: 'Avalanche (P) + Blizzard (E)', process: 'TSMC N5P', design: L('单片 SoC，统一内存封装', 'Monolithic SoC, unified memory on package', 'モノリシック SoC、ユニファイドメモリ同梱'), l1: 'P: 128 KB D + 192 KB I', isa: 'ARMv8.6, AMX', smt: NO_SMT },
  'apple-m1': { cores: 'Firestorm (P) + Icestorm (E)', process: 'TSMC N5', design: L('单片 SoC，统一内存封装', 'Monolithic SoC, unified memory on package', 'モノリシック SoC、ユニファイドメモリ同梱'), l1: 'P: 128 KB D + 192 KB I', isa: 'ARMv8.5, AMX', smt: NO_SMT },
  'snapdragon-x': { cores: 'Oryon（12× 全大核）', process: 'TSMC N4', design: L('单片 SoC', 'Monolithic SoC', 'モノリシック SoC'), l1: '96 KB D + 192 KB I', isa: 'ARMv8.7', smt: NO_SMT },
  'snapdragon-8cx': { cores: 'Kryo 680 (Cortex-X1 + A78)', process: 'Samsung 5nm', design: L('单片 SoC', 'Monolithic SoC', 'モノリシック SoC'), l1: '64 KB D + 64 KB I', isa: 'ARMv8.4', smt: NO_SMT },
}

export interface GpuArch {
  arch: string
  process: string
  unitName: L3            // SM / CU / Xe-core
  shadersPerUnit: number | null
  rtGen: L3 | null
  aiGen: L3 | null
  design: L3
}
const MONO_G = L('单片 GPU', 'Monolithic GPU', 'モノリシック GPU')
export const GPU_ARCH: Record<string, GpuArch> = {
  blackwell: { arch: 'Blackwell (GB20x)', process: 'TSMC 4N', unitName: L('SM', 'SM', 'SM'), shadersPerUnit: 128, rtGen: L('第 4 代 RT Core', '4th-gen RT Core', '第4世代 RT コア'), aiGen: L('第 5 代 Tensor Core（FP4）', '5th-gen Tensor Core (FP4)', '第5世代 Tensor コア（FP4）'), design: MONO_G },
  ada: { arch: 'Ada Lovelace (AD10x)', process: 'TSMC 4N', unitName: L('SM', 'SM', 'SM'), shadersPerUnit: 128, rtGen: L('第 3 代 RT Core', '3rd-gen RT Core', '第3世代 RT コア'), aiGen: L('第 4 代 Tensor Core（FP8）', '4th-gen Tensor Core (FP8)', '第4世代 Tensor コア（FP8）'), design: MONO_G },
  ampere: { arch: 'Ampere (GA10x)', process: 'Samsung 8N', unitName: L('SM', 'SM', 'SM'), shadersPerUnit: 128, rtGen: L('第 2 代 RT Core', '2nd-gen RT Core', '第2世代 RT コア'), aiGen: L('第 3 代 Tensor Core', '3rd-gen Tensor Core', '第3世代 Tensor コア'), design: MONO_G },
  turing: { arch: 'Turing (TU10x / TU11x)', process: 'TSMC 12nm FFN', unitName: L('SM', 'SM', 'SM'), shadersPerUnit: 64, rtGen: L('第 1 代 RT Core（RTX 型号）', '1st-gen RT Core (RTX only)', '第1世代 RT コア（RTX のみ）'), aiGen: L('第 2 代 Tensor Core（RTX 型号）', '2nd-gen Tensor Core (RTX only)', '第2世代 Tensor コア（RTX のみ）'), design: MONO_G },
  pascal: { arch: 'Pascal (GP10x)', process: 'TSMC 16nm FinFET', unitName: L('SM', 'SM', 'SM'), shadersPerUnit: 128, rtGen: null, aiGen: null, design: MONO_G },
  maxwell: { arch: 'Maxwell 2 (GM20x)', process: 'TSMC 28nm', unitName: L('SMM', 'SMM', 'SMM'), shadersPerUnit: 128, rtGen: null, aiGen: null, design: MONO_G },
  kepler: { arch: 'Kepler (GK10x)', process: 'TSMC 28nm', unitName: L('SMX', 'SMX', 'SMX'), shadersPerUnit: 192, rtGen: null, aiGen: null, design: MONO_G },
  fermi: { arch: 'Fermi (GF10x / GF11x)', process: 'TSMC 40nm', unitName: L('SM', 'SM', 'SM'), shadersPerUnit: 32, rtGen: null, aiGen: null, design: MONO_G },
  tesla: { arch: 'Tesla (G8x / GT200)', process: 'TSMC 65nm / 55nm', unitName: L('SM', 'SM', 'SM'), shadersPerUnit: 8, rtGen: null, aiGen: null, design: MONO_G },
  rdna4: { arch: 'RDNA 4 (Navi 4x)', process: 'TSMC N4P', unitName: L('CU', 'CU', 'CU'), shadersPerUnit: 64, rtGen: L('第 3 代 RT 加速器（BVH8 + 定向盒）', '3rd-gen RT accelerator (BVH8 + oriented boxes)', '第3世代 RT アクセラレータ（BVH8）'), aiGen: L('第 2 代 AI 加速器（FP8, 稀疏）', '2nd-gen AI accelerator (FP8, sparsity)', '第2世代 AI アクセラレータ（FP8）'), design: L('单片 + Infinity Cache', 'Monolithic + Infinity Cache', 'モノリシック + Infinity Cache') },
  rdna3: { arch: 'RDNA 3 (Navi 3x)', process: 'TSMC N5 (GCD) + N6 (MCD)', unitName: L('CU', 'CU', 'CU'), shadersPerUnit: 64, rtGen: L('第 2 代 RT 加速器', '2nd-gen RT accelerator', '第2世代 RT アクセラレータ'), aiGen: L('第 1 代 AI 加速器（WMMA）', '1st-gen AI accelerator (WMMA)', '第1世代 AI アクセラレータ（WMMA）'), design: L('Chiplet：GCD 图形晶片 + MCD 显存/缓存晶片（Navi 31/32）', 'Chiplet: GCD graphics die + MCD memory/cache dies (Navi 31/32)', 'チップレット：GCD + MCD（Navi 31/32）') },
  'rdna3.5': { arch: 'RDNA 3.5', process: 'TSMC N4P', unitName: L('CU', 'CU', 'CU'), shadersPerUnit: 64, rtGen: L('第 2 代 RT 加速器', '2nd-gen RT accelerator', '第2世代 RT アクセラレータ'), aiGen: L('WMMA', 'WMMA', 'WMMA'), design: L('APU 集成', 'Integrated in APU', 'APU 内蔵') },
  rdna2: { arch: 'RDNA 2 (Navi 2x)', process: 'TSMC N7', unitName: L('CU', 'CU', 'CU'), shadersPerUnit: 64, rtGen: L('第 1 代 Ray Accelerator', '1st-gen Ray Accelerator', '第1世代 Ray Accelerator'), aiGen: null, design: L('单片 + Infinity Cache', 'Monolithic + Infinity Cache', 'モノリシック + Infinity Cache') },
  rdna: { arch: 'RDNA (Navi 1x)', process: 'TSMC N7', unitName: L('CU', 'CU', 'CU'), shadersPerUnit: 64, rtGen: null, aiGen: null, design: MONO_G },
  vega: { arch: 'GCN 5 (Vega 10)', process: 'GF 14nm', unitName: L('CU', 'CU', 'CU'), shadersPerUnit: 64, rtGen: null, aiGen: null, design: L('GPU + HBM2 于中介层', 'GPU + HBM2 on interposer', 'GPU + HBM2 インターポーザ') },
  polaris: { arch: 'GCN 4 (Polaris)', process: 'GF 14nm', unitName: L('CU', 'CU', 'CU'), shadersPerUnit: 64, rtGen: null, aiGen: null, design: MONO_G },
  gcn: { arch: 'GCN 1–3', process: 'TSMC 28nm', unitName: L('CU', 'CU', 'CU'), shadersPerUnit: 64, rtGen: null, aiGen: null, design: L('单片（Fiji 为 HBM 中介层）', 'Monolithic (Fiji on HBM interposer)', 'モノリシック（Fiji は HBM インターポーザ）') },
  terascale: { arch: 'TeraScale 2/3 (VLIW5 / VLIW4)', process: 'TSMC 55nm / 40nm', unitName: L('SIMD', 'SIMD', 'SIMD'), shadersPerUnit: 80, rtGen: null, aiGen: null, design: MONO_G },
  xe2: { arch: 'Xe2 Battlemage', process: 'TSMC N5', unitName: L('Xe 核心', 'Xe-core', 'Xe コア'), shadersPerUnit: 128, rtGen: L('第 2 代 RT 单元', '2nd-gen RT unit', '第2世代 RT ユニット'), aiGen: L('XMX 引擎', 'XMX engine', 'XMX エンジン'), design: MONO_G },
  xe: { arch: 'Xe HPG Alchemist', process: 'TSMC N6', unitName: L('Xe 核心', 'Xe-core', 'Xe コア'), shadersPerUnit: 128, rtGen: L('第 1 代 RT 单元', '1st-gen RT unit', '第1世代 RT ユニット'), aiGen: L('XMX 引擎', 'XMX engine', 'XMX エンジン'), design: MONO_G },
  'xe-lp': { arch: 'Xe-LP', process: 'Intel 10nm SuperFin / Intel 7', unitName: L('EU', 'EU', 'EU'), shadersPerUnit: 8, rtGen: null, aiGen: null, design: L('CPU 集成', 'Integrated in CPU', 'CPU 内蔵') },
  gen9: { arch: 'Gen9.5', process: 'Intel 14nm', unitName: L('EU', 'EU', 'EU'), shadersPerUnit: 8, rtGen: null, aiGen: null, design: L('CPU 集成', 'Integrated in CPU', 'CPU 内蔵') },
  'apple-m3': { arch: 'Apple GPU (M3 family)', process: 'TSMC N3B', unitName: L('GPU 核心', 'GPU core', 'GPU コア'), shadersPerUnit: 128, rtGen: L('硬件光追（第 1 代）', 'Hardware RT (1st gen)', 'ハードウェア RT（第1世代）'), aiGen: null, design: L('SoC 集成，动态缓存', 'Integrated in SoC, Dynamic Caching', 'SoC 内蔵、Dynamic Caching') },
  'apple-m2': { arch: 'Apple GPU (M2 family)', process: 'TSMC N5P', unitName: L('GPU 核心', 'GPU core', 'GPU コア'), shadersPerUnit: 128, rtGen: null, aiGen: null, design: L('SoC 集成', 'Integrated in SoC', 'SoC 内蔵') },
  'apple-m1': { arch: 'Apple GPU (M1 family)', process: 'TSMC N5', unitName: L('GPU 核心', 'GPU core', 'GPU コア'), shadersPerUnit: 128, rtGen: null, aiGen: null, design: L('SoC 集成', 'Integrated in SoC', 'SoC 内蔵') },
  volta: { arch: 'Volta (GV100)', process: 'TSMC 12nm FFN', unitName: L('SM', 'SM', 'SM'), shadersPerUnit: 64, rtGen: null, aiGen: L('第 1 代 Tensor Core', '1st-gen Tensor Core', '第1世代 Tensor コア'), design: L('GPU + HBM2 于中介层', 'GPU + HBM2 on interposer', 'GPU + HBM2 インターポーザ') },
  'apple-m4': { arch: 'Apple GPU (M4 family)', process: 'TSMC N3E', unitName: L('GPU 核心', 'GPU core', 'GPU コア'), shadersPerUnit: 128, rtGen: L('硬件光追（第 2 代）', 'Hardware RT (2nd gen)', 'ハードウェア RT（第2世代）'), aiGen: L('Neural Engine（SoC）', 'Neural Engine (SoC)', 'Neural Engine（SoC）'), design: L('SoC 集成，动态缓存', 'Integrated in SoC, Dynamic Caching', 'SoC 内蔵、Dynamic Caching') },
  'snapdragon-x': { arch: 'Adreno X1', process: 'TSMC N4', unitName: L('着色器核心', 'Shader core', 'シェーダコア'), shadersPerUnit: null, rtGen: null, aiGen: null, design: L('SoC 集成', 'Integrated in SoC', 'SoC 内蔵') },
}
