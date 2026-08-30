import { readFileSync, writeFileSync } from 'node:fs'
const rd = (f) => JSON.parse(readFileSync(`public/data/${f}`, 'utf8')); const wr = (f, a) => writeFileSync(`public/data/${f}`, JSON.stringify(a, null, 2) + '\n')
/* [id, name, brand, series, gen, chip, vram, type, bus, tdp, raster, rt, release, price, zh, en, ja, tags, est] */
const R = [
  // NVIDIA
  ['nvidia-rtx-5090-d', 'RTX 5090 D', 'NVIDIA', 'RTX 50', 'blackwell', 'GB202', 32, 'GDDR7', 512, 575, 99, 99, '2025-01', 16499, '中国特供版，AI 算力受限，游戏几乎无差。', 'China-market version with capped AI throughput; gaming nearly identical.', '中国向け。AI 性能制限、ゲームはほぼ同じ。', ['旗舰', '国产']],
  ['nvidia-rtx-4090-d', 'RTX 4090 D', 'NVIDIA', 'RTX 40', 'ada', 'AD102', 24, 'GDDR6X', 384, 425, 78, 80, '2023-12', 12999, '中国特供版 4090，核心略减。', 'China-market 4090 with fewer cores.', '中国向け 4090。コア数微減。', ['国产']],
  ['nvidia-rtx-5050', 'RTX 5050', 'NVIDIA', 'RTX 50', 'blackwell', 'GB207', 8, 'GDDR6', 128, 130, 28, 29, '2025-07', 1999, 'GDDR6 版入门 50 系。', 'Entry 50-series with GDDR6.', 'GDDR6 の入門 50 系。', ['1080p', '入门']],
  ['nvidia-rtx-3090-ti', 'RTX 3090 Ti', 'NVIDIA', 'RTX 30', 'ampere', 'GA102', 24, 'GDDR6X', 384, 450, 58, 50, '2022-03', null, '450W 完整 GA102。', 'Full GA102 at 450W.', '450W のフル GA102。', ['旗舰']],
  ['nvidia-rtx-2080', 'RTX 2080', 'NVIDIA', 'RTX 20', 'turing', 'TU104', 8, 'GDDR6', 256, 215, 25, 18, '2018-09', null, '光追元年次旗舰。', 'RT year-one second-tier.', 'RT 元年の準旗艦。', ['历史'], true],
  ['nvidia-titan-rtx', 'TITAN RTX', 'NVIDIA', 'TITAN', 'turing', 'TU102', 24, 'GDDR6', 384, 280, 34, 25, '2018-12', null, '24GB 完整 TU102。', 'Full TU102 with 24GB.', '24GB フル TU102。', ['历史', '生产力'], true],
  ['nvidia-titan-v', 'TITAN V', 'NVIDIA', 'TITAN', 'volta', 'GV100', 12, 'HBM2', 3072, 250, 30, null, '2017-12', null, 'Volta 唯一消费级卡。', 'The only consumer Volta card.', '唯一の一般向け Volta。', ['历史'], true],
  ['nvidia-titan-xp', 'TITAN Xp', 'NVIDIA', 'TITAN', 'pascal', 'GP102', 12, 'GDDR5X', 384, 250, 25, null, '2017-04', null, '完整 GP102。', 'Full GP102.', 'フル GP102。', ['历史'], true],
  ['nvidia-titan-x-pascal', 'TITAN X (Pascal)', 'NVIDIA', 'TITAN', 'pascal', 'GP102', 12, 'GDDR5X', 384, 250, 23, null, '2016-08', null, '1080 Ti 之前的旗舰。', 'The flagship before the 1080 Ti.', '1080 Ti 以前の旗艦。', ['历史'], true],
  ['nvidia-gtx-1060-3gb', 'GTX 1060 3GB', 'NVIDIA', 'GeForce 10', 'pascal', 'GP106', 3, 'GDDR5', 192, 120, 9.5, null, '2016-08', null, '少 128 个核心的 3GB 版。', '3GB version with 128 fewer cores.', '128 コア少ない 3GB 版。', ['历史'], true],
  ['nvidia-gt-1030', 'GT 1030', 'NVIDIA', 'GeForce 10', 'pascal', 'GP108', 2, 'GDDR5', 64, 30, 2.4, null, '2017-05', null, '亮机卡，注意 DDR4 版更慢。', 'Display-out card; the DDR4 version is slower.', '表示用カード。DDR4 版はさらに遅い。', ['历史', '入门'], true],
  ['nvidia-gtx-750', 'GTX 750', 'NVIDIA', 'GeForce 700', 'maxwell', 'GM107', 1, 'GDDR5', 128, 55, 3.0, null, '2014-02', null, '750 Ti 降配。', 'Cut-down 750 Ti.', '750 Ti の下位版。', ['历史'], true],
  ['nvidia-gtx-690', 'GTX 690', 'NVIDIA', 'GeForce 600', 'kepler', '2× GK104', 4, 'GDDR5', 512, 300, 9.0, null, '2012-04', null, '双芯 Kepler。', 'Dual-GPU Kepler.', 'デュアル GPU Kepler。', ['历史'], true],
  ['nvidia-gtx-660-ti', 'GTX 660 Ti', 'NVIDIA', 'GeForce 600', 'kepler', 'GK104', 2, 'GDDR5', 192, 150, 5.3, null, '2012-08', null, '位宽缩减的 GK104。', 'GK104 with a narrower bus.', 'バス幅削減の GK104。', ['历史'], true],
  ['nvidia-gtx-650-ti-boost', 'GTX 650 Ti Boost', 'NVIDIA', 'GeForce 600', 'kepler', 'GK106', 2, 'GDDR5', 192, 134, 3.9, null, '2013-03', null, '带 Boost 的 650 Ti。', '650 Ti with Boost.', 'Boost 付き 650 Ti。', ['历史'], true],
  ['nvidia-gtx-590', 'GTX 590', 'NVIDIA', 'GeForce 500', 'fermi', '2× GF110', 3, 'GDDR5', 768, 365, 6.5, null, '2011-03', null, '双芯 Fermi。', 'Dual-GPU Fermi.', 'デュアル GPU Fermi。', ['历史'], true],
  ['nvidia-gtx-560', 'GTX 560', 'NVIDIA', 'GeForce 500', 'fermi', 'GF114', 1, 'GDDR5', 256, 150, 3.0, null, '2011-05', null, '560 Ti 降配。', 'Cut-down 560 Ti.', '560 Ti の下位版。', ['历史'], true],
  ['nvidia-gtx-550-ti', 'GTX 550 Ti', 'NVIDIA', 'GeForce 500', 'fermi', 'GF116', 1, 'GDDR5', 192, 116, 2.1, null, '2011-03', null, 'Fermi 入门。', 'Fermi entry.', 'Fermi 入門。', ['历史'], true],
  ['nvidia-gtx-470', 'GTX 470', 'NVIDIA', 'GeForce 400', 'fermi', 'GF100', 1.25, 'GDDR5', 320, 215, 3.4, null, '2010-03', null, '480 降配。', 'Cut-down 480.', '480 の下位版。', ['历史'], true],
  ['nvidia-geforce-gtx-295', 'GeForce GTX 295', 'NVIDIA', 'GeForce 200', 'tesla', '2× GT200b', 1.75, 'GDDR3', 896, 289, 3.6, null, '2009-01', null, '双芯 GT200。', 'Dual-GPU GT200.', 'デュアル GPU GT200。', ['历史'], true],
  ['nvidia-geforce-gtx-285', 'GeForce GTX 285', 'NVIDIA', 'GeForce 200', 'tesla', 'GT200b', 1, 'GDDR3', 512, 204, 2.8, null, '2009-01', null, '55nm 版 280。', '55nm 280.', '55nm 版 280。', ['历史'], true],
  ['nvidia-geforce-gtx-275', 'GeForce GTX 275', 'NVIDIA', 'GeForce 200', 'tesla', 'GT200b', 0.875, 'GDDR3', 448, 219, 2.5, null, '2009-04', null, '对标 4890。', 'Rival to the 4890.', '4890 の対抗馬。', ['历史'], true],
  ['nvidia-geforce-9800-gtx-plus', 'GeForce 9800 GTX+', 'NVIDIA', 'GeForce 9', 'tesla', 'G92b', 0.5, 'GDDR3', 256, 141, 1.8, null, '2008-07', null, '55nm G92，后改名 GTS 250。', '55nm G92, later renamed GTS 250.', '55nm G92、後に GTS 250 に改名。', ['历史'], true],
  ['nvidia-geforce-9800-gx2', 'GeForce 9800 GX2', 'NVIDIA', 'GeForce 9', 'tesla', '2× G92', 1, 'GDDR3', 512, 197, 2.6, null, '2008-03', null, '双芯 G92。', 'Dual-GPU G92.', 'デュアル GPU G92。', ['历史'], true],
  ['nvidia-geforce-9600-gt', 'GeForce 9600 GT', 'NVIDIA', 'GeForce 9', 'tesla', 'G94', 0.5, 'GDDR3', 256, 95, 1.0, null, '2008-02', null, '2008 年的甜点。', 'The 2008 sweet spot.', '2008 年の定番。', ['历史'], true],
  ['nvidia-geforce-8800-gts-512', 'GeForce 8800 GTS 512', 'NVIDIA', 'GeForce 8', 'tesla', 'G92', 0.5, 'GDDR3', 256, 140, 1.7, null, '2007-12', null, '完整 G92。', 'Full G92.', 'フル G92。', ['历史'], true],
  ['nvidia-geforce-8800-ultra', 'GeForce 8800 Ultra', 'NVIDIA', 'GeForce 8', 'tesla', 'G80', 0.75, 'GDDR3', 384, 175, 1.75, null, '2007-05', null, 'G80 提频版旗舰。', 'Higher-clocked G80 flagship.', 'G80 高クロック旗艦。', ['历史'], true],
  ['nvidia-geforce-8600-gt', 'GeForce 8600 GT', 'NVIDIA', 'GeForce 8', 'tesla', 'G84', 0.25, 'GDDR3', 128, 43, 0.45, null, '2007-04', null, '当年最普及的中端卡。', 'The most common mid-range card of its day.', '当時最も普及したミドル。', ['历史'], true],
  // AMD
  ['amd-rx-9070-gre', 'RX 9070 GRE', 'AMD', 'RX 9000', 'rdna4', 'Navi 48', 12, 'GDDR6', 192, 220, 50, 44, '2025-05', 3999, '12GB 中国首发版。', '12GB China-first variant.', '12GB 中国先行版。', ['2K', '国产']],
  ['amd-rx-7650-gre', 'RX 7650 GRE', 'AMD', 'RX 7000', 'rdna3', 'Navi 33', 8, 'GDDR6', 128, 170, 27, 19, '2025-02', 1899, '中国特供 7600 变体。', 'China-market 7600 variant.', '中国向け 7600 派生。', ['1080p', '国产']],
  ['amd-rx-6400', 'RX 6400', 'AMD', 'RX 6000', 'rdna2', 'Navi 24', 4, 'GDDR6', 64, 53, 10, 4, '2022-04', null, '半高免供电，PCIe ×4。', 'Low-profile, no power connector, PCIe ×4.', 'ロープロ、外部電源不要、PCIe ×4。', ['入门']],
  ['amd-rx-5500', 'RX 5500', 'AMD', 'RX 5000', 'rdna', 'Navi 14', 8, 'GDDR6', 128, 150, 11, null, '2019-10', null, 'OEM 版 5500 XT。', 'OEM 5500 XT.', 'OEM 版 5500 XT。', ['历史'], true],
  ['amd-rx-550', 'RX 550', 'AMD', 'RX 500', 'polaris', 'Polaris 12', 4, 'GDDR5', 128, 50, 2.6, null, '2017-04', null, '亮机卡。', 'Display-out card.', '表示用カード。', ['历史', '入门'], true],
  ['amd-r9-fury', 'Radeon R9 Fury', 'AMD', 'Radeon R9 300', 'gcn', 'Fiji', 4, 'HBM', 4096, 275, 12, null, '2015-07', null, '风冷版 Fury X 降配。', 'Air-cooled, cut-down Fury X.', '空冷の Fury X 下位版。', ['历史'], true],
  ['amd-r9-nano', 'Radeon R9 Nano', 'AMD', 'Radeon R9 300', 'gcn', 'Fiji', 4, 'HBM', 4096, 175, 11.5, null, '2015-09', null, '15cm 的完整 Fiji。', 'Full Fiji in 15 cm.', '15cm のフル Fiji。', ['历史', '经典'], true],
  ['amd-r9-290', 'Radeon R9 290', 'AMD', 'Radeon R9 200', 'gcn', 'Hawaii', 4, 'GDDR5', 512, 275, 9.0, null, '2013-11', null, '$399 的 Hawaii。', 'The $399 Hawaii.', '$399 の Hawaii。', ['历史'], true],
  ['amd-r9-280', 'Radeon R9 280', 'AMD', 'Radeon R9 200', 'gcn', 'Tahiti', 3, 'GDDR5', 384, 250, 6.0, null, '2014-03', null, '7950 换标。', 'Rebadged 7950.', '7950 のリブランド。', ['历史'], true],
  ['amd-r9-270', 'Radeon R9 270', 'AMD', 'Radeon R9 200', 'gcn', 'Curacao', 2, 'GDDR5', 256, 150, 4.5, null, '2013-11', null, '7870 降频换标。', 'Lower-clocked rebadged 7870.', '7870 の低クロックリブランド。', ['历史'], true],
  ['amd-radeon-hd-7990', 'Radeon HD 7990', 'AMD', 'Radeon HD 7000', 'gcn', '2× Tahiti', 6, 'GDDR5', 768, 375, 11, null, '2013-04', null, '双芯 Tahiti。', 'Dual-GPU Tahiti.', 'デュアル GPU Tahiti。', ['历史'], true],
  ['amd-radeon-hd-7970-ghz', 'Radeon HD 7970 GHz Edition', 'AMD', 'Radeon HD 7000', 'gcn', 'Tahiti', 3, 'GDDR5', 384, 250, 7.2, null, '2012-06', null, '1GHz Tahiti，压制 680。', '1 GHz Tahiti that beat the 680.', '1GHz Tahiti、680 を抑えた。', ['历史'], true],
  ['amd-radeon-hd-7790', 'Radeon HD 7790', 'AMD', 'Radeon HD 7000', 'gcn', 'Bonaire', 1, 'GDDR5', 128, 85, 3.0, null, '2013-03', null, 'GCN 2 首作。', 'First GCN 2.', 'GCN 2 初作。', ['历史'], true],
  ['amd-radeon-hd-7750', 'Radeon HD 7750', 'AMD', 'Radeon HD 7000', 'gcn', 'Cape Verde', 1, 'GDDR5', 128, 55, 1.9, null, '2012-02', null, '免供电 GCN。', 'No-power-connector GCN.', '外部電源不要の GCN。', ['历史'], true],
  ['amd-radeon-hd-6990', 'Radeon HD 6990', 'AMD', 'Radeon HD 6000', 'terascale', '2× Cayman', 4, 'GDDR5', 512, 375, 7.5, null, '2011-03', null, '双芯 Cayman，375W。', 'Dual-GPU Cayman, 375W.', 'デュアル Cayman、375W。', ['历史'], true],
  ['amd-radeon-hd-6790', 'Radeon HD 6790', 'AMD', 'Radeon HD 6000', 'terascale', 'Barts', 1, 'GDDR5', 256, 150, 2.5, null, '2011-04', null, 'Barts 降配。', 'Cut-down Barts.', 'Barts 下位版。', ['历史'], true],
  ['amd-radeon-hd-6770', 'Radeon HD 6770', 'AMD', 'Radeon HD 6000', 'terascale', 'Juniper', 1, 'GDDR5', 128, 108, 1.9, null, '2011-04', null, '5770 换标。', 'Rebadged 5770.', '5770 のリブランド。', ['历史'], true],
  ['amd-radeon-hd-5970', 'Radeon HD 5970', 'AMD', 'Radeon HD 5000', 'terascale', '2× Cypress', 2, 'GDDR5', 512, 294, 6.0, null, '2009-11', null, '当年最快的双芯卡。', 'Fastest dual-GPU card of its day.', '当時最速のデュアル GPU。', ['历史'], true],
  ['amd-radeon-hd-5830', 'Radeon HD 5830', 'AMD', 'Radeon HD 5000', 'terascale', 'Cypress', 1, 'GDDR5', 256, 175, 2.5, null, '2010-02', null, 'Cypress 大幅降配。', 'Heavily cut Cypress.', '大幅削減の Cypress。', ['历史'], true],
  ['amd-radeon-hd-5750', 'Radeon HD 5750', 'AMD', 'Radeon HD 5000', 'terascale', 'Juniper', 1, 'GDDR5', 128, 86, 1.6, null, '2009-10', null, '5770 降配。', 'Cut-down 5770.', '5770 下位版。', ['历史'], true],
  ['amd-radeon-hd-5670', 'Radeon HD 5670', 'AMD', 'Radeon HD 5000', 'terascale', 'Redwood', 0.5, 'GDDR5', 128, 61, 1.0, null, '2010-01', null, '免供电 DX11 入门。', 'No-power-connector DX11 entry.', '外部電源不要の DX11 入門。', ['历史'], true],
  ['amd-radeon-hd-4870-x2', 'Radeon HD 4870 X2', 'AMD', 'Radeon HD 4000', 'terascale', '2× RV770', 2, 'GDDR5', 512, 286, 4.0, null, '2008-08', null, '双芯 RV770。', 'Dual-GPU RV770.', 'デュアル RV770。', ['历史'], true],
  ['amd-radeon-hd-4770', 'Radeon HD 4770', 'AMD', 'Radeon HD 4000', 'terascale', 'RV740', 0.5, 'GDDR5', 128, 80, 1.5, null, '2009-04', null, '首款 40nm GPU。', 'First 40nm GPU.', '初の 40nm GPU。', ['历史'], true],
  ['amd-radeon-hd-4670', 'Radeon HD 4670', 'AMD', 'Radeon HD 4000', 'terascale', 'RV730', 0.5, 'GDDR3', 128, 59, 0.9, null, '2008-09', null, '免供电中端。', 'No-power-connector mid-range.', '外部電源不要のミドル。', ['历史'], true],
  ['amd-radeon-hd-3870-x2', 'Radeon HD 3870 X2', 'AMD', 'Radeon HD 3000', 'terascale', '2× RV670', 1, 'GDDR3', 512, 196, 1.9, null, '2008-01', null, '首款单卡双芯回归。', 'Return of the dual-GPU single card.', 'デュアル GPU 単一カードの復活。', ['历史'], true],
  ['amd-radeon-hd-3850', 'Radeon HD 3850', 'AMD', 'Radeon HD 3000', 'terascale', 'RV670', 0.25, 'GDDR3', 256, 75, 0.9, null, '2007-11', null, '3870 降配。', 'Cut-down 3870.', '3870 下位版。', ['历史'], true],
  ['amd-radeon-hd-2600-xt', 'Radeon HD 2600 XT', 'AMD', 'Radeon HD 2000', 'terascale', 'RV630', 0.25, 'GDDR3', 128, 45, 0.4, null, '2007-06', null, 'R600 时代中端。', 'R600-era mid-range.', 'R600 時代のミドル。', ['历史'], true],
  // Intel
  ['intel-arc-a770-8gb', 'Arc A770 8GB', 'Intel', 'Arc A', 'xe', 'ACM-G10', 8, 'GDDR6', 256, 225, 29, 25, '2022-10', null, '8GB 版 A770。', '8GB A770.', '8GB 版 A770。', ['2K']],
  ['intel-arc-a310', 'Arc A310', 'Intel', 'Arc A', 'xe', 'ACM-G11', 4, 'GDDR6', 64, 75, 6, 4, '2022-09', 599, '半高 AV1 编码卡。', 'Low-profile AV1 encoding card.', 'ロープロ AV1 エンコードカード。', ['入门']],
]
const arr = rd('gpus.json'); const ids = new Set(arr.map((i) => i.id)); let n = 0
for (const [id, name, brand, series, gen, chip, vram_gb, vram_type, bus_bit, tdp_w, raster, rt, release, price, zh, en, ja, tags, est] of R) {
  if (ids.has(id)) continue
  arr.push({ id, name, nameEn: `${brand} ${name}`, brand, form: 'desktop', series, gen, chip, vram_gb, vram_type, bus_bit, tdp_w, release, price_cny: price, summary: zh, summary_en: en, summary_ja: ja, tags: est ? [...new Set([...tags, '历史'])] : tags, ...(est ? { est: true } : {}), scores: { raster_rel: raster, rt_rel: rt } }); n++
}
wr('gpus.json', arr); console.log('desktop gpus +', n, '=', arr.length)
