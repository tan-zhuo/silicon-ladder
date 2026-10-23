/** 选购指南内容（三语）。picks 引用产品 id，页面自动带出名称与分数。 */
import type { Category } from '@/types/hardware'
export type L3 = [string, string, string]
const L = (zh: string, en: string, ja: string): L3 => [zh, en, ja]
export interface Pick { cat: Category; id: string; why: L3 }
export interface Build { title: L3; budget: L3; desc: L3; picks: Pick[]; cooler?: L3; case?: L3 }
export interface Table { title?: L3; head: L3[]; rows: L3[][] }
export interface Section { id: string; title: L3; intro: L3; builds?: Build[]; table?: Table; tables?: Table[]; bullets?: L3[]; checklist?: L3[] }

export const GUIDE: Section[] = [
  {
    id: 'budget', title: L('按预算装游戏台式机', 'Gaming desktop by budget', '予算別ゲーミングデスクトップ'),
    intro: L('四档预算各给一套配置。原则：显卡占总预算 35–45%，CPU 不拖累显卡即可；电源留 30% 余量；SSD 至少 1TB。', 'Four budget tiers. Rules of thumb: GPU takes 35–45% of the budget, the CPU only needs to keep up; 30% PSU headroom; at least 1TB SSD.', '4段階の予算。目安：GPU が予算の 35–45%、CPU は GPU の足を引っ張らない程度、電源は 30% 余裕、SSD は 1TB 以上。'),
    builds: [
      { title: L('入门 1080p', 'Entry 1080p', '入門 1080p'), budget: L('约 ¥4,000–5,000', '~¥4,000–5,000', '約 ¥4,000–5,000'), desc: L('主流网游与 1080p 3A 中高画质。', 'Esports and 1080p AAA at medium-high.', 'eスポーツと 1080p AAA 中〜高設定。'),
        picks: [{ cat: 'cpu', id: 'amd-ryzen-5-7500f', why: L('无核显六核，游戏够用', 'Six cores, no iGPU, enough for gaming', '内蔵GPUなし6コア、ゲームには十分') }, { cat: 'gpu', id: 'amd-rx-6600', why: L('千元档 1080p 王者', 'Budget 1080p king', '低価格帯 1080p の王者') }, { cat: 'ram', id: 'gskill-flare-x5-ddr5-6000-cl30-32', why: L('AM5 甜点频率', 'AM5 sweet-spot speed', 'AM5 定番クロック') }, { cat: 'storage', id: 'lexar-nm790-2tb', why: L('无 DRAM 但表现好', 'DRAM-less yet strong', 'DRAM なしでも高性能') }, { cat: 'psu', id: 'deepcool-pn850m', why: L('B 档金牌，留足余量', 'Tier B Gold with headroom', 'Bティア Gold、余裕あり') }, { cat: 'mobo', id: 'msi-pro-b650-p-wifi', why: L('B650 入门够用，带 Wi-Fi', 'Entry B650 with Wi-Fi', '入門 B650、Wi-Fi 付き') }], cooler: L('单塔风冷（如 AK400）即可', 'Single-tower air cooler (e.g. AK400)', 'シングルタワー空冷（AK400 など）'), case: L('ATX / mATX 机箱均可，显卡 ≤ 250mm', 'ATX or mATX case; GPU ≤ 250 mm', 'ATX / mATX ケース、GPU ≤ 250mm') },
      { title: L('主流 1440p', 'Mainstream 1440p', '主流 WQHD'), budget: L('约 ¥8,000–10,000', '~¥8,000–10,000', '約 ¥8,000–10,000'), desc: L('2K 高刷，光追可开。', '1440p high refresh, RT usable.', 'WQHD 高リフレッシュ、RT も可。'),
        picks: [{ cat: 'cpu', id: 'amd-ryzen-7-9700x', why: L('65W 单核强', 'Strong single-core at 65W', '65W でシングル強力') }, { cat: 'gpu', id: 'amd-rx-9070', why: L('220W 能效最佳的 2K 卡', 'Most efficient 1440p card', '最も効率の良い WQHD カード') }, { cat: 'ram', id: 'corsair-vengeance-ddr5-6000-cl30-32', why: L('EXPO 一键', 'EXPO one-click', 'EXPO ワンクリック') }, { cat: 'storage', id: 'crucial-t500-2tb', why: L('PCIe 4.0 后期优秀盘', 'Excellent late PCIe 4.0', 'PCIe 4.0 後期の優秀品') }, { cat: 'psu', id: 'corsair-rm850x-2024', why: L('A 档，原生 12V-2x6', 'Tier A, native 12V-2x6', 'Aティア、ネイティブ 12V-2x6') }, { cat: 'mobo', id: 'msi-mag-b650-tomahawk-wifi', why: L('B 档经典，供电充足', 'Classic Tier B with solid VRM', '定番 B ティア、VRM 十分') }], cooler: L('双塔风冷或 240 水冷', 'Dual-tower air or 240 AIO', 'デュアルタワー空冷か 240 簡易水冷'), case: L('ATX 中塔，显卡 ≤ 320mm', 'ATX mid-tower; GPU ≤ 320 mm', 'ATX ミドルタワー、GPU ≤ 320mm') },
      { title: L('高端 1440p / 4K', 'High-end 1440p / 4K', 'ハイエンド WQHD / 4K'), budget: L('约 ¥14,000–18,000', '~¥14,000–18,000', '約 ¥14,000–18,000'), desc: L('游戏优先，兼顾直播与剪辑。', 'Gaming first, streaming and editing too.', 'ゲーム優先、配信と編集も。'),
        picks: [{ cat: 'cpu', id: 'amd-ryzen-7-9800x3d', why: L('当前游戏最强', 'Fastest gaming CPU', '現行ゲーム最速') }, { cat: 'gpu', id: 'nvidia-rtx-5070-ti', why: L('16GB，2K 高刷甜点', '16GB, 1440p high-refresh sweet spot', '16GB、WQHD 高リフレッシュの定番') }, { cat: 'ram', id: 'gskill-trident-z5-neo-ddr5-6000-cl30-64', why: L('64GB 大容量', '64GB capacity', '64GB 大容量') }, { cat: 'storage', id: 'samsung-990-pro-2tb', why: L('PCIe 4.0 天花板', 'PCIe 4.0 ceiling', 'PCIe 4.0 の天井') }, { cat: 'psu', id: 'seasonic-vertex-gx-1000', why: L('海韵自产，十年保', 'Seasonic in-house, 10-year warranty', 'Seasonic 自社製、10年保証') }, { cat: 'mobo', id: 'asus-rog-strix-b850-e-gaming-wifi', why: L('A 档 B850，两个 Gen5 M.2', 'Tier A B850 with two Gen5 M.2', 'A ティア B850、Gen5 M.2 ×2') }], cooler: L('360 水冷或高端双塔', '360 AIO or high-end dual tower', '360 簡易水冷か高級デュアルタワー'), case: L('ATX 中塔，预留 360 冷排位', 'ATX mid-tower with 360 radiator support', 'ATX ミドルタワー、360 ラジエーター対応') },
      { title: L('核显办公 / 影音', 'iGPU office / HTPC', '内蔵GPU オフィス / HTPC'), budget: L('约 ¥2,500–3,500', '~¥2,500–3,500', '約 ¥2,500–3,500'), desc: L('不配独显。核显办公、4K 影音、轻度修图；日后可加显卡。', 'No dGPU. Office, 4K media, light photo work; add a GPU later.', 'dGPU なし。オフィス・4K 動画・軽い写真編集。後から GPU 追加可。'),
        picks: [{ cat: 'cpu', id: 'amd-ryzen-5-8600g', why: L('RDNA3 核显可玩网游', 'RDNA3 iGPU handles esports', 'RDNA3 内蔵GPU でeスポーツ可') }, { cat: 'mobo', id: 'asus-prime-a620m-a', why: L('A620 够用，便宜', 'A620 is enough and cheap', 'A620 で十分、安価') }, { cat: 'ram', id: 'kingbank-heijin-ddr5-6000-cl30-32', why: L('核显吃带宽，上 6000', 'iGPU loves bandwidth: go 6000', '内蔵GPU は帯域重視、6000 を') }, { cat: 'storage', id: 'wd-blue-sn580-1tb', why: L('1TB 入门够用', '1TB entry is enough', '1TB 入門で十分') }, { cat: 'psu', id: 'deepcool-pn650m', why: L('650W 留给日后显卡', '650W leaves room for a GPU', '650W で将来の GPU に備える') }],
        cooler: L('盒装散热器或入门单塔', 'Stock or entry single-tower', '付属クーラーか入門シングルタワー'), case: L('mATX 小机箱', 'Small mATX case', 'mATX 小型ケース') },
      { title: L('ITX 小钢炮', 'ITX small form factor', 'ITX 小型機'), budget: L('约 ¥12,000–15,000', '~¥12,000–15,000', '約 ¥12,000–15,000'), desc: L('体积优先：ITX 主板 + SFX 电源 + 双槽显卡，注意散热器高度与显卡长度。', 'Size first: ITX board + SFX PSU + dual-slot GPU; watch cooler height and GPU length.', 'サイズ優先：ITX ボード + SFX 電源 + 2 スロット GPU。クーラー高と GPU 長に注意。'),
        picks: [{ cat: 'cpu', id: 'amd-ryzen-7-9800x3d', why: L('120W 游戏最强，小机箱友好', '120 W, fastest in games, SFF-friendly', '120W でゲーム最速、小型機向き') }, { cat: 'mobo', id: 'asus-rog-strix-b850-i-gaming-wifi', why: L('ITX B850，供电扎实', 'ITX B850 with strong VRM', 'ITX B850、VRM 良好') }, { cat: 'gpu', id: 'amd-rx-9070', why: L('220W 双槽可选多', '220 W, many dual-slot models', '220W、2 スロットモデル多数') }, { cat: 'ram', id: 'teamgroup-t-force-vulcan-ddr5-6000-cl30-32', why: L('矮条不挡散热器', 'Low profile, clears coolers', 'ロープロファイルで干渉なし') }, { cat: 'storage', id: 'wd-black-sn850x-2tb', why: L('单面颗粒，ITX 背面槽可用', 'Single-sided; fits rear M.2', '片面実装、背面 M.2 可') }, { cat: 'psu', id: 'corsair-sf750-2024', why: L('SFX A 档，原生 12V-2x6', 'SFX Tier A, native 12V-2x6', 'SFX A ティア、ネイティブ 12V-2x6') }],
        cooler: L('≤ 70mm 下压式或 240 水冷（看机箱）', '≤ 70 mm top-down or 240 AIO (case dependent)', '高さ 70mm 以下トップフローか 240 簡易水冷'), case: L('ITX 机箱 ≤ 20L，显卡 ≤ 300mm', 'ITX case ≤ 20 L; GPU ≤ 300 mm', 'ITX ケース 20L 以下、GPU ≤ 300mm') },
      { title: L('Intel 主流 1440p', 'Intel mainstream 1440p', 'Intel 主流 WQHD'), budget: L('约 ¥9,000–11,000', '~¥9,000–11,000', '約 ¥9,000–11,000'), desc: L('想要 Intel 平台的同档方案：Core Ultra 7 + B860，自带雷电 4。', 'The Intel take on the same tier: Core Ultra 7 + B860 with Thunderbolt 4 on board.', 'Intel 版の同クラス構成：Core Ultra 7 + B860、Thunderbolt 4 内蔵。'),
        picks: [{ cat: 'cpu', id: 'intel-core-ultra-7-265k', why: L('20 核，生产力强', '20 cores, strong productivity', '20 コア、生産性良好') }, { cat: 'mobo', id: 'msi-mag-b860-tomahawk-wifi', why: L('B860 够 265K 用', 'B860 handles the 265K', 'B860 で 265K 十分') }, { cat: 'gpu', id: 'nvidia-rtx-5070', why: L('12GB，DLSS 4 多帧', '12 GB with DLSS 4 MFG', '12GB、DLSS 4 MFG') }, { cat: 'ram', id: 'kingston-fury-renegade-ddr5-7200-cl38-32', why: L('Intel 吃高频，上 7200', 'Intel scales with speed: 7200', 'Intel は高クロック向き、7200 を') }, { cat: 'storage', id: 'crucial-t500-2tb', why: L('PCIe 4.0 甜点', 'PCIe 4.0 sweet spot', 'PCIe 4.0 の定番') }, { cat: 'psu', id: 'msi-mag-a750gl-pcie5', why: L('750W 金牌，原生 16-pin', '750 W Gold, native 16-pin', '750W Gold、ネイティブ 16-pin') }],
        cooler: L('双塔风冷或 240 水冷', 'Dual-tower air or 240 AIO', 'デュアルタワー空冷か 240 簡易水冷'), case: L('ATX 中塔', 'ATX mid-tower', 'ATX ミドルタワー') },
      { title: L('旗舰 4K', 'Flagship 4K', 'フラッグシップ 4K'), budget: L('¥25,000+', '¥25,000+', '¥25,000+'), desc: L('不妥协。注意 5090 需要 1000W 以上 ATX 3.1 电源与大机箱。', 'No compromise. The 5090 needs a 1000W+ ATX 3.1 PSU and a large case.', '妥協なし。5090 は 1000W 以上の ATX 3.1 電源と大型ケースが必要。'),
        picks: [{ cat: 'cpu', id: 'amd-ryzen-9-9950x3d', why: L('游戏与生产力双旗舰', 'Gaming + productivity flagship', 'ゲームと生産性の両立') }, { cat: 'gpu', id: 'nvidia-rtx-5090', why: L('桌面最强', 'Fastest desktop card', 'デスクトップ最速') }, { cat: 'ram', id: 'gskill-trident-z5-neo-ddr5-6000-cl30-64', why: L('64GB，AM5 稳定', '64GB, stable on AM5', '64GB、AM5 で安定') }, { cat: 'storage', id: 'wd-black-sn8100-2tb', why: L('PCIe 5.0 综合最强', 'Best overall PCIe 5.0', 'PCIe 5.0 総合最強') }, { cat: 'psu', id: 'corsair-hx1200i-2023', why: L('1200W 白金，数字监控', '1200W Platinum with monitoring', '1200W Platinum、監視付き') }, { cat: 'mobo', id: 'asus-rog-crosshair-x870e-hero', why: L('旗舰 X870E，110A 供电', 'Flagship X870E with 110A stages', 'フラッグシップ X870E、110A') }], cooler: L('360 水冷（9950X3D 170W）', '360 AIO (9950X3D at 170 W)', '360 簡易水冷（9950X3D 170W）'), case: L('全塔或大中塔，显卡 ≥ 360mm 空间', 'Full tower or large mid-tower; GPU clearance ≥ 360 mm', 'フルタワーか大型ミドル、GPU 360mm 以上') },
    ],
  },
  {
    id: 'work', title: L('按用途：生产力', 'By workload: productivity', '用途別：生産性'),
    intro: L('生产力看多核、内存容量与显存，而不是游戏分。', 'Productivity is about cores, memory capacity and VRAM, not gaming scores.', '生産性はコア数・メモリ容量・VRAM が重要で、ゲームスコアではない。'),
    builds: [
      { title: L('视频剪辑 / 调色', 'Video editing / grading', '動画編集 / カラーグレーディング'), budget: L('—', '—', '—'), desc: L('多核 + 大显存 + 快缓外写入的素材盘。Intel 核显 QSV 对 H.264/HEVC 时间线有帮助。', 'Cores + big VRAM + a scratch drive with fast post-cache writes. Intel iGPU QSV helps H.264/HEVC timelines.', 'コア数 + 大容量 VRAM + キャッシュ外書込の速いスクラッチディスク。Intel 内蔵GPU の QSV は H.264/HEVC タイムラインに有効。'),
        picks: [{ cat: 'cpu', id: 'intel-core-ultra-9-285k', why: L('多核最强 Intel，带 QSV', 'Strongest Intel multi-core with QSV', 'Intel 最強マルチ、QSV 付き') }, { cat: 'gpu', id: 'nvidia-rtx-4090', why: L('24GB，CUDA / NVENC 双编码器', '24GB, CUDA, dual NVENC', '24GB、CUDA、デュアル NVENC') }, { cat: 'storage', id: 'seagate-firecuda-530-2tb', why: L('TBW 2550 耐久', 'TBW 2550 endurance', 'TBW 2550 の耐久') }, { cat: 'mobo', id: 'msi-mpg-z890-carbon-wifi', why: L('Z890 Carbon，雷电 4 + 5GbE', 'Z890 Carbon, Thunderbolt 4 + 5GbE', 'Z890 Carbon、Thunderbolt 4 + 5GbE') }] },
      { title: L('3D 渲染 / 编译', '3D rendering / compiling', '3D レンダリング / コンパイル'), budget: L('—', '—', '—'), desc: L('线程越多越好，内存 64GB 起。', 'More threads is better; start at 64GB.', 'スレッドが多いほど良い。メモリは 64GB から。'),
        picks: [{ cat: 'cpu', id: 'amd-ryzen-9-9950x', why: L('16 核 32 线程', '16C/32T', '16コア32スレッド') }, { cat: 'ram', id: 'gskill-trident-z5-neo-ddr5-6000-cl30-64', why: L('64GB 双条', '64GB in two sticks', '64GB 2枚') }, { cat: 'gpu', id: 'nvidia-rtx-5080', why: L('Blender / Octane CUDA 加速', 'CUDA acceleration for Blender / Octane', 'Blender / Octane の CUDA 加速') }, { cat: 'mobo', id: 'asus-proart-x870e-creator-wifi', why: L('10GbE + USB4，四 M.2', '10GbE + USB4, four M.2', '10GbE + USB4、M.2 ×4') }] },
      { title: L('本地 AI 推理', 'Local AI inference', 'ローカル AI 推論'), budget: L('—', '—', '—'), desc: L('显存容量决定能跑多大的模型：8GB 7B-Q4，16GB 14B-Q4，24GB 32B-Q4，统一内存 128GB 可跑 70B。', 'VRAM size decides model size: 8GB → 7B Q4, 16GB → 14B Q4, 24GB → 32B Q4, 128GB unified memory → 70B.', 'VRAM 容量でモデルサイズが決まる：8GB→7B Q4、16GB→14B Q4、24GB→32B Q4、ユニファイド 128GB→70B。'),
        picks: [{ cat: 'gpu', id: 'nvidia-rtx-4090', why: L('24GB，CUDA 生态最成熟', '24GB, most mature CUDA ecosystem', '24GB、CUDA エコシステム最成熟') }, { cat: 'gpu', id: 'nvidia-rtx-5060-ti-16gb', why: L('最便宜的 16GB N 卡', 'Cheapest 16GB NVIDIA card', '最安の 16GB NVIDIA') }, { cat: 'cpu', id: 'amd-ryzen-ai-max-395', why: L('128GB 统一内存跑 70B', '128GB unified memory runs 70B', 'ユニファイド 128GB で 70B') }] },
    ],
  },
  {
    id: 'laptop', title: L('笔记本', 'Laptops', 'ノート PC'),
    intro: L('笔记本先看形态再看芯片：同一颗 CPU/GPU 在不同机型可以差 30% 以上。看清 TGP、功耗墙、是否有独显直连。', 'Pick the form factor first: the same CPU/GPU can differ 30%+ between models. Check TGP, power limits and MUX switch.', 'まずフォームファクタ、次にチップ。同じ CPU/GPU でも機種差 30% 以上。TGP・電力制限・MUX を確認。'),
    builds: [
      { title: L('轻薄办公（续航优先）', 'Thin & light (battery first)', '薄型（バッテリー優先）'), budget: L('—', '—', '—'), desc: L('看能效与核显，不看桌面榜。', 'Efficiency and iGPU matter, not the desktop chart.', '効率と内蔵GPU を見る。'),
        picks: [{ cat: 'cpu', id: 'apple-m4-10', why: L('单核与能效双第一', 'Top single-core and efficiency', 'シングルと効率で首位') }, { cat: 'cpu', id: 'intel-core-ultra-7-258v', why: L('x86 续航最好', 'Best x86 battery life', 'x86 で最長バッテリー') }, { cat: 'cpu', id: 'amd-ryzen-ai-9-hx-370', why: L('x86 核显最强', 'Strongest x86 iGPU', 'x86 最強内蔵GPU') }] },
      { title: L('全能本', 'All-rounder', '汎用ノート'), budget: L('—', '—', '—'), desc: L('标压 CPU + 中 TGP 独显，兼顾便携。', 'Standard-voltage CPU + mid-TGP dGPU, still portable.', '標準電圧 CPU + 中 TGP dGPU、携帯性も。'),
        picks: [{ cat: 'cpu', id: 'intel-core-ultra-7-255h', why: L('均衡', 'Balanced', 'バランス型') }, { cat: 'gpu', id: 'nvidia-rtx-5070-laptop-80w', why: L('80W 版 1080p 畅玩', '80W version plays 1080p', '80W 版で 1080p 快適') }, { cat: 'ram', id: 'kingston-fury-impact-ddr5-6400-sodimm-32', why: L('可升级机型首选', 'For upgradeable models', '増設可能機向け') }] },
      { title: L('游戏本（性能优先）', 'Gaming laptop (performance first)', 'ゲーミングノート（性能優先）'), budget: L('—', '—', '—'), desc: L('一定看 TGP：满血 140–175W 与 80–100W 差 20–40%。', 'Always check TGP: 140–175W full power vs 80–100W differs 20–40%.', '必ず TGP を確認：140–175W と 80–100W で 20–40% 差。'),
        picks: [{ cat: 'cpu', id: 'amd-ryzen-9-9955hx', why: L('桌面级 16 核', 'Desktop-class 16 cores', 'デスクトップ級 16コア') }, { cat: 'gpu', id: 'nvidia-rtx-5080-laptop-150w', why: L('高 TGP 满血', 'Full-power high TGP', '高 TGP フルパワー') }, { cat: 'gpu', id: 'nvidia-rtx-4060-laptop-140w', why: L('性价比之选', 'Value pick', 'コスパ選択') }] },
    ],
  },
  {
    id: 'upgrade', title: L('升级路线', 'Upgrade paths', 'アップグレード経路'),
    intro: L('先判断瓶颈：游戏 1080p 高刷看 CPU，2K/4K 看显卡；卡顿看内存与硬盘。', 'Find the bottleneck first: 1080p high refresh → CPU, 1440p/4K → GPU, stutter → memory and storage.', 'まずボトルネック判定：1080p 高リフレッシュは CPU、WQHD/4K は GPU、カクつきはメモリとストレージ。'),
    builds: [
      { title: L('AM4 老平台', 'Older AM4 platform', '旧 AM4 プラットフォーム'), budget: L('—', '—', '—'), desc: L('换 U 不换板：B450/B550 刷 BIOS 上 5700X3D，比换整套划算得多。', 'Swap the CPU, keep the board: flash B450/B550 and drop in a 5700X3D — far cheaper than a new platform.', 'CPU だけ交換：B450/B550 を BIOS 更新して 5700X3D。プラットフォーム一新より格安。'),
        picks: [{ cat: 'cpu', id: 'amd-ryzen-7-5700x3d', why: L('AM4 最后的游戏 U', 'AM4\'s last gaming CPU', 'AM4 最後のゲーム CPU') }, { cat: 'storage', id: 'samsung-970-evo-plus-1tb', why: L('PCIe 3.0 也够用', 'PCIe 3.0 is enough', 'PCIe 3.0 で十分') }, { cat: 'mobo', id: 'msi-mag-b550-tomahawk', why: L('B550 经典，刷 BIOS 即上', 'Classic B550, flash and go', '定番 B550、BIOS 更新で対応') }] },
      { title: L('Intel 12 代主板', 'Intel 12th-gen board', 'Intel 第12世代ボード'), budget: L('—', '—', '—'), desc: L('Z690/B660 刷 BIOS 可上 14 代；注意 13/14 代 K 系列微码 0x12B。', 'Z690/B660 take 14th gen with a BIOS update; mind microcode 0x12B on 13th/14th-gen K parts.', 'Z690/B660 は BIOS 更新で第14世代対応。13/14 世代 K はマイクロコード 0x12B に注意。'),
        picks: [{ cat: 'cpu', id: 'intel-core-i5-14600k', why: L('LGA1700 甜点', 'LGA1700 sweet spot', 'LGA1700 の定番') }, { cat: 'mobo', id: 'msi-mag-b760-tomahawk-wifi', why: L('B760 够 14600K', 'B760 handles the 14600K', 'B760 で 14600K 十分') }] },
      { title: L('该换平台了吗？', 'Time for a new platform?', 'プラットフォーム更新の時期？'), budget: L('—', '—', '—'), desc: L('如果还是 DDR3 / PCIe 2.0（Haswell 及更早），换任何一颗新 U 都意味着换板换内存，直接看主流 1440p 配置。', 'If you are still on DDR3 / PCIe 2.0 (Haswell or older), any new CPU means new board + memory — go straight to the mainstream 1440p build.', 'DDR3 / PCIe 2.0（Haswell 以前）なら CPU 交換＝ボードとメモリも交換。主流 WQHD 構成へ。'),
        picks: [{ cat: 'cpu', id: 'amd-ryzen-5-9600x', why: L('AM5 入门，可再升级', 'AM5 entry with upgrade room', 'AM5 入門、将来性あり') }, { cat: 'ram', id: 'gskill-flare-x5-ddr5-6000-cl30-32', why: L('32GB 起步', 'Start at 32GB', '32GB から') }, { cat: 'mobo', id: 'asus-tuf-gaming-b850-plus-wifi', why: L('B850 新平台入门', 'Entry to the B850 platform', 'B850 新プラットフォーム入門') }] },
    ],
  },
  {
    id: 'assembly', title: L('组装规格速查', 'Build specs reference', '組立スペック早見'),
    intro: L('装机时最常翻的几张表：平台对照、电源功率、散热器、机箱尺寸与内存配置。', 'The tables you look up most while building: platforms, PSU sizing, coolers, case dimensions and memory configs.', '組立時によく参照する表：プラットフォーム、電源容量、クーラー、ケース寸法、メモリ構成。'),
    tables: [
      { title: L('平台对照', 'Platform comparison', 'プラットフォーム比較'),
        head: [L('插槽', 'Socket', 'ソケット'), L('CPU', 'CPU', 'CPU'), L('内存', 'Memory', 'メモリ'), L('芯片组梯队', 'Chipset ladder', 'チップセット'), L('PCIe', 'PCIe', 'PCIe'), L('升级空间', 'Upgrade room', '将来性')],
        rows: [
          [L('AM5', 'AM5', 'AM5'), L('Ryzen 7000 / 8000 / 9000', 'Ryzen 7000 / 8000 / 9000', 'Ryzen 7000 / 8000 / 9000'), L('DDR5，甜点 6000 CL30', 'DDR5, sweet spot 6000 CL30', 'DDR5、定番 6000 CL30'), L('X870E > X870 ≈ B850 > B650E > B650 > B840 / A620', 'X870E > X870 ≈ B850 > B650E > B650 > B840 / A620', 'X870E > X870 ≈ B850 > B650E > B650 > B840 / A620'), L('5.0 ×16 + ×4', '5.0 ×16 + ×4', '5.0 ×16 + ×4'), L('承诺至 2027+', 'Supported through 2027+', '2027 年以降も')],
          [L('LGA1851', 'LGA1851', 'LGA1851'), L('Core Ultra 200S', 'Core Ultra 200S', 'Core Ultra 200S'), L('DDR5，7200–8000+，支持 CUDIMM', 'DDR5, 7200–8000+, CUDIMM', 'DDR5、7200–8000+、CUDIMM 対応'), L('Z890 > B860 > H810', 'Z890 > B860 > H810', 'Z890 > B860 > H810'), L('5.0 ×16 + ×4，TB4', '5.0 ×16 + ×4, TB4', '5.0 ×16 + ×4、TB4'), L('一代平台，空间小', 'One generation, little room', '1 世代のみ')],
          [L('AM4', 'AM4', 'AM4'), L('Ryzen 1000–5000', 'Ryzen 1000–5000', 'Ryzen 1000–5000'), L('DDR4，3600 CL16', 'DDR4, 3600 CL16', 'DDR4、3600 CL16'), L('X570 > B550 > B450 > A520', 'X570 > B550 > B450 > A520', 'X570 > B550 > B450 > A520'), L('4.0（X570 / B550）', '4.0 (X570 / B550)', '4.0（X570 / B550）'), L('终点 5700X3D', 'Ends at 5700X3D', '5700X3D で終点')],
          [L('LGA1700', 'LGA1700', 'LGA1700'), L('12 / 13 / 14 代 Core', '12th–14th Gen Core', '第 12〜14 世代 Core'), L('DDR4 或 DDR5（看板）', 'DDR4 or DDR5 (board)', 'DDR4 か DDR5（ボード次第）'), L('Z790 > B760 > H610', 'Z790 > B760 > H610', 'Z790 > B760 > H610'), L('5.0 ×16 + 4.0 ×4', '5.0 ×16 + 4.0 ×4', '5.0 ×16 + 4.0 ×4'), L('终点 14 代', 'Ends at 14th Gen', '第 14 世代で終点')],
        ] },
      { title: L('电源功率怎么选', 'PSU sizing', '電源容量の選び方'),
        head: [L('显卡', 'GPU', 'GPU'), L('显卡功耗', 'GPU power', 'GPU 消費電力'), L('搭配 65–120W CPU', 'With a 65–120 W CPU', '65–120W CPU と'), L('搭配 170–250W CPU', 'With a 170–250 W CPU', '170–250W CPU と'), L('供电线', 'Connector', 'コネクタ')],
        rows: [
          [L('RTX 5060 / RX 9060 XT', 'RTX 5060 / RX 9060 XT', 'RTX 5060 / RX 9060 XT'), L('145–180W', '145–180 W', '145–180W'), L('550–650W', '550–650 W', '550–650W'), L('650–750W', '650–750 W', '650–750W'), L('8-pin ×1', '1× 8-pin', '8-pin ×1')],
          [L('RTX 5070 / RX 9070', 'RTX 5070 / RX 9070', 'RTX 5070 / RX 9070'), L('220–250W', '220–250 W', '220–250W'), L('650–750W', '650–750 W', '650–750W'), L('750–850W', '750–850 W', '750–850W'), L('12V-2x6 或 8-pin ×2', '12V-2x6 or 2× 8-pin', '12V-2x6 か 8-pin ×2')],
          [L('RTX 5070 Ti / RX 9070 XT', 'RTX 5070 Ti / RX 9070 XT', 'RTX 5070 Ti / RX 9070 XT'), L('300–340W', '300–340 W', '300–340W'), L('750–850W', '750–850 W', '750–850W'), L('850–1000W', '850–1000 W', '850–1000W'), L('12V-2x6 或 8-pin ×3', '12V-2x6 or 3× 8-pin', '12V-2x6 か 8-pin ×3')],
          [L('RTX 5080 / 4090', 'RTX 5080 / 4090', 'RTX 5080 / 4090'), L('360–450W', '360–450 W', '360–450W'), L('850–1000W', '850–1000 W', '850–1000W'), L('1000–1200W', '1000–1200 W', '1000–1200W'), L('12V-2x6 原生', 'Native 12V-2x6', 'ネイティブ 12V-2x6')],
          [L('RTX 5090', 'RTX 5090', 'RTX 5090'), L('575W', '575 W', '575W'), L('1000–1200W', '1000–1200 W', '1000–1200W'), L('1200–1600W', '1200–1600 W', '1200–1600W'), L('12V-2x6 原生，ATX 3.1', 'Native 12V-2x6, ATX 3.1', 'ネイティブ 12V-2x6、ATX 3.1')],
        ] },
      { title: L('散热器怎么配', 'Cooler sizing', 'クーラーの選び方'),
        head: [L('CPU 功耗', 'CPU power', 'CPU 消費電力'), L('代表 CPU', 'Typical CPUs', '代表的な CPU'), L('建议散热器', 'Recommended cooler', '推奨クーラー'), L('备注', 'Note', '備考')],
        rows: [
          [L('≤ 65W', '≤ 65 W', '65W 以下'), L('7500F / 9600X / 14400 / 8600G', '7500F / 9600X / 14400 / 8600G', '7500F / 9600X / 14400 / 8600G'), L('盒装或入门单塔', 'Stock or entry single tower', '付属か入門シングルタワー'), L('AM5 盒装散热器够用', 'AM5 stock cooler is fine', 'AM5 付属クーラーで十分')],
          [L('105–125W', '105–125 W', '105–125W'), L('9700X / 9800X3D / 7800X3D / 14600K', '9700X / 9800X3D / 7800X3D / 14600K', '9700X / 9800X3D / 7800X3D / 14600K'), L('高端单塔或双塔风冷', 'High-end single or dual tower', '高級シングルかデュアルタワー'), L('X3D 对温度敏感，别省', 'X3D is heat-sensitive: do not skimp', 'X3D は温度に敏感')],
          [L('170–200W', '170–200 W', '170–200W'), L('9950X / 9950X3D / 265K', '9950X / 9950X3D / 265K', '9950X / 9950X3D / 265K'), L('双塔风冷或 280 / 360 水冷', 'Dual tower or 280 / 360 AIO', 'デュアルタワーか 280 / 360 簡易水冷'), L('风冷会撞功耗墙，水冷多 5–8% 多核', 'Air throttles; AIO gives 5–8% more multi-core', '空冷は電力制限に当たる。水冷で 5–8% 向上')],
          [L('250W+', '250 W+', '250W 以上'), L('285K / 14900K 解锁', '285K / 14900K unlocked', '285K / 14900K 解除'), L('360 / 420 水冷', '360 / 420 AIO', '360 / 420 簡易水冷'), L('LGA1700 加防弯扣具', 'Add a contact frame on LGA1700', 'LGA1700 は反り防止フレーム')],
        ] },
      { title: L('机箱与尺寸', 'Case & dimensions', 'ケースと寸法'),
        head: [L('主板', 'Board', 'ボード'), L('尺寸', 'Size', '寸法'), L('机箱', 'Case', 'ケース'), L('显卡长度', 'GPU length', 'GPU 長'), L('散热器高度', 'Cooler height', 'クーラー高'), L('电源', 'PSU', '電源')],
        rows: [
          [L('E-ATX', 'E-ATX', 'E-ATX'), L('305 × 277mm', '305 × 277 mm', '305 × 277mm'), L('全塔 / 大中塔', 'Full / large mid-tower', 'フル / 大型ミドル'), L('≤ 400mm', '≤ 400 mm', '400mm 以下'), L('≤ 185mm', '≤ 185 mm', '185mm 以下'), L('ATX', 'ATX', 'ATX')],
          [L('ATX', 'ATX', 'ATX'), L('305 × 244mm', '305 × 244 mm', '305 × 244mm'), L('中塔', 'Mid-tower', 'ミドルタワー'), L('≤ 330–380mm', '≤ 330–380 mm', '330–380mm 以下'), L('≤ 165–175mm', '≤ 165–175 mm', '165–175mm 以下'), L('ATX', 'ATX', 'ATX')],
          [L('mATX', 'mATX', 'mATX'), L('244 × 244mm', '244 × 244 mm', '244 × 244mm'), L('紧凑中塔 / mATX', 'Compact mid / mATX', 'コンパクト / mATX'), L('≤ 300–350mm', '≤ 300–350 mm', '300–350mm 以下'), L('≤ 155–165mm', '≤ 155–165 mm', '155–165mm 以下'), L('ATX / SFX', 'ATX / SFX', 'ATX / SFX')],
          [L('Mini-ITX', 'Mini-ITX', 'Mini-ITX'), L('170 × 170mm', '170 × 170 mm', '170 × 170mm'), L('ITX ≤ 20L', 'ITX ≤ 20 L', 'ITX 20L 以下'), L('≤ 300–330mm，双槽', '≤ 300–330 mm, dual slot', '300–330mm 以下、2 スロット'), L('≤ 55–75mm 或 240 水冷', '≤ 55–75 mm or 240 AIO', '55–75mm 以下か 240 簡易水冷'), L('SFX / SFX-L', 'SFX / SFX-L', 'SFX / SFX-L')],
        ] },
      { title: L('内存配置', 'Memory configuration', 'メモリ構成'),
        head: [L('平台', 'Platform', 'プラットフォーム'), L('推荐', 'Recommended', '推奨'), L('条数', 'Sticks', '枚数'), L('一键超频', 'One-click OC', 'ワンクリック OC'), L('备注', 'Note', '備考')],
        rows: [
          [L('AM5（Zen 4 / 5）', 'AM5 (Zen 4 / 5)', 'AM5（Zen 4 / 5）'), L('DDR5-6000 CL30', 'DDR5-6000 CL30', 'DDR5-6000 CL30'), L('2 × 16 / 2 × 32', '2 × 16 / 2 × 32', '2 × 16 / 2 × 32'), L('EXPO', 'EXPO', 'EXPO'), L('超过 6400 分频；4 条插满降频', 'Above 6400 the divider kicks in; 4 sticks downclock', '6400 超は分周。4 枚挿しは低クロック')],
          [L('LGA1851', 'LGA1851', 'LGA1851'), L('DDR5-7200 ~ 8000', 'DDR5-7200 to 8000', 'DDR5-7200〜8000'), L('2 × 16 / 2 × 24', '2 × 16 / 2 × 24', '2 × 16 / 2 × 24'), L('XMP 3.0', 'XMP 3.0', 'XMP 3.0'), L('CUDIMM 可上 8800+', 'CUDIMM reaches 8800+', 'CUDIMM で 8800 超')],
          [L('LGA1700 DDR5', 'LGA1700 DDR5', 'LGA1700 DDR5'), L('DDR5-6400 ~ 7200', 'DDR5-6400 to 7200', 'DDR5-6400〜7200'), L('2 × 16', '2 × 16', '2 × 16'), L('XMP 3.0', 'XMP 3.0', 'XMP 3.0'), L('B760 也能开 XMP', 'XMP works on B760 too', 'B760 でも XMP 可')],
          [L('AM4 / LGA1700 DDR4', 'AM4 / LGA1700 DDR4', 'AM4 / LGA1700 DDR4'), L('DDR4-3600 CL16', 'DDR4-3600 CL16', 'DDR4-3600 CL16'), L('2 × 16', '2 × 16', '2 × 16'), L('XMP / DOCP', 'XMP / DOCP', 'XMP / DOCP'), L('AM4 FCLK 1800 同步', 'AM4: keep FCLK 1800 in sync', 'AM4 は FCLK 1800 同期')],
        ] },
    ],
  },
  {
    id: 'checklist', title: L('下单前兼容性清单', 'Compatibility checklist', '購入前の互換性チェック'),
    intro: L('逐条核对，90% 的装机翻车都出在这几项。', 'Go through every line; most build failures come from these.', '一つずつ確認。組立トラブルの大半はここで起きる。'),
    checklist: [
      L('CPU 插槽 = 主板插槽（AM5 / LGA1851 / AM4 / LGA1700），且主板 BIOS 支持该代 CPU；新 U 配老板看是否有 BIOS Flashback。', 'CPU socket matches the board (AM5 / LGA1851 / AM4 / LGA1700) and the BIOS supports that generation; for a new CPU on an older board check for BIOS Flashback.', 'CPU ソケット = ボードソケット（AM5 / LGA1851 / AM4 / LGA1700）、BIOS がその世代に対応。新 CPU を旧ボードに載せるなら BIOS Flashback を確認。'),
      L('内存类型 = 主板类型（DDR4 / DDR5 不通用），频率在主板 QVL 或「最高支持」内。', 'Memory type matches the board (DDR4 and DDR5 are not interchangeable); speed within the QVL or max supported.', 'メモリ規格 = ボード規格（DDR4 / DDR5 は非互換）。クロックは QVL か最大対応内。'),
      L('电源瓦数 ≥ 上表建议，且有显卡需要的供电线（12V-2x6 原生最好，转接线次之）。', 'PSU wattage ≥ the table above and it has the GPU connectors you need (native 12V-2x6 preferred over adapters).', '電源容量は上表以上、GPU のコネクタがある（ネイティブ 12V-2x6 が望ましい）。'),
      L('主板尺寸 ≤ 机箱支持尺寸；显卡长度、散热器高度、冷排位置都在机箱规格内。', 'Board size fits the case; GPU length, cooler height and radiator placement are within case specs.', 'ボード寸法がケース対応内。GPU 長、クーラー高、ラジエーター位置も確認。'),
      L('散热器扣具支持该插槽（AM5 与 AM4 孔位相同；LGA1851 沿用 LGA1700）。', 'Cooler bracket supports the socket (AM5 shares AM4 holes; LGA1851 uses LGA1700 mounts).', 'クーラーの取付金具がソケット対応（AM5 は AM4 と同じ、LGA1851 は LGA1700 と同じ）。'),
      L('M.2 数量与规格够用：PCIe 5.0 盘要插 Gen5 槽并配散热片；ITX 背面槽通常只支持单面颗粒。', 'Enough M.2 slots of the right spec: Gen5 drives need a Gen5 slot with a heatsink; rear ITX slots usually take single-sided drives only.', 'M.2 の数と規格：Gen5 SSD は Gen5 スロット＋ヒートシンク。ITX 背面は片面実装のみが多い。'),
      L('显卡槽是否被 M.2 或第二条 PCIe 槽占用带宽（部分板插满 M.2 后显卡降为 ×8）。', 'Check lane sharing: on some boards filling every M.2 drops the GPU slot to ×8.', 'レーン共有に注意：M.2 を埋めると GPU が ×8 になるボードも。'),
      L('需要雷电 / USB4、2.5GbE 以上网口、Wi-Fi 7 的话，确认主板原生带，不要指望后加。', 'If you need Thunderbolt / USB4, 2.5GbE+ or Wi-Fi 7, make sure the board has them onboard.', 'Thunderbolt / USB4、2.5GbE 以上、Wi-Fi 7 が必要ならボード内蔵を確認。'),
      L('机箱前面板 USB-C 需要主板有 USB 3.2 Type-E 内接口。', 'A front-panel USB-C needs a USB 3.2 Type-E header on the board.', 'フロント USB-C にはボードの USB 3.2 Type-E ヘッダーが必要。'),
      L('开机先刷最新 BIOS 再开 EXPO / XMP；13 / 14 代 Intel 务必更新微码。', 'Update the BIOS before enabling EXPO / XMP; 13th / 14th Gen Intel must get the microcode update.', '最初に BIOS を更新してから EXPO / XMP。第 13 / 14 世代 Intel はマイクロコード更新必須。'),
    ],
  },
  {
    id: 'tables', title: L('速查表', 'Quick reference', 'クイックリファレンス'),
    intro: L('装机前对照三张表。', 'Three tables to check before buying.', '購入前に確認する3つの表。'),
    table: {
      head: [L('目标', 'Target', '目標'), L('显存建议', 'VRAM', 'VRAM'), L('显卡档位', 'GPU class', 'GPU クラス'), L('电源', 'PSU', '電源'), L('内存', 'Memory', 'メモリ')],
      rows: [
        [L('1080p 60 fps', '1080p 60 fps', '1080p 60 fps'), L('8GB', '8GB', '8GB'), L('RX 6600 / RTX 4060', 'RX 6600 / RTX 4060', 'RX 6600 / RTX 4060'), L('550W 铜牌+', '550W Bronze+', '550W Bronze 以上'), L('16GB', '16GB', '16GB')],
        [L('1080p 144 fps', '1080p 144 fps', '1080p 144 fps'), L('8–12GB', '8–12GB', '8–12GB'), L('RTX 5060 Ti / RX 9060 XT', 'RTX 5060 Ti / RX 9060 XT', 'RTX 5060 Ti / RX 9060 XT'), L('650W 金牌', '650W Gold', '650W Gold'), L('32GB', '32GB', '32GB')],
        [L('1440p 144 fps', '1440p 144 fps', 'WQHD 144 fps'), L('12–16GB', '12–16GB', '12–16GB'), L('RTX 5070 Ti / RX 9070 XT', 'RTX 5070 Ti / RX 9070 XT', 'RTX 5070 Ti / RX 9070 XT'), L('750–850W 金牌 ATX 3.1', '750–850W Gold ATX 3.1', '750–850W Gold ATX 3.1'), L('32GB', '32GB', '32GB')],
        [L('4K 120 fps', '4K 120 fps', '4K 120 fps'), L('16–24GB', '16–24GB', '16–24GB'), L('RTX 5080 / 4090', 'RTX 5080 / 4090', 'RTX 5080 / 4090'), L('850–1000W ATX 3.1', '850–1000W ATX 3.1', '850–1000W ATX 3.1'), L('32–64GB', '32–64GB', '32–64GB')],
        [L('4K 光追全开', '4K full RT', '4K フル RT'), L('24–32GB', '24–32GB', '24–32GB'), L('RTX 5090', 'RTX 5090', 'RTX 5090'), L('1000W+ ATX 3.1', '1000W+ ATX 3.1', '1000W 以上 ATX 3.1'), L('64GB', '64GB', '64GB')],
      ],
    },
  },
  {
    id: 'myths', title: L('常见误区', 'Common myths', 'よくある誤解'),
    intro: L('这些说法在论坛里流传很广，但数据不支持。', 'Widely repeated on forums, not supported by data.', 'フォーラムで広まっているがデータが裏付けない話。'),
    bullets: [
      L('「瓦数越大电源越好」— 分档比瓦数重要，D 档 850W 不如 A 档 650W。', '"More watts = better PSU" — tier matters more than wattage; a Tier D 850W is worse than a Tier A 650W.', '「W 数が大きいほど良い電源」— ティアが W 数より重要。D ティア 850W より A ティア 650W。'),
      L('「同名笔记本显卡性能一样」— RTX 5070 Laptop 80W 比 115W 慢约 20%。', '"Same-name laptop GPUs perform the same" — the 80W RTX 5070 Laptop is ~20% slower than the 115W.', '「同名ノート GPU は同性能」— RTX 5070 Laptop 80W は 115W より約 20% 遅い。'),
      L('「SSD 看顺序读写」— 日常体验由 4K 随机与缓外写入决定，QLC 盘缓外可低至 100 MB/s。', '"Judge SSDs by sequential speed" — daily feel comes from 4K random and post-cache writes; QLC can drop to 100 MB/s.', '「SSD はシーケンシャル速度」— 日常体感は 4K ランダムとキャッシュ外書込。QLC は 100 MB/s まで落ちる。'),
      L('「内存频率越高越好」— DDR5 在 AM5 上超过 6400 需要分频，延迟反而变差。', '"Faster memory is always better" — above 6400 on AM5 the UCLK divider kicks in and latency gets worse.', '「メモリは高クロックほど良い」— AM5 で 6400 超は UCLK 分周でレイテンシ悪化。'),
      L('「多核越多游戏越快」— 游戏看单核与缓存，8 核 X3D 打赢 16 核。', '"More cores = faster games" — games want single-core and cache; an 8-core X3D beats 16 cores.', '「コアが多いほどゲームが速い」— ゲームはシングルとキャッシュ。8コア X3D が 16コアに勝つ。'),
      L('「80Plus 金牌 = 用料好」— 80Plus 只认证转换效率，与纹波、保护、电容无关。', '"80Plus Gold = quality build" — 80Plus certifies efficiency only, not ripple, protections or capacitors.', '「80Plus Gold = 高品質」— 80Plus は効率認証のみ。リップル・保護・コンデンサとは無関係。'),
    ],
  },
]
