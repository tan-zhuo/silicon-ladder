/**
 * 平台 / 兼容性知识表：按插槽、代次派生，三语（zh / en / ja）。
 * 每条文案为 L(zh, en, ja) 三元组，运行时按当前语言取值。
 */
import type { Cpu, Gpu, Storage, Psu, Ram } from '@/types/hardware'
import { locale } from '@/i18n'

type L3 = [string, string, string]
const L = (zh: string, en: string, ja: string): L3 => [zh, en, ja]
const pick = (v: L3 | string): string => (typeof v === 'string' ? v : v[locale.value === 'en' ? 1 : locale.value === 'ja' ? 2 : 0])

export interface Row { label: string; value: string; note?: string }
const row = (label: L3, value: L3 | string, note?: L3 | string): Row => ({ label: pick(label), value: pick(value), ...(note ? { note: pick(note) } : {}) })

/* ---------- 标签 ---------- */
const LBL = {
  arch: L('微架构', 'Microarchitecture', 'マイクロアーキテクチャ'), process: L('制程', 'Process', 'プロセス'), l2: L('L2 缓存', 'L2 cache', 'L2 キャッシュ'),
  lanes: L('CPU PCIe 通道', 'CPU PCIe lanes', 'CPU PCIe レーン'), npu: L('AI 加速', 'AI accelerator', 'AI アクセラレータ'), socket: L('插槽', 'Socket', 'ソケット'),
  chipsets: L('兼容芯片组', 'Compatible chipsets', '対応チップセット'), mem: L('内存支持', 'Memory', 'メモリ'), pcie: L('PCIe', 'PCIe', 'PCIe'),
  cooler: L('散热器孔位', 'Cooler mount', 'クーラー取付'), upgrade: L('升级路线', 'Upgrade path', 'アップグレード'), pkg: L('封装', 'Package', 'パッケージ'),
  power: L('功耗墙', 'Power limit', '電力制限'), igpu: L('核显', 'iGPU', '内蔵GPU'), archProc: L('架构 / 制程', 'Architecture / process', 'アーキテクチャ / プロセス'),
  bus: L('总线接口', 'Bus interface', 'バス'), upscale: L('超采样 / 帧生成', 'Upscaling / frame gen', 'アップスケール / フレーム生成'), enc: L('视频编码', 'Video encode', '動画エンコード'),
  api: L('API', 'API', 'API'), conn: L('供电接口', 'Power connector', '電源コネクタ'), psu: L('推荐电源', 'Recommended PSU', '推奨電源'), size: L('体积参考', 'Size reference', 'サイズ目安'),
  tgp: L('TGP 区间', 'TGP range', 'TGP 範囲'), display: L('显示输出', 'Display output', '映像出力'), vram: L('显存', 'VRAM', 'VRAM'), slot: L('插槽', 'Slot', 'スロット'),
  oc: L('一键超频', 'One-click OC', 'ワンクリック OC'), volt: L('电压', 'Voltage', '電圧'), platform: L('平台建议', 'Platform advice', 'プラットフォーム'), four: L('四条插满', 'Four sticks', '4枚挿し'),
  spec: L('规格', 'Form factor', '規格'), iface: L('接口需求', 'Interface', 'インターフェース'), cool: L('散热', 'Cooling', '冷却'), dram: L('DRAM 缓存', 'DRAM cache', 'DRAM キャッシュ'),
  compat: L('兼容性', 'Compatibility', '互換性'), use: L('适用', 'Use case', '用途'), rec: L('记录方式', 'Recording', '記録方式'), note: L('注意', 'Note', '注意'),
  endurance: L('耐久 / 容量', 'Endurance / capacity', '耐久 / 容量'), gpuPower: L('显卡供电', 'GPU power', 'GPU 電源'), standard: L('标准', 'Standard', '規格'),
  carry: L('可带显卡参考', 'GPU class reference', '対応 GPU 目安'), modular: L('模组', 'Modular', 'モジュラー'), risk: L('风险提示', 'Risk', 'リスク'),
}

