// 构建后：为每个产品生成 1200×630 OG 图（SVG → PNG，@resvg/resvg-js，DejaVu 字体，仅拉丁文本）
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { Resvg } from '@resvg/resvg-js'

const DIST = 'dist'
const load = (f) => JSON.parse(readFileSync(`public/data/${f}`, 'utf8'))
const data = { cpu: load('cpus.json'), gpu: load('gpus.json'), ram: load('rams.json'), storage: load('storages.json'), psu: load('psus.json') }
const CAT = { cpu: 'CPU', gpu: 'GPU', ram: 'MEMORY', storage: 'STORAGE', psu: 'PSU' }
const FORM = { desktop: 'Desktop', laptop: 'Laptop', igpu: 'iGPU', 'kit-desktop': 'Desktop kit', sodimm: 'SO-DIMM', onboard: 'Onboard', nvme: 'NVMe', sata: 'SATA', hdd: 'HDD', atx: 'ATX', sfx: 'SFX' }
const COLOR = { AMD: '#E65C00', NVIDIA: '#76B900', Intel: '#0071C5', Apple: '#8E8E93', Qualcomm: '#3253DC' }
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))
const latin = (s) => String(s ?? '').replace(/[^\x20-\x7E -ɏ–—·×]/g, '').replace(/\s+/g, ' ').trim()
const nameOf = (i) => { const n = i.nameEn || i.name; return n.startsWith(i.brand + ' ') ? n.slice(i.brand.length + 1) : n }

function lines(cat, i) {
  switch (cat) {
    case 'cpu': return [['Cores', i.cores], ['Clocks', i.clocks], ['TDP', i.tdp_w + 'W'], ['Socket', i.socket], ['L3', i.cache_l3]]
    case 'gpu': return [['VRAM', `${i.vram_gb}GB ${i.vram_type.split(' ')[0]}`], ['Bus', i.bus_bit + '-bit'], [i.form === 'laptop' ? 'TGP' : 'TBP', (i.tgp_w ?? i.tdp_w) + 'W'], ['Die', i.chip], ['Arch', i.gen]]
    case 'ram': return [['Spec', i.spec], ['Speed', i.speed_mt + ' MT/s'], ['CL', i.cl ?? '—'], ['Read', i.scores.read_GBs ? i.scores.read_GBs + ' GB/s' : '—'], ['Latency', i.scores.latency_ns ? i.scores.latency_ns + ' ns' : '—']]
    case 'storage': return [['Interface', i.interface.toUpperCase()], ['Capacity', i.capacity_gb >= 1000 ? i.capacity_gb / 1000 + 'TB' : i.capacity_gb + 'GB'], ['Seq. read', i.seq_read ? i.seq_read + ' MB/s' : '—'], ['4K read', i.iops_4k_read ? Math.round(i.iops_4k_read / 1000) + 'K IOPS' : '—'], ['DRAM', i.dram ? 'Yes' : 'No']]
    case 'psu': return [['Wattage', i.watt + 'W'], ['Tier', i.tier], ['Rating', i.efficiency], ['ATX 3.1', i.atx31 ? 'Yes' : 'No'], ['Modular', i.modular]]
  }
}
const fit = (s, max) => (s.length > max ? s.slice(0, max - 1) + '…' : s)

function svg(cat, i) {
  const c = COLOR[i.brand] ?? '#5B8CFF'
  const name = latin(nameOf(i)); const size = name.length > 26 ? 52 : name.length > 18 ? 64 : 76
  const rows = lines(cat, i).map(([k, v]) => [k, latin(fit(String(v), 34))])
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c}" stop-opacity=".35"/><stop offset=".6" stop-color="#0B0F14" stop-opacity="0"/></linearGradient>
  <linearGradient id="b" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${c}"/><stop offset="1" stop-color="${c}" stop-opacity=".4"/></linearGradient></defs>
  <rect width="1200" height="630" fill="#0B0F14"/><rect width="1200" height="630" fill="url(#g)"/>
  <rect x="0" y="0" width="14" height="630" fill="${c}"/>
  <text x="80" y="92" font-family="DejaVu Sans" font-size="24" font-weight="bold" fill="${c}" letter-spacing="6">${esc(i.brand.toUpperCase())}  ·  ${CAT[cat]}  ·  ${esc(FORM[i.form].toUpperCase())}</text>
  <text x="80" y="${92 + size + 30}" font-family="DejaVu Sans" font-size="${size}" font-weight="bold" fill="#E7EEF6">${esc(fit(name, 34))}</text>
  <text x="80" y="${92 + size + 78}" font-family="DejaVu Sans" font-size="26" fill="#8B9BB0">${esc(i.release)}${i.est ? '  ·  estimated score' : ''}</text>
  ${rows.map(([k, v], n) => `<text x="80" y="${330 + n * 46}" font-family="DejaVu Sans" font-size="26" fill="#8B9BB0">${esc(k)}</text><text x="300" y="${330 + n * 46}" font-family="DejaVu Sans" font-size="26" font-weight="bold" fill="#E7EEF6">${esc(v)}</text>`).join('')}
  <rect x="80" y="562" width="360" height="6" rx="3" fill="url(#b)"/>
  <text x="1120" y="590" text-anchor="end" font-family="DejaVu Sans" font-size="26" font-weight="bold" fill="#E7EEF6">Silicon Ladder</text>
  <text x="1120" y="616" text-anchor="end" font-family="DejaVu Sans" font-size="18" fill="#8B9BB0">silicon-ladder.vercel.app</text>
</svg>`
}

const fonts = ['assets/fonts/DejaVuSans.ttf', 'assets/fonts/DejaVuSans-Bold.ttf'].map((f) => readFileSync(f))
let n = 0
for (const cat of Object.keys(data)) {
  mkdirSync(join(DIST, 'og', cat), { recursive: true })
  for (const i of data[cat]) {
    const r = new Resvg(svg(cat, i), { fitTo: { mode: 'width', value: 1200 }, font: { fontBuffers: fonts, defaultFontFamily: 'DejaVu Sans', loadSystemFonts: false } })
    writeFileSync(join(DIST, 'og', cat, `${i.id}.png`), r.render().asPng()); n++
  }
}
console.log(`og images: ${n}`)
