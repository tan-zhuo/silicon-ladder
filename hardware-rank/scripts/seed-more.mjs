// 一次性扩充种子数据：读取现有 JSON，追加未存在的 id
import { readFileSync, writeFileSync } from 'node:fs'
const D = 'public/data/'
const load = (f) => JSON.parse(readFileSync(D + f, 'utf8'))
const save = (f, arr) => writeFileSync(D + f, JSON.stringify(arr, null, 2) + '\n')
const merge = (f, add) => { const cur = load(f); const ids = new Set(cur.map((x) => x.id)); const n = add.filter((x) => !ids.has(x.id)); save(f, [...cur, ...n]); console.log(f, '+' + n.length, '=', cur.length + n.length) }

/* ---------------- CPU ---------------- */
const cpu = (id, name, brand, form, series, gen, socket, cores, clocks, tdp_w, extra, st, mt, gaming, igpu_rel, release, price, summary, tags) => ({
  id, name, nameEn: `${brand} ${name}`, brand, form, series, gen, socket, cores, clocks, tdp_w, ...extra,
  release, price_cny: price, summary, tags, scores: { cb24_st: st, cb24_mt: mt, gaming_rel: gaming, igpu_rel },
})
const D5 = 'DDR5-5600', D5_64 = 'DDR5-6400', L3 = (mb) => `${mb} MB`
const cpus = [
  // AMD 桌面
  cpu('amd-ryzen-9-9950x3d', 'Ryzen 9 9950X3D', 'AMD', 'desktop', 'Ryzen 9', 'zen5', 'AM5', '16P / 32T', '4.3 / 5.7 GHz', 170, { igpu: 'Radeon (2CU)', cache_l3: '128 MB (3D V-Cache)', mem: D5 }, 1370, 25000, 104, null, '2025-03', 5299, '游戏与生产力双旗舰，不用再二选一。', ['X3D', '旗舰', '生产力']),
  cpu('amd-ryzen-9-9900x', 'Ryzen 9 9900X', 'AMD', 'desktop', 'Ryzen 9', 'zen5', 'AM5', '12P / 24T', '4.4 / 5.6 GHz', 120, { igpu: 'Radeon (2CU)', cache_l3: L3(64), mem: D5 }, 1350, 19500, 85, null, '2024-08', 3299, '12 核 120W，生产力甜点。', ['生产力']),
  cpu('amd-ryzen-7-9700x', 'Ryzen 7 9700X', 'AMD', 'desktop', 'Ryzen 7', 'zen5', 'AM5', '8P / 16T', '3.8 / 5.5 GHz', 65, { igpu: 'Radeon (2CU)', cache_l3: L3(32), mem: D5 }, 1340, 13500, 84, null, '2024-08', 2199, '65W 能效极佳，单核强。', ['能效']),
  cpu('amd-ryzen-5-9600x', 'Ryzen 5 9600X', 'AMD', 'desktop', 'Ryzen 5', 'zen5', 'AM5', '6P / 12T', '3.9 / 5.4 GHz', 65, { igpu: 'Radeon (2CU)', cache_l3: L3(32), mem: D5 }, 1320, 10800, 82, null, '2024-08', 1699, 'Zen5 入门，单核不输旗舰。', ['性价比']),
  cpu('amd-ryzen-9-7950x3d', 'Ryzen 9 7950X3D', 'AMD', 'desktop', 'Ryzen 9', 'zen4', 'AM5', '16P / 32T', '4.2 / 5.7 GHz', 120, { igpu: 'Radeon (2CU)', cache_l3: '128 MB (3D V-Cache)', mem: 'DDR5-5200' }, 1150, 23500, 99, null, '2023-02', 4299, '上代全能旗舰，依赖核心调度。', ['X3D', '生产力']),
  cpu('amd-ryzen-9-7950x', 'Ryzen 9 7950X', 'AMD', 'desktop', 'Ryzen 9', 'zen4', 'AM5', '16P / 32T', '4.5 / 5.7 GHz', 170, { igpu: 'Radeon (2CU)', cache_l3: L3(64), mem: 'DDR5-5200' }, 1180, 24000, 84, null, '2022-09', 3599, '16 核生产力，降价后很香。', ['生产力']),
  cpu('amd-ryzen-9-7900x', 'Ryzen 9 7900X', 'AMD', 'desktop', 'Ryzen 9', 'zen4', 'AM5', '12P / 24T', '4.7 / 5.6 GHz', 170, { igpu: 'Radeon (2CU)', cache_l3: L3(64), mem: 'DDR5-5200' }, 1160, 18500, 83, null, '2022-09', 2799, '12 核，功耗偏高。', ['生产力']),
  cpu('amd-ryzen-7-7700x', 'Ryzen 7 7700X', 'AMD', 'desktop', 'Ryzen 7', 'zen4', 'AM5', '8P / 16T', '4.5 / 5.4 GHz', 105, { igpu: 'Radeon (2CU)', cache_l3: L3(32), mem: 'DDR5-5200' }, 1130, 13300, 81, null, '2022-09', 1899, '8 核均衡，AM5 早期主力。', []),
  cpu('amd-ryzen-5-7600x', 'Ryzen 5 7600X', 'AMD', 'desktop', 'Ryzen 5', 'zen4', 'AM5', '6P / 12T', '4.7 / 5.3 GHz', 105, { igpu: 'Radeon (2CU)', cache_l3: L3(32), mem: 'DDR5-5200' }, 1110, 10500, 79, null, '2022-09', 1399, '比 7600 高频一点，多花的钱不太值。', []),
  cpu('amd-ryzen-5-7500f', 'Ryzen 5 7500F', 'AMD', 'desktop', 'Ryzen 5', 'zen4', 'AM5', '6P / 12T', '3.7 / 5.0 GHz', 65, { igpu: null, cache_l3: L3(32), mem: 'DDR5-5200' }, 1060, 9900, 77, null, '2023-07', 1049, '无核显特供，游戏入门性价比之王。', ['性价比', '游戏']),
  cpu('amd-ryzen-7-5800x3d', 'Ryzen 7 5800X3D', 'AMD', 'desktop', 'Ryzen 7', 'zen3', 'AM4', '8P / 16T', '3.4 / 4.5 GHz', 105, { igpu: null, cache_l3: '96 MB (3D V-Cache)', mem: 'DDR4-3200' }, 850, 9800, 85, null, '2022-04', 1799, 'AM4 平台游戏终点站。', ['X3D', '游戏', 'AM4']),
  cpu('amd-ryzen-5-5600', 'Ryzen 5 5600', 'AMD', 'desktop', 'Ryzen 5', 'zen3', 'AM4', '6P / 12T', '3.5 / 4.4 GHz', 65, { igpu: null, cache_l3: L3(32), mem: 'DDR4-3200' }, 780, 7500, 64, null, '2022-04', 699, '老平台升级最便宜方案。', ['性价比', 'AM4']),
  // Intel 桌面
  cpu('intel-core-ultra-9-285k', 'Core Ultra 9 285K', 'Intel', 'desktop', 'Core Ultra 9', 'arrow-lake', 'LGA1851', '8P+16E / 24T', '3.7 / 5.7 GHz', 125, { igpu: 'Intel Graphics (4Xe)', cache_l3: L3(36), mem: D5_64 }, 1400, 26000, 86, null, '2024-10', 4499, '多核最强 Intel，游戏不如 X3D。', ['生产力', '旗舰']),
  cpu('intel-core-ultra-5-245k', 'Core Ultra 5 245K', 'Intel', 'desktop', 'Core Ultra 5', 'arrow-lake', 'LGA1851', '6P+8E / 14T', '4.2 / 5.2 GHz', 125, { igpu: 'Intel Graphics (4Xe)', cache_l3: L3(24), mem: D5_64 }, 1300, 15500, 78, null, '2024-10', 1999, 'Arrow Lake 入门，单核不错。', []),
  cpu('intel-core-i9-14900k', 'Core i9-14900K', 'Intel', 'desktop', 'Core i9', 'raptor-lake', 'LGA1700', '8P+16E / 32T', '3.2 / 6.0 GHz', 125, { igpu: 'UHD 770', cache_l3: L3(36), mem: 'DDR5-5600 / DDR4-3200' }, 1300, 25500, 85, null, '2023-10', 3699, '6GHz 旗舰，功耗与稳定性争议。', ['生产力']),
  cpu('intel-core-i5-14600k', 'Core i5-14600K', 'Intel', 'desktop', 'Core i5', 'raptor-lake', 'LGA1700', '6P+8E / 20T', '3.5 / 5.3 GHz', 125, { igpu: 'UHD 770', cache_l3: L3(24), mem: 'DDR5-5600 / DDR4-3200' }, 1220, 16500, 80, null, '2023-10', 1799, '中端多核优秀，LGA1700 甜点。', ['性价比']),
  cpu('intel-core-i5-14400', 'Core i5-14400', 'Intel', 'desktop', 'Core i5', 'raptor-lake', 'LGA1700', '6P+4E / 16T', '2.5 / 4.7 GHz', 65, { igpu: 'UHD 730', cache_l3: L3(20), mem: 'DDR5-4800 / DDR4-3200' }, 1080, 11000, 72, null, '2024-01', 1299, '65W 办公游戏两用。', []),
  cpu('intel-core-i9-13900k', 'Core i9-13900K', 'Intel', 'desktop', 'Core i9', 'raptor-lake', 'LGA1700', '8P+16E / 32T', '3.0 / 5.8 GHz', 125, { igpu: 'UHD 770', cache_l3: L3(36), mem: 'DDR5-5600 / DDR4-3200' }, 1290, 24500, 84, null, '2022-10', 3299, '与 14900K 几乎同款。', ['生产力']),
  cpu('intel-core-i5-13400f', 'Core i5-13400F', 'Intel', 'desktop', 'Core i5', 'raptor-lake', 'LGA1700', '6P+4E / 16T', '2.5 / 4.6 GHz', 65, { igpu: null, cache_l3: L3(20), mem: 'DDR5-4800 / DDR4-3200' }, 1040, 10000, 70, null, '2023-01', 999, '无核显入门，游戏够用。', ['性价比']),
  cpu('intel-core-i7-12700k', 'Core i7-12700K', 'Intel', 'desktop', 'Core i7', 'alder-lake', 'LGA1700', '8P+4E / 20T', '3.6 / 5.0 GHz', 125, { igpu: 'UHD 770', cache_l3: L3(25), mem: 'DDR5-4800 / DDR4-3200' }, 1080, 14500, 76, null, '2021-11', 1899, '大小核首代，二手好价。', []),
  cpu('intel-core-i5-12400f', 'Core i5-12400F', 'Intel', 'desktop', 'Core i5', 'alder-lake', 'LGA1700', '6P / 12T', '2.5 / 4.4 GHz', 65, { igpu: null, cache_l3: L3(18), mem: 'DDR5-4800 / DDR4-3200' }, 950, 8500, 66, null, '2022-01', 799, '经典入门神 U。', ['性价比']),
  // 笔记本
  cpu('apple-m4-10', 'Apple M4 (10核)', 'Apple', 'laptop', 'M4', 'apple-m4', 'soldered', '4P+6E / 10T', '— / 4.4 GHz', 20, { tdp_range: '15–22W', igpu: 'M4 GPU (10核)', cache_l3: '—', mem: 'LPDDR5X-7500' }, 1700, 9500, 45, 70, '2024-05', null, 'MacBook Air 主力，单核与旗舰同级。', ['能效', '轻薄']),
  cpu('apple-m4-max-16', 'Apple M4 Max (16核)', 'Apple', 'laptop', 'M4', 'apple-m4', 'soldered', '12P+4E / 16T', '— / 4.5 GHz', 60, { tdp_range: '40–70W', igpu: 'M4 Max GPU (40核)', cache_l3: '—', mem: 'LPDDR5X-8533' }, 1730, 22500, 78, 96, '2024-11', null, '移动工作站级别，内存带宽巨大。', ['旗舰', '生产力']),
  cpu('apple-m3-8', 'Apple M3 (8核)', 'Apple', 'laptop', 'M3', 'apple-m3', 'soldered', '4P+4E / 8T', '— / 4.05 GHz', 20, { tdp_range: '15–20W', igpu: 'M3 GPU (10核)', cache_l3: '—', mem: 'LPDDR5-6400' }, 1450, 8000, 40, 58, '2023-11', null, '上代 Air，日常够用。', ['轻薄']),
  cpu('intel-core-ultra-9-288v', 'Core Ultra 9 288V', 'Intel', 'laptop', 'Core Ultra 9', 'lunar-lake', 'soldered', '4P+4LP / 8T', '3.3 / 5.1 GHz', 30, { tdp_range: '17–37W', igpu: 'Arc 140V', cache_l3: L3(12), mem: 'LPDDR5X-8533 (板载)' }, 1210, 6800, 50, 85, '2024-09', null, 'Lunar Lake 旗舰，续航与核显强、多核弱。', ['能效', '轻薄']),
  cpu('intel-core-ultra-7-258v', 'Core Ultra 7 258V', 'Intel', 'laptop', 'Core Ultra 7', 'lunar-lake', 'soldered', '4P+4LP / 8T', '2.2 / 4.8 GHz', 17, { tdp_range: '17–37W', igpu: 'Arc 140V', cache_l3: L3(12), mem: 'LPDDR5X-8533 (板载)' }, 1180, 6500, 48, 82, '2024-09', null, '轻薄本 Lunar Lake 主力型号。', ['能效', '轻薄']),
  cpu('intel-core-ultra-9-275hx', 'Core Ultra 9 275HX', 'Intel', 'laptop', 'Core Ultra 9', 'arrow-lake-hx', 'soldered', '8P+16E / 24T', '2.7 / 5.4 GHz', 55, { tdp_range: '55–160W', igpu: 'Intel Graphics (4Xe)', cache_l3: L3(36), mem: 'DDR5-6400' }, 1380, 22500, 82, 30, '2025-01', null, '游戏本旗舰，多核桌面级。', ['游戏本', '旗舰']),
  cpu('intel-core-ultra-7-255h', 'Core Ultra 7 255H', 'Intel', 'laptop', 'Core Ultra 7', 'arrow-lake-h', 'soldered', '6P+8E+2LP / 16T', '2.0 / 5.1 GHz', 28, { tdp_range: '28–115W', igpu: 'Arc 140T', cache_l3: L3(24), mem: 'LPDDR5X-8400 / DDR5-6400' }, 1230, 12000, 56, 72, '2025-01', null, '全能本主流，均衡。', ['全能本']),
  cpu('intel-core-i9-14900hx', 'Core i9-14900HX', 'Intel', 'laptop', 'Core i9', 'raptor-lake-hx', 'soldered', '8P+16E / 32T', '2.2 / 5.8 GHz', 55, { tdp_range: '55–157W', igpu: 'UHD', cache_l3: L3(36), mem: 'DDR5-5600' }, 1250, 21000, 78, 22, '2024-01', null, '上代游戏本旗舰，发热大。', ['游戏本']),
  cpu('amd-ryzen-ai-max-395', 'Ryzen AI Max+ 395', 'AMD', 'laptop', 'Ryzen AI Max', 'zen5', 'soldered (FP11)', '16P / 32T', '3.0 / 5.1 GHz', 55, { tdp_range: '45–120W', igpu: 'Radeon 8060S', cache_l3: L3(64), mem: 'LPDDR5X-8000 (板载, 256-bit)' }, 1330, 20500, 85, 100, '2025-02', null, 'Strix Halo：核显直逼独显的怪物。', ['旗舰', '核显', '生产力']),
  cpu('amd-ryzen-ai-7-350', 'Ryzen AI 7 350', 'AMD', 'laptop', 'Ryzen AI 7', 'zen5', 'soldered', '4P+4c / 16T', '2.0 / 5.0 GHz', 28, { tdp_range: '15–54W', igpu: 'Radeon 860M', cache_l3: L3(16), mem: 'LPDDR5X-8000 / DDR5-5600' }, 1150, 9800, 55, 74, '2025-01', null, 'Krackan 主流轻薄本。', ['轻薄']),
  cpu('amd-ryzen-9-8945hs', 'Ryzen 9 8945HS', 'AMD', 'laptop', 'Ryzen 9', 'zen4', 'soldered', '8P / 16T', '4.0 / 5.2 GHz', 45, { tdp_range: '35–54W', igpu: 'Radeon 780M', cache_l3: L3(16), mem: 'LPDDR5X-7500 / DDR5-5600' }, 1120, 11500, 57, 75, '2024-01', null, 'Hawk Point 高配，核显 780M。', ['全能本']),
  cpu('amd-ryzen-7-8845hs', 'Ryzen 7 8845HS', 'AMD', 'laptop', 'Ryzen 7', 'zen4', 'soldered', '8P / 16T', '3.8 / 5.1 GHz', 45, { tdp_range: '35–54W', igpu: 'Radeon 780M', cache_l3: L3(16), mem: 'LPDDR5X-7500 / DDR5-5600' }, 1100, 11000, 55, 74, '2024-01', null, '2024 轻薄全能本最常见。', ['全能本', '性价比']),
  cpu('amd-ryzen-9-7945hx', 'Ryzen 9 7945HX', 'AMD', 'laptop', 'Ryzen 9', 'zen4', 'soldered (FL1)', '16P / 32T', '2.5 / 5.4 GHz', 55, { tdp_range: '55–75W', igpu: 'Radeon 610M', cache_l3: L3(64), mem: 'DDR5-5200' }, 1180, 18500, 74, 20, '2023-02', null, '上代游戏本 16 核。', ['游戏本']),
  cpu('qualcomm-snapdragon-x-plus-x1p-64-100', 'Snapdragon X Plus X1P-64-100', 'Qualcomm', 'laptop', 'Snapdragon X Plus', 'snapdragon-x', 'soldered', '10P / 10T', '3.4 GHz', 30, { tdp_range: '20–45W', igpu: 'Adreno X1-45', cache_l3: L3(42), mem: 'LPDDR5X-8448' }, 1380, 11500, 45, 68, '2024-06', null, 'X Elite 的平价版。', ['ARM', '能效']),
]
merge('cpus.json', cpus)

