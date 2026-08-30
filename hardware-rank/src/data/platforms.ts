/**
 * 平台 / 兼容性知识表：按插槽、代次派生，避免每条产品手填。
 * 内容为公开规格整理，新增插槽或架构时在此补充即可。
 */
import type { Cpu, Gpu, Storage, Psu, Ram } from '@/types/hardware'

export interface Row { label: string; value: string; note?: string }

/* ---------- CPU 插槽 ---------- */
interface SocketInfo {
  name: string
  vendor: string
  since: string
  chipsets: string[]
  memory: string
  pcie: string
  cooler: string
  upgrade: string
}
const SOCKETS: Record<string, SocketInfo> = {
  AM5: {
    name: 'AM5 (LGA1718)', vendor: 'AMD', since: '2022-09',
    chipsets: ['X870E', 'X870', 'B850', 'B840', 'X670E', 'X670', 'B650E', 'B650', 'A620'],
    memory: '仅 DDR5（双通道，甜点 6000 MT/s EXPO）',
    pcie: 'PCIe 5.0 ×16 显卡 + ×4 NVMe（B840/A620 主板可能限制为 4.0）',
    cooler: '沿用 AM4 孔位（背板兼容），多数 AM4 散热器可直装',
    upgrade: 'AMD 承诺支持到 2027+，Zen 4 / Zen 5 均可用；老主板需更新 BIOS 才能上 9000 系',
  },
  AM4: {
    name: 'AM4 (PGA1331)', vendor: 'AMD', since: '2017-03',
    chipsets: ['X570', 'B550', 'A520', 'X470', 'B450', 'X370', 'B350', 'A320'],
    memory: '仅 DDR4（双通道，甜点 3600 MT/s）',
    pcie: 'PCIe 4.0（X570/B550 + Zen 2 以上），其余 3.0',
    cooler: 'AM4 孔位，绝大多数散热器兼容',
    upgrade: '平台已停更，5800X3D / 5700X3D 为终点站；300 系主板需刷 BIOS',
  },
  LGA1851: {
    name: 'LGA1851', vendor: 'Intel', since: '2024-10',
    chipsets: ['Z890', 'B860', 'H810'],
    memory: '仅 DDR5（双通道，官方 6400，主板普遍 8000+）',
    pcie: 'CPU 直出 PCIe 5.0 ×16 + ×4 + 4.0 ×4',
    cooler: '与 LGA1700 同孔位，但 IHS 热点位置北移，部分厂商提供偏移扣具',
    upgrade: '仅 Arrow Lake（Core Ultra 200S），下一代 Nova Lake 预计换插槽',
  },
  LGA1200: { name: 'LGA1200', vendor: 'Intel', since: '2020-05', chipsets: ['Z590', 'B560', 'H570', 'H510', 'Z490', 'B460', 'H470', 'H410'], memory: '仅 DDR4（双通道，11 代官方 3200）', pcie: '11 代 PCIe 4.0 ×16 + ×4（500 系）；10 代 3.0', cooler: '与 LGA115x 同孔位（75×75）', upgrade: '仅 10/11 代，平台已停更；400 系主板搭 11 代需 BIOS' },
  LGA1151v2: { name: 'LGA1151 (300 系)', vendor: 'Intel', since: '2017-10', chipsets: ['Z390', 'B365', 'B360', 'H370', 'H310', 'Z370'], memory: '仅 DDR4（官方 2666）', pcie: 'PCIe 3.0 ×16', cooler: 'LGA115x 孔位', upgrade: '8/9 代通用；与 100/200 系主板物理相同但不兼容' },
  LGA1151: { name: 'LGA1151 (100/200 系)', vendor: 'Intel', since: '2015-08', chipsets: ['Z270', 'B250', 'H270', 'Z170', 'B150', 'H110'], memory: 'DDR4-2133/2400 或 DDR3L（视主板）', pcie: 'PCIe 3.0 ×16', cooler: 'LGA115x 孔位', upgrade: '仅 6/7 代，平台已停更' },
  LGA1150: { name: 'LGA1150', vendor: 'Intel', since: '2013-06', chipsets: ['Z97', 'H97', 'Z87', 'H87', 'B85', 'H81'], memory: '仅 DDR3-1600', pcie: 'PCIe 3.0 ×16', cooler: 'LGA115x 孔位', upgrade: '仅 4 代（Haswell / Devil’s Canyon / Broadwell），已停更' },
  LGA1155: { name: 'LGA1155', vendor: 'Intel', since: '2011-01', chipsets: ['Z77', 'H77', 'B75', 'Z68', 'P67', 'H67', 'H61'], memory: '仅 DDR3-1333/1600', pcie: 'Ivy Bridge PCIe 3.0；Sandy Bridge 2.0', cooler: 'LGA115x 孔位', upgrade: '2/3 代通用（6 系主板需 BIOS 支持 3 代），已停更' },
  LGA1156: { name: 'LGA1156', vendor: 'Intel', since: '2009-09', chipsets: ['P55', 'H55', 'H57'], memory: '仅 DDR3-1333 双通道', pcie: 'PCIe 2.0 ×16', cooler: 'LGA115x 孔位', upgrade: '仅 Lynnfield / Clarkdale，早已停更' },
  LGA1366: { name: 'LGA1366', vendor: 'Intel', since: '2008-11', chipsets: ['X58'], memory: 'DDR3 三通道', pcie: 'PCIe 2.0（X58 提供 36 条）', cooler: 'LGA1366 专用孔位（80×80）', upgrade: 'Bloomfield / Gulftown，可上 6 核至强，早已停更' },
  'LGA2011-3': { name: 'LGA2011-3', vendor: 'Intel', since: '2014-08', chipsets: ['X99'], memory: 'DDR4 四通道', pcie: 'CPU 直出 28–40 条 PCIe 3.0', cooler: 'LGA2011 专用孔位', upgrade: 'Haswell-E / Broadwell-E，HEDT 平台已停更' },
  LGA775: { name: 'LGA775', vendor: 'Intel', since: '2004-06', chipsets: ['P45', 'P43', 'G41', 'X48', 'P35', 'G31', 'nForce 7xx'], memory: 'DDR2 或 DDR3（视主板）', pcie: 'PCIe 2.0 ×16（P45/X48），旧板 1.x', cooler: 'LGA775 孔位（72×72）', upgrade: 'Core 2 全系，注意 FSB 1333/1600 支持，早已停更' },
  'AM3+': { name: 'AM3+', vendor: 'AMD', since: '2011-10', chipsets: ['990FX', '990X', '970', '890FX'], memory: '仅 DDR3-1866', pcie: 'PCIe 2.0 ×16', cooler: 'AM2/AM3 通用孔位', upgrade: 'FX 全系（推土机 / 打桩机），可插 AM3 Phenom II，已停更' },
  AM3: { name: 'AM3', vendor: 'AMD', since: '2009-02', chipsets: ['890GX', '870', '790X', '785G', '770'], memory: 'DDR3-1333（CPU 双控 DDR2/DDR3）', pcie: 'PCIe 2.0 ×16', cooler: 'AM2/AM3 通用孔位', upgrade: 'Phenom II / Athlon II，已停更' },
  'AM2+': { name: 'AM2+', vendor: 'AMD', since: '2007-11', chipsets: ['790FX', '790GX', '780G', '770'], memory: '仅 DDR2-1066', pcie: 'PCIe 2.0 ×16', cooler: 'AM2/AM3 通用孔位', upgrade: 'Phenom / Athlon 64 X2，可插 AM3 CPU，早已停更' },
  LGA1700: {
    name: 'LGA1700', vendor: 'Intel', since: '2021-11',
    chipsets: ['Z790', 'B760', 'H770', 'H610', 'Z690', 'B660', 'H670'],
    memory: 'DDR5 或 DDR4（取决于主板，不可混用）',
    pcie: 'PCIe 5.0 ×16 + 4.0 ×4（600/700 系）',
    cooler: 'LGA1700 专用孔位（78×78），老 115x 散热器需转接扣具',
    upgrade: '12/13/14 代通用，需 BIOS 支持；13/14 代 K 系列注意微码 0x12B 更新',
  },
}