/* ---------- CPU 插槽 ---------- */
interface SocketInfo { name: string; since: string; chipsets: string[]; memory: L3; pcie: L3; cooler: L3; upgrade: L3 }
const SOCKETS: Record<string, SocketInfo> = {
  AM5: { name: 'AM5 (LGA1718)', since: '2022-09', chipsets: ['X870E', 'X870', 'B850', 'B840', 'X670E', 'X670', 'B650E', 'B650', 'A620'],
    memory: L('仅 DDR5（双通道，甜点 6000 MT/s EXPO）', 'DDR5 only (dual channel, 6000 MT/s EXPO sweet spot)', 'DDR5 のみ（2ch、6000 MT/s EXPO が定番）'),
    pcie: L('PCIe 5.0 ×16 显卡 + ×4 NVMe（B840/A620 主板可能限制为 4.0）', 'PCIe 5.0 ×16 GPU + ×4 NVMe (B840/A620 boards may limit to 4.0)', 'PCIe 5.0 ×16 GPU + ×4 NVMe（B840/A620 は 4.0 制限あり）'),
    cooler: L('沿用 AM4 孔位（背板兼容），多数 AM4 散热器可直装', 'Same mount as AM4 (backplate compatible); most AM4 coolers fit', 'AM4 と同じ取付（バックプレート互換）。多くの AM4 クーラーが使用可'),
    upgrade: L('AMD 承诺支持到 2027+，Zen 4 / Zen 5 均可用；老主板需更新 BIOS 才能上 9000 系', 'AMD promises support through 2027+; Zen 4 / Zen 5 both work; older boards need a BIOS update for 9000-series', 'AMD は 2027 年以降までサポートを約束。Zen 4 / Zen 5 対応。旧ボードは 9000 系に BIOS 更新必要') },
  AM4: { name: 'AM4 (PGA1331)', since: '2017-03', chipsets: ['X570', 'B550', 'A520', 'X470', 'B450', 'X370', 'B350', 'A320'],
    memory: L('仅 DDR4（双通道，甜点 3600 MT/s）', 'DDR4 only (dual channel, 3600 MT/s sweet spot)', 'DDR4 のみ（2ch、3600 MT/s が定番）'),
    pcie: L('PCIe 4.0（X570/B550 + Zen 2 以上），其余 3.0', 'PCIe 4.0 (X570/B550 with Zen 2+), otherwise 3.0', 'PCIe 4.0（X570/B550 + Zen 2 以降）、それ以外は 3.0'),
    cooler: L('AM4 孔位，绝大多数散热器兼容', 'AM4 mount, nearly all coolers compatible', 'AM4 取付。ほぼ全てのクーラー対応'),
    upgrade: L('平台已停更，5800X3D / 5700X3D 为终点站；300 系主板需刷 BIOS', 'Platform ended; 5800X3D / 5700X3D are the final stop; 300-series boards need a BIOS flash', 'プラットフォーム終了。5800X3D / 5700X3D が最終。300 系は BIOS 更新必要') },
  LGA1851: { name: 'LGA1851', since: '2024-10', chipsets: ['Z890', 'B860', 'H810'],
    memory: L('仅 DDR5（双通道，官方 6400，主板普遍 8000+）', 'DDR5 only (dual channel, 6400 official, boards commonly 8000+)', 'DDR5 のみ（2ch、公式 6400、ボードは 8000+ 対応が多い）'),
    pcie: L('CPU 直出 PCIe 5.0 ×16 + ×4 + 4.0 ×4', 'CPU: PCIe 5.0 ×16 + ×4 plus 4.0 ×4', 'CPU 直結 PCIe 5.0 ×16 + ×4 + 4.0 ×4'),
    cooler: L('与 LGA1700 同孔位，但 IHS 热点位置北移，部分厂商提供偏移扣具', 'Same mount as LGA1700, but the hotspot moved north; some vendors offer offset brackets', 'LGA1700 と同じ取付だがホットスポットが北側へ。オフセット金具を出すメーカーあり'),
    upgrade: L('仅 Arrow Lake（Core Ultra 200S），下一代 Nova Lake 预计换插槽', 'Arrow Lake (Core Ultra 200S) only; Nova Lake is expected to change socket', 'Arrow Lake（Core Ultra 200S）のみ。次世代 Nova Lake はソケット変更見込み') },
  LGA1700: { name: 'LGA1700', since: '2021-11', chipsets: ['Z790', 'B760', 'H770', 'H610', 'Z690', 'B660', 'H670'],
    memory: L('DDR5 或 DDR4（取决于主板，不可混用）', 'DDR5 or DDR4 (board-dependent, not mixable)', 'DDR5 または DDR4（ボード依存、混在不可）'),
    pcie: L('PCIe 5.0 ×16 + 4.0 ×4（600/700 系）', 'PCIe 5.0 ×16 + 4.0 ×4 (600/700 series)', 'PCIe 5.0 ×16 + 4.0 ×4（600/700 系）'),
    cooler: L('LGA1700 专用孔位（78×78），老 115x 散热器需转接扣具', 'LGA1700-specific mount (78×78); older 115x coolers need an adapter', 'LGA1700 専用取付（78×78）。旧 115x クーラーは変換金具が必要'),
    upgrade: L('12/13/14 代通用，需 BIOS 支持；13/14 代 K 系列注意微码 0x12B 更新', '12th/13th/14th gen with BIOS support; 13th/14th-gen K parts need microcode 0x12B', '第12/13/14世代対応（BIOS 要件あり）。13/14 世代 K は マイクロコード 0x12B 更新必須') },
  LGA1200: { name: 'LGA1200', since: '2020-05', chipsets: ['Z590', 'B560', 'H570', 'H510', 'Z490', 'B460', 'H470', 'H410'],
    memory: L('仅 DDR4（双通道，11 代官方 3200）', 'DDR4 only (dual channel, 3200 official on 11th gen)', 'DDR4 のみ（2ch、第11世代公式 3200）'),
    pcie: L('11 代 PCIe 4.0 ×16 + ×4（500 系）；10 代 3.0', '11th gen PCIe 4.0 ×16 + ×4 (500 series); 10th gen 3.0', '第11世代 PCIe 4.0 ×16 + ×4（500 系）、第10世代は 3.0'),
    cooler: L('与 LGA115x 同孔位（75×75）', 'Same mount as LGA115x (75×75)', 'LGA115x と同じ取付（75×75）'),
    upgrade: L('仅 10/11 代，平台已停更；400 系主板搭 11 代需 BIOS', '10th/11th gen only, platform ended; 400-series boards need a BIOS for 11th gen', '第10/11世代のみ、終了済。400 系で第11世代は BIOS 更新必要') },
  LGA1151v2: { name: 'LGA1151 (300)', since: '2017-10', chipsets: ['Z390', 'B365', 'B360', 'H370', 'H310', 'Z370'],
    memory: L('仅 DDR4（官方 2666）', 'DDR4 only (2666 official)', 'DDR4 のみ（公式 2666）'), pcie: L('PCIe 3.0 ×16', 'PCIe 3.0 ×16', 'PCIe 3.0 ×16'),
    cooler: L('LGA115x 孔位', 'LGA115x mount', 'LGA115x 取付'),
    upgrade: L('8/9 代通用；与 100/200 系主板物理相同但不兼容', '8th/9th gen; physically identical to 100/200-series boards but incompatible', '第8/9世代対応。100/200 系ボードと物理的に同じだが非互換') },
  LGA1151: { name: 'LGA1151 (100/200)', since: '2015-08', chipsets: ['Z270', 'B250', 'H270', 'Z170', 'B150', 'H110'],
    memory: L('DDR4-2133/2400 或 DDR3L（视主板）', 'DDR4-2133/2400 or DDR3L (board-dependent)', 'DDR4-2133/2400 または DDR3L（ボード依存）'), pcie: L('PCIe 3.0 ×16', 'PCIe 3.0 ×16', 'PCIe 3.0 ×16'),
    cooler: L('LGA115x 孔位', 'LGA115x mount', 'LGA115x 取付'), upgrade: L('仅 6/7 代，平台已停更', '6th/7th gen only, platform ended', '第6/7世代のみ、終了済') },
  LGA1150: { name: 'LGA1150', since: '2013-06', chipsets: ['Z97', 'H97', 'Z87', 'H87', 'B85', 'H81'],
    memory: L('仅 DDR3-1600', 'DDR3-1600 only', 'DDR3-1600 のみ'), pcie: L('PCIe 3.0 ×16', 'PCIe 3.0 ×16', 'PCIe 3.0 ×16'), cooler: L('LGA115x 孔位', 'LGA115x mount', 'LGA115x 取付'),
    upgrade: L('仅 4 代（Haswell / Devil’s Canyon / Broadwell），已停更', '4th gen only (Haswell / Devil’s Canyon / Broadwell), ended', '第4世代のみ（Haswell / Devil’s Canyon / Broadwell）、終了済') },
  LGA1155: { name: 'LGA1155', since: '2011-01', chipsets: ['Z77', 'H77', 'B75', 'Z68', 'P67', 'H67', 'H61'],
    memory: L('仅 DDR3-1333/1600', 'DDR3-1333/1600 only', 'DDR3-1333/1600 のみ'), pcie: L('Ivy Bridge PCIe 3.0；Sandy Bridge 2.0', 'Ivy Bridge PCIe 3.0; Sandy Bridge 2.0', 'Ivy Bridge は PCIe 3.0、Sandy Bridge は 2.0'),
    cooler: L('LGA115x 孔位', 'LGA115x mount', 'LGA115x 取付'), upgrade: L('2/3 代通用（6 系主板需 BIOS 支持 3 代），已停更', '2nd/3rd gen (6-series boards need a BIOS for 3rd gen), ended', '第2/3世代対応（6 系は第3世代に BIOS 必要）、終了済') },
  LGA1156: { name: 'LGA1156', since: '2009-09', chipsets: ['P55', 'H55', 'H57'],
    memory: L('仅 DDR3-1333 双通道', 'DDR3-1333 dual channel only', 'DDR3-1333 2ch のみ'), pcie: L('PCIe 2.0 ×16', 'PCIe 2.0 ×16', 'PCIe 2.0 ×16'), cooler: L('LGA115x 孔位', 'LGA115x mount', 'LGA115x 取付'),
    upgrade: L('仅 Lynnfield / Clarkdale，早已停更', 'Lynnfield / Clarkdale only, long ended', 'Lynnfield / Clarkdale のみ、終了済') },
  LGA1366: { name: 'LGA1366', since: '2008-11', chipsets: ['X58'],
    memory: L('DDR3 三通道', 'DDR3 triple channel', 'DDR3 3ch'), pcie: L('PCIe 2.0（X58 提供 36 条）', 'PCIe 2.0 (36 lanes from X58)', 'PCIe 2.0（X58 が 36 レーン提供）'),
    cooler: L('LGA1366 专用孔位（80×80）', 'LGA1366-specific mount (80×80)', 'LGA1366 専用取付（80×80）'), upgrade: L('Bloomfield / Gulftown，可上 6 核至强，早已停更', 'Bloomfield / Gulftown; 6-core Xeons work; long ended', 'Bloomfield / Gulftown。6 コア Xeon 可。終了済') },
  'LGA2011-3': { name: 'LGA2011-3', since: '2014-08', chipsets: ['X99'],
    memory: L('DDR4 四通道', 'DDR4 quad channel', 'DDR4 4ch'), pcie: L('CPU 直出 28–40 条 PCIe 3.0', '28–40 PCIe 3.0 lanes from CPU', 'CPU 直結 PCIe 3.0 28–40 レーン'),
    cooler: L('LGA2011 专用孔位', 'LGA2011-specific mount', 'LGA2011 専用取付'), upgrade: L('Haswell-E / Broadwell-E，HEDT 平台已停更', 'Haswell-E / Broadwell-E, HEDT platform ended', 'Haswell-E / Broadwell-E。HEDT 終了済') },
  LGA775: { name: 'LGA775', since: '2004-06', chipsets: ['P45', 'P43', 'G41', 'X48', 'P35', 'G31', 'nForce 7xx'],
    memory: L('DDR2 或 DDR3（视主板）', 'DDR2 or DDR3 (board-dependent)', 'DDR2 または DDR3（ボード依存）'), pcie: L('PCIe 2.0 ×16（P45/X48），旧板 1.x', 'PCIe 2.0 ×16 (P45/X48), 1.x on older boards', 'PCIe 2.0 ×16（P45/X48）、旧ボードは 1.x'),
    cooler: L('LGA775 孔位（72×72）', 'LGA775 mount (72×72)', 'LGA775 取付（72×72）'), upgrade: L('Core 2 全系，注意 FSB 1333/1600 支持，早已停更', 'All Core 2; check FSB 1333/1600 support; long ended', 'Core 2 全般。FSB 1333/1600 対応に注意。終了済') },
  'AM3+': { name: 'AM3+', since: '2011-10', chipsets: ['990FX', '990X', '970', '890FX'],
    memory: L('仅 DDR3-1866', 'DDR3-1866 only', 'DDR3-1866 のみ'), pcie: L('PCIe 2.0 ×16', 'PCIe 2.0 ×16', 'PCIe 2.0 ×16'), cooler: L('AM2/AM3 通用孔位', 'AM2/AM3 common mount', 'AM2/AM3 共通取付'),
    upgrade: L('FX 全系（推土机 / 打桩机），可插 AM3 Phenom II，已停更', 'All FX (Bulldozer / Piledriver); AM3 Phenom II also fits; ended', 'FX 全般（Bulldozer / Piledriver）。AM3 Phenom II も可。終了済') },
  AM3: { name: 'AM3', since: '2009-02', chipsets: ['890GX', '870', '790X', '785G', '770'],
    memory: L('DDR3-1333（CPU 双控 DDR2/DDR3）', 'DDR3-1333 (CPU supports DDR2/DDR3)', 'DDR3-1333（CPU は DDR2/DDR3 両対応）'), pcie: L('PCIe 2.0 ×16', 'PCIe 2.0 ×16', 'PCIe 2.0 ×16'),
    cooler: L('AM2/AM3 通用孔位', 'AM2/AM3 common mount', 'AM2/AM3 共通取付'), upgrade: L('Phenom II / Athlon II，已停更', 'Phenom II / Athlon II, ended', 'Phenom II / Athlon II。終了済') },
  'AM2+': { name: 'AM2+', since: '2007-11', chipsets: ['790FX', '790GX', '780G', '770'],
    memory: L('仅 DDR2-1066', 'DDR2-1066 only', 'DDR2-1066 のみ'), pcie: L('PCIe 2.0 ×16', 'PCIe 2.0 ×16', 'PCIe 2.0 ×16'), cooler: L('AM2/AM3 通用孔位', 'AM2/AM3 common mount', 'AM2/AM3 共通取付'),
    upgrade: L('Phenom / Athlon 64 X2，可插 AM3 CPU，早已停更', 'Phenom / Athlon 64 X2; AM3 CPUs also fit; long ended', 'Phenom / Athlon 64 X2。AM3 CPU も可。終了済') },
}