/* ---------------- GPU ---------------- */
const gpu = (id, name, brand, form, series, gen, chip, vram_gb, vram_type, bus_bit, tdp_w, extra, raster, rt, release, price, summary, tags) => ({
  id, name, nameEn: `${brand} ${name}`, brand, form, series, gen, chip, vram_gb, vram_type, bus_bit, tdp_w, ...extra,
  release, price_cny: price, summary, tags, scores: { raster_rel: raster, rt_rel: rt },
})
const lap = (w, range) => ({ tgp_w: w, tgp_range: range })
const gpus = [
  // NVIDIA 桌面
  gpu('nvidia-rtx-5070', 'RTX 5070', 'NVIDIA', 'desktop', 'RTX 50', 'blackwell', 'GB205', 12, 'GDDR7', 192, 250, {}, 52, 54, '2025-03', 4599, '12GB 显存偏保守，2K 主流。', ['2K']),
  gpu('nvidia-rtx-5060-ti-16gb', 'RTX 5060 Ti 16GB', 'NVIDIA', 'desktop', 'RTX 50', 'blackwell', 'GB206', 16, 'GDDR7', 128, 180, {}, 42, 43, '2025-04', 3599, '16GB 版本才值得买。', ['1080p', '2K']),
  gpu('nvidia-rtx-5060', 'RTX 5060', 'NVIDIA', 'desktop', 'RTX 50', 'blackwell', 'GB206', 8, 'GDDR7', 128, 145, {}, 35, 36, '2025-05', 2499, '8GB 显存是硬伤。', ['1080p']),
  gpu('nvidia-rtx-4080-super', 'RTX 4080 SUPER', 'NVIDIA', 'desktop', 'RTX 40', 'ada', 'AD103', 16, 'GDDR6X', 256, 320, {}, 68, 70, '2024-01', 7999, '上代 4K 次旗舰。', ['4K']),
  gpu('nvidia-rtx-4070-ti-super', 'RTX 4070 Ti SUPER', 'NVIDIA', 'desktop', 'RTX 40', 'ada', 'AD103', 16, 'GDDR6X', 256, 285, {}, 60, 60, '2024-01', 6499, '16GB 显存的 2K 高刷卡。', ['2K']),
  gpu('nvidia-rtx-4070', 'RTX 4070', 'NVIDIA', 'desktop', 'RTX 40', 'ada', 'AD104', 12, 'GDDR6X', 192, 200, {}, 46, 45, '2023-04', 4299, '200W 安静的 2K 卡。', ['2K']),
  gpu('nvidia-rtx-4060-ti-8gb', 'RTX 4060 Ti 8GB', 'NVIDIA', 'desktop', 'RTX 40', 'ada', 'AD106', 8, 'GDDR6', 128, 160, {}, 36, 34, '2023-05', 2999, '位宽与显存都缩水。', ['1080p']),
  gpu('nvidia-rtx-4060', 'RTX 4060', 'NVIDIA', 'desktop', 'RTX 40', 'ada', 'AD107', 8, 'GDDR6', 128, 115, {}, 30, 28, '2023-06', 2299, '功耗低，网吧与入门首选。', ['1080p', '性价比']),
  gpu('nvidia-rtx-3080-10gb', 'RTX 3080 10GB', 'NVIDIA', 'desktop', 'RTX 30', 'ampere', 'GA102', 10, 'GDDR6X', 320, 320, {}, 47, 40, '2020-09', null, '上上代旗舰，二手仍能打。', ['2K']),
  gpu('nvidia-rtx-3070', 'RTX 3070', 'NVIDIA', 'desktop', 'RTX 30', 'ampere', 'GA104', 8, 'GDDR6', 256, 220, {}, 37, 30, '2020-10', null, '8GB 显存开始吃紧。', ['2K']),
  gpu('nvidia-rtx-3060-12gb', 'RTX 3060 12GB', 'NVIDIA', 'desktop', 'RTX 30', 'ampere', 'GA106', 12, 'GDDR6', 192, 170, {}, 26, 20, '2021-02', null, '大显存入门经典。', ['1080p']),
  // AMD 桌面
  gpu('amd-rx-9070', 'RX 9070', 'AMD', 'desktop', 'RX 9000', 'rdna4', 'Navi 48', 16, 'GDDR6', 256, 220, {}, 57, 50, '2025-03', 4499, '220W 能效很好，比 XT 更均衡。', ['2K', '能效']),
  gpu('amd-rx-9060-xt-16gb', 'RX 9060 XT 16GB', 'AMD', 'desktop', 'RX 9000', 'rdna4', 'Navi 44', 16, 'GDDR6', 128, 160, {}, 36, 31, '2025-06', 2799, '同价位 16GB，对标 5060 Ti。', ['1080p', '性价比']),
  gpu('amd-rx-7900-xtx', 'RX 7900 XTX', 'AMD', 'desktop', 'RX 7000', 'rdna3', 'Navi 31', 24, 'GDDR6', 384, 355, {}, 70, 52, '2022-12', 6999, '24GB 光栅强，光追一般。', ['4K']),
  gpu('amd-rx-7900-xt', 'RX 7900 XT', 'AMD', 'desktop', 'RX 7000', 'rdna3', 'Navi 31', 20, 'GDDR6', 320, 315, {}, 62, 45, '2022-12', 5499, '降价后性价比高。', ['4K', '2K']),
  gpu('amd-rx-7700-xt', 'RX 7700 XT', 'AMD', 'desktop', 'RX 7000', 'rdna3', 'Navi 32', 12, 'GDDR6', 192, 245, {}, 42, 32, '2023-09', 2999, '夹在 7800 XT 与 7600 之间。', ['2K']),
  gpu('amd-rx-7600', 'RX 7600', 'AMD', 'desktop', 'RX 7000', 'rdna3', 'Navi 33', 8, 'GDDR6', 128, 165, {}, 28, 20, '2023-05', 1899, '1080p 入门。', ['1080p', '性价比']),
  gpu('amd-rx-6800-xt', 'RX 6800 XT', 'AMD', 'desktop', 'RX 6000', 'rdna2', 'Navi 21', 16, 'GDDR6', 256, 300, {}, 50, 30, '2020-11', null, '上上代 16GB，二手性价比。', ['2K']),
  gpu('amd-rx-6600', 'RX 6600', 'AMD', 'desktop', 'RX 6000', 'rdna2', 'Navi 23', 8, 'GDDR6', 128, 132, {}, 24, 14, '2021-10', 1299, '千元档 1080p 王者。', ['1080p', '性价比']),
  // Intel 桌面
  gpu('intel-arc-b580', 'Arc B580', 'Intel', 'desktop', 'Arc B', 'xe2', 'BMG-G21', 12, 'GDDR6', 192, 190, {}, 33, 30, '2024-12', 2199, 'Battlemage 12GB，驱动大幅改善。', ['1080p', '2K', '性价比']),
  gpu('intel-arc-b570', 'Arc B570', 'Intel', 'desktop', 'Arc B', 'xe2', 'BMG-G21', 10, 'GDDR6', 160, 150, {}, 28, 25, '2025-01', 1799, 'B580 的缩减版。', ['1080p']),
  gpu('intel-arc-a770-16gb', 'Arc A770 16GB', 'Intel', 'desktop', 'Arc A', 'xe', 'ACM-G10', 16, 'GDDR6', 256, 225, {}, 30, 26, '2022-10', null, '首代 Arc，老游戏兼容性一般。', ['2K']),
  // 笔记本
  gpu('nvidia-rtx-5070-ti-laptop-140w', 'RTX 5070 Ti Laptop', 'NVIDIA', 'laptop', 'RTX 50 Laptop', 'blackwell', 'GB205', 12, 'GDDR7', 192, 140, lap(140, '60–115W (+25W Boost)'), 55, 53, '2025-03', null, '12GB 显存，高端游戏本主流。', ['高TGP']),
  gpu('nvidia-rtx-5060-laptop-115w', 'RTX 5060 Laptop', 'NVIDIA', 'laptop', 'RTX 50 Laptop', 'blackwell', 'GB206', 8, 'GDDR7', 128, 115, lap(115, '45–115W'), 40, 38, '2025-05', null, '满血 5060，主流游戏本。', ['中TGP']),
  gpu('nvidia-rtx-5060-laptop-80w', 'RTX 5060 Laptop', 'NVIDIA', 'laptop', 'RTX 50 Laptop', 'blackwell', 'GB206', 8, 'GDDR7', 128, 80, lap(80, '45–115W'), 33, 31, '2025-05', null, '轻薄游戏本 80W 版。', ['低TGP', '轻薄']),
  gpu('nvidia-rtx-5050-laptop-100w', 'RTX 5050 Laptop', 'NVIDIA', 'laptop', 'RTX 50 Laptop', 'blackwell', 'GB207', 8, 'GDDR7', 128, 100, lap(100, '50–100W'), 30, 28, '2025-06', null, '入门独显本。', ['中TGP']),
  gpu('nvidia-rtx-4090-laptop-175w', 'RTX 4090 Laptop', 'NVIDIA', 'laptop', 'RTX 40 Laptop', 'ada', 'AD103', 16, 'GDDR6', 256, 175, lap(175, '80–150W (+25W Boost)'), 66, 64, '2023-02', null, '上代移动旗舰，核心是桌面 4080。', ['旗舰', '高TGP']),
  gpu('nvidia-rtx-4080-laptop-175w', 'RTX 4080 Laptop', 'NVIDIA', 'laptop', 'RTX 40 Laptop', 'ada', 'AD104', 12, 'GDDR6', 192, 175, lap(175, '60–150W (+25W Boost)'), 58, 56, '2023-02', null, '上代次旗舰。', ['高TGP']),
  gpu('nvidia-rtx-4070-laptop-90w', 'RTX 4070 Laptop', 'NVIDIA', 'laptop', 'RTX 40 Laptop', 'ada', 'AD106', 8, 'GDDR6', 128, 90, lap(90, '35–115W (+25W Boost)'), 38, 36, '2023-02', null, '轻薄本 90W 版，比满血慢一成多。', ['中TGP', '轻薄']),
  gpu('nvidia-rtx-4060-laptop-140w', 'RTX 4060 Laptop', 'NVIDIA', 'laptop', 'RTX 40 Laptop', 'ada', 'AD107', 8, 'GDDR6', 128, 140, lap(140, '35–115W (+25W Boost)'), 36, 34, '2023-02', null, '销量最大的游戏本显卡。', ['高TGP', '性价比']),
  gpu('nvidia-rtx-4060-laptop-90w', 'RTX 4060 Laptop', 'NVIDIA', 'laptop', 'RTX 40 Laptop', 'ada', 'AD107', 8, 'GDDR6', 128, 90, lap(90, '35–115W (+25W Boost)'), 31, 29, '2023-02', null, '全能本常见 90W 版本。', ['中TGP']),
  gpu('nvidia-rtx-4050-laptop-100w', 'RTX 4050 Laptop', 'NVIDIA', 'laptop', 'RTX 40 Laptop', 'ada', 'AD107', 6, 'GDDR6', 96, 100, lap(100, '35–115W'), 27, 25, '2023-02', null, '6GB 显存入门独显。', ['中TGP']),
  gpu('amd-rx-7900m', 'RX 7900M', 'AMD', 'laptop', 'RX 7000M', 'rdna3', 'Navi 31', 16, 'GDDR6', 256, 180, lap(180, '180W'), 56, 40, '2023-10', null, 'AMD 移动旗舰，机型极少。', ['高TGP']),
  gpu('amd-rx-7700s', 'RX 7700S', 'AMD', 'laptop', 'RX 7000S', 'rdna3', 'Navi 33', 8, 'GDDR6', 128, 100, lap(100, '75–100W'), 33, 22, '2023-02', null, 'Framework 16 等少数机型。', ['中TGP']),
  // 核显
  gpu('apple-m4-pro-gpu-20', 'M4 Pro GPU (20核)', 'Apple', 'igpu', 'M4', 'apple-m4', 'M4 Pro', 24, 'LPDDR5X (统一内存)', 256, 45, { tgp_w: 45 }, 36, 12, '2024-11', null, '媲美 4060 Laptop 低功耗档。', ['核显']),
  gpu('apple-m4-gpu-10', 'M4 GPU (10核)', 'Apple', 'igpu', 'M4', 'apple-m4', 'M4', 16, 'LPDDR5X (统一内存)', 128, 20, { tgp_w: 20 }, 18, 6, '2024-05', null, 'Air 级核显。', ['核显']),
  gpu('amd-radeon-8060s', 'Radeon 8060S', 'AMD', 'igpu', 'Radeon 8000S', 'rdna3.5', 'Strix Halo (40CU)', 32, 'LPDDR5X (统一内存)', 256, 55, { tgp_w: 55 }, 55, 18, '2025-02', null, '核显天花板 x86 侧，接近 4070 Laptop。', ['核显', '旗舰']),
  gpu('amd-radeon-890m', 'Radeon 890M', 'AMD', 'igpu', 'Radeon 800M', 'rdna3.5', 'Strix Point (16CU)', 8, 'LPDDR5X (共享)', 128, 28, { tgp_w: 28 }, 20, 6, '2024-07', null, '轻薄本最强 x86 核显之一。', ['核显']),
  gpu('amd-radeon-780m', 'Radeon 780M', 'AMD', 'igpu', 'Radeon 700M', 'rdna3', 'Phoenix (12CU)', 8, 'LPDDR5X (共享)', 128, 28, { tgp_w: 28 }, 15, 5, '2023-01', null, '掌机与轻薄本常见。', ['核显']),
  gpu('intel-arc-140v', 'Arc 140V', 'Intel', 'igpu', 'Arc (Xe2)', 'xe2', 'Lunar Lake (8Xe)', 8, 'LPDDR5X (板载)', 128, 17, { tgp_w: 17 }, 16, 6, '2024-09', null, 'Lunar Lake 核显，能效出色。', ['核显']),
  gpu('intel-arc-140t', 'Arc 140T', 'Intel', 'igpu', 'Arc (Xe)', 'xe', 'Arrow Lake-H (8Xe)', 8, 'LPDDR5X (共享)', 128, 28, { tgp_w: 28 }, 15, 5, '2025-01', null, 'Arrow Lake H 核显。', ['核显']),
  gpu('qualcomm-adreno-x1-85', 'Adreno X1-85', 'Qualcomm', 'igpu', 'Adreno X1', 'snapdragon-x', 'X Elite', 8, 'LPDDR5X (共享)', 128, 30, { tgp_w: 30 }, 13, null, '2024-06', null, 'ARM 本核显，兼容性限制多。', ['核显', 'ARM']),
]
merge('gpus.json', gpus)

