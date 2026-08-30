import { computed, ref } from 'vue'
import { zh } from './zh'
import { en } from './en'
import { ja } from './ja'

export type Locale = 'zh' | 'en' | 'ja'
export const LOCALES: { key: Locale; label: string }[] = [
  { key: 'zh', label: '中文' },
  { key: 'en', label: 'English' },
  { key: 'ja', label: '日本語' },
]
const KEY = 'sl-lang'
const messages: Record<Locale, Msg> = { zh, en, ja }
export type Msg = typeof zh

function detect(): Locale {
  try { const v = localStorage.getItem(KEY); if (v === 'zh' || v === 'en' || v === 'ja') return v } catch { /* ignore */ }
  const nav = (navigator.language || 'zh').toLowerCase()
  if (nav.startsWith('ja')) return 'ja'
  if (nav.startsWith('en')) return 'en'
  return 'zh'
}

export const locale = ref<Locale>(detect())
export function setLocale(l: Locale) {
  locale.value = l
  try { localStorage.setItem(KEY, l) } catch { /* ignore */ }
  document.documentElement.lang = l === 'zh' ? 'zh-CN' : l
}
document.documentElement.lang = locale.value === 'zh' ? 'zh-CN' : locale.value

function get(obj: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((o, k) => (o && typeof o === 'object' ? (o as Record<string, unknown>)[k] : undefined), obj)
}

/** t('rank.count', { n: 5 }) */
export function t(path: string, params?: Record<string, string | number>): string {
  let v = get(messages[locale.value], path)
  if (v === undefined) v = get(messages.zh, path)
  if (typeof v !== 'string') return path
  if (params) for (const [k, val] of Object.entries(params)) v = (v as string).split(`{${k}}`).join(String(val))
  return v as string
}

export function useI18n() {
  return { t, locale, setLocale, m: computed(() => messages[locale.value]) }
}

/** 产品显示名：非中文环境优先英文名 */
export function displayName(item: { name: string; nameEn?: string; brand?: string }): string {
  if (locale.value === 'zh' || !item.nameEn) return item.name
  // 去掉重复的品牌前缀（"NVIDIA GeForce RTX 5090" -> "GeForce RTX 5090"）
  const prefix = item.brand ? item.brand + ' ' : ''
  return prefix && item.nameEn.startsWith(prefix) ? item.nameEn.slice(prefix.length) : item.nameEn
}

/** 产品一句话评价：按语言取 summary_en / summary_ja，缺失回退中文 */
export function displaySummary(item: { summary: string; summary_en?: string; summary_ja?: string }): string {
  if (locale.value === 'en') return item.summary_en || item.summary
  if (locale.value === 'ja') return item.summary_ja || item.summary
  return item.summary
}
/** 标签翻译 */
export function tagLabel(tag: string): string {
  const v = get(messages[locale.value], 'tags.' + tag)
  return typeof v === 'string' ? v : tag
}
