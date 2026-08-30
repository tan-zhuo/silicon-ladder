import { t, locale } from '@/i18n'

export const DASH = '—'

export function num(v: number | null | undefined, digits = 0): string {
  if (v === null || v === undefined || Number.isNaN(v)) return DASH
  return v.toLocaleString('en-US', { maximumFractionDigits: digits, minimumFractionDigits: digits })
}
export function rel(v: number | null | undefined): string {
  return v === null || v === undefined ? DASH : v.toFixed(1)
}
export function price(v: number | null | undefined): string {
  if (v === null || v === undefined) return DASH
  const loc = locale.value === 'zh' ? 'zh-CN' : locale.value === 'ja' ? 'ja-JP' : 'en-US'
  const s = new Intl.NumberFormat(loc, { style: 'currency', currency: 'CNY', maximumFractionDigits: 0 }).format(v)
  return locale.value === 'zh' ? s : s.replace(/^(CN¥|￥|¥|CNY)\s?/, 'CN¥')
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
