// 构建后：为每个路由 × 语言生成静态 HTML（title/meta/JSON-LD/hreflang + 可见摘要），并输出 sitemap.xml / robots.txt
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

const SITE = 'https://silicon-ladder.vercel.app'
const DIST = 'dist'
const LANGS = ['zh', 'en', 'ja']
const HL = { zh: 'zh-CN', en: 'en', ja: 'ja' }
const prefix = (l) => (l === 'zh' ? '' : `/${l}`)
const load = (f) => JSON.parse(readFileSync(`public/data/${f}`, 'utf8'))
const meta = load('meta.json')
const data = { cpu: load('cpus.json'), gpu: load('gpus.json'), ram: load('rams.json'), storage: load('storages.json'), psu: load('psus.json') }

const T = {
  zh: { site: 'Silicon Ladder — 消费级硬件排行榜', cat: { cpu: 'CPU', gpu: 'GPU', ram: '内存', storage: '存储', psu: '电源' }, form: { desktop: '桌面', laptop: '笔记本', igpu: '核显', 'kit-desktop': '台式套装', sodimm: '笔记本条', onboard: '板载', nvme: 'NVMe', sata: 'SATA', hdd: 'HDD', atx: 'ATX', sfx: 'SFX' },
    rankTitle: (c, fs) => `${c} 排行榜 / 天梯图 — ${fs.join(' / ')}分池 · Silicon Ladder`, rankDesc: (c, n, fs) => `${c} 排行榜与天梯图，收录 ${n} 款（${fs.join('、')}），支持游戏 / 单核 / 多核 / 能效 / 性价比切换，AMD、Intel、NVIDIA 并列对照。数据更新 ${meta.updated}。`,
    rankH1: (c) => `${c} 排行榜 / 天梯图`, prodTitle: (n, f, c) => `${n} 规格、跑分、天梯排名与兼容性 · ${f} ${c} · Silicon Ladder`, prodDesc: (b, n, r, s, l) => `${b} ${n}（${r}）：${s} ${l}。`, viewAll: (c) => `查看 ${c} 完整排行榜`, home: '首页', rankings: '排行榜',
    guide: ['场景选购指南 — 游戏 / 生产力 / 轻薄本 / 游戏本 · Silicon Ladder', '四个常见场景各 3 条硬件推荐：纯游戏台式机、生产力剪辑、轻薄本、游戏本。', '场景选购指南'],
    method: ['方法论与数据来源 — 分池归一、综合权重、电源分档 · Silicon Ladder', '相对分 rel(x)=x/max×100 同形态池内归一；桌面 CPU 游戏 40%+单核 25%+多核 25%+能效 10%；GPU 光栅 55%+光追 25%+能效 20%；电源按 Tier 分档不跑分。', '方法论与数据来源'],
    compare: ['硬件对比 — 同品类最多 4 项并排 · Silicon Ladder', 'CPU / GPU / 内存 / 存储 / 电源同品类并排对比，规格与相对分一目了然。', '硬件对比'],
    spec: { socket: '插槽', cores: '核心 / 线程', clocks: '频率', tdp: 'TDP', igpu: '核显', l3: 'L3', mem: '内存', st: 'Cinebench 2024 单核', mt: 'Cinebench 2024 多核', arch: '架构', chip: '核心', vram: '显存', bus: '位宽', tbp: 'TBP', tgp: 'TGP', raster: '光栅相对分', rt: '光追相对分', spec: '规格', cap: '容量', speed: '速率', cl: 'CL', read: '读带宽', lat: '延迟', iface: '接口', nand: '颗粒', dram: 'DRAM', seq: '顺序读/写', r4k: '4K 随机读', co: '缓外写入', tbw: 'TBW', watt: '瓦数', tier: '分档', eff: '认证', atx31: 'ATX 3.1', mod: '模组', oem: 'OEM', yes: '有', no: '无', y: '是', n: '否' } },
  en: { site: 'Silicon Ladder — Consumer Hardware Rankings', cat: { cpu: 'CPU', gpu: 'GPU', ram: 'Memory', storage: 'Storage', psu: 'PSU' }, form: { desktop: 'Desktop', laptop: 'Laptop', igpu: 'iGPU', 'kit-desktop': 'Desktop kit', sodimm: 'SO-DIMM', onboard: 'Onboard', nvme: 'NVMe', sata: 'SATA', hdd: 'HDD', atx: 'ATX', sfx: 'SFX' },
    rankTitle: (c, fs) => `${c} Rankings & Ladder — ${fs.join(' / ')} pools · Silicon Ladder`, rankDesc: (c, n, fs) => `${c} rankings and ladder chart with ${n} entries (${fs.join(', ')}). Switch between gaming, single-core, multi-core, efficiency and value; AMD, Intel and NVIDIA side by side. Data updated ${meta.updated}.`,
    rankH1: (c) => `${c} Rankings & Ladder`, prodTitle: (n, f, c) => `${n} specs, benchmarks, ladder rank & compatibility · ${f} ${c} · Silicon Ladder`, prodDesc: (b, n, r, s, l) => `${b} ${n} (${r}): ${s} ${l}.`, viewAll: (c) => `See the full ${c} rankings`, home: 'Home', rankings: 'Rankings',
    guide: ['Buying guide by scenario — gaming / productivity / thin & light / gaming laptop · Silicon Ladder', 'Three hardware picks for each of four scenarios: gaming desktop, productivity, thin & light, gaming laptop.', 'Buying guide by scenario'],
    method: ['Methodology & data sources — pooling, overall weights, PSU tiers · Silicon Ladder', 'Relative score rel(x)=x/max×100 within the same form-factor pool; desktop CPU gaming 40% + single 25% + multi 25% + efficiency 10%; GPU raster 55% + RT 25% + efficiency 20%; PSUs tiered, not benchmarked.', 'Methodology & data sources'],
    compare: ['Hardware compare — up to 4 items side by side · Silicon Ladder', 'Compare CPUs, GPUs, memory, storage and PSUs within a category: specs and relative scores at a glance.', 'Hardware compare'],
    spec: { socket: 'Socket', cores: 'Cores / threads', clocks: 'Clocks', tdp: 'TDP', igpu: 'iGPU', l3: 'L3', mem: 'Memory', st: 'Cinebench 2024 single', mt: 'Cinebench 2024 multi', arch: 'Architecture', chip: 'Die', vram: 'VRAM', bus: 'Bus', tbp: 'TBP', tgp: 'TGP', raster: 'Raster (relative)', rt: 'RT (relative)', spec: 'Spec', cap: 'Capacity', speed: 'Speed', cl: 'CL', read: 'Read BW', lat: 'Latency', iface: 'Interface', nand: 'NAND', dram: 'DRAM', seq: 'Seq. read/write', r4k: '4K random read', co: 'Post-cache write', tbw: 'TBW', watt: 'Wattage', tier: 'Tier', eff: 'Rating', atx31: 'ATX 3.1', mod: 'Modular', oem: 'OEM', yes: 'Yes', no: 'No', y: 'Yes', n: 'No' } },
  ja: { site: 'Silicon Ladder — コンシューマー向けハードウェアランキング', cat: { cpu: 'CPU', gpu: 'GPU', ram: 'メモリ', storage: 'ストレージ', psu: '電源' }, form: { desktop: 'デスクトップ', laptop: 'ノート', igpu: '内蔵GPU', 'kit-desktop': 'デスクトップ用', sodimm: 'SO-DIMM', onboard: 'オンボード', nvme: 'NVMe', sata: 'SATA', hdd: 'HDD', atx: 'ATX', sfx: 'SFX' },
    rankTitle: (c, fs) => `${c} ランキング / 性能ラダー — ${fs.join(' / ')} 別 · Silicon Ladder`, rankDesc: (c, n, fs) => `${c} のランキングと性能ラダー。${n} 件収録（${fs.join('、')}）。ゲーム / シングル / マルチ / 電力効率 / コスパを切替、AMD・Intel・NVIDIA を左右対照。データ更新 ${meta.updated}。`,
    rankH1: (c) => `${c} ランキング / 性能ラダー`, prodTitle: (n, f, c) => `${n} 仕様・ベンチマーク・ラダー順位・互換性 · ${f} ${c} · Silicon Ladder`, prodDesc: (b, n, r, s, l) => `${b} ${n}（${r}）：${s} ${l}。`, viewAll: (c) => `${c} の全ランキングを見る`, home: 'ホーム', rankings: 'ランキング',
    guide: ['シーン別購入ガイド — ゲーム / 生産性 / 薄型 / ゲーミングノート · Silicon Ladder', 'よくある4シーンにハードウェアを各3件推奨：ゲーム用デスクトップ、生産性、薄型ノート、ゲーミングノート。', 'シーン別購入ガイド'],
    method: ['評価方法とデータソース — プール分け・総合重み・電源ティア · Silicon Ladder', '相対スコア rel(x)=x/max×100 を同フォームプール内で正規化。デスクトップ CPU はゲーム 40%+シングル 25%+マルチ 25%+効率 10%、GPU はラスタ 55%+RT 25%+効率 20%。電源はティア分けでベンチなし。', '評価方法とデータソース'],
    compare: ['ハードウェア比較 — 同カテゴリ最大4件 · Silicon Ladder', 'CPU / GPU / メモリ / ストレージ / 電源を同カテゴリで並べて比較。仕様と相対スコアが一目瞭然。', 'ハードウェア比較'],
    spec: { socket: 'ソケット', cores: 'コア / スレッド', clocks: 'クロック', tdp: 'TDP', igpu: '内蔵GPU', l3: 'L3', mem: 'メモリ', st: 'Cinebench 2024 シングル', mt: 'Cinebench 2024 マルチ', arch: 'アーキテクチャ', chip: 'ダイ', vram: 'VRAM', bus: 'バス幅', tbp: 'TBP', tgp: 'TGP', raster: 'ラスタ相対', rt: 'RT 相対', spec: '仕様', cap: '容量', speed: '速度', cl: 'CL', read: '読込帯域', lat: 'レイテンシ', iface: 'IF', nand: 'NAND', dram: 'DRAM', seq: 'Seq. 読/書', r4k: '4K ランダム読', co: 'キャッシュ外書込', tbw: 'TBW', watt: 'W数', tier: 'ティア', eff: '認証', atx31: 'ATX 3.1', mod: 'モジュラー', oem: 'OEM', yes: 'あり', no: 'なし', y: 'はい', n: 'いいえ' } },
}
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))
const nameOf = (i, l) => (l === 'zh' || !i.nameEn ? i.name : i.nameEn.startsWith(i.brand + ' ') ? i.nameEn.slice(i.brand.length + 1) : i.nameEn)
const sumOf = (i, l) => (l === 'en' ? i.summary_en : l === 'ja' ? i.summary_ja : i.summary) || i.summary