const perCore = (kb: string) => L(`每核 ${kb}`, `${kb} per core`, `コアあたり ${kb}`)
const lanes = (n: string, gen: string) => L(`${n} 条 PCIe ${gen}`, `${n} PCIe ${gen} lanes`, `PCIe ${gen} ${n} レーン`)
const CPU_GEN: Record<string, { arch: string; process: string; pcieLanes?: L3; l2?: L3; npu?: string }> = {
  zen5: { arch: 'Zen 5', process: 'TSMC N4P (CCD) + N6 (IOD)', pcieLanes: lanes('28', '5.0'), l2: perCore('1 MB') },
  zen4: { arch: 'Zen 4', process: 'TSMC N5 (CCD) + N6 (IOD)', pcieLanes: lanes('28', '5.0'), l2: perCore('1 MB') },
  zen3: { arch: 'Zen 3', process: 'TSMC N7', pcieLanes: lanes('24', '4.0'), l2: perCore('512 KB') },
  'zen3+': { arch: 'Zen 3+', process: 'TSMC N6', l2: perCore('512 KB') },
  zen2: { arch: 'Zen 2', process: 'TSMC N7 (CCD) + GF 12nm (IOD)', pcieLanes: lanes('24', '4.0'), l2: perCore('512 KB') },
  'zen+': { arch: 'Zen+', process: 'GF 12nm', pcieLanes: lanes('24', '3.0'), l2: perCore('512 KB') },
  zen: { arch: 'Zen', process: 'GF 14nm', pcieLanes: lanes('24', '3.0'), l2: perCore('512 KB') },
  'arrow-lake': { arch: 'Lion Cove + Skymont', process: 'TSMC N3B', pcieLanes: L('24 条（20×5.0 + 4×4.0）', '24 lanes (20× 5.0 + 4× 4.0)', '24 レーン（20× 5.0 + 4× 4.0）'), l2: L('P 核 3 MB / E 核簇 4 MB', 'P-core 3 MB / E-cluster 4 MB', 'P コア 3 MB / E クラスタ 4 MB'), npu: 'NPU 13 TOPS' },
  'arrow-lake-hx': { arch: 'Lion Cove + Skymont', process: 'TSMC N3B', l2: L('P 核 3 MB', 'P-core 3 MB', 'P コア 3 MB'), npu: 'NPU 13 TOPS' },
  'arrow-lake-h': { arch: 'Lion Cove + Skymont + LP-E', process: 'TSMC N3B', l2: L('P 核 3 MB', 'P-core 3 MB', 'P コア 3 MB'), npu: 'NPU 13 TOPS' },
  'lunar-lake': { arch: 'Lion Cove + Skymont', process: 'TSMC N3B', l2: L('P 核 2.5 MB', 'P-core 2.5 MB', 'P コア 2.5 MB'), npu: 'NPU 48 TOPS' },
  'meteor-lake': { arch: 'Redwood Cove + Crestmont', process: 'Intel 4', l2: L('P 核 2 MB', 'P-core 2 MB', 'P コア 2 MB'), npu: 'NPU 11 TOPS' },
  'raptor-lake': { arch: 'Raptor Cove + Gracemont', process: 'Intel 7', pcieLanes: L('20 条（16×5.0 + 4×4.0）', '20 lanes (16× 5.0 + 4× 4.0)', '20 レーン（16× 5.0 + 4× 4.0）'), l2: L('P 核 2 MB / E 核簇 4 MB', 'P-core 2 MB / E-cluster 4 MB', 'P コア 2 MB / E クラスタ 4 MB') },
  'raptor-lake-hx': { arch: 'Raptor Cove + Gracemont', process: 'Intel 7', l2: L('P 核 2 MB', 'P-core 2 MB', 'P コア 2 MB') },
  'alder-lake': { arch: 'Golden Cove + Gracemont', process: 'Intel 7', pcieLanes: L('20 条（16×5.0 + 4×4.0）', '20 lanes (16× 5.0 + 4× 4.0)', '20 レーン（16× 5.0 + 4× 4.0）'), l2: L('P 核 1.25 MB', 'P-core 1.25 MB', 'P コア 1.25 MB') },
  'tiger-lake': { arch: 'Willow Cove', process: 'Intel 10nm SuperFin', l2: perCore('1.25 MB') },
  'rocket-lake': { arch: 'Cypress Cove', process: 'Intel 14nm', pcieLanes: lanes('20', '4.0'), l2: perCore('512 KB') },
  'comet-lake': { arch: 'Comet Lake', process: 'Intel 14nm++', pcieLanes: lanes('16', '3.0'), l2: perCore('256 KB') },
  'coffee-lake': { arch: 'Coffee Lake', process: 'Intel 14nm++', pcieLanes: lanes('16', '3.0'), l2: perCore('256 KB') },
  'kaby-lake': { arch: 'Kaby Lake', process: 'Intel 14nm+', pcieLanes: lanes('16', '3.0'), l2: perCore('256 KB') },
  skylake: { arch: 'Skylake', process: 'Intel 14nm', pcieLanes: lanes('16', '3.0'), l2: perCore('256 KB') },
  'haswell-e': { arch: 'Haswell-E', process: 'Intel 22nm', pcieLanes: lanes('40', '3.0'), l2: perCore('256 KB') },
  haswell: { arch: 'Haswell', process: 'Intel 22nm', pcieLanes: lanes('16', '3.0'), l2: perCore('256 KB') },
  'ivy-bridge': { arch: 'Ivy Bridge', process: 'Intel 22nm (Tri-Gate)', pcieLanes: lanes('16', '3.0'), l2: perCore('256 KB') },
  'sandy-bridge': { arch: 'Sandy Bridge', process: 'Intel 32nm', pcieLanes: lanes('16', '2.0'), l2: perCore('256 KB') },
  nehalem: { arch: 'Nehalem / Lynnfield', process: 'Intel 45nm', pcieLanes: L('LGA1156：16 条 PCIe 2.0', 'LGA1156: 16 PCIe 2.0 lanes', 'LGA1156：PCIe 2.0 16 レーン'), l2: perCore('256 KB') },
  core2: { arch: 'Core (Conroe / Penryn)', process: 'Intel 65nm / 45nm', l2: L('共享 L2（无 L3）', 'Shared L2 (no L3)', '共有 L2（L3 なし）') },
  k10: { arch: 'K10 (Stars)', process: 'AMD 65nm / 45nm', l2: perCore('512 KB') },
  bulldozer: { arch: 'Bulldozer', process: 'GF 32nm SOI', l2: L('每模块 2 MB', '2 MB per module', 'モジュールあたり 2 MB') },
  piledriver: { arch: 'Piledriver', process: 'GF 32nm SOI', l2: L('每模块 2 MB', '2 MB per module', 'モジュールあたり 2 MB') },
  'apple-m4': { arch: 'Apple M4 (ARMv9.2)', process: 'TSMC N3E', npu: 'Neural Engine 38 TOPS' },
  'apple-m3': { arch: 'Apple M3 (ARMv8.6)', process: 'TSMC N3B', npu: 'Neural Engine 18 TOPS' },
  'apple-m2': { arch: 'Apple M2 (ARMv8.6)', process: 'TSMC N5P', npu: 'Neural Engine 15.8 TOPS' },
  'apple-m1': { arch: 'Apple M1 (ARMv8.5)', process: 'TSMC N5', npu: 'Neural Engine 11 TOPS' },
  'snapdragon-x': { arch: 'Oryon (ARMv8.7)', process: 'TSMC N4', npu: 'Hexagon NPU 45 TOPS' },
  'snapdragon-8cx': { arch: 'Kryo 680 (ARMv8.4)', process: 'Samsung 5nm', npu: 'Hexagon 15 TOPS' },
}

