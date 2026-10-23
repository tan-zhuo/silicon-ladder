import { t, locale } from '@/i18n'

export const DASH = '—'

export function num(v: number | null | undefined, digits = 0): string {
  if (v === null || v === undefined || Number.isNaN(v)) return DASH
  return v.toLocaleString('en-US', { maximumFractionDigits: digits, minimumFractionDigits: digits })
}
export function rel(v: number | null | undefined): string {
  return v === null || v === undefined ? DASH : v.toFixed(1)
}
/** 汇率由 meta.json 提供（1 CNY → USD / JPY），加载后由 catalog 写入 */
export const FX = { USD: 0.139, JPY: 20.5 }
const fmt0 = (n: number) => n.toLocaleString('en-US', { maximumFractionDigits: 0 })
/** 三币种参考价：当前语言的币种排在最前 */
export function price(v: number | null | undefined): string {
  if (v === null || v === undefined) return DASH
  const parts = { zh: `CN¥${fmt0(v)}`, en: `US$${fmt0(v * FX.USD)}`, ja: `JP¥${fmt0(Math.round((v * FX.JPY) / 100) * 100)}` }
  const order = locale.value === 'en' ? ['en', 'zh', 'ja'] : locale.value === 'ja' ? ['ja', 'zh', 'en'] : ['zh', 'en', 'ja']
  return order.map((k) => parts[k as keyof typeof parts]).join(' · ')
}
/** 单币种（当前语言） */
export function priceShort(v: number | null | undefined): string {
  if (v === null || v === undefined) return DASH
  return locale.value === 'en' ? `US$${fmt0(v * FX.USD)}` : locale.value === 'ja' ? `JP¥${fmt0(Math.round((v * FX.JPY) / 100) * 100)}` : `CN¥${fmt0(v)}`
}
export function bool(v: boolean | null | undefined): string {
  if (v === null || v === undefined) return DASH
  return v ? t('spec.yes') : t('spec.no')
}
export function iops(v: number | null | undefined): string {
  if (v === null || v === undefined) return DASH
  return v >= 1000 ? `${Math.round(v / 1000)}K` : String(v)
}
export function capacity(gb: number): string {
  if (gb < 1) return `${Math.round(gb * 1024)}MB`
  return gb >= 1000 ? `${(gb / 1000).toFixed(gb % 1000 === 0 ? 0 : 1)}TB` : `${gb}GB`
}
export function vram(gb: number): string {
  return gb < 1 ? `${Math.round(gb * 1024)}MB` : `${gb}GB`
}
export const catLabel = (c: string) => t(`cat.${c}`)
export const formLabel = (f: string) => t(`form.${f}`)
export const ifaceLabel = (i: string) => t(`iface.${i}`)
export const modularLabel = (m: string) => t(`modular.${m}`)

/** 品牌主色：天梯条、字标回退、OG 图共用（近似官方色） */
export const BRAND_COLORS: Record<string, string> = {
  AMD: '#E65C00', NVIDIA: '#76B900', Intel: '#0071C5', Apple: '#8E8E93', Qualcomm: '#3253DC',
  Samsung: '#1428A0', Corsair: '#F2C500', Kingston: '#C8102E', HyperX: '#E4002B', Crucial: '#0A64B4', Micron: '#0A64B4',
  'G.Skill': '#E4002B', TEAMGROUP: '#E60012', ADATA: '#E4002B', XPG: '#D8232A', Patriot: '#D71920', PNY: '#1F3A93', Lexar: '#3366CC',
  KINGBANK: '#D0021B', Gloway: '#F28C1C', 'Silicon Power': '#1E4FA3', Colorful: '#E60012', Acer: '#83B81A',
  WD: '#005EB8', SanDisk: '#D22630', Seagate: '#6DBE45', Toshiba: '#E60012', 'SK Hynix': '#F37021', KIOXIA: '#E60012', Solidigm: '#0F1B3D',
  ZhiTai: '#1F6FEB', 致态: '#1F6FEB', Netac: '#1E63C8', Hikvision: '#E60012', Sabrent: '#1E73BE', OCZ: '#1C1C1C', Transcend: '#960014', Hitachi: '#CC0000', HGST: '#005EB8',
  Seasonic: '#003C7D', 'be quiet!': '#F08A00', 'Super Flower': '#F39800', Thermaltake: '#E4002B', 'Cooler Master': '#6B2C91', MSI: '#E4002B', ASUS: '#1F1F1F', Gigabyte: '#F58220',
  EVGA: '#1C1C1C', Antec: '#1C1C1C', FSP: '#005BAC', SilverStone: '#1C1C1C', 'Lian Li': '#1C1C1C', NZXT: '#8B35FF', DeepCool: '#1C1C1C', Phanteks: '#1C1C1C', 'Fractal Design': '#1C1C1C',
  Enermax: '#D71920', Montech: '#1C1C1C', 'Great Wall': '#C8102E', 长城: '#C8102E', Segotep: '#F5B400', 鑫谷: '#F5B400', Huntkey: '#0066B3', 航嘉: '#0066B3', 'Golden Field': '#1E63C8', 金河田: '#1E63C8', Aigo: '#E60012', 爱国者: '#E60012', SAMA: '#1C1C1C', 先马: '#1C1C1C', '1STPLAYER': '#E60012', Rosewill: '#1E63C8', XFX: '#1C1C1C', Zotac: '#F5B400', Sapphire: '#1E63C8', Generic: '#8B9BB0',
}
export function brandColor(brand: string): string {
  return BRAND_COLORS[brand] ?? '#8B9BB0'
}
export function yearOf(release: string): number {
  return Number(release.slice(0, 4))
}
