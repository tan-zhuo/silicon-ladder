// public/favicon.svg → favicon-32 / icon-192 / icon-512 / apple-touch-icon（满铺底色）/ og.png（站点默认分享图）
import { readFileSync, writeFileSync } from 'node:fs'
import { Resvg } from '@resvg/resvg-js'
const src = readFileSync('public/favicon.svg', 'utf8')
const png = (svg, w) => new Resvg(svg, { fitTo: { mode: 'width', value: w } }).render().asPng()
writeFileSync('public/favicon-32.png', png(src, 32))
writeFileSync('public/icon-192.png', png(src, 192))
writeFileSync('public/icon-512.png', png(src, 512))
const defs = src.match(/<defs>[\s\S]*?<\/defs>/)[0]
const inner = src.replace(/^[\s\S]*?<\/defs>/, '').replace(/<\/svg>\s*$/, '')
// Apple 触控图标：iOS 自行切圆角，这里满铺渐变并把图案缩到 84%
const apple = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">${defs}<rect width="64" height="64" fill="url(#g)"/><g transform="translate(5.12 5.12) scale(.84)">${inner}</g></svg>`
writeFileSync('public/apple-touch-icon.png', png(apple, 180))
const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">${defs}
  <radialGradient id="glow" cx="1" cy="0" r="1"><stop offset="0" stop-color="#3B63E0" stop-opacity=".35"/><stop offset="1" stop-color="#09090B" stop-opacity="0"/></radialGradient>
  <rect width="1200" height="630" fill="#09090B"/><rect width="1200" height="630" fill="url(#glow)"/>
  <g transform="translate(96 215) scale(3.125)">${inner}</g>
  <text x="340" y="300" font-family="DejaVu Sans" font-size="84" font-weight="bold" fill="#EDEDF0" letter-spacing="-2">CPU.News</text>
  <text x="344" y="356" font-family="DejaVu Sans" font-size="30" fill="#9699A3">Consumer hardware rankings &amp; ladders</text>
  <text x="344" y="402" font-family="DejaVu Sans" font-size="22" fill="#6C6F7A">CPU · GPU · Memory · Storage · PSU</text>
  <rect x="344" y="440" width="300" height="6" rx="3" fill="#3B63E0"/>
</svg>`
writeFileSync('public/og.png', png(og, 1200))
console.log('icons written')