export function cpuPlatform(c: Cpu): Row[] {
  const rows: Row[] = []
  const g = CPU_GEN[c.gen]
  if (g) {
    rows.push(row(LBL.arch, g.arch), row(LBL.process, g.process))
    if (g.l2) rows.push(row(LBL.l2, g.l2))
    if (g.pcieLanes) rows.push(row(LBL.lanes, g.pcieLanes))
    if (g.npu) rows.push(row(LBL.npu, g.npu))
  }
  const s = SOCKETS[c.socket]
  if (s) {
    rows.push(row(LBL.socket, s.name, L(`${s.since} 起`, `since ${s.since}`, `${s.since} 〜`)))
    rows.push(row(LBL.chipsets, s.chipsets.join(' / ')), row(LBL.mem, s.memory), row(LBL.pcie, s.pcie), row(LBL.cooler, s.cooler), row(LBL.upgrade, s.upgrade))
  } else if (c.form === 'laptop') {
    const pkg = c.socket.includes('(') ? ' ' + c.socket.slice(c.socket.indexOf('(')) : ''
    rows.push(row(LBL.pkg, L(`BGA 板载${pkg}`, `BGA soldered${pkg}`, `BGA オンボード${pkg}`), L('焊死在主板上，不可更换或升级', 'Soldered to the board; cannot be replaced or upgraded', '基板に直付け。交換・アップグレード不可')))
    const onboard = c.mem.includes('板载') || c.mem.startsWith('LPDDR')
    rows.push(row(LBL.mem, onboard ? L(`${c.mem}（板载，不可扩展）`, `${c.mem} (onboard, not expandable)`, `${c.mem}（オンボード、増設不可）`) : L(`${c.mem}（SO-DIMM，通常可升级）`, `${c.mem} (SO-DIMM, usually upgradeable)`, `${c.mem}（SO-DIMM、通常増設可）`)))
    if (c.tdp_range) rows.push(row(LBL.power, c.tdp_range, L('实际由笔记本厂商设定，同芯片不同机型差距可达 30%+', 'Set by the laptop maker; the same chip can differ 30%+ between models', 'ノートメーカーが設定。同じチップでも機種差 30% 以上')))
  }
  if (c.igpu) rows.push(row(LBL.igpu, c.igpu, c.form === 'desktop' ? L('可亮机 / 编解码，不适合游戏', 'Boots and encodes/decodes; not for gaming', '起動と動画処理は可。ゲームには不向き') : undefined))
  else rows.push(row(LBL.igpu, L('无', 'None', 'なし'), L('必须搭配独立显卡才能点亮', 'A discrete GPU is required for display output', '映像出力には dGPU が必須')))
  return rows
}