const CPU_GEN: Record<string, { arch: string; process: string; pcieLanes?: string; l2?: string; npu?: string }> = {
  zen5: { arch: 'Zen 5', process: 'TSMC N4P (CCD) + N6 (IOD)', pcieLanes: '28 条 PCIe 5.0（桌面）', l2: '每核 1 MB' },
  zen4: { arch: 'Zen 4', process: 'TSMC N5 (CCD) + N6 (IOD)', pcieLanes: '28 条 PCIe 5.0（桌面）', l2: '每核 1 MB' },
  zen3: { arch: 'Zen 3', process: 'TSMC N7', pcieLanes: '24 条 PCIe 4.0', l2: '每核 512 KB' },
  'arrow-lake': { arch: 'Lion Cove + Skymont', process: 'TSMC N3B (Compute Tile)', pcieLanes: '24 条（20×5.0 + 4×4.0）', l2: 'P 核 3 MB / E 核簇 4 MB', npu: 'NPU 13 TOPS' },
  'arrow-lake-hx': { arch: 'Lion Cove + Skymont', process: 'TSMC N3B', l2: 'P 核 3 MB', npu: 'NPU 13 TOPS' },
  'arrow-lake-h': { arch: 'Lion Cove + Skymont + LP-E', process: 'TSMC N3B', l2: 'P 核 3 MB', npu: 'NPU 13 TOPS' },
  'lunar-lake': { arch: 'Lion Cove + Skymont', process: 'TSMC N3B', l2: 'P 核 2.5 MB', npu: 'NPU 48 TOPS' },
  'meteor-lake': { arch: 'Redwood Cove + Crestmont', process: 'Intel 4', l2: 'P 核 2 MB', npu: 'NPU 11 TOPS' },
  'raptor-lake': { arch: 'Raptor Cove + Gracemont', process: 'Intel 7', pcieLanes: '20 条（16×5.0 + 4×4.0）', l2: 'P 核 2 MB / E 核簇 4 MB' },
  'raptor-lake-hx': { arch: 'Raptor Cove + Gracemont', process: 'Intel 7', l2: 'P 核 2 MB' },
  'alder-lake': { arch: 'Golden Cove + Gracemont', process: 'Intel 7', pcieLanes: '20 条（16×5.0 + 4×4.0）', l2: 'P 核 1.25 MB' },
  core2: { arch: 'Core (Conroe / Penryn)', process: 'Intel 65nm / 45nm', l2: '共享 L2（无 L3）' },
  nehalem: { arch: 'Nehalem / Lynnfield', process: 'Intel 45nm', pcieLanes: 'LGA1156：16 条 PCIe 2.0', l2: '每核 256 KB' },
  k10: { arch: 'K10 (Stars)', process: 'AMD 65nm / 45nm', l2: '每核 512 KB' },
  'sandy-bridge': { arch: 'Sandy Bridge', process: 'Intel 32nm', pcieLanes: '16 条 PCIe 2.0', l2: '每核 256 KB' },
  'ivy-bridge': { arch: 'Ivy Bridge', process: 'Intel 22nm (Tri-Gate)', pcieLanes: '16 条 PCIe 3.0', l2: '每核 256 KB' },
  bulldozer: { arch: 'Bulldozer', process: 'GF 32nm SOI', l2: '每模块 2 MB' },
  piledriver: { arch: 'Piledriver', process: 'GF 32nm SOI', l2: '每模块 2 MB' },
  haswell: { arch: 'Haswell', process: 'Intel 22nm', pcieLanes: '16 条 PCIe 3.0', l2: '每核 256 KB' },
  'haswell-e': { arch: 'Haswell-E', process: 'Intel 22nm', pcieLanes: '40 条 PCIe 3.0', l2: '每核 256 KB' },
  skylake: { arch: 'Skylake', process: 'Intel 14nm', pcieLanes: '16 条 PCIe 3.0', l2: '每核 256 KB' },
  'kaby-lake': { arch: 'Kaby Lake', process: 'Intel 14nm+', pcieLanes: '16 条 PCIe 3.0', l2: '每核 256 KB' },
  'coffee-lake': { arch: 'Coffee Lake', process: 'Intel 14nm++', pcieLanes: '16 条 PCIe 3.0', l2: '每核 256 KB' },
  'comet-lake': { arch: 'Comet Lake', process: 'Intel 14nm++', pcieLanes: '16 条 PCIe 3.0', l2: '每核 256 KB' },
  'rocket-lake': { arch: 'Cypress Cove', process: 'Intel 14nm', pcieLanes: '20 条 PCIe 4.0', l2: '每核 512 KB' },
  'tiger-lake': { arch: 'Willow Cove', process: 'Intel 10nm SuperFin', l2: '每核 1.25 MB' },
  zen: { arch: 'Zen', process: 'GF 14nm', pcieLanes: '24 条 PCIe 3.0', l2: '每核 512 KB' },
  'zen+': { arch: 'Zen+', process: 'GF 12nm', pcieLanes: '24 条 PCIe 3.0', l2: '每核 512 KB' },
  zen2: { arch: 'Zen 2', process: 'TSMC N7 (CCD) + GF 12nm (IOD)', pcieLanes: '24 条 PCIe 4.0', l2: '每核 512 KB' },
  'zen3+': { arch: 'Zen 3+', process: 'TSMC N6', l2: '每核 512 KB' },
  'apple-m1': { arch: 'Apple M1 (ARMv8.5)', process: 'TSMC N5', npu: 'Neural Engine 11 TOPS' },
  'apple-m2': { arch: 'Apple M2 (ARMv8.6)', process: 'TSMC N5P', npu: 'Neural Engine 15.8 TOPS' },
  'snapdragon-8cx': { arch: 'Kryo 680 (ARMv8.4)', process: 'Samsung 5nm', npu: 'Hexagon 15 TOPS' },
  'apple-m4': { arch: 'Apple M4 (ARMv9.2)', process: 'TSMC N3E', npu: 'Neural Engine 38 TOPS' },
  'apple-m3': { arch: 'Apple M3 (ARMv8.6)', process: 'TSMC N3B', npu: 'Neural Engine 18 TOPS' },
  'snapdragon-x': { arch: 'Oryon (ARMv8.7)', process: 'TSMC N4', npu: 'Hexagon NPU 45 TOPS' },
}

