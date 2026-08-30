// 笔记本 CPU 技术规格补录；-1 = 厂商未公开 / 不适用（NA）
import { readFileSync, writeFileSync } from 'node:fs'
const NA = -1
/* [id, die, die_mm2, transistors_m, l2_mb, base, boost, power_label, power_max_w, mem_channels, mem_max_mt, mem_max_gb, pcie, igpu_cu, igpu_ghz] */
const ROWS = [
  ['intel-core-ultra-9-185h', 'Compute (Intel 4) + GPU (N5) + SoC/IO (N6) Tile, Foveros', NA, NA, 24, 2.3, 5.1, 'PL2', 115, 2, 7467, 96, '5.0 ×8 + 4.0 ×12', 8, 2.35],
  ['intel-core-ultra-7-255h', 'Compute (N3B) + GPU + SoC Tile, Foveros', NA, NA, 24, 2.0, 5.1, 'PL2', 115, 2, 8400, 128, '5.0 ×8 + 4.0 ×12', 8, 2.25],
  ['intel-core-i9-13980hx', '单片 (Intel 7 257mm²)', 257, NA, 32, 2.2, 5.6, 'PL2', 157, 2, 5600, 128, '16×5.0 + 4×4.0', 32, 1.65],
  ['intel-core-i7-13700h', '单片 (Intel 7 ~217mm²)', 217, NA, 24, 2.4, 5.0, 'PL2', 115, 2, 6400, 96, '5.0 ×8 + 4.0 ×12', 96, 1.5],
  ['intel-core-i7-12700h', '单片 (Intel 7 ~217mm²)', 217, NA, 24, 2.3, 4.7, 'PL2', 115, 2, 5200, 64, '5.0 ×8 + 4.0 ×12', 96, 1.4],
  ['intel-core-i7-1360p', '单片 (Intel 7)', NA, NA, 18, 2.2, 5.0, 'PL2', 64, 2, 6400, 64, '4.0 ×8 + ×12', 96, 1.5],
  ['intel-core-i7-11800h', '单片 (Intel 10nm SuperFin ~190mm²)', 190, NA, 10, 2.3, 4.6, 'PL2', 107, 2, 3200, 64, '4.0 ×20', 32, 1.45],
  ['intel-core-i7-10750h', '单片 (14nm ~150mm²)', 150, NA, 1.5, 2.6, 5.0, 'PL2', 107, 2, 2933, 128, '3.0 ×16', 24, 1.15],
  ['intel-core-i7-9750h', '单片 (14nm 149mm²)', 149, NA, 1.5, 2.6, 4.5, 'PL2', 90, 2, 2666, 128, '3.0 ×16', 24, 1.15],
  ['intel-core-i7-8750h', '单片 (14nm 149mm²)', 149, NA, 1.5, 2.2, 4.1, 'PL2', 78, 2, 2666, 64, '3.0 ×16', 24, 1.1],
  ['intel-core-i7-7700hq', '单片 (14nm 126mm²)', 126, NA, 1, 2.8, 3.8, 'PL2', 56, 2, 2400, 64, '3.0 ×16', 24, 1.1],
  ['intel-core-i7-6700hq', '单片 (14nm 122mm²)', 122, NA, 1, 2.6, 3.5, 'PL2', 56, 2, 2133, 64, '3.0 ×16', 24, 1.05],
  ['intel-core-i7-4700hq', '单片 (22nm 177mm²)', 177, 1400, 1, 2.4, 3.4, 'TDP', 47, 2, 1600, 32, '3.0 ×16', 20, 1.2],
  ['amd-ryzen-ai-7-350', '单片 (N4P ~178mm²)', 178, NA, 8, 2.0, 5.0, 'cTDP', 54, 2, 8000, 256, '4.0 ×16', 8, 3.0],
  ['amd-ryzen-9-8945hs', '单片 (N4 178mm²)', 178, 25000, 8, 4.0, 5.2, 'cTDP', 54, 2, 7500, 256, '4.0 ×20', 12, 2.8],
  ['amd-ryzen-7-8845hs', '单片 (N4 178mm²)', 178, 25000, 8, 3.8, 5.1, 'cTDP', 54, 2, 7500, 256, '4.0 ×20', 12, 2.7],
  ['amd-ryzen-7-7840hs', '单片 (N4 178mm²)', 178, 25000, 8, 3.8, 5.1, 'cTDP', 54, 2, 7500, 256, '4.0 ×20', 12, 2.7],
  ['amd-ryzen-9-7945hx', '2× CCD (N5 71mm²) + IOD (N6 122mm²)', 264, 13100, 16, 2.5, 5.4, 'cTDP', 75, 2, 5200, 64, '5.0 ×28', 2, 2.2],
  ['amd-ryzen-7-7735hs', '单片 (N6 210mm²)', 210, 13100, 4, 3.2, 4.75, 'cTDP', 54, 2, 4800, 64, '4.0 ×20', 12, 2.2],
  ['amd-ryzen-9-6900hs', '单片 (N6 210mm²)', 210, 13100, 4, 3.3, 4.9, 'cTDP', 54, 2, 6400, 64, '4.0 ×20', 12, 2.4],
  ['amd-ryzen-7-5800h', '单片 (N7 180mm²)', 180, 10700, 4, 3.2, 4.4, 'cTDP', 54, 2, 3200, 64, '3.0 ×20', 8, 2.0],
  ['amd-ryzen-7-4800h', '单片 (N7 156mm²)', 156, 9800, 4, 2.9, 4.2, 'cTDP', 54, 2, 3200, 64, '3.0 ×16', 7, 1.6],
  ['apple-m3-max-16', '单片 SoC (N3B)', NA, 92000, NA, NA, 4.05, 'cTDP', 80, 8, 6400, 128, 'Thunderbolt 4', 40, NA],
  ['apple-m3-pro-12', '单片 SoC (N3B)', NA, 37000, NA, NA, 4.05, 'cTDP', 45, 3, 6400, 36, 'Thunderbolt 4', 18, NA],
  ['apple-m3-8', '单片 SoC (N3B)', NA, 25000, NA, NA, 4.05, 'cTDP', 20, 2, 6400, 24, 'Thunderbolt 4', 10, NA],
  ['apple-m2-max-12', '单片 SoC (N5P)', NA, 67000, NA, NA, 3.7, 'cTDP', 80, 8, 6400, 96, 'Thunderbolt 4', 38, NA],
  ['apple-m2-pro-12', '单片 SoC (N5P)', NA, 40000, NA, NA, 3.5, 'cTDP', 45, 4, 6400, 32, 'Thunderbolt 4', 19, NA],
  ['apple-m2-8', '单片 SoC (N5P ~155mm²)', 155, 20000, NA, NA, 3.5, 'cTDP', 22, 2, 6400, 24, 'Thunderbolt 4', 10, NA],
  ['apple-m1-max-10', '单片 SoC (N5 432mm²)', 432, 57000, NA, NA, 3.2, 'cTDP', 70, 8, 6400, 64, 'Thunderbolt 4', 32, NA],
  ['apple-m1-pro-10', '单片 SoC (N5 245mm²)', 245, 33700, NA, NA, 3.2, 'cTDP', 40, 4, 6400, 32, 'Thunderbolt 4', 16, NA],
  ['apple-m1-8', '单片 SoC (N5 119mm²)', 119, 16000, NA, NA, 3.2, 'cTDP', 20, 2, 4266, 16, 'Thunderbolt 4', 8, NA],
  ['qualcomm-snapdragon-x-plus-x1p-64-100', '单片 SoC (N4 170mm²)', 170, NA, 36, 3.4, 3.4, 'cTDP', 45, 8, 8448, 64, '4.0 ×8', NA, NA],
  ['qualcomm-snapdragon-8cx-gen3', '单片 SoC (Samsung 5nm)', NA, NA, NA, 3.0, 3.0, 'cTDP', 15, 8, 4266, 32, '4.0 ×4', NA, NA],
]
const K = ['die', 'die_mm2', 'transistors_m', 'l2_mb', 'base_ghz', 'boost_ghz', 'power_label', 'power_max_w', 'mem_channels', 'mem_max_mt', 'mem_max_gb', 'pcie', 'igpu_cu', 'igpu_ghz']
const arr = JSON.parse(readFileSync('public/data/cpus.json', 'utf8')); const m = new Map(ROWS.map((r) => [r[0], r])); let n = 0
for (const it of arr) {
  const r = m.get(it.id); if (r) { it.tech = { ...Object.fromEntries(K.map((k, i) => [k, r[i + 1] ?? null])), launch_usd: NA }; n++ }
  if (it.tech) {
    if (it.form === 'laptop' && it.tech.launch_usd == null) it.tech.launch_usd = NA
    // Intel 2017 年后（Coffee Lake 起）未公开晶体管数
    if (it.brand === 'Intel' && it.tech.transistors_m == null && !['core2', 'nehalem', 'sandy-bridge', 'ivy-bridge', 'haswell', 'haswell-e'].includes(it.gen)) it.tech.transistors_m = NA
    if (it.brand === 'Intel' && it.tech.die_mm2 == null && ['arrow-lake', 'arrow-lake-h', 'arrow-lake-hx', 'lunar-lake', 'meteor-lake'].includes(it.gen)) it.tech.die_mm2 = NA
  }
}
writeFileSync('public/data/cpus.json', JSON.stringify(arr, null, 2) + '\n')
// GPU：核显无独立晶片；笔记本 GPU 无零售价
const g = JSON.parse(readFileSync('public/data/gpus.json', 'utf8'))
for (const it of g) {
  if (!it.tech) it.tech = { die_mm2: NA, transistors_m: NA, units: null, shaders: null, tmus: null, rops: null, rt_cores: null, tensor_cores: null, base_mhz: null, boost_mhz: null, mem_gbps: null, mem_bw_gbs: null, l2_mb: null, infinity_cache_mb: null, tflops_fp32: null, launch_usd: NA }
  if (it.form === 'igpu') { for (const k of ['die_mm2', 'transistors_m']) if (it.tech[k] == null) it.tech[k] = NA; if (it.tech.launch_usd == null) it.tech.launch_usd = NA; if (it.tech.base_mhz == null) it.tech.base_mhz = NA }
  if (it.form === 'laptop' && it.tech.launch_usd == null) it.tech.launch_usd = NA
  if (it.tech.infinity_cache_mb == null && it.brand !== 'AMD') it.tech.infinity_cache_mb = NA
  if (it.tech.l2_mb == null && ['tesla', 'terascale'].includes(it.gen)) it.tech.l2_mb = NA
}
writeFileSync('public/data/gpus.json', JSON.stringify(g, null, 2) + '\n')
console.log('laptop cpu tech +', n)