/* ---------- GPU ---------- */
const decodeOnly = L('仅解码', 'Decode only', 'デコードのみ')
const GPU_GEN: Record<string, { arch: string; process: string; pcie: string | L3; upscale: string | L3; encoder: string | L3; api: string }> = {
  blackwell: { arch: 'Blackwell', process: 'TSMC 4N', pcie: 'PCIe 5.0 ×16', upscale: L('DLSS 4（多帧生成）', 'DLSS 4 (multi-frame generation)', 'DLSS 4（マルチフレーム生成）'), encoder: L('NVENC 第 9 代：AV1 / HEVC 4:2:2', 'NVENC gen 9: AV1 / HEVC 4:2:2', 'NVENC 第9世代：AV1 / HEVC 4:2:2'), api: 'DirectX 12 Ultimate / Vulkan 1.4 / CUDA 12' },
  ada: { arch: 'Ada Lovelace', process: 'TSMC 4N', pcie: 'PCIe 4.0 ×16', upscale: L('DLSS 3.5（单帧生成）', 'DLSS 3.5 (single-frame generation)', 'DLSS 3.5（シングルフレーム生成）'), encoder: L('NVENC 第 8 代：AV1', 'NVENC gen 8: AV1', 'NVENC 第8世代：AV1'), api: 'DirectX 12 Ultimate / Vulkan / CUDA 12' },
  ampere: { arch: 'Ampere', process: 'Samsung 8N', pcie: 'PCIe 4.0 ×16', upscale: L('DLSS 2 / 3.5 光线重建（无帧生成）', 'DLSS 2 / 3.5 ray reconstruction (no frame gen)', 'DLSS 2 / 3.5 レイ再構成（フレーム生成なし）'), encoder: L('NVENC 第 7 代：HEVC（无 AV1 编码）', 'NVENC gen 7: HEVC (no AV1 encode)', 'NVENC 第7世代：HEVC（AV1 エンコードなし）'), api: 'DirectX 12 Ultimate / CUDA 12' },
  turing: { arch: 'Turing', process: 'TSMC 12nm FFN', pcie: 'PCIe 3.0 ×16', upscale: L('DLSS 2（RTX 型号）', 'DLSS 2 (RTX models)', 'DLSS 2（RTX モデル）'), encoder: L('NVENC 第 7 代：HEVC B 帧', 'NVENC gen 7: HEVC B-frames', 'NVENC 第7世代：HEVC B フレーム'), api: 'DirectX 12 Ultimate (RTX) / CUDA 7.5' },
  pascal: { arch: 'Pascal', process: 'TSMC 16nm FinFET', pcie: 'PCIe 3.0 ×16', upscale: L('—（可用 FSR / XeSS DP4a）', '— (FSR / XeSS DP4a usable)', '—（FSR / XeSS DP4a 利用可）'), encoder: L('NVENC 第 6 代：HEVC 10-bit', 'NVENC gen 6: HEVC 10-bit', 'NVENC 第6世代：HEVC 10-bit'), api: 'DirectX 12 (FL 12_1) / CUDA 6.x' },
  maxwell: { arch: 'Maxwell', process: 'TSMC 28nm', pcie: 'PCIe 3.0 ×16', upscale: '—', encoder: L('NVENC 第 5 代：HEVC', 'NVENC gen 5: HEVC', 'NVENC 第5世代：HEVC'), api: 'DirectX 12 (FL 12_1) / CUDA 5.x' },
  kepler: { arch: 'Kepler', process: 'TSMC 28nm', pcie: 'PCIe 3.0 ×16', upscale: '—', encoder: L('NVENC 第 1 代：H.264', 'NVENC gen 1: H.264', 'NVENC 第1世代：H.264'), api: 'DirectX 12 (FL 11_0) / CUDA 3.x' },
  fermi: { arch: 'Fermi', process: 'TSMC 40nm', pcie: 'PCIe 2.0 ×16', upscale: '—', encoder: decodeOnly, api: 'DirectX 12 (FL 11_0) / CUDA 2.x' },
  tesla: { arch: 'Tesla (G8x / GT200)', process: 'TSMC 65nm / 55nm', pcie: 'PCIe 2.0 ×16', upscale: '—', encoder: L('PureVideo HD（仅解码）', 'PureVideo HD (decode only)', 'PureVideo HD（デコードのみ）'), api: 'DirectX 10 / OpenGL 3.3 / CUDA 1.x' },
  rdna4: { arch: 'RDNA 4', process: 'TSMC N4P', pcie: 'PCIe 5.0 ×16', upscale: L('FSR 4（AI 超采样）', 'FSR 4 (AI upscaling)', 'FSR 4（AI アップスケール）'), encoder: 'VCN 5: AV1 / HEVC', api: 'DirectX 12 Ultimate / Vulkan / ROCm' },
  rdna3: { arch: 'RDNA 3', process: 'TSMC N5 + N6 (MCD)', pcie: 'PCIe 4.0 ×16', upscale: L('FSR 3.1（帧生成）', 'FSR 3.1 (frame generation)', 'FSR 3.1（フレーム生成）'), encoder: 'VCN 4: AV1 / HEVC', api: 'DirectX 12 Ultimate / Vulkan' },
  'rdna3.5': { arch: 'RDNA 3.5', process: 'TSMC N4P', pcie: L('集成（共享 CPU 通道）', 'Integrated (shares CPU lanes)', '内蔵（CPU レーン共有）'), upscale: 'FSR 3.1', encoder: 'VCN 4: AV1', api: 'DirectX 12 Ultimate' },
  rdna2: { arch: 'RDNA 2', process: 'TSMC N7', pcie: L('PCIe 4.0 ×16（6600 为 ×8）', 'PCIe 4.0 ×16 (×8 on the 6600)', 'PCIe 4.0 ×16（6600 は ×8）'), upscale: L('FSR 3.1（帧生成）', 'FSR 3.1 (frame generation)', 'FSR 3.1（フレーム生成）'), encoder: L('VCN 3：HEVC（无 AV1 编码）', 'VCN 3: HEVC (no AV1 encode)', 'VCN 3：HEVC（AV1 エンコードなし）'), api: 'DirectX 12 Ultimate' },
  rdna: { arch: 'RDNA', process: 'TSMC N7', pcie: 'PCIe 4.0 ×16', upscale: 'FSR 3.1', encoder: 'VCN 2: HEVC', api: 'DirectX 12 (FL 12_1) / Vulkan' },
  vega: { arch: 'GCN 5 (Vega)', process: 'GF 14nm', pcie: 'PCIe 3.0 ×16', upscale: 'FSR 2', encoder: 'VCE 4: HEVC', api: 'DirectX 12 (FL 12_1) / Vulkan' },
  polaris: { arch: 'GCN 4 (Polaris)', process: 'GF 14nm', pcie: 'PCIe 3.0 ×16', upscale: 'FSR 2', encoder: 'VCE 3.4: H.264 / HEVC', api: 'DirectX 12 (FL 12_0) / Vulkan' },
  gcn: { arch: 'GCN 1–3', process: 'TSMC 28nm', pcie: 'PCIe 3.0 ×16', upscale: L('—（FSR 1/2 可用）', '— (FSR 1/2 usable)', '—（FSR 1/2 利用可）'), encoder: 'VCE: H.264', api: 'DirectX 12 (FL 12_0) / Vulkan' },
  terascale: { arch: 'TeraScale (VLIW5 / VLIW4)', process: 'TSMC 55nm / 40nm', pcie: 'PCIe 2.0 ×16', upscale: '—', encoder: L('UVD（仅解码）', 'UVD (decode only)', 'UVD（デコードのみ）'), api: 'DirectX 10.1 / 11' },
  xe2: { arch: 'Xe2 (Battlemage)', process: 'TSMC N5 / N3B', pcie: L('PCIe 4.0 ×8（B580）', 'PCIe 4.0 ×8 (B580)', 'PCIe 4.0 ×8（B580）'), upscale: L('XeSS 2（帧生成）', 'XeSS 2 (frame generation)', 'XeSS 2（フレーム生成）'), encoder: 'AV1 / HEVC / VP9', api: 'DirectX 12 Ultimate / oneAPI' },
  xe: { arch: 'Xe (Alchemist)', process: 'TSMC N6', pcie: 'PCIe 4.0 ×16', upscale: 'XeSS 1.3', encoder: 'AV1 / HEVC', api: L('DirectX 12 Ultimate（需 Resizable BAR）', 'DirectX 12 Ultimate (Resizable BAR required)', 'DirectX 12 Ultimate（Resizable BAR 必須）') as unknown as string },
  'apple-m4': { arch: 'Apple GPU (M4)', process: 'TSMC N3E', pcie: L('集成（统一内存）', 'Integrated (unified memory)', '内蔵（ユニファイドメモリ）'), upscale: 'MetalFX', encoder: L('ProRes / HEVC / AV1 解码', 'ProRes / HEVC / AV1 decode', 'ProRes / HEVC / AV1 デコード'), api: 'Metal 3' },
  'snapdragon-x': { arch: 'Adreno X1', process: 'TSMC N4', pcie: L('集成', 'Integrated', '内蔵'), upscale: '—', encoder: 'AV1 / HEVC', api: 'DirectX 12 (FL 12_1)' },
}

