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

export function brandColor(brand: string): string {
  switch (brand) {
    case 'AMD': return '#E65C00'
    case 'NVIDIA': return '#76B900'
    case 'Intel': return '#0071C5'
    case 'Apple': return '#8E8E93'
    case 'Qualcomm': return '#3253DC'
    default: return '#8B9BB0'
  }
}
export function yearOf(release: string): number {
  return Number(release.slice(0, 4))
}