/* ---------------- RAM ---------------- */
const ram = (id, name, brand, form, type, spec, capacity_gb, speed_mt, cl, latency_ns, read, write, release, price, summary) => ({
  id, name, brand, form, type, spec, capacity_gb, speed_mt, cl, latency_ns, release, price_cny: price, summary,
  scores: { read_GBs: read, write_GBs: write, latency_ns },
})
merge('rams.json', [
  ram('gskill-trident-z5-neo-ddr5-6000-cl30-64', 'G.Skill Trident Z5 Neo DDR5-6000 CL30 64GB', 'G.Skill', 'kit-desktop', 'DDR5', 'DDR5-6000 CL30 64GB (32x2)', 64, 6000, 30, 61, 92, 86, '2024-03', 1399, 'AM5 大容量首选，EXPO。'),
  ram('gskill-flare-x5-ddr5-6000-cl30-32', 'G.Skill Flare X5 DDR5-6000 CL30 32GB', 'G.Skill', 'kit-desktop', 'DDR5', 'DDR5-6000 CL30 32GB (16x2)', 32, 6000, 30, 62, 90, 84, '2022-11', 599, '无灯低矮，AM5 性价比之选。'),
  ram('teamgroup-t-force-delta-ddr5-6400-cl32-32', 'TEAMGROUP T-Force Delta DDR5-6400 CL32 32GB', 'TEAMGROUP', 'kit-desktop', 'DDR5', 'DDR5-6400 CL32 32GB (16x2)', 32, 6400, 32, 61, 96, 90, '2023-03', 699, '海力士 A-die，可超。'),
  ram('corsair-dominator-titanium-ddr5-7200-cl34-32', 'Corsair Dominator Titanium DDR5-7200 CL34 32GB', 'Corsair', 'kit-desktop', 'DDR5', 'DDR5-7200 CL34 32GB (16x2)', 32, 7200, 34, 60, 106, 98, '2023-07', 1299, '旗舰外观，Intel 平台。'),
  ram('gskill-trident-z5-royal-ddr5-8000-cl38-48', 'G.Skill Trident Z5 Royal DDR5-8000 CL38 48GB', 'G.Skill', 'kit-desktop', 'DDR5', 'DDR5-8000 CL38 48GB (24x2)', 48, 8000, 38, 59, 118, 108, '2024-06', 1899, '超频玩家向，需好主板。'),
  ram('kingston-fury-renegade-ddr5-6400-cl32-32', 'Kingston FURY Renegade DDR5-6400 CL32 32GB', 'Kingston', 'kit-desktop', 'DDR5', 'DDR5-6400 CL32 32GB (16x2)', 32, 6400, 32, 61, 96, 90, '2022-06', 799, '金士顿高端线。'),
  ram('crucial-pro-ddr5-5600-cl46-32', 'Crucial Pro DDR5-5600 CL46 32GB', 'Crucial', 'kit-desktop', 'DDR5', 'DDR5-5600 CL46 32GB (16x2)', 32, 5600, 46, 78, 82, 76, '2023-05', 499, 'JEDEC 原厂颗粒，稳但慢。'),
  ram('gskill-ripjaws-v-ddr4-3200-cl16-16', 'G.Skill Ripjaws V DDR4-3200 CL16 16GB', 'G.Skill', 'kit-desktop', 'DDR4', 'DDR4-3200 CL16 16GB (8x2)', 16, 3200, 16, 68, 46, 44, '2016-01', 229, 'DDR4 时代的标准答案。'),
  ram('gskill-ripjaws-ddr5-5600-sodimm-32', 'G.Skill Ripjaws DDR5-5600 SO-DIMM 32GB', 'G.Skill', 'sodimm', 'DDR5', 'DDR5-5600 CL40 32GB (16x2) SO-DIMM', 32, 5600, 40, 74, 79, 73, '2023-04', 699, '时序稍好的笔记本条。'),
  ram('kingston-fury-impact-ddr5-6400-sodimm-32', 'Kingston FURY Impact DDR5-6400 SO-DIMM 32GB', 'Kingston', 'sodimm', 'DDR5', 'DDR5-6400 CL38 32GB (16x2) SO-DIMM', 32, 6400, 38, 68, 88, 82, '2024-02', 899, '支持 XMP 的高频笔记本条。'),
  ram('crucial-ddr4-3200-sodimm-16', 'Crucial DDR4-3200 SO-DIMM 16GB', 'Crucial', 'sodimm', 'DDR4', 'DDR4-3200 CL22 16GB (8x2) SO-DIMM', 16, 3200, 22, 78, 44, 42, '2020-01', 249, '老笔记本升级。'),
  ram('intel-lunar-lake-lpddr5x-8533-onboard', 'Lunar Lake LPDDR5X-8533 板载', 'Intel', 'onboard', 'LPDDR5X', 'LPDDR5X-8533 封装内 32GB', 32, 8533, null, null, 128, null, '2024-09', null, '内存封装在 CPU 上，购机时定死。'),
  ram('amd-strix-halo-lpddr5x-8000-onboard', 'Strix Halo LPDDR5X-8000 板载', 'AMD', 'onboard', 'LPDDR5X', 'LPDDR5X-8000 256-bit 128GB', 128, 8000, null, null, 250, null, '2025-02', null, '256-bit 四通道，核显性能的根基。'),
  ram('apple-m4-max-lpddr5x-onboard', 'Apple M4 Max LPDDR5X 板载', 'Apple', 'onboard', 'LPDDR5X', 'LPDDR5X-8533 512-bit 最高 128GB', 128, 8533, null, null, 410, null, '2024-11', null, '统一内存带宽 546GB/s 级别。'),
])

