// 品牌 Logo：design/brand-logos.json → src/assets/logos/*.svg + src/assets/brandLogos.ts
// 来源：simple-icons（单路径 24×24）/ Wikimedia Commons（svgo 压缩；单一深色填充自动改 currentColor 以适配暗色）
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'node:fs'
import * as si from 'simple-icons'
import { optimize } from 'svgo'

const MAN = JSON.parse(readFileSync('design/brand-logos.json', 'utf8'))
const OUT = 'src/assets/logos'
mkdirSync(OUT, { recursive: true })
const slug = (b) => b.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const UA = { 'User-Agent': 'cpu.news-bot/1.0 (contact: tanzhuoyanuoer@gmail.com)' }
const BROWSER = { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36' }
const force = process.argv.includes('--force')
async function fetchText(url, extra = {}) { const r = await fetch(url, { headers: { ...(url.includes('wikimedia.org') ? UA : BROWSER), ...extra }, redirect: 'follow' }); if (!r.ok) throw new Error(`${r.status} ${url}`); return r.text() }

/** 去重后的非 none 填充/描边色 */
function colorsOf(svg) {
  const set = new Set()
  for (const m of svg.matchAll(/(?:fill|stroke|stop-color)\s*[:=]\s*["']?\s*(#[0-9a-fA-F]{3,8}|rgb\([^)]*\)|[a-zA-Z]+)/g)) {
    const c = m[1].toLowerCase(); if (['none', 'transparent', 'currentcolor', 'url', 'inherit'].includes(c)) continue; set.add(c)
  }
  return [...set]
}
const gray = (c) => { const m = c.match(/^#([0-9a-f]{6})$/); if (!m) return c === 'black'; const r = parseInt(m[1].slice(0, 2), 16), g = parseInt(m[1].slice(2, 4), 16), b = parseInt(m[1].slice(4, 6), 16); return Math.max(r, g, b) - Math.min(r, g, b) < 40 }
const lum = (c) => { const m = c.match(/^#([0-9a-f]{3,8})$/); if (!m) return c === 'black' ? 0 : 255; let h = m[1]; if (h.length === 3) h = h.split('').map((x) => x + x).join(''); return (parseInt(h.slice(0, 2), 16) * 299 + parseInt(h.slice(2, 4), 16) * 587 + parseInt(h.slice(4, 6), 16) * 114) / 1000 }

function normalize(raw, mono, singleColor, whiteToCurrent = false, stripClip = false) {
  const { data } = optimize(raw, { multipass: true, plugins: [{ name: 'preset-default', params: { overrides: { inlineStyles: { onlyMatchedOnce: false } } } }, 'removeDimensions', 'removeXMLNS', { name: 'prefixIds', params: { prefix: 'bl' } }] })
  let svg = data
  const isDarkGray = (c) => { const n = c.length === 4 ? '#' + c.slice(1).split('').map((x) => x + x).join('') : c; return n === 'black' || (gray(n) && lum(n) < 70) }
  // 近黑 / 单色 → currentColor：由组件按主题给色；其余品牌色保持
  svg = svg.replace(/(fill|stroke)(\s*[=:]\s*["']?)(#[0-9a-fA-F]{3,6}|black)/g, (m, k, sep, c) => (mono || isDarkGray(c.toLowerCase()) || (singleColor && c.toLowerCase() === singleColor) ? `${k}${sep}currentColor` : m))
  if (stripClip) svg = svg.replace(/<clipPath[\s\S]*?<\/clipPath>/g, '').replace(/\s*clip-path="[^"]*"/g, '').replace(/<defs>\s*<\/defs>/g, '')
  if (whiteToCurrent) svg = svg.replace(/(fill|stroke)(\s*[=:]\s*["']?)(#fff|#ffffff|white)\b/gi, '$1$2currentColor')
  // 未显式填充的元素默认黑 → 根上补 currentColor 让其继承
  if (!/<svg[^>]*\sfill=/.test(svg)) svg = svg.replace('<svg', '<svg fill="currentColor"')
  return svg.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"')
}

const out = {}
for (const [brand, src] of Object.entries(MAN)) {
  if (brand.startsWith('$')) continue
  if (src.si) {
    const icon = si[src.si]; if (!icon) { console.warn('missing si', src.si); continue }
    out[brand] = { title: icon.title, hex: '#' + icon.hex, path: icon.path }
    continue
  }
  const file = `${OUT}/${slug(brand)}.svg`
  if (!existsSync(file) || force) {
    const url = src.url ?? `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(src.commons.replace(/^File:/, ''))}`
    let raw
    try { raw = await fetchText(url, src.referer ? { Referer: src.referer } : {}) } catch (e) { console.warn('fetch failed', brand, e.message); continue }
    const cols = colorsOf(raw)
    // 单一深色（或无显式颜色）→ 单色处理；多色保持原样
    const norm = cols.map((c) => (c.length === 4 && c[0] === '#' ? '#' + c.slice(1).split('').map((x) => x + x).join('') : c))
    const real = norm.filter((c) => c !== '#ffffff' && c !== 'white')
    const single = real.length === 1 ? real[0] : null // 单一品牌色：改 currentColor，由组件着色（亮色用品牌色，暗色若太深则用前景色）
    const mono = src.mono ?? (real.length === 0 || (single !== null && gray(single)))
    writeFileSync(file, normalize(raw, mono, single, !!src.whiteToCurrent, !!src.stripClip))
    writeFileSync(file + '.json', JSON.stringify({ mono, tone: single && !gray(single) ? single : null, colors: cols, source: url }))
    console.log('fetched', brand.padEnd(14), mono ? 'mono ' : 'color', cols.slice(0, 4).join(','))
  }
  const meta = JSON.parse(readFileSync(file + '.json', 'utf8'))
  const mono = src.mono ?? meta.mono
  const vb = readFileSync(file, 'utf8').match(/viewBox="([^"]+)"/)?.[1] ?? '0 0 1 1'
  const [, , w, h] = vb.split(/[\s,]+/).map(Number)
  const tone = src.hex ?? meta.tone ?? null
  out[brand] = { title: brand, hex: tone ?? (meta.colors.find((c) => c.startsWith('#') && c !== '#ffffff') ?? '#111113'), file: `${slug(brand)}.svg`, mono, ...(tone ? { tone, toneDark: lum(tone.length === 4 ? '#' + tone.slice(1).split('').map((x) => x + x).join('') : tone) < 110 } : {}), ratio: +(w / h).toFixed(3) }
}
const id = (f) => 'l_' + f.replace(/[^a-z0-9]/g, '_')
const imports = Object.values(out).filter((v) => v.file).map((v) => `import ${id(v.file)} from './logos/${v.file}?raw'`).join('\n')
const body = JSON.stringify(out, null, 2).replace(/"file": "([^"]+)"/g, (_, f) => `"svg": ${id(f)}`)
writeFileSync('src/assets/brandLogos.ts',
  `// 自动生成：npm run gen:logos（来源 simple-icons 与 Wikimedia Commons；品牌标识仅用于识别，商标归各自所有者）\n${imports}\n` +
  `export interface BrandLogo { title: string; hex: string; path?: string; svg?: string; mono?: boolean; tone?: string; toneDark?: boolean; ratio?: number }\n` +
  `export const BRAND_LOGOS: Record<string, BrandLogo> = ${body}\n`)
console.log('generated', Object.keys(out).length, 'logos')
