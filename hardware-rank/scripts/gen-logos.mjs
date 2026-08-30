// 构建期从 simple-icons（MIT / CC0 品牌路径）导出用到的官方 Logo 路径，生成 src/assets/brandLogos.ts
import { writeFileSync } from 'node:fs'
import * as si from 'simple-icons'
const map = {
  AMD: 'siAmd', Intel: 'siIntel', NVIDIA: 'siNvidia', Apple: 'siApple', Qualcomm: 'siQualcomm',
  Samsung: 'siSamsung', Corsair: 'siCorsair', Kingston: 'siKingstontechnology', Seagate: 'siSeagate',
  MSI: 'siMsi', 'Cooler Master': 'siCoolermaster',
}
const out = {}
for (const [brand, key] of Object.entries(map)) {
  const icon = si[key]
  if (!icon) { console.warn('missing', key); continue }
  out[brand] = { title: icon.title, hex: '#' + icon.hex, path: icon.path }
}
writeFileSync('src/assets/brandLogos.ts',
  `// 自动生成：npm run gen:logos（来源 simple-icons，官方品牌矢量）\n` +
  `export interface BrandLogo { title: string; hex: string; path: string }\n` +
  `export const BRAND_LOGOS: Record<string, BrandLogo> = ${JSON.stringify(out, null, 2)}\n`)
console.log('generated', Object.keys(out).length, 'logos')