const template = readFileSync(join(DIST, 'index.html'), 'utf8')
function render(path, l, { title, description, jsonLd = [], body = '', image }) {
  const p = prefix(l) + (path === '/' ? '' : path)
  const url = SITE + (p || '/')
  const alts = LANGS.map((x) => `    <link rel="alternate" hreflang="${HL[x]}" href="${SITE + (prefix(x) + (path === '/' ? '' : path) || '/')}" />`).join('\n') + `\n    <link rel="alternate" hreflang="x-default" href="${SITE + (path === '/' ? '/' : path)}" />`
  let html = template
    .replace('<html lang="zh-CN">', `<html lang="${HL[l]}">`)
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${esc(description)}" />`)
    .replace(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${url}" />`)
    .replace(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${esc(title)}" />`)
  if (image) html = html.replace(/<meta property="og:image" content="[^"]*" \/>/, `<meta property="og:image" content="${SITE}${image}" />`).replace('</head>', `    <meta property="og:image:width" content="1200" />\n    <meta property="og:image:height" content="630" />\n    <meta name="twitter:image" content="${SITE}${image}" />\n  </head>`)
  html = html.replace('</head>', `    <meta property="og:url" content="${url}" />\n    <meta property="og:description" content="${esc(description)}" />\n    <meta property="og:locale" content="${l === 'zh' ? 'zh_CN' : l === 'ja' ? 'ja_JP' : 'en_US'}" />\n${alts}\n` + jsonLd.map((o) => `    <script type="application/ld+json">${JSON.stringify(o)}</script>`).join('\n') + '\n  </head>')
  html = html.replace('<div id="app"></div>', `<div id="app"></div>\n    <div id="ssr-summary" style="max-width:960px;margin:24px auto;padding:0 16px;font-family:system-ui,sans-serif;color:#0F172A">${body}</div>`)
  const rel = (p || '/').replace(/^\//, '')
  const dir = join(DIST, rel)
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'index.html'), html)
  if (rel) writeFileSync(join(DIST, rel + '.html'), html)
}
const bc = (l, items) => ({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it[0], item: SITE + prefix(l) + it[1] })) })

