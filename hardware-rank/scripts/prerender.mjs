// 构建后：为每个路由生成静态 HTML（正确的 title/meta/JSON-LD + 可见摘要），并输出 sitemap.xml / robots.txt
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

const SITE = 'https://silicon-ladder.vercel.app'
const DIST = 'dist'
const load = (f) => JSON.parse(readFileSync(`public/data/${f}`, 'utf8'))
const meta = load('meta.json')
const data = { cpu: load('cpus.json'), gpu: load('gpus.json'), ram: load('rams.json'), storage: load('storages.json'), psu: load('psus.json') }
const CAT = { cpu: 'CPU', gpu: 'GPU', ram: '内存', storage: '存储', psu: '电源' }
const FORM = { desktop: '桌面', laptop: '笔记本', igpu: '核显', 'kit-desktop': '台式套装', sodimm: '笔记本条', onboard: '板载', nvme: 'NVMe', sata: 'SATA', hdd: 'HDD', atx: 'ATX', sfx: 'SFX' }
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))

const template = readFileSync(join(DIST, 'index.html'), 'utf8')
function render(path, { title, description, jsonLd = [], body = '' }) {
  const url = SITE + path
  let html = template
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${esc(description)}" />`)
    .replace(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${url}" />`)
    .replace(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${esc(title)}" />`)
  html = html.replace('</head>', `    <meta property="og:url" content="${url}" />\n    <meta property="og:description" content="${esc(description)}" />\n` + jsonLd.map((o) => `    <script type="application/ld+json">${JSON.stringify(o)}</script>`).join('\n') + '\n  </head>')
  html = html.replace('<div id="app"></div>', `<div id="app"></div>\n    <div id="ssr-summary" style="max-width:960px;margin:24px auto;padding:0 16px;font-family:system-ui,sans-serif;color:#0F172A">${body}</div>`)
  const dir = join(DIST, path)
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'index.html'), html) // 目录索引形式（Netlify / 通用静态托管）
  if (path !== '/') writeFileSync(join(DIST, path + '.html'), html) // cleanUrls 形式（Vercel）
}
const bc = (items) => ({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it[0], item: SITE + it[1] })) })