export function cpuPlatform(c: Cpu): Row[] {
  const rows: Row[] = []
  const g = CPU_GEN[c.gen]
  if (g) {
    rows.push({ label: '微架构', value: g.arch })
    rows.push({ label: '制程', value: g.process })
    if (g.l2) rows.push({ label: 'L2 缓存', value: g.l2 })
    if (g.pcieLanes) rows.push({ label: 'CPU PCIe 通道', value: g.pcieLanes })
    if (g.npu) rows.push({ label: 'AI 加速', value: g.npu })
  }
  const s = SOCKETS[c.socket]
  if (s) {
    rows.push({ label: '插槽', value: s.name, note: `${s.since} 起` })
    rows.push({ label: '兼容芯片组', value: s.chipsets.join(' / ') })
    rows.push({ label: '内存支持', value: s.memory })
    rows.push({ label: 'PCIe', value: s.pcie })
    rows.push({ label: '散热器孔位', value: s.cooler })
    rows.push({ label: '升级路线', value: s.upgrade })
  } else if (c.form === 'laptop') {
    const pkg = c.socket.includes('(') ? ' ' + c.socket.slice(c.socket.indexOf('(')) : ''
    rows.push({ label: '封装', value: `BGA 板载${pkg}`, note: '焊死在主板上，不可更换或升级' })
    rows.push({ label: '内存', value: c.mem.includes('板载') || c.mem.startsWith('LPDDR') ? `${c.mem}（板载，不可扩展）` : `${c.mem}（SO-DIMM，通常可升级）` })
    if (c.tdp_range) rows.push({ label: '功耗墙', value: `${c.tdp_range}`, note: '实际由笔记本厂商设定，同芯片不同机型差距可达 30%+' })
  }
  if (c.igpu) rows.push({ label: '核显', value: c.igpu, note: c.form === 'desktop' ? '可亮机 / 编解码，不适合游戏' : undefined })
  else rows.push({ label: '核显', value: '无', note: '必须搭配独立显卡才能点亮' })
  return rows
}