function powerConnector(g: Gpu): L3 {
  if (g.form !== 'desktop') return L('—', '—', '—')
  if (g.brand === 'NVIDIA' && (g.gen === 'blackwell' || g.gen === 'ada')) {
    if (g.tdp_w >= 200 || (g.gen === 'blackwell' && g.tdp_w >= 180)) { const n = g.tdp_w >= 450 ? 4 : g.tdp_w >= 300 ? 3 : 2; return L(`1× 12V-2x6 (16-pin)，随附 ${n}× 8-pin 转接线`, `1× 12V-2x6 (16-pin), ${n}× 8-pin adapter included`, `1× 12V-2x6（16-pin）、${n}× 8-pin 変換ケーブル付属`) }
    return L('1× 8-pin PCIe（部分型号 12V-2x6）', '1× 8-pin PCIe (12V-2x6 on some models)', '1× 8-pin PCIe（一部モデルは 12V-2x6）')
  }
  if (g.tdp_w >= 300) return g.gen === 'tesla' || g.gen === 'fermi' ? L('1× 8-pin + 1× 6-pin PCIe', '1× 8-pin + 1× 6-pin PCIe', '1× 8-pin + 1× 6-pin PCIe') : L('3× 8-pin PCIe', '3× 8-pin PCIe', '3× 8-pin PCIe')
  if (g.tdp_w >= 200) return L('2× 8-pin PCIe', '2× 8-pin PCIe', '2× 8-pin PCIe')
  if (g.tdp_w >= 130) return L('1× 8-pin PCIe', '1× 8-pin PCIe', '1× 8-pin PCIe')
  return L('1× 8-pin 或 6-pin PCIe', '1× 8-pin or 6-pin PCIe', '1× 8-pin または 6-pin PCIe')
}
function recommendedPsu(tdp: number): L3 {
  const w = tdp >= 500 ? 1000 : tdp >= 350 ? 850 : tdp >= 280 ? 750 : tdp >= 220 ? 650 : tdp >= 160 ? 550 : 450
  return L(`${w}W 起（${tdp}W TBP + 主流 CPU，留 30% 余量）`, `${w}W+ (${tdp}W TBP + mainstream CPU, 30% headroom)`, `${w}W 以上（${tdp}W TBP + 主流 CPU、余裕 30%）`)
}
function slotSize(tdp: number): L3 {
  if (tdp >= 400) return L('3–4 槽，长度 300–340mm，注意机箱与主板下方 M.2', '3–4 slots, 300–340 mm long; check case and M.2 clearance', '3–4 スロット、長さ 300–340mm。ケースと M.2 の干渉に注意')
  if (tdp >= 250) return L('2.5–3 槽，长度 280–320mm', '2.5–3 slots, 280–320 mm', '2.5–3 スロット、280–320mm')
  if (tdp >= 160) return L('2–2.5 槽，长度 240–300mm', '2–2.5 slots, 240–300 mm', '2–2.5 スロット、240–300mm')
  return L('2 槽，长度 170–250mm，多数 ITX 可用', '2 slots, 170–250 mm, fits most ITX', '2 スロット、170–250mm。多くの ITX に対応')
}

