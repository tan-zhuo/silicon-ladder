/** 选购指南内容（三语）。picks 引用产品 id，页面自动带出名称与分数。 */
import type { Category } from '@/types/hardware'
export type L3 = [string, string, string]
const L = (zh: string, en: string, ja: string): L3 => [zh, en, ja]
export interface Pick { cat: Category; id: string; why: L3 }
export interface Build { title: L3; budget: L3; desc: L3; picks: Pick[] }
export interface Section { id: string; title: L3; intro: L3; builds?: Build[]; table?: { head: L3[]; rows: L3[][] }; bullets?: L3[] }

export const GUIDE: Section[] = [
  {
    id: 'budget', title: L('按预算装游戏台式机', 'Gaming desktop by budget', '予算別ゲーミングデスクトップ'),
    intro: L('四档预算各给一套配置。原则：显卡占总预算 35–45%，CPU 不拖累显卡即可；电源留 30% 余量；SSD 至少 1TB。', 'Four budget tiers. Rules of thumb: GPU takes 35–45% of the budget, the CPU only needs to keep up; 30% PSU headroom; at least 1TB SSD.', '4段階の予算。目安：GPU が予算の 35–45%、CPU は GPU の足を引っ張らない程度、電源は 30% 余裕、SSD は 1TB 以上。'),
    builds: [
      { title: L('入门 1080p', 'Entry 1080p', '入門 1080p'), budget: L('约 ¥4,000–5,000', '~¥4,000–5,000', '約 ¥4,000–5,000'), desc: L('主流网游与 1080p 3A 中高画质。', 'Esports and 1080p AAA at medium-high.', 'eスポーツと 1080p AAA 中〜高設定。'),
        picks: [{ cat: 'cpu', id: 'amd-ryzen-5-7500f', why: L('无核显六核，游戏够用', 'Six cores, no iGPU, enough for gaming', '内蔵GPUなし6コア、ゲームには十分') }, { cat: 'gpu', id: 'amd-rx-6600', why: L('千元档 1080p 王者', 'Budget 1080p king', '低価格帯 1080p の王者') }, { cat: 'ram', id: 'gskill-flare-x5-ddr5-6000-cl30-32', why: L('AM5 甜点频率', 'AM5 sweet-spot speed', 'AM5 定番クロック') }, { cat: 'storage', id: 'lexar-nm790-2tb', why: L('无 DRAM 但表现好', 'DRAM-less yet strong', 'DRAM なしでも高性能') }, { cat: 'psu', id: 'deepcool-pn850m', why: L('B 档金牌，留足余量', 'Tier B Gold with headroom', 'Bティア Gold、余裕あり') }] },
      { title: L('主流 1440p', 'Mainstream 1440p', '主流 WQHD'), budget: L('约 ¥8,000–10,000', '~¥8,000–10,000', '約 ¥8,000–10,000'), desc: L('2K 高刷，光追可开。', '1440p high refresh, RT usable.', 'WQHD 高リフレッシュ、RT も可。'),
        picks: [{ cat: 'cpu', id: 'amd-ryzen-7-9700x', why: L('65W 单核强', 'Strong single-core at 65W', '65W でシングル強力') }, { cat: 'gpu', id: 'amd-rx-9070', why: L('220W 能效最佳的 2K 卡', 'Most efficient 1440p card', '最も効率の良い WQHD カード') }, { cat: 'ram', id: 'corsair-vengeance-ddr5-6000-cl30-32', why: L('EXPO 一键', 'EXPO one-click', 'EXPO ワンクリック') }, { cat: 'storage', id: 'crucial-t500-2tb', why: L('PCIe 4.0 后期优秀盘', 'Excellent late PCIe 4.0', 'PCIe 4.0 後期の優秀品') }, { cat: 'psu', id: 'corsair-rm850x-2024', why: L('A 档，原生 12V-2x6', 'Tier A, native 12V-2x6', 'Aティア、ネイティブ 12V-2x6') }] },
      { title: L('高端 1440p / 4K', 'High-end 1440p / 4K', 'ハイエンド WQHD / 4K'), budget: L('约 ¥14,000–18,000', '~¥14,000–18,000', '約 ¥14,000–18,000'), desc: L('游戏优先，兼顾直播与剪辑。', 'Gaming first, streaming and editing too.', 'ゲーム優先、配信と編集も。'),
        picks: [{ cat: 'cpu', id: 'amd-ryzen-7-9800x3d', why: L('当前游戏最强', 'Fastest gaming CPU', '現行ゲーム最速') }, { cat: 'gpu', id: 'nvidia-rtx-5070-ti', why: L('16GB，2K 高刷甜点', '16GB, 1440p high-refresh sweet spot', '16GB、WQHD 高リフレッシュの定番') }, { cat: 'ram', id: 'gskill-trident-z5-neo-ddr5-6000-cl30-64', why: L('64GB 大容量', '64GB capacity', '64GB 大容量') }, { cat: 'storage', id: 'samsung-990-pro-2tb', why: L('PCIe 4.0 天花板', 'PCIe 4.0 ceiling', 'PCIe 4.0 の天井') }, { cat: 'psu', id: 'seasonic-vertex-gx-1000', why: L('海韵自产，十年保', 'Seasonic in-house, 10-year warranty', 'Seasonic 自社製、10年保証') }] },
      { title: L('旗舰 4K', 'Flagship 4K', 'フラッグシップ 4K'), budget: L('¥25,000+', '¥25,000+', '¥25,000+'), desc: L('不妥协。注意 5090 需要 1000W 以上 ATX 3.1 电源与大机箱。', 'No compromise. The 5090 needs a 1000W+ ATX 3.1 PSU and a large case.', '妥協なし。5090 は 1000W 以上の ATX 3.1 電源と大型ケースが必要。'),
        picks: [{ cat: 'cpu', id: 'amd-ryzen-9-9950x3d', why: L('游戏与生产力双旗舰', 'Gaming + productivity flagship', 'ゲームと生産性の両立') }, { cat: 'gpu', id: 'nvidia-rtx-5090', why: L('桌面最强', 'Fastest desktop card', 'デスクトップ最速') }, { cat: 'ram', id: 'gskill-trident-z5-neo-ddr5-6000-cl30-64', why: L('64GB，AM5 稳定', '64GB, stable on AM5', '64GB、AM5 で安定') }, { cat: 'storage', id: 'wd-black-sn8100-2tb', why: L('PCIe 5.0 综合最强', 'Best overall PCIe 5.0', 'PCIe 5.0 総合最強') }, { cat: 'psu', id: 'corsair-hx1200i-2023', why: L('1200W 白金，数字监控', '1200W Platinum with monitoring', '1200W Platinum、監視付き') }] },
    ],
  },
  {
    id: 'work', title: L('按用途：生产力', 'By workload: productivity', '用途別：生産性'),
    intro: L('生产力看多核、内存容量与显存，而不是游戏分。', 'Productivity is about cores, memory capacity and VRAM, not gaming scores.', '生産性はコア数・メモリ容量・VRAM が重要で、ゲームスコアではない。'),
    builds: [
      { title: L('视频剪辑 / 调色', 'Video editing / grading', '動画編集 / カラーグレーディング'), budget: L('—', '—', '—'), desc: L('多核 + 大显存 + 快缓外写入的素材盘。Intel 核显 QSV 对 H.264/HEVC 时间线有帮助。', 'Cores + big VRAM + a scratch drive with fast post-cache writes. Intel iGPU QSV helps H.264/HEVC timelines.', 'コア数 + 大容量 VRAM + キャッシュ外書込の速いスクラッチディスク。Intel 内蔵GPU の QSV は H.264/HEVC タイムラインに有効。'),
        picks: [{ cat: 'cpu', id: 'intel-core-ultra-9-285k', why: L('多核最强 Intel，带 QSV', 'Strongest Intel multi-core with QSV', 'Intel 最強マルチ、QSV 付き') }, { cat: 'gpu', id: 'nvidia-rtx-4090', why: L('24GB，CUDA / NVENC 双编码器', '24GB, CUDA, dual NVENC', '24GB、CUDA、デュアル NVENC') }, { cat: 'storage', id: 'seagate-firecuda-530-2tb', why: L('TBW 2550 耐久', 'TBW 2550 endurance', 'TBW 2550 の耐久') }] },
      { title: L('3D 渲染 / 编译', '3D rendering / compiling', '3D レンダリング / コンパイル'), budget: L('—', '—', '—'), desc: L('线程越多越好，内存 64GB 起。', 'More threads is better; start at 64GB.', 'スレッドが多いほど良い。メモリは 64GB から。'),
        picks: [{ cat: 'cpu', id: 'amd-ryzen-9-9950x', why: L('16 核 32 线程', '16C/32T', '16コア32スレッド') }, { cat: 'ram', id: 'gskill-trident-z5-neo-ddr5-6000-cl30-64', why: L('64GB 双条', '64GB in two sticks', '64GB 2枚') }, { cat: 'gpu', id: 'nvidia-rtx-5080', why: L('Blender / Octane CUDA 加速', 'CUDA acceleration for Blender / Octane', 'Blender / Octane の CUDA 加速') }] },
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
        picks: [{ cat: 'cpu', id: 'amd-ryzen-7-5700x3d', why: L('AM4 最后的游戏 U', 'AM4\'s last gaming CPU', 'AM4 最後のゲーム CPU') }, { cat: 'storage', id: 'samsung-970-evo-plus-1tb', why: L('PCIe 3.0 也够用', 'PCIe 3.0 is enough', 'PCIe 3.0 で十分') }] },
      { title: L('Intel 12 代主板', 'Intel 12th-gen board', 'Intel 第12世代ボード'), budget: L('—', '—', '—'), desc: L('Z690/B660 刷 BIOS 可上 14 代；注意 13/14 代 K 系列微码 0x12B。', 'Z690/B660 take 14th gen with a BIOS update; mind microcode 0x12B on 13th/14th-gen K parts.', 'Z690/B660 は BIOS 更新で第14世代対応。13/14 世代 K はマイクロコード 0x12B に注意。'),
        picks: [{ cat: 'cpu', id: 'intel-core-i5-14600k', why: L('LGA1700 甜点', 'LGA1700 sweet spot', 'LGA1700 の定番') }] },
      { title: L('该换平台了吗？', 'Time for a new platform?', 'プラットフォーム更新の時期？'), budget: L('—', '—', '—'), desc: L('如果还是 DDR3 / PCIe 2.0（Haswell 及更早），换任何一颗新 U 都意味着换板换内存，直接看主流 1440p 配置。', 'If you are still on DDR3 / PCIe 2.0 (Haswell or older), any new CPU means new board + memory — go straight to the mainstream 1440p build.', 'DDR3 / PCIe 2.0（Haswell 以前）なら CPU 交換＝ボードとメモリも交換。主流 WQHD 構成へ。'),
        picks: [{ cat: 'cpu', id: 'amd-ryzen-5-9600x', why: L('AM5 入门，可再升级', 'AM5 entry with upgrade room', 'AM5 入門、将来性あり') }, { cat: 'ram', id: 'gskill-flare-x5-ddr5-6000-cl30-32', why: L('32GB 起步', 'Start at 32GB', '32GB から') }] },
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