/* ---------- GPU ---------- */
const GPU_GEN: Record<string, { arch: string; process: string; pcie: string; upscale: string; encoder: string; api: string }> = {
  blackwell: { arch: 'Blackwell', process: 'TSMC 4N', pcie: 'PCIe 5.0 ×16', upscale: 'DLSS 4（多帧生成）', encoder: 'NVENC 第 9 代：AV1 / HEVC 4:2:2', api: 'DirectX 12 Ultimate / Vulkan 1.4 / CUDA 12' },
  ada: { arch: 'Ada Lovelace', process: 'TSMC 4N', pcie: 'PCIe 4.0 ×16', upscale: 'DLSS 3.5（单帧生成）', encoder: 'NVENC 第 8 代：AV1', api: 'DirectX 12 Ultimate / Vulkan / CUDA 12' },
  ampere: { arch: 'Ampere', process: 'Samsung 8N', pcie: 'PCIe 4.0 ×16', upscale: 'DLSS 2 / 3.5 光线重建（无帧生成）', encoder: 'NVENC 第 7 代：HEVC（无 AV1 编码）', api: 'DirectX 12 Ultimate / CUDA 12' },
  rdna4: { arch: 'RDNA 4', process: 'TSMC N4P', pcie: 'PCIe 5.0 ×16', upscale: 'FSR 4（AI 超采样）', encoder: 'VCN 5：AV1 / HEVC', api: 'DirectX 12 Ultimate / Vulkan / ROCm' },
  rdna3: { arch: 'RDNA 3', process: 'TSMC N5 + N6 (MCD)', pcie: 'PCIe 4.0 ×16', upscale: 'FSR 3.1（帧生成）', encoder: 'VCN 4：AV1 / HEVC', api: 'DirectX 12 Ultimate / Vulkan' },
  'rdna3.5': { arch: 'RDNA 3.5', process: 'TSMC N4P', pcie: '集成（共享 CPU 通道）', upscale: 'FSR 3.1', encoder: 'VCN 4：AV1', api: 'DirectX 12 Ultimate' },
  rdna2: { arch: 'RDNA 2', process: 'TSMC N7', pcie: 'PCIe 4.0 ×16（6600 为 ×8）', upscale: 'FSR 3.1（帧生成）', encoder: 'VCN 3：HEVC（无 AV1 编码）', api: 'DirectX 12 Ultimate' },
  xe2: { arch: 'Xe2 (Battlemage)', process: 'TSMC N5 / N3B', pcie: 'PCIe 4.0 ×8（B580）', upscale: 'XeSS 2（帧生成）', encoder: 'AV1 / HEVC / VP9', api: 'DirectX 12 Ultimate / oneAPI' },
  xe: { arch: 'Xe (Alchemist)', process: 'TSMC N6', pcie: 'PCIe 4.0 ×16', upscale: 'XeSS 1.3', encoder: 'AV1 / HEVC', api: 'DirectX 12 Ultimate（需 Resizable BAR）' },
  tesla: { arch: 'Tesla (G8x / GT200)', process: 'TSMC 65nm / 55nm', pcie: 'PCIe 2.0 ×16', upscale: '—', encoder: 'PureVideo HD（仅解码）', api: 'DirectX 10 / OpenGL 3.3 / CUDA 1.x' },
  fermi: { arch: 'Fermi', process: 'TSMC 40nm', pcie: 'PCIe 2.0 ×16', upscale: '—', encoder: '仅解码', api: 'DirectX 12 (FL 11_0) / CUDA 2.x' },
  kepler: { arch: 'Kepler', process: 'TSMC 28nm', pcie: 'PCIe 3.0 ×16', upscale: '—', encoder: 'NVENC 第 1 代：H.264', api: 'DirectX 12 (FL 11_0) / CUDA 3.x' },
  maxwell: { arch: 'Maxwell', process: 'TSMC 28nm', pcie: 'PCIe 3.0 ×16', upscale: '—', encoder: 'NVENC 第 5 代：HEVC', api: 'DirectX 12 (FL 12_1) / CUDA 5.x' },
  pascal: { arch: 'Pascal', process: 'TSMC 16nm FinFET', pcie: 'PCIe 3.0 ×16', upscale: '—（可用 FSR / XeSS DP4a）', encoder: 'NVENC 第 6 代：HEVC 10-bit', api: 'DirectX 12 (FL 12_1) / CUDA 6.x' },
  turing: { arch: 'Turing', process: 'TSMC 12nm FFN', pcie: 'PCIe 3.0 ×16', upscale: 'DLSS 2（RTX 型号）', encoder: 'NVENC 第 7 代：HEVC B 帧', api: 'DirectX 12 Ultimate（RTX）/ CUDA 7.5' },
  terascale: { arch: 'TeraScale (VLIW5 / VLIW4)', process: 'TSMC 55nm / 40nm', pcie: 'PCIe 2.0 ×16', upscale: '—', encoder: 'UVD（仅解码）', api: 'DirectX 10.1 / 11' },
  gcn: { arch: 'GCN 1–3', process: 'TSMC 28nm', pcie: 'PCIe 3.0 ×16', upscale: '—（FSR 1/2 可用）', encoder: 'VCE：H.264', api: 'DirectX 12 (FL 12_0) / Vulkan' },
  polaris: { arch: 'GCN 4 (Polaris)', process: 'GF 14nm', pcie: 'PCIe 3.0 ×16', upscale: 'FSR 2', encoder: 'VCE 3.4：H.264 / HEVC', api: 'DirectX 12 (FL 12_0) / Vulkan' },
  vega: { arch: 'GCN 5 (Vega)', process: 'GF 14nm', pcie: 'PCIe 3.0 ×16', upscale: 'FSR 2', encoder: 'VCE 4：HEVC', api: 'DirectX 12 (FL 12_1) / Vulkan' },
  rdna: { arch: 'RDNA', process: 'TSMC N7', pcie: 'PCIe 4.0 ×16', upscale: 'FSR 3.1', encoder: 'VCN 2：HEVC', api: 'DirectX 12 (FL 12_1) / Vulkan' },
  'apple-m4': { arch: 'Apple GPU (M4 系)', process: 'TSMC N3E', pcie: '集成（统一内存）', upscale: 'MetalFX', encoder: 'ProRes / HEVC / AV1 解码', api: 'Metal 3' },
  'snapdragon-x': { arch: 'Adreno X1', process: 'TSMC N4', pcie: '集成', upscale: '—', encoder: 'AV1 / HEVC', api: 'DirectX 12 (FL 12_1)' },
}