export function gpuPlatform(g: Gpu): Row[] {
  const rows: Row[] = []
  const a = GPU_GEN[g.gen]
  if (a) {
    rows.push(row(LBL.archProc, `${a.arch} · ${a.process}`))
    const pcieStr = pick(a.pcie)
    rows.push(row(LBL.bus, a.pcie, g.form === 'desktop' && pcieStr.includes('5.0') ? L('插 PCIe 4.0 主板亦可，损失 <2%', 'Works in PCIe 4.0 boards with <2% loss', 'PCIe 4.0 ボードでも損失 2% 未満') : undefined))
    rows.push(row(LBL.upscale, a.upscale), row(LBL.enc, a.encoder), row(LBL.api, a.api))
  }
  if (g.form === 'desktop') {
    const conn = powerConnector(g)
    rows.push(row(LBL.conn, conn, conn[0].includes('12V-2x6') ? L('需 ATX 3.1 电源原生线或转接线，插紧到底', 'Needs an ATX 3.1 native cable or adapter; seat it fully', 'ATX 3.1 ネイティブケーブルか変換が必要。奥まで確実に挿す') : undefined))
    rows.push(row(LBL.psu, recommendedPsu(g.tdp_w)), row(LBL.size, slotSize(g.tdp_w), L('以各家非公版为准', 'Varies by AIB model', 'AIB モデルにより異なる')))
  } else if (g.form === 'laptop') {
    rows.push(row(LBL.tgp, g.tgp_range ?? `${g.tgp_w ?? g.tdp_w}W`, L('本条目按标注功耗档评分；低功耗版本请看同名其他条目', 'Scored at the listed power tier; see other same-name entries for lower TGPs', 'この項目は記載の電力帯で評価。低 TGP 版は同名の別項目を参照')))
    rows.push(row(LBL.display, L('视机型：MUX 独显直连 / Advanced Optimus 影响帧率 5–15%', 'Model-dependent: MUX switch / Advanced Optimus affects fps by 5–15%', '機種依存：MUX 直結 / Advanced Optimus で fps が 5–15% 変動')))
  } else {
    rows.push(row(LBL.vram, L(`共享系统内存（${g.vram_type}）`, `Shared system memory (${g.vram_type})`, `システムメモリ共有（${g.vram_type}）`), L('实际可用取决于系统内存容量与带宽', 'Usable amount depends on system memory size and bandwidth', '実際の容量はシステムメモリ量と帯域次第')))
  }
  return rows
}

/* ---------- RAM ---------- */
export function ramPlatform(r: Ram): Row[] {
  const rows: Row[] = []
  if (r.form === 'kit-desktop') {
    rows.push(row(LBL.slot, r.type === 'DDR5' ? L('DIMM 288-pin（DDR5 缺口位置与 DDR4 不同，不可互插）', 'DIMM 288-pin (DDR5 key differs from DDR4, not interchangeable)', 'DIMM 288-pin（DDR5 は切り欠き位置が DDR4 と異なり非互換）') : L('DIMM 288-pin（DDR4）', 'DIMM 288-pin (DDR4)', 'DIMM 288-pin（DDR4）')))
    rows.push(row(LBL.oc, r.type === 'DDR5' ? L('XMP 3.0 (Intel) / EXPO (AMD)，请确认主板支持', 'XMP 3.0 (Intel) / EXPO (AMD); check board support', 'XMP 3.0（Intel）/ EXPO（AMD）。ボード対応を確認') : L('XMP 2.0（AMD 主板亦可读取）', 'XMP 2.0 (AMD boards can read it too)', 'XMP 2.0（AMD ボードでも読める）')))
    rows.push(row(LBL.volt, r.type === 'DDR5' ? (r.speed_mt >= 7000 ? L('1.40–1.45V（高频）', '1.40–1.45 V (high speed)', '1.40–1.45V（高クロック）') : r.speed_mt >= 6000 ? '1.35V' : '1.10V (JEDEC)') : r.speed_mt >= 3600 ? '1.35V' : '1.20V'))
    rows.push(row(LBL.platform, r.type === 'DDR5' ? (r.speed_mt > 6400 ? L('Intel Z790 / Z890 双条易达；AM5 需 UCLK 分频，6000–6400 更稳', 'Easy on Intel Z790 / Z890 with two sticks; AM5 needs a UCLK divider, 6000–6400 is safer', 'Intel Z790 / Z890 なら 2 枚で容易。AM5 は UCLK 分周が必要で 6000–6400 が無難') : L('AM5 甜点（1:1 UCLK）/ Intel 通用', 'AM5 sweet spot (1:1 UCLK) / fine on Intel', 'AM5 の定番（UCLK 1:1）/ Intel でも可')) : L('AM4 / Intel 12–14 代 DDR4 主板', 'AM4 / Intel 12th–14th gen DDR4 boards', 'AM4 / Intel 第12–14世代 DDR4 ボード')))
    rows.push(row(LBL.four, L('四条 DDR5 会显著降频，建议双条大容量', 'Four DDR5 sticks drop speed a lot; prefer two large sticks', 'DDR5 4 枚はクロックが大きく低下。大容量 2 枚を推奨')))
  } else if (r.form === 'sodimm') {
    rows.push(row(LBL.slot, `SO-DIMM 262-pin (${r.type})`, L('与桌面 DIMM 不通用；确认笔记本有插槽而非板载', 'Not interchangeable with desktop DIMMs; make sure the laptop has slots, not soldered memory', 'デスクトップ DIMM と非互換。ノートにスロットがあるか（オンボードでないか）確認')))
    rows.push(row(LBL.oc, r.speed_mt > 5600 ? L('XMP 3.0 / EXPO，仅部分游戏本支持', 'XMP 3.0 / EXPO, only some gaming laptops support it', 'XMP 3.0 / EXPO。一部ゲーミングノートのみ対応') : L('JEDEC 默认即可', 'JEDEC default is fine', 'JEDEC 既定で可')))
  } else {
    rows.push(row(LBL.pkg, L('LPDDR 板载 / 封装内（BGA）', 'LPDDR onboard / on-package (BGA)', 'LPDDR オンボード / パッケージ内（BGA）'), L('购机时选定容量，之后无法升级', 'Capacity is fixed at purchase; no upgrades', '購入時に容量確定。増設不可')))
    rows.push(row(L('位宽', 'Bus width', 'バス幅'), r.spec.includes('512') ? '512-bit' : r.spec.includes('256') ? '256-bit' : '128-bit'))
  }
  return rows
}