const urls = [['/', '1.0', 'daily']]
// 排行页
for (const cat of Object.keys(data)) {
  const forms = [...new Set(data[cat].map((i) => i.form))]
  const items = data[cat]
  const title = `${CAT[cat]} 排行榜 / 天梯图 — ${forms.map((f) => FORM[f]).join(' / ')}分池 · Silicon Ladder`
  const desc = `${CAT[cat]} 排行榜与天梯图，收录 ${items.length} 款（${forms.map((f) => FORM[f]).join('、')}），支持游戏 / 单核 / 多核 / 能效 / 性价比切换，AMD、Intel、NVIDIA 并列对照。数据更新 ${meta.updated}。`
  const body = `<h1>${esc(CAT[cat])} 排行榜 / 天梯图</h1><p>${esc(desc)}</p>` + forms.map((f) => `<h2>${esc(FORM[f])} ${esc(CAT[cat])}</h2><ol>` + items.filter((i) => i.form === f).slice(0, 80).map((i) => `<li><a href="/product/${cat}/${i.id}">${esc(i.name)}</a> — ${esc(i.brand)} · ${esc(i.release)} · ${esc(i.summary)}</li>`).join('') + '</ol>').join('')
  render(`/rank/${cat}`, { title, description: desc, body, jsonLd: [bc([['首页', '/'], [CAT[cat] + ' 排行榜', `/rank/${cat}`]]), { '@context': 'https://schema.org', '@type': 'ItemList', name: title, numberOfItems: items.length, itemListElement: items.slice(0, 50).map((i, k) => ({ '@type': 'ListItem', position: k + 1, name: i.name, url: `${SITE}/product/${cat}/${i.id}` })) }] })
  urls.push([`/rank/${cat}`, '0.9', 'weekly'])
}
// 详情页
function specLines(cat, i) {
  switch (cat) {
    case 'cpu': return [['插槽', i.socket], ['核心 / 线程', i.cores], ['频率', i.clocks], ['TDP', i.tdp_w + 'W'], ['核显', i.igpu ?? '—'], ['L3', i.cache_l3], ['内存', i.mem], ['Cinebench 2024 单核', i.scores.cb24_st], ['Cinebench 2024 多核', i.scores.cb24_mt]]
    case 'gpu': return [['架构', i.gen], ['核心', i.chip], ['显存', `${i.vram_gb}GB ${i.vram_type}`], ['位宽', i.bus_bit + '-bit'], [i.form === 'laptop' ? 'TGP' : 'TBP', (i.tgp_w ?? i.tdp_w) + 'W'], ['光栅相对分', i.scores.raster_rel], ['光追相对分', i.scores.rt_rel ?? '—']]
    case 'ram': return [['规格', i.spec], ['容量', i.capacity_gb + 'GB'], ['速率', i.speed_mt + ' MT/s'], ['CL', i.cl ?? '—'], ['读带宽', i.scores.read_GBs ? i.scores.read_GBs + ' GB/s' : '—'], ['延迟', i.scores.latency_ns ? i.scores.latency_ns + ' ns' : '—']]
    case 'storage': return [['接口', i.interface], ['容量', i.capacity_gb + 'GB'], ['颗粒', i.nand ?? '—'], ['DRAM', i.dram ? '有' : '无'], ['顺序读/写', `${i.seq_read ?? '—'} / ${i.seq_write ?? '—'} MB/s`], ['4K 随机读', i.iops_4k_read ?? '—'], ['缓外写入', i.write_cache_out ? i.write_cache_out + ' MB/s' : '—'], ['TBW', i.tbw ?? '—']]
    case 'psu': return [['瓦数', i.watt + 'W'], ['分档', i.tier], ['认证', i.efficiency], ['ATX 3.1', i.atx31 ? '是' : '否'], ['模组', i.modular], ['OEM', i.oem]]
  }
}
for (const cat of Object.keys(data)) for (const i of data[cat]) {
  const lines = specLines(cat, i).filter(([, v]) => v !== null && v !== undefined)
  const title = `${i.name} 规格、跑分、天梯排名与兼容性 · ${FORM[i.form]} ${CAT[cat]} · Silicon Ladder`
  const desc = `${i.brand} ${i.name}（${i.release}）：${i.summary} ${lines.slice(0, 5).map(([k, v]) => `${k} ${v}`).join('，')}。`
  const body = `<h1>${esc(i.name)}</h1><p>${esc(i.brand)} · ${esc(FORM[i.form])} ${esc(CAT[cat])} · ${esc(i.release)}</p><p>${esc(i.summary)}</p><table>` + lines.map(([k, v]) => `<tr><th align="left">${esc(k)}</th><td>${esc(v)}</td></tr>`).join('') + `</table><p><a href="/rank/${cat}">查看 ${esc(CAT[cat])} 完整排行榜</a></p>`
  render(`/product/${cat}/${i.id}`, { title, description: desc, body, jsonLd: [bc([['首页', '/'], [CAT[cat] + ' 排行榜', `/rank/${cat}`], [i.name, `/product/${cat}/${i.id}`]]), { '@context': 'https://schema.org', '@type': 'Product', name: i.name, brand: { '@type': 'Brand', name: i.brand }, description: i.summary, releaseDate: i.release, sku: i.id, url: `${SITE}/product/${cat}/${i.id}`, additionalProperty: lines.map(([k, v]) => ({ '@type': 'PropertyValue', name: k, value: String(v) })), ...(i.price_cny ? { offers: { '@type': 'Offer', priceCurrency: 'CNY', price: i.price_cny } } : {}) }] })
  urls.push([`/product/${cat}/${i.id}`, '0.7', 'monthly'])
}
render('/guide', { title: '场景选购指南 — 游戏 / 生产力 / 轻薄本 / 游戏本 · Silicon Ladder', description: '四个常见场景各 3 条硬件推荐：纯游戏台式机、生产力剪辑、轻薄本、游戏本。', body: '<h1>场景选购指南</h1>' })
render('/methodology', { title: '方法论与数据来源 — 分池归一、综合权重、电源分档 · Silicon Ladder', description: '相对分 rel(x)=x/max×100 同形态池内归一；桌面 CPU 游戏 40%+单核 25%+多核 25%+能效 10%；GPU 光栅 55%+光追 25%+能效 20%；电源按 Tier 分档不跑分。', body: '<h1>方法论与数据来源</h1>' })
render('/compare', { title: '硬件对比 — 同品类最多 4 项并排 · Silicon Ladder', description: 'CPU / GPU / 内存 / 存储 / 电源同品类并排对比，规格与相对分一目了然。', body: '<h1>硬件对比</h1>' })
urls.push(['/guide', '0.6', 'monthly'], ['/methodology', '0.5', 'monthly'], ['/compare', '0.4', 'monthly'])

writeFileSync(join(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` + urls.map(([u, p, f]) => `  <url><loc>${SITE}${u}</loc><lastmod>${meta.updated}</lastmod><changefreq>${f}</changefreq><priority>${p}</priority></url>`).join('\n') + '\n</urlset>\n')
writeFileSync(join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`)
console.log(`prerendered ${urls.length} routes, sitemap + robots written`)