function powerConnector(g: Gpu): string {
  if (g.form !== 'desktop') return '—'
  if (g.brand === 'NVIDIA' && (g.gen === 'blackwell' || g.gen === 'ada')) {
    if (g.tdp_w >= 200 || g.gen === 'blackwell' && g.tdp_w >= 180) return `1× 12V-2x6 (16-pin)，随附 ${g.tdp_w >= 450 ? '4' : g.tdp_w >= 300 ? '3' : '2'}× 8-pin 转接线`
    return '1× 8-pin PCIe（部分型号 12V-2x6）'
  }
  if (g.tdp_w >= 300) return g.gen === 'tesla' || g.gen === 'fermi' ? '1× 8-pin + 1× 6-pin PCIe' : '3× 8-pin PCIe'
  if (g.tdp_w >= 200) return '2× 8-pin PCIe'
  if (g.tdp_w >= 130) return '1× 8-pin PCIe'
  return '1× 8-pin 或 6-pin PCIe'
}
function recommendedPsu(tdp: number): string {
  const w = tdp >= 500 ? 1000 : tdp >= 350 ? 850 : tdp >= 280 ? 750 : tdp >= 220 ? 650 : tdp >= 160 ? 550 : 450
  return `${w}W 起（${tdp}W TBP + 主流 CPU，留 30% 余量）`
}
function slotSize(tdp: number): string {
  return tdp >= 400 ? '3–4 槽，长度 300–340mm，注意机箱与主板下方 M.2' : tdp >= 250 ? '2.5–3 槽，长度 280–320mm' : tdp >= 160 ? '2–2.5 槽，长度 240–300mm' : '2 槽，长度 170–250mm，多数 ITX 可用'
}

