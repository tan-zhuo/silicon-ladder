/** 方法论内容（三语）。 */
export type L3 = [string, string, string]
const L = (zh: string, en: string, ja: string): L3 => [zh, en, ja]
export interface Block { type: 'p' | 'code' | 'table' | 'list' | 'kv'; text?: L3; rows?: L3[][]; head?: L3[]; items?: L3[]; kv?: [L3, L3][] }
export interface MSection { id: string; title: L3; blocks: Block[] }

export const METHOD: MSection[] = [
  { id: 'sources', title: L('数据来源与口径', 'Data sources & definitions', 'データソースと定義'), blocks: [
    { type: 'p', text: L('本站是纯静态站点，所有数据保存在 public/data/*.json，随版本发布更新，不做运行时爬虫、不接价格 API。每个指标的口径如下：', 'This is a fully static site: all data lives in public/data/*.json and ships with each release — no runtime scraping, no price APIs. Each metric is defined as follows:', '完全静的サイトです。全データは public/data/*.json に保存しリリースごとに更新。ランタイム収集や価格 API はありません。各指標の定義：') },
    { type: 'table', head: [L('指标', 'Metric', '指標'), L('口径', 'Definition', '定義'), L('单位', 'Unit', '単位')], rows: [
      [L('CPU 单核 / 多核', 'CPU single / multi', 'CPU シングル / マルチ'), L('Cinebench 2024 单核 / 多核，默认功耗设置', 'Cinebench 2024 single / multi at stock power limits', 'Cinebench 2024 シングル / マルチ、定格電力設定'), L('分', 'pts', 'pt')],
      [L('CPU 游戏', 'CPU gaming', 'CPU ゲーム'), L('1080p 高画质、旗舰显卡下多游戏平均帧率，相对同池第一', '1080p high settings with a flagship GPU, multi-game average fps relative to the pool leader', '1080p 高設定・フラッグシップ GPU での複数ゲーム平均 fps、プール首位比'), L('相对分', 'relative', '相対値')],
      [L('GPU 光栅 / 光追', 'GPU raster / RT', 'GPU ラスタ / RT'), L('1440p（桌面）或 1080p（笔记本）多游戏平均帧率，分别统计关闭 / 开启光追', '1440p (desktop) or 1080p (laptop) multi-game average fps, RT off / on separately', 'WQHD（デスクトップ）または 1080p（ノート）の複数ゲーム平均 fps、RT オフ / オン別'), L('相对分', 'relative', '相対値')],
      [L('核显', 'iGPU', '内蔵GPU'), L('1080p 低画质多游戏平均帧率', '1080p low settings multi-game average fps', '1080p 低設定の複数ゲーム平均 fps'), L('相对分', 'relative', '相対値')],
      [L('内存', 'Memory', 'メモリ'), L('AIDA64 读带宽与延迟，XMP/EXPO 开启', 'AIDA64 read bandwidth and latency with XMP/EXPO on', 'AIDA64 読込帯域とレイテンシ、XMP/EXPO 有効'), L('GB/s · ns', 'GB/s · ns', 'GB/s · ns')],
      [L('存储', 'Storage', 'ストレージ'), L('厂商标称顺序读写与 4K 随机读 IOPS；缓外写入取评测中 SLC 缓存耗尽后的稳态速度', 'Vendor sequential and 4K random read IOPS; post-cache write is the steady state after the SLC cache is exhausted', 'メーカー公称シーケンシャルと 4K ランダム読 IOPS。キャッシュ外書込は SLC キャッシュ枯渇後の定常速度'), L('MB/s · IOPS', 'MB/s · IOPS', 'MB/s · IOPS')],
      [L('功耗', 'Power', '電力'), L('桌面 CPU 用 TDP、显卡用 TBP；笔记本用典型 cTDP / TGP', 'TDP for desktop CPUs, TBP for GPUs; typical cTDP / TGP for laptops', 'デスクトップ CPU は TDP、GPU は TBP、ノートは代表的 cTDP / TGP'), L('W', 'W', 'W')],
    ] },
  ] },
  { id: 'pools', title: L('分池：桌面 / 笔记本 / 核显永远分开', 'Pools: desktop / laptop / iGPU are always separate', 'プール：デスクトップ / ノート / 内蔵GPU は常に別'), blocks: [
    { type: 'p', text: L('每个产品都有 form 字段。排行、相对分、同类推荐、竞品都只在「同品类 + 同形态」的池内计算。同名的 RTX 5070 Laptop 因 TGP 不同是两条独立记录，天梯图与对比页跨形态时会给出警告。', 'Every product has a form field. Rankings, relative scores, recommendations and rivals are computed only within "same category + same form factor". Two RTX 5070 Laptop entries exist because their TGPs differ; the ladder and compare pages warn when form factors are mixed.', '全製品に form フィールドがあります。順位・相対スコア・類似製品・競合は「同カテゴリ + 同フォーム」内でのみ計算。同名の RTX 5070 Laptop は TGP 違いで別項目。ラダーと比較ページはフォーム混在時に警告。') },
  ] },
  { id: 'relative', title: L('相对分与计算示例', 'Relative score with a worked example', '相対スコアと計算例'), blocks: [
    { type: 'code', text: L('rel(x) = round(x / max(pool) × 1000) / 10   // 越高越好\nrel(x) = round(min(pool) / x × 1000) / 10   // 越低越好（延迟）', 'rel(x) = round(x / max(pool) × 1000) / 10   // higher is better\nrel(x) = round(min(pool) / x × 1000) / 10   // lower is better (latency)', 'rel(x) = round(x / max(pool) × 1000) / 10   // 高いほど良い\nrel(x) = round(min(pool) / x × 1000) / 10   // 低いほど良い（レイテンシ）') },
    { type: 'p', text: L('示例：桌面 CPU 池中 Cinebench 2024 多核最高为 26,000（Core Ultra 9 285K）。Ryzen 7 9800X3D 得 16,200，多核相对分 = 16200 / 26000 × 100 = 62.3。缺失值不参与 max，也不展示相对分。', 'Example: the desktop CPU pool\'s highest Cinebench 2024 multi-core is 26,000 (Core Ultra 9 285K). The Ryzen 7 9800X3D scores 16,200, so its multi-core relative score = 16200 / 26000 × 100 = 62.3. Missing values are excluded from max and never shown.', '例：デスクトップ CPU プールの Cinebench 2024 マルチ最高は 26,000（Core Ultra 9 285K）。Ryzen 7 9800X3D は 16,200 なのでマルチ相対値 = 16200 / 26000 × 100 = 62.3。欠損値は max に含めず表示しません。') },
  ] },
  { id: 'weights', title: L('综合分权重与理由', 'Overall weights and rationale', '総合の重みと理由'), blocks: [
    { type: 'p', text: L('综合分只是默认排序之一。计算时先把各分项在同池归一到 0–100，再加权，最后再归一一次，因此池内第一永远是 100。', 'Overall is only the default sort. Each component is normalized to 0–100 within the pool, weighted, then normalized again, so the pool leader is always 100.', '総合はデフォルトの並び順に過ぎません。各項目をプール内で 0–100 に正規化し、加重後に再正規化するため、プール首位は常に 100。') },
    { type: 'table', head: [L('池', 'Pool', 'プール'), L('权重', 'Weights', '重み'), L('为什么', 'Why', '理由')], rows: [
      [L('桌面 CPU', 'Desktop CPU', 'デスクトップ CPU'), L('游戏 40 · 单核 25 · 多核 25 · 能效 10', 'Gaming 40 · single 25 · multi 25 · efficiency 10', 'ゲーム 40 · シングル 25 · マルチ 25 · 効率 10'), L('桌面 CPU 的主要购买动机是游戏；能效在桌面上权重低', 'Gaming is the main reason to buy a desktop CPU; efficiency matters less on desktop', 'デスクトップ CPU の主目的はゲーム。効率の重みは低い')],
      [L('笔记本 CPU', 'Laptop CPU', 'ノート CPU'), L('单核 25 · 多核 30 · 能效 30 · 核显 15', 'Single 25 · multi 30 · efficiency 30 · iGPU 15', 'シングル 25 · マルチ 30 · 効率 30 · 内蔵GPU 15'), L('续航与核显是笔记本体验的核心；无核显分时 15% 均摊到单核与多核', 'Battery and iGPU define the laptop experience; without an iGPU score the 15% goes to single + multi', 'バッテリーと内蔵GPU がノート体験の核。内蔵GPU スコアがなければ 15% をシングルとマルチへ')],
      [L('GPU', 'GPU', 'GPU'), L('光栅 55 · 光追 25 · 能效 20', 'Raster 55 · RT 25 · efficiency 20', 'ラスタ 55 · RT 25 · 効率 20'), L('大多数游戏仍以光栅为主；无光追硬件的老卡把 25% 按剩余项均摊', 'Most games are still raster-bound; cards without RT hardware redistribute the 25%', '多くのゲームは依然ラスタ主体。RT 非対応の旧カードは 25% を再配分')],
      [L('内存', 'Memory', 'メモリ'), L('带宽 50 · 延迟 50', 'Bandwidth 50 · latency 50', '帯域 50 · レイテンシ 50'), L('游戏更吃延迟，生产力更吃带宽，各半', 'Games want latency, productivity wants bandwidth — split evenly', 'ゲームはレイテンシ、生産性は帯域。折半')],
      [L('NVMe', 'NVMe', 'NVMe'), L('4K 随机 40 · 缓外 30 · 顺序读 20 · 耐久 10', '4K random 40 · post-cache 30 · seq. read 20 · endurance 10', '4K ランダム 40 · キャッシュ外 30 · Seq. 読 20 · 耐久 10'), L('日常体验由 4K 与缓外决定，顺序读只在大文件拷贝时有感', 'Daily feel comes from 4K and post-cache; sequential only shows in big copies', '日常体感は 4K とキャッシュ外。シーケンシャルは大容量コピーのみ')],
      [L('电源', 'PSU', '電源'), L('无分数：Tier A→D，同档瓦数降序', 'No score: tier A→D, then wattage', 'スコアなし：ティア A→D、同ティアは W 数順'), L('电源的差异在电气品质而非「性能」；80Plus 只认证效率', 'PSUs differ in electrical quality, not "performance"; 80Plus certifies efficiency only', '電源の差は電気的品質であり「性能」ではない。80Plus は効率認証のみ')],
    ] },
  ] },
  { id: 'estimates', title: L('历史硬件的估算方法', 'How historical hardware is estimated', '旧世代の推定方法'), blocks: [
    { type: 'p', text: L('2007–2023 年的条目标记为「估算」。老硬件没有 Cinebench 2024 或现代光追数据，我们取公开评测中它与某个「锚点产品」的相对比例（例如 i7-2600K 在 Cinebench R15 中约为 i7-8700K 的 60%），再乘以锚点在当前池中的分数。这种换算适合定位，不适合精确比较：不同年代的测试软件、驱动与游戏都不同，误差通常在 ±10–15%。', 'Entries from 2007–2023 are marked "est.". Older hardware has no Cinebench 2024 or modern RT data, so we take its ratio to an "anchor" product in public reviews (e.g. the i7-2600K is ~60% of the i7-8700K in Cinebench R15) and multiply by the anchor\'s score in the current pool. This is fine for positioning, not for precise comparison: software, drivers and games differ across eras, so expect ±10–15% error.', '2007–2023 年の項目は「推定」マーク付きです。旧世代には Cinebench 2024 や最新 RT データがないため、公開レビューでの「アンカー製品」との比率（例：i7-2600K は Cinebench R15 で i7-8700K の約 60%）に、現行プールでのアンカーのスコアを掛けます。位置付けには十分ですが精密比較には不向き：世代でソフト・ドライバ・ゲームが異なり、誤差は ±10–15% 程度。') },
    { type: 'p', text: L('校准流程：把真实评测数据填入 data-src/calibration.csv，运行 npm run calibrate，对应条目的「估算」标记自动清除，meta.version +1。', 'Calibration: fill real review data into data-src/calibration.csv and run npm run calibrate; the "est." flag is cleared for those entries and meta.version increments.', '校正手順：実測データを data-src/calibration.csv に入力し npm run calibrate を実行。該当項目の「推定」が解除され meta.version が +1。') },
  ] },
  { id: 'missing', title: L('缺失值与「未公开」', 'Missing values and "not disclosed"', '欠損値と「未公開」'), blocks: [
    { type: 'list', items: [
      L('— ：我们尚未收录该数据，欢迎补充。', '— : we do not have this value yet; contributions welcome.', '— ：未収録のデータ。補完歓迎。'),
      L('厂商未公开 / 不适用：厂商不公布（Intel 自 2017 年起不公布晶体管数；Apple 不公布基础频率）或该字段不适用（核显没有独立晶片，笔记本芯片没有零售首发价）。', 'Not disclosed / N/A: the vendor does not publish it (Intel stopped publishing transistor counts in 2017; Apple does not publish base clocks) or it does not apply (iGPUs have no separate die; laptop chips have no retail launch price).', '未公開 / 該当なし：メーカー非公開（Intel は 2017 年以降トランジスタ数を非公開、Apple はベースクロック非公開）または該当しない（内蔵GPU に独立ダイなし、ノートチップに小売価格なし）。'),
      L('分数为 null 时不参与归一、不展示相对分，也不会用 0 冒充。', 'Null scores are excluded from normalization, never displayed, and never faked as 0.', 'スコアが null の場合は正規化に含めず表示もせず、0 で代用もしません。'),
    ] },
  ] },
  { id: 'tech', title: L('技术规格的来源', 'Where technical specs come from', '技術仕様の出所'), blocks: [
    { type: 'p', text: L('架构级信息（核心微架构、制程、芯片设计、L1、指令集、SMT、每单元着色器、RT / AI 单元世代）按代次派生；产品级信息（晶片布局与面积、晶体管、L2、时钟、PPT / PL2、内存控制器、PCIe、SM / CU、TMU / ROP、显存速率、首发价）按公开规格逐条录入。晶体管密度与每瓦算力为派生值。', 'Architecture-level facts (core microarchitecture, process, chip design, L1, ISA, SMT, shaders per unit, RT / AI unit generation) are derived per generation; product-level facts (die layout and area, transistors, L2, clocks, PPT / PL2, memory controller, PCIe, SM / CU, TMU / ROP, memory speed, launch price) are entered per product from public specs. Transistor density and compute per watt are derived.', 'アーキテクチャ情報（マイクロアーキテクチャ、プロセス、チップ設計、L1、命令セット、SMT、ユニットあたりシェーダ、RT / AI 世代）は世代から導出。製品情報（ダイ構成と面積、トランジスタ、L2、クロック、PPT / PL2、メモリコントローラ、PCIe、SM / CU、TMU / ROP、メモリ速度、発売価格）は公開仕様から個別入力。密度とワットあたり性能は派生値。') },
  ] },
  { id: 'glossary', title: L('术语表', 'Glossary', '用語集'), blocks: [
    { type: 'kv', kv: [
      [L('TDP', 'TDP', 'TDP'), L('热设计功耗，厂商给散热器的设计参考，不等于实际功耗', 'Thermal design power — a cooler design target, not actual draw', '熱設計電力。クーラー設計の目安で実消費電力ではない')],
      [L('PPT / PL1 / PL2', 'PPT / PL1 / PL2', 'PPT / PL1 / PL2'), L('AMD 封装功耗上限 / Intel 长期与短期功耗上限，决定真实满载功耗', 'AMD package power limit / Intel long- and short-term limits — these set real full-load draw', 'AMD パッケージ電力上限 / Intel 長期・短期上限。実際の全負荷電力を決める')],
      [L('TBP / TGP', 'TBP / TGP', 'TBP / TGP'), L('桌面显卡整板功耗 / 笔记本显卡功耗档，同名笔记本卡按 TGP 拆分', 'Desktop total board power / laptop GPU power tier; same-name laptop cards are split by TGP', 'デスクトップのボード全体電力 / ノート GPU の電力帯。同名ノートカードは TGP で分割')],
      [L('Chiplet / CCD / IOD', 'Chiplet / CCD / IOD', 'Chiplet / CCD / IOD'), L('AMD 把计算核心（CCD）与 I/O（IOD）做成独立晶片再封装，便于用不同制程', 'AMD splits compute dies (CCD) and the I/O die (IOD) so each can use a different process', 'AMD は演算ダイ（CCD）と I/O ダイ（IOD）を分離し、別プロセスを使える')],
      [L('SM / CU / Xe', 'SM / CU / Xe-core', 'SM / CU / Xe'), L('NVIDIA / AMD / Intel 的 GPU 基本计算单元，每单元着色器数因架构而异', 'The basic GPU compute block for NVIDIA / AMD / Intel; shaders per unit vary by architecture', 'NVIDIA / AMD / Intel の GPU 基本演算ブロック。ユニットあたりシェーダ数は世代で異なる')],
      [L('HMB', 'HMB', 'HMB'), L('无 DRAM 固态盘借用系统内存做映射表', 'DRAM-less SSDs borrow system memory for the mapping table', 'DRAM なし SSD がマッピング表にシステムメモリを借用')],
      [L('缓外写入', 'Post-cache write', 'キャッシュ外書込'), L('SLC 缓存写满后的持续写入速度，QLC 可低至 100 MB/s', 'Sustained write after the SLC cache fills; QLC can drop to 100 MB/s', 'SLC キャッシュ枯渇後の持続書込。QLC は 100 MB/s まで低下')],
      [L('CMR / SMR', 'CMR / SMR', 'CMR / SMR'), L('机械盘垂直 / 叠瓦记录，SMR 随机写慢，不宜 NAS / RAID', 'Conventional / shingled recording; SMR has slow random writes and is unsuitable for NAS / RAID', '従来 / 瓦記録。SMR はランダム書込が遅く NAS / RAID に不向き')],
      [L('XMP / EXPO', 'XMP / EXPO', 'XMP / EXPO'), L('Intel / AMD 的内存一键超频配置文件', 'Intel / AMD one-click memory overclock profiles', 'Intel / AMD のメモリワンクリック OC プロファイル')],
      [L('12V-2x6 / 12VHPWR', '12V-2x6 / 12VHPWR', '12V-2x6 / 12VHPWR'), L('600W 级 16-pin 显卡供电接口；12V-2x6 是缩短感应针脚的修订版', '600W-class 16-pin GPU connector; 12V-2x6 is the revision with shorter sense pins', '600W 級 16-pin GPU コネクタ。12V-2x6 はセンスピン短縮の改訂版')],
      [L('Tier（电源）', 'Tier (PSU)', 'ティア（電源）'), L('A–D 分档综合纹波、保护、用料与代工厂口碑，仅作展示', 'A–D tiers combine ripple, protections, components and OEM reputation; display only', 'A–D はリップル・保護・部品・OEM 評判の総合。表示のみ')],
    ] },
  ] },
  { id: 'faq', title: L('常见问题', 'FAQ', 'よくある質問'), blocks: [
    { type: 'kv', kv: [
      [L('为什么 9950X 综合分比 9800X3D 高，但游戏榜相反？', 'Why does the 9950X rank above the 9800X3D overall but below in gaming?', 'なぜ 9950X は総合で 9800X3D より上なのにゲームでは逆？'), L('综合分含 25% 多核，16 核拉开差距；切到「游戏」排序即可看到 X3D 领先。', 'Overall includes 25% multi-core, where 16 cores pull ahead; switch to "Gaming" to see the X3D lead.', '総合にはマルチ 25% が含まれ 16 コアが有利。「ゲーム」に切り替えると X3D が首位。')],
      [L('笔记本显卡为什么不和桌面比？', 'Why not compare laptop and desktop GPUs?', 'なぜノート GPU とデスクトップを比較しない？'), L('测试分辨率、功耗上限和散热都不同，混排会误导。对比页跨形态时会警告。', 'Different test resolutions, power limits and cooling; mixing them misleads. The compare page warns across form factors.', 'テスト解像度・電力制限・冷却が異なり、混在は誤解を招く。比較ページはフォーム混在時に警告。')],
      [L('可以提交数据吗？', 'Can I contribute data?', 'データ提供はできる？'), L('可以。仓库公开，直接提 PR 修改 public/data/*.json 或 data-src/calibration.csv，CI 会校验格式。', 'Yes. The repo is public — open a PR against public/data/*.json or data-src/calibration.csv; CI validates the format.', 'はい。リポジトリは公開。public/data/*.json や data-src/calibration.csv への PR を。CI が形式を検証。')],
      [L('多久更新？', 'How often is it updated?', '更新頻度は？'), L('随版本发布更新，页脚显示数据日期与版本号。', 'With each release; the footer shows the data date and version.', 'リリースごと。フッターにデータ日付とバージョン表示。')],
    ] },
  ] },
  { id: 'limits', title: L('已知局限', 'Known limitations', '既知の制約'), blocks: [
    { type: 'list', items: [
      L('分数为静态快照，不反映驱动 / BIOS 更新后的变化。', 'Scores are a static snapshot and do not reflect driver / BIOS updates.', 'スコアは静的スナップショットで、ドライバ / BIOS 更新を反映しない。'),
      L('价格为参考快照且不完整；性价比榜仅在池内有价格时显示。', 'Prices are incomplete reference snapshots; the value sort shows only when the pool has prices.', '価格は不完全な参考値。コスパ順は価格のあるプールのみ表示。'),
      L('笔记本芯片的实际表现受机型功耗墙影响，同芯片差距可达 30%+。', 'Laptop chips depend on each model\'s power limits; the same chip can differ 30%+.', 'ノートチップは機種の電力制限に依存し、同チップでも 30% 以上の差。'),
      L('历史硬件分数为估算，误差 ±10–15%。', 'Historical scores are estimates with ±10–15% error.', '旧世代スコアは推定で誤差 ±10–15%。'),
    ] },
  ] },
]