/* ---------------- Storage ---------------- */
const ssd = (id, name, brand, form, iface, cap, nand, dram, sr, sw, r4k, co, tbw, release, price, summary, tags) => ({
  id, name, brand, form, interface: iface, capacity_gb: cap, nand, dram, seq_read: sr, seq_write: sw, iops_4k_read: r4k, write_cache_out: co, tbw, release, price_cny: price, summary, tags,
})
merge('storages.json', [
  ssd('samsung-9100-pro-2tb', 'Samsung 9100 PRO 2TB', 'Samsung', 'nvme', 'pcie5', 2000, 'V-NAND TLC (V8)', true, 14800, 13400, 2200000, 3000, 1200, '2025-03', 1899, '三星 PCIe 5.0 旗舰，能效优秀。', ['旗舰', 'PCIe5']),
  ssd('wd-black-sn8100-2tb', 'WD Black SN8100 2TB', 'WD', 'nvme', 'pcie5', 2000, 'BiCS8 TLC', true, 14900, 14000, 2300000, 3400, 1200, '2025-05', 1799, '当前 PCIe 5.0 综合最强之一，发热可控。', ['旗舰', 'PCIe5']),
  ssd('zhitai-tiplus9100-2tb', '致态 TiPlus9100 2TB', 'ZhiTai', 'nvme', 'pcie5', 2000, 'YMTC TLC', true, 14000, 12000, 1800000, 2600, 1200, '2025-04', 1499, '国产 PCIe 5.0，价格友好。', ['国产', 'PCIe5']),
  ssd('crucial-t500-2tb', 'Crucial T500 2TB', 'Crucial', 'nvme', 'pcie4', 2000, 'B58R TLC', true, 7400, 7000, 1180000, 1400, 1200, '2023-10', 899, 'PCIe 4.0 后期优秀盘。', ['性价比']),
  ssd('samsung-990-evo-plus-2tb', 'Samsung 990 EVO Plus 2TB', 'Samsung', 'nvme', 'pcie4', 2000, 'V-NAND TLC', false, 7250, 6300, 1050000, 1200, 1200, '2024-10', 899, 'HMB 无 DRAM，日常够用。', []),
  ssd('solidigm-p44-pro-2tb', 'Solidigm P44 Pro 2TB', 'Solidigm', 'nvme', 'pcie4', 2000, 'SK hynix 176L TLC', true, 7000, 6500, 1400000, 1500, 1200, '2022-11', 899, '海力士 P41 换壳，4K 极强。', ['游戏']),
  ssd('sk-hynix-platinum-p41-2tb', 'SK hynix Platinum P41 2TB', 'SK Hynix', 'nvme', 'pcie4', 2000, '176L TLC', true, 7000, 6500, 1400000, 1500, 1200, '2022-05', 949, 'PCIe 4.0 时代 4K 标杆。', ['游戏']),
  ssd('lexar-nm790-2tb', 'Lexar NM790 2TB', 'Lexar', 'nvme', 'pcie4', 2000, 'YMTC 232L TLC', false, 7400, 6500, 1000000, 1200, 1500, '2023-06', 749, '无 DRAM 但表现出色，性价比高。', ['性价比']),
  ssd('kioxia-exceria-plus-g3-2tb', 'KIOXIA EXCERIA PLUS G3 2TB', 'KIOXIA', 'nvme', 'pcie4', 2000, 'BiCS6 TLC', false, 5000, 3900, 680000, 900, 1200, '2023-09', 699, '铠侠原厂颗粒，低发热。', []),
  ssd('crucial-p3-plus-2tb', 'Crucial P3 Plus 2TB', 'Crucial', 'nvme', 'pcie4', 2000, 'QLC', false, 5000, 4200, 650000, 200, 440, '2022-06', 599, 'QLC 缓外极慢，只适合仓库盘。', ['入门', 'QLC']),
  ssd('wd-blue-sn580-1tb', 'WD Blue SN580 1TB', 'WD', 'nvme', 'pcie4', 1000, 'BiCS5 TLC', false, 4150, 4150, 600000, 600, 600, '2023-07', 399, '入门 PCIe 4.0，稳妥。', ['入门']),
  ssd('samsung-980-1tb', 'Samsung 980 1TB', 'Samsung', 'nvme', 'pcie3', 1000, 'V-NAND TLC', false, 3500, 3000, 500000, 500, 600, '2021-03', 379, 'PCIe 3.0 无 DRAM 入门。', ['入门']),
  ssd('crucial-mx500-1tb', 'Crucial MX500 1TB', 'Crucial', 'sata', 'sata', 1000, 'Micron TLC', true, 560, 510, 95000, 450, 360, '2018-01', 449, 'SATA 长青款。', ['SATA']),
  ssd('samsung-870-qvo-2tb', 'Samsung 870 QVO 2TB', 'Samsung', 'sata', 'sata', 2000, 'V-NAND QLC', true, 560, 530, 98000, 160, 720, '2020-06', 799, 'QLC 大容量，缓外慢。', ['SATA', 'QLC']),
  ssd('wd-blue-sa510-1tb', 'WD Blue SA510 1TB', 'WD', 'sata', 'sata', 1000, 'TLC', false, 560, 520, 90000, 400, 400, '2022-03', 399, '无 DRAM SATA 入门。', ['SATA']),
  ssd('seagate-exos-x18-16tb', 'Seagate Exos X18 16TB', 'Seagate', 'hdd', 'sata-hdd', 16000, 'CMR 7200rpm 氦气', false, 270, 270, null, null, null, '2020-10', 2299, '企业盘做仓库，噪音大。', ['CMR', '企业']),
  ssd('wd-ultrastar-hc550-18tb', 'WD Ultrastar HC550 18TB', 'WD', 'hdd', 'sata-hdd', 18000, 'CMR 7200rpm 氦气', false, 270, 270, null, null, null, '2020-01', 2699, '企业级大容量。', ['CMR', '企业']),
  ssd('toshiba-n300-8tb', 'Toshiba N300 8TB', 'Toshiba', 'hdd', 'sata-hdd', 8000, 'CMR 7200rpm', false, 240, 240, null, null, null, '2019-01', 1299, 'NAS 盘第三选择。', ['NAS', 'CMR']),
  ssd('wd-black-4tb-wd4005fzbx', 'WD Black 4TB', 'WD', 'hdd', 'sata-hdd', 4000, 'CMR 7200rpm 256MB', false, 220, 220, null, null, null, '2020-01', 899, '桌面性能盘，五年保。', ['CMR']),
  ssd('seagate-barracuda-2tb-smr', 'Seagate BarraCuda 2TB', 'Seagate', 'hdd', 'sata-hdd', 2000, 'SMR 7200rpm', false, 220, 220, null, null, null, '2016-01', 349, 'SMR 叠瓦，只适合冷数据。', ['SMR']),
])