export function gpuPlatform(g: Gpu): Row[] {
  const rows: Row[] = []
  const a = GPU_GEN[g.gen]
  if (a) {
    rows.push({ label: '架构 / 制程', value: `${a.arch} · ${a.process}` })
    rows.push({ label: '总线接口', value: a.pcie, note: g.form === 'desktop' && a.pcie.includes('5.0') ? '插 PCIe 4.0 主板亦可，损失 <2%' : undefined })
    rows.push({ label: '超采样 / 帧生成', value: a.upscale })
    rows.push({ label: '视频编码', value: a.encoder })
    rows.push({ label: 'API', value: a.api })
  }
  if (g.form === 'desktop') {
    rows.push({ label: '供电接口', value: powerConnector(g), note: powerConnector(g).includes('12V-2x6') ? '需 ATX 3.1 电源原生线或转接线，插紧到底' : undefined })
    rows.push({ label: '推荐电源', value: recommendedPsu(g.tdp_w) })
    rows.push({ label: '体积参考', value: slotSize(g.tdp_w), note: '以各家非公版为准' })
  } else if (g.form === 'laptop') {
    rows.push({ label: 'TGP 区间', value: g.tgp_range ?? `${g.tgp_w ?? g.tdp_w}W`, note: '本条目按标注功耗档评分；低功耗版本请看同名其他条目' })
    rows.push({ label: '显示输出', value: '视机型：MUX 独显直连 / Advanced Optimus 影响帧率 5–15%' })
  } else {
    rows.push({ label: '显存', value: `共享系统内存（${g.vram_type}）`, note: '实际可用取决于系统内存容量与带宽' })
  }
  return rows
}

