/** 购买链接：各商城搜索页（静态，不接 API）。亚马逊联盟标签通过 VITE_AMZN_TAG 注入。 */
import type { AnyItem } from '@/types/hardware'
export interface ShopLink { key: string; label: string; url: string; region: string }
const TAG = import.meta.env.VITE_AMZN_TAG as string | undefined
const q = (s: string) => encodeURIComponent(s.trim())
/** 用英文名去掉品牌前缀，商城搜索更稳定 */
export function shopQuery(item: AnyItem): string {
  const n = item.nameEn || item.name
  const base = n.startsWith(item.brand + ' ') ? n.slice(item.brand.length + 1) : n
  return `${item.brand} ${base}`.replace(/\s*\((\d+W|\d+核|\d+-core)\)\s*/g, ' ').trim()
}
export function shopLinks(item: AnyItem): ShopLink[] {
  const s = shopQuery(item)
  const tag = TAG ? `&tag=${TAG}` : ''
  return [
    { key: 'jd', label: '京东', region: 'CN', url: `https://search.jd.com/Search?keyword=${q(s)}&enc=utf-8` },
    { key: 'jdi', label: '京东国际', region: 'CN', url: `https://search.jd.com/Search?keyword=${q(s)}&enc=utf-8&wtype=1` },
    { key: 'amzus', label: 'Amazon.com', region: 'US', url: `https://www.amazon.com/s?k=${q(s)}${tag}` },
    { key: 'amzjp', label: 'Amazon.co.jp', region: 'JP', url: `https://www.amazon.co.jp/s?k=${q(s)}${tag}` },
  ]
}