/* ---------- Storage ---------- */
export function storagePlatform(s: Storage): Row[] {
  const rows: Row[] = []
  if (s.form === 'nvme') {
    rows.push(row(LBL.spec, 'M.2 2280 M-Key, NVMe 2.0'))
    rows.push(row(LBL.iface, s.interface === 'pcie5' ? L('PCIe 5.0 ×4（AM5 / LGA1700+ 第一根 M.2）', 'PCIe 5.0 ×4 (first M.2 on AM5 / LGA1700+)', 'PCIe 5.0 ×4（AM5 / LGA1700 以降の第1 M.2）') : s.interface === 'pcie4' ? L('PCIe 4.0 ×4（向下兼容 3.0）', 'PCIe 4.0 ×4 (backward compatible with 3.0)', 'PCIe 4.0 ×4（3.0 に下位互換）') : 'PCIe 3.0 ×4'))
    rows.push(row(LBL.cool, s.interface === 'pcie5' ? L('必须散热片，最好主板自带或主动风扇；裸盘会过热降速', 'Heatsink required, ideally the board\'s own or active cooling; bare drives throttle', 'ヒートシンク必須。マザー付属か能動冷却が望ましい。裸だとサーマルスロットリング') : L('建议主板自带散热片；无则可裸装', 'Board heatsink recommended; bare install is acceptable', 'マザー付属ヒートシンク推奨。なければ裸でも可')))
    rows.push(row(LBL.dram, s.dram ? L('有独立 DRAM', 'Dedicated DRAM', '独立 DRAM あり') : L('无 DRAM（HMB 借用内存）', 'DRAM-less (HMB uses system memory)', 'DRAM なし（HMB でシステムメモリ利用）'), s.dram ? undefined : L('随机小文件与满盘性能稍弱', 'Slightly weaker random small-file and full-drive performance', 'ランダム小ファイルと満杯時の性能がやや劣る')))
    rows.push(row(LBL.compat, L('PS5 扩展需 PCIe 4.0+ 且带散热片，高度 ≤11.25mm；笔记本请确认单面/双面', 'PS5 needs PCIe 4.0+ with a heatsink, ≤11.25 mm tall; check single/double-sided for laptops', 'PS5 は PCIe 4.0 以上 + ヒートシンク、高さ 11.25mm 以下。ノートは片面/両面を確認')))
  } else if (s.form === 'sata') {
    rows.push(row(LBL.spec, '2.5" 7mm, SATA III 6Gb/s'))
    rows.push(row(LBL.iface, L('任意 SATA 口，速度上限约 560 MB/s', 'Any SATA port, ~560 MB/s ceiling', '任意の SATA ポート。上限約 560 MB/s')))
    rows.push(row(LBL.use, L('老平台升级、笔记本 2.5 寸位、数据仓库', 'Older platform upgrades, 2.5" laptop bays, bulk storage', '旧プラットフォーム更新、ノート 2.5 インチベイ、データ倉庫')))
  } else {
    rows.push(row(LBL.spec, '3.5", SATA III 6Gb/s'))
    rows.push(row(LBL.rec, s.nand?.includes('SMR') ? L('SMR 叠瓦：随机写入慢，不宜 NAS / RAID', 'SMR: slow random writes, unsuitable for NAS / RAID', 'SMR：ランダム書込が遅く NAS / RAID に不向き') : L('CMR 垂直：适合 NAS / RAID', 'CMR: suitable for NAS / RAID', 'CMR：NAS / RAID に適する')))
    rows.push(row(LBL.note, L('需机箱 3.5 寸位与 SATA 供电；氦气盘噪音与振动较大，NAS 建议同型号多块', 'Needs a 3.5" bay and SATA power; helium drives are louder; use matching drives in a NAS', '3.5 インチベイと SATA 電源が必要。ヘリウム充填は騒音・振動大。NAS は同型番で揃える')))
  }
  if (s.tbw) { const n = (s.tbw / s.capacity_gb * 1000).toFixed(0); rows.push(row(LBL.endurance, L(`${n} 次全盘写入（TBW ÷ 容量）`, `${n} full-drive writes (TBW ÷ capacity)`, `全容量書込 ${n} 回（TBW ÷ 容量）`))) }
  return rows
}

/* ---------- PSU ---------- */
export function psuPlatform(p: Psu): Row[] {
  const rows: Row[] = []
  rows.push(row(LBL.spec, p.form === 'sfx' ? L('SFX（125×63.5×100mm），配 ATX 转接板可装普通机箱', 'SFX (125×63.5×100 mm); fits ATX cases with a bracket', 'SFX（125×63.5×100mm）。ブラケットで ATX ケースにも搭載可') : L('ATX（150×86×140–160mm）', 'ATX (150×86×140–160 mm)', 'ATX（150×86×140–160mm）')))
  rows.push(row(LBL.gpuPower, p.atx31 ? L('原生 12V-2x6 (16-pin) 一条 + 多个 8-pin', 'One native 12V-2x6 (16-pin) plus several 8-pin', 'ネイティブ 12V-2x6（16-pin）1 本 + 8-pin 複数') : p.watt >= 750 ? L('8-pin ×4+；上 40/50 系需 12VHPWR 转接线', '4+ 8-pin; 40/50-series needs a 12VHPWR adapter', '8-pin ×4 以上。40/50 系は 12VHPWR 変換が必要') : L('8-pin ×2–4', '2–4× 8-pin', '8-pin ×2–4')))
  rows.push(row(LBL.standard, p.atx31 ? L('ATX 3.1 / PCIe 5.1：承受 200% 瞬时峰值，12V-2x6 感应针脚更短更安全', 'ATX 3.1 / PCIe 5.1: handles 200% transient peaks; shorter 12V-2x6 sense pins are safer', 'ATX 3.1 / PCIe 5.1：200% の瞬間ピークに対応。12V-2x6 のセンスピン短縮で安全') : L('ATX 2.x / 3.0：注意 40/50 系高瞬时功耗', 'ATX 2.x / 3.0: mind 40/50-series transient spikes', 'ATX 2.x / 3.0：40/50 系の瞬間電力に注意')))
  const cls = p.watt >= 1000 ? 'RTX 5090 / 4090' : p.watt >= 850 ? 'RTX 5080 / 4080 / RX 9070 XT' : p.watt >= 750 ? 'RTX 5070 Ti / RX 7900 XT' : p.watt >= 650 ? 'RTX 5070 / RX 9070' : 'RTX 5060 / RX 7600'
  rows.push(row(LBL.carry, L(`${cls} 级`, `${cls} class`, `${cls} クラス`)))
  rows.push(row(LBL.modular, p.modular === 'full' ? L('全模组：所有线材可拆，理线方便', 'Fully modular: all cables detach, easy cable management', 'フルモジュラー：全ケーブル着脱可、配線が容易') : p.modular === 'semi' ? L('半模组：24-pin / CPU 固定', 'Semi-modular: 24-pin / CPU fixed', 'セミモジュラー：24-pin / CPU 固定') : L('非模组：线材固定，理线困难', 'Non-modular: fixed cables, harder to manage', '直出し：ケーブル固定、配線しにくい')))
  if (p.tier === 'D') rows.push(row(LBL.risk, L('标称功率与真实能力可能不符，不建议搭配独立显卡', 'Rated wattage may not reflect real capability; not recommended with a discrete GPU', '表記 W 数と実力が一致しない可能性。dGPU との組み合わせは非推奨')))
  return rows
}