/* ---------------- PSU ---------------- */
const psu = (id, name, brand, form, watt, tier, eff, atx31, modular, oem, release, price, summary) => ({
  id, name, brand, form, watt, tier, efficiency: eff, atx31, modular, oem, release, price_cny: price, summary,
})
const G = '80Plus Gold / Cybenetics Gold', P = '80Plus Platinum / Cybenetics Platinum', T = '80Plus Titanium / Cybenetics Titanium'
merge('psus.json', [
  psu('corsair-rm850x-2024', 'Corsair RM850x (2024)', 'Corsair', 'atx', 850, 'A', G, true, 'full', 'CWT', '2024-04', 899, '2024 新版，风扇更静、原生 12V-2x6。'),
  psu('corsair-hx1200i-2023', 'Corsair HX1200i (2023)', 'Corsair', 'atx', 1200, 'A', P, true, 'full', 'CWT', '2023-02', 2199, '双 4090 级别，数字监控。'),
  psu('corsair-sf1000l', 'Corsair SF1000L', 'Corsair', 'sfx', 1000, 'A', G, true, 'full', 'Great Wall', '2023-03', 1499, 'SFX-L 千瓦，ITX 高端。'),
  psu('seasonic-focus-gx-850-atx31', 'Seasonic Focus GX-850 ATX 3.1', 'Seasonic', 'atx', 850, 'A', G, true, 'full', 'Seasonic', '2024-03', 799, '海韵入门金牌，十年保。'),
  psu('seasonic-prime-tx-1000', 'Seasonic Prime TX-1000', 'Seasonic', 'atx', 1000, 'A', T, true, 'full', 'Seasonic', '2023-09', 2499, '钛金旗舰，12 年保。'),
  psu('be-quiet-dark-power-13-1000', 'be quiet! Dark Power 13 1000W', 'be quiet!', 'atx', 1000, 'A', T, false, 'full', 'FSP', '2023-01', 2299, '安静与用料兼得，ATX 3.0。'),
  psu('be-quiet-pure-power-12-m-850', 'be quiet! Pure Power 12 M 850W', 'be quiet!', 'atx', 850, 'B', G, true, 'full', 'HEC', '2023-05', 749, '静音主流款。'),
  psu('asus-rog-strix-850g-aura', 'ASUS ROG Strix 850G Aura', 'ASUS', 'atx', 850, 'A', G, true, 'full', 'Great Wall', '2024-01', 1099, '长城代工，ROG 溢价。'),
  psu('asus-tuf-gaming-850g', 'ASUS TUF Gaming 850G', 'ASUS', 'atx', 850, 'B', G, true, 'full', 'Great Wall', '2023-06', 749, 'TUF 系列，扎实够用。'),
  psu('msi-mag-a850gl-pcie5', 'MSI MAG A850GL PCIE5', 'MSI', 'atx', 850, 'B', G, false, 'full', 'CWT', '2023-03', 599, '微星主流金牌，ATX 3.0。'),
  psu('nzxt-c1000-gold-2024', 'NZXT C1000 Gold (2024)', 'NZXT', 'atx', 1000, 'B', G, true, 'full', 'CWT', '2024-02', 999, '简约外观，CWT 方案。'),
  psu('thermaltake-toughpower-gf3-850', 'Thermaltake Toughpower GF3 850W', 'Thermaltake', 'atx', 850, 'B', G, false, 'full', 'CWT', '2022-09', 699, '首批 ATX 3.0 之一。'),
  psu('great-wall-x7-850', '长城 X7 850W', 'Great Wall', 'atx', 850, 'B', G, true, 'full', 'Great Wall', '2024-05', 599, '国产大厂自产，性价比高。'),
  psu('deepcool-pn850m', '九州风神 PN850M', 'DeepCool', 'atx', 850, 'B', G, true, 'full', 'CWT', '2024-04', 549, '九州风神主流金牌。'),
  psu('segotep-kl-850g', '鑫谷 昆仑 KL-850G', 'Segotep', 'atx', 850, 'C', G, true, 'full', 'Segotep', '2023-10', 449, '国产入门金牌，够用。'),
  psu('huntkey-mvp-k850', '航嘉 MVP K850', 'Huntkey', 'atx', 850, 'C', '80Plus Gold', false, 'full', 'Huntkey', '2023-05', 499, '老牌国产，规格中规中矩。'),
  psu('antec-neo-eco-850-modular', 'Antec NeoECO 850M', 'Antec', 'atx', 850, 'C', '80Plus Gold', false, 'full', 'Andyson', '2022-06', 499, '入门金牌。'),
  psu('xpg-core-reactor-ii-850', 'XPG Core Reactor II 850W', 'XPG', 'atx', 850, 'A', G, true, 'full', 'CWT', '2023-08', 799, 'CWT 高端方案，口碑好。'),
  psu('fsp-hydro-g-pro-850', 'FSP Hydro G Pro 850W', 'FSP', 'atx', 850, 'B', G, true, 'full', 'FSP', '2023-04', 699, '全汉自产金牌。'),
  psu('cooler-master-v850-sfx-gold', 'Cooler Master V850 SFX Gold', 'Cooler Master', 'sfx', 850, 'A', G, false, 'full', 'Enhance', '2021-01', 1199, 'ITX 装机高端 SFX。'),
  psu('silverstone-sx750-pt', 'SilverStone SX750-PT', 'SilverStone', 'sfx', 750, 'A', P, false, 'full', 'Enhance', '2022-05', 1299, 'SFX 白金，体积极小。'),
  psu('evga-supernova-750-g6', 'EVGA SuperNOVA 750 G6', 'EVGA', 'atx', 750, 'B', G, false, 'full', 'FSP', '2021-08', 699, 'EVGA 经典金牌，已渐退市。'),
])