function specLines(cat, i, S) {
  switch (cat) {
    case 'cpu': return [[S.socket, i.socket], [S.cores, i.cores], [S.clocks, i.clocks], [S.tdp, i.tdp_w + 'W'], [S.igpu, i.igpu ?? '—'], [S.l3, i.cache_l3], [S.mem, i.mem], [S.st, i.scores.cb24_st], [S.mt, i.scores.cb24_mt]]
    case 'gpu': return [[S.arch, i.gen], [S.chip, i.chip], [S.vram, `${i.vram_gb}GB ${i.vram_type}`], [S.bus, i.bus_bit + '-bit'], [i.form === 'laptop' ? S.tgp : S.tbp, (i.tgp_w ?? i.tdp_w) + 'W'], [S.raster, i.scores.raster_rel], [S.rt, i.scores.rt_rel ?? '—']]
    case 'ram': return [[S.spec, i.spec], [S.cap, i.capacity_gb + 'GB'], [S.speed, i.speed_mt + ' MT/s'], [S.cl, i.cl ?? '—'], [S.read, i.scores.read_GBs ? i.scores.read_GBs + ' GB/s' : '—'], [S.lat, i.scores.latency_ns ? i.scores.latency_ns + ' ns' : '—']]
    case 'storage': return [[S.iface, i.interface], [S.cap, i.capacity_gb + 'GB'], [S.nand, i.nand ?? '—'], [S.dram, i.dram ? S.yes : S.no], [S.seq, `${i.seq_read ?? '—'} / ${i.seq_write ?? '—'} MB/s`], [S.r4k, i.iops_4k_read ?? '—'], [S.co, i.write_cache_out ? i.write_cache_out + ' MB/s' : '—'], [S.tbw, i.tbw ?? '—']]
    case 'psu': return [[S.watt, i.watt + 'W'], [S.tier, i.tier], [S.eff, i.efficiency], [S.atx31, i.atx31 ? S.y : S.n], [S.mod, i.modular], [S.oem, i.oem]]
  }
}