/* ---------- RAM ---------- */
export function ramPlatform(r: Ram): Row[] {
  const rows: Row[] = []
  if (r.form === 'kit-desktop') {
    rows.push({ label: '插槽', value: r.type === 'DDR5' ? 'DIMM 288-pin（DDR5 缺口位置与 DDR4 不同，不可互插）' : 'DIMM 288-pin（DDR4）' })
    rows.push({ label: '一键超频', value: r.type === 'DDR5' ? 'XMP 3.0 (Intel) / EXPO (AMD)，请确认主板支持' : 'XMP 2.0（AMD 主板亦可读取）' })
    rows.push({ label: '电压', value: r.type === 'DDR5' ? (r.speed_mt >= 7000 ? '1.40–1.45V（高频）' : r.speed_mt >= 6000 ? '1.35V' : '1.10V (JEDEC)') : r.speed_mt >= 3600 ? '1.35V' : '1.20V' })
    rows.push({ label: '平台建议', value: r.type === 'DDR5' ? (r.speed_mt > 6400 ? 'Intel Z790 / Z890 双条易达；AM5 需 UCLK 分频，6000–6400 更稳' : 'AM5 甜点（1:1 UCLK）/ Intel 通用') : 'AM4 / Intel 12–14 代 DDR4 主板' })
    rows.push({ label: '四条插满', value: '四条 DDR5 会显著降频，建议双条大容量' })
  } else if (r.form === 'sodimm') {
    rows.push({ label: '插槽', value: `SO-DIMM 262-pin（${r.type}）`, note: '与桌面 DIMM 不通用；确认笔记本有插槽而非板载' })
    rows.push({ label: '一键超频', value: r.speed_mt > 5600 ? 'XMP 3.0 / EXPO，仅部分游戏本支持' : 'JEDEC 默认即可' })
  } else {
    rows.push({ label: '封装', value: 'LPDDR 板载 / 封装内（BGA）', note: '购机时选定容量，之后无法升级' })
    rows.push({ label: '位宽', value: r.spec.includes('512') ? '512-bit' : r.spec.includes('256') ? '256-bit' : '128-bit' })
  }
  return rows
}