const paths = [['/', '1.0', 'daily']]
for (const l of LANGS) {
  const t = T[l]
  // 排行页
  for (const cat of Object.keys(data)) {
    const items = data[cat]; const forms = [...new Set(items.map((i) => i.form))]; const fs = forms.map((f) => t.form[f]); const C = t.cat[cat]
    const title = t.rankTitle(C, fs); const desc = t.rankDesc(C, items.length, fs)
    const body = `<h1>${esc(t.rankH1(C))}</h1><p>${esc(desc)}</p>` + forms.map((f) => `<h2>${esc(t.form[f])} ${esc(C)}</h2><ol>` + items.filter((i) => i.form === f).slice(0, 80).map((i) => `<li><a href="${prefix(l)}/product/${cat}/${i.id}">${esc(nameOf(i, l))}</a> — ${esc(i.brand)} · ${esc(i.release)} · ${esc(sumOf(i, l))}</li>`).join('') + '</ol>').join('')
    render(`/rank/${cat}`, l, { title, description: desc, body, jsonLd: [bc(l, [[t.home, '/'], [C + ' ' + t.rankings, `/rank/${cat}`]]), { '@context': 'https://schema.org', '@type': 'ItemList', name: title, numberOfItems: items.length, itemListElement: items.slice(0, 50).map((i, k) => ({ '@type': 'ListItem', position: k + 1, name: nameOf(i, l), url: `${SITE}${prefix(l)}/product/${cat}/${i.id}` })) }] })
    if (l === 'zh') paths.push([`/rank/${cat}`, '0.9', 'weekly'])
  }
  // 详情页
  for (const cat of Object.keys(data)) for (const i of data[cat]) {
    const lines = specLines(cat, i, t.spec).filter(([, v]) => v !== null && v !== undefined)
    const n = nameOf(i, l); const C = t.cat[cat]; const F = t.form[i.form]
    const title = t.prodTitle(n, F, C); const desc = t.prodDesc(i.brand, n, i.release, sumOf(i, l), lines.slice(0, 5).map(([k, v]) => `${k} ${v}`).join(', '))
    const body = `<h1>${esc(n)}</h1><p>${esc(i.brand)} · ${esc(F)} ${esc(C)} · ${esc(i.release)}</p><p>${esc(sumOf(i, l))}</p><table>` + lines.map(([k, v]) => `<tr><th align="left">${esc(k)}</th><td>${esc(v)}</td></tr>`).join('') + `</table><p><a href="${prefix(l)}/rank/${cat}">${esc(t.viewAll(C))}</a></p>`
    render(`/product/${cat}/${i.id}`, l, { title, description: desc, body, image: `/og/${cat}/${i.id}.png`, jsonLd: [bc(l, [[t.home, '/'], [C + ' ' + t.rankings, `/rank/${cat}`], [n, `/product/${cat}/${i.id}`]]), { '@context': 'https://schema.org', '@type': 'Product', name: n, brand: { '@type': 'Brand', name: i.brand }, description: sumOf(i, l), releaseDate: i.release, sku: i.id, url: `${SITE}${prefix(l)}/product/${cat}/${i.id}`, additionalProperty: lines.map(([k, v]) => ({ '@type': 'PropertyValue', name: k, value: String(v) })), ...(i.price_cny ? { offers: { '@type': 'Offer', priceCurrency: 'CNY', price: i.price_cny } } : {}) }] })
    if (l === 'zh') paths.push([`/product/${cat}/${i.id}`, '0.7', 'monthly'])
  }
  render('/guide', l, { title: t.guide[0], description: t.guide[1], body: `<h1>${esc(t.guide[2])}</h1>` })
  render('/methodology', l, { title: t.method[0], description: t.method[1], body: `<h1>${esc(t.method[2])}</h1>` })
  render('/compare', l, { title: t.compare[0], description: t.compare[1], body: `<h1>${esc(t.compare[2])}</h1>` })
  if (l !== 'zh') render('/', l, { title: t.site, description: t.rankDesc(t.cat.cpu + ' / ' + t.cat.gpu, Object.values(data).reduce((n, a) => n + a.length, 0), Object.values(t.form).slice(0, 3)), body: `<h1>${esc(t.site)}</h1>` })
}
paths.push(['/guide', '0.6', 'monthly'], ['/methodology', '0.5', 'monthly'], ['/compare', '0.4', 'monthly'])

const urlEntry = ([u, p, f]) => LANGS.map((l) => `  <url><loc>${SITE}${prefix(l)}${u === '/' ? (l === 'zh' ? '/' : '') : u}</loc><lastmod>${meta.updated}</lastmod><changefreq>${f}</changefreq><priority>${p}</priority>\n` + LANGS.map((x) => `    <xhtml:link rel="alternate" hreflang="${HL[x]}" href="${SITE}${prefix(x)}${u === '/' ? (x === 'zh' ? '/' : '') : u}"/>`).join('\n') + `\n    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}${u}"/>\n  </url>`).join('\n')
writeFileSync(join(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n` + paths.map(urlEntry).join('\n') + '\n</urlset>\n')
writeFileSync(join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`)
console.log(`prerendered ${paths.length} routes × ${LANGS.length} languages, sitemap + robots written`)