/* ---------- Storage ---------- */
export function storagePlatform(s: Storage): Row[] {
  const rows: Row[] = []
  if (s.form === 'nvme') {
    rows.push({ label: '规格', value: 'M.2 2280 M-Key，NVMe 2.0' })
    rows.push({ label: '接口需求', value: s.interface === 'pcie5' ? 'PCIe 5.0 ×4（AM5 / LGA1700+ 第一根 M.2）' : s.interface === 'pcie4' ? 'PCIe 4.0 ×4（向下兼容 3.0）' : 'PCIe 3.0 ×4' })
    rows.push({ label: '散热', value: s.interface === 'pcie5' ? '必须散热片，最好主板自带或主动风扇；裸盘会过热降速' : '建议主板自带散热片；无则可裸装' })
    rows.push({ label: 'DRAM 缓存', value: s.dram ? '有独立 DRAM' : '无 DRAM（HMB 借用内存）', note: s.dram ? undefined : '随机小文件与满盘性能稍弱' })
    rows.push({ label: '兼容性', value: 'PS5 扩展需 PCIe 4.0+ 且带散热片，高度 ≤11.25mm；笔记本请确认单面/双面' })
  } else if (s.form === 'sata') {
    rows.push({ label: '规格', value: '2.5 英寸 7mm，SATA III 6Gb/s' })
    rows.push({ label: '接口需求', value: '任意 SATA 口，速度上限约 560 MB/s' })
    rows.push({ label: '适用', value: '老平台升级、笔记本 2.5 寸位、数据仓库' })
  } else {
    rows.push({ label: '规格', value: '3.5 英寸，SATA III 6Gb/s' })
    rows.push({ label: '记录方式', value: s.nand?.includes('SMR') ? 'SMR 叠瓦：随机写入慢，不宜 NAS / RAID' : 'CMR 垂直：适合 NAS / RAID' })
    rows.push({ label: '注意', value: '需机箱 3.5 寸位与 SATA 供电；氦气盘噪音与振动较大，NAS 建议同型号多块' })
  }
  if (s.tbw) rows.push({ label: '耐久 / 容量', value: `${(s.tbw / s.capacity_gb * 1000).toFixed(0)} 次全盘写入（TBW ÷ 容量）` })
  return rows
}

/* ---------- PSU ---------- */
export function psuPlatform(p: Psu): Row[] {
  const rows: Row[] = []
  rows.push({ label: '规格', value: p.form === 'sfx' ? 'SFX（125×63.5×100mm），配 ATX 转接板可装普通机箱' : 'ATX（150×86×140–160mm）' })
  rows.push({ label: '显卡供电', value: p.atx31 ? '原生 12V-2x6 (16-pin) 一条 + 多个 8-pin' : p.watt >= 750 ? '8-pin ×4+；上 40/50 系需 12VHPWR 转接线' : '8-pin ×2–4' })
  rows.push({ label: '标准', value: p.atx31 ? 'ATX 3.1 / PCIe 5.1：承受 200% 瞬时峰值，12V-2x6 感应针脚更短更安全' : 'ATX 2.x / 3.0：注意 40/50 系高瞬时功耗' })
  rows.push({ label: '可带显卡参考', value: p.watt >= 1000 ? 'RTX 5090 / 4090 级' : p.watt >= 850 ? 'RTX 5080 / 4080 / RX 9070 XT 级' : p.watt >= 750 ? 'RTX 5070 Ti / RX 7900 XT 级' : p.watt >= 650 ? 'RTX 5070 / RX 9070 级' : 'RTX 5060 / RX 7600 级' })
  rows.push({ label: '模组', value: p.modular === 'full' ? '全模组：所有线材可拆，理线方便' : p.modular === 'semi' ? '半模组：24-pin / CPU 固定' : '非模组：线材固定，理线困难' })
  if (p.tier === 'D') rows.push({ label: '风险提示', value: '标称功率与真实能力可能不符，不建议搭配独立显卡' })
  return rows
}
