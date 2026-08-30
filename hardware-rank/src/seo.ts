import { watchEffect, onUnmounted, type Ref } from 'vue'

export const SITE_URL = 'https://silicon-ladder.vercel.app'
export const SITE_NAME = 'Silicon Ladder'

export interface SeoInput {
  title: string
  description: string
  path: string
  /** JSON-LD 对象（可多个） */
  jsonLd?: object[]
  image?: string
}

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) { el = document.createElement('meta'); el.setAttribute(attr, key); document.head.appendChild(el) }
  el.setAttribute('content', content)
}
function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)
  if (!el) { el = document.createElement('link'); el.setAttribute('rel', rel); document.head.appendChild(el) }
  el.setAttribute('href', href)
}

export function applySeo(s: SeoInput) {
  const full = s.title.includes(SITE_NAME) ? s.title : `${s.title} · ${SITE_NAME}`
  document.title = full
  const url = SITE_URL + s.path
  upsertMeta('name', 'description', s.description)
  upsertLink('canonical', url)
  upsertMeta('property', 'og:title', full)
  upsertMeta('property', 'og:description', s.description)
  upsertMeta('property', 'og:url', url)
  upsertMeta('property', 'og:type', 'website')
  upsertMeta('property', 'og:site_name', SITE_NAME)
  upsertMeta('property', 'og:image', s.image ?? SITE_URL + '/og.png')
  upsertMeta('name', 'twitter:card', 'summary_large_image')
  upsertMeta('name', 'twitter:title', full)
  upsertMeta('name', 'twitter:description', s.description)
  document.head.querySelectorAll('script[data-seo-jsonld]').forEach((e) => e.remove())
  for (const obj of s.jsonLd ?? []) {
    const el = document.createElement('script')
    el.type = 'application/ld+json'
    el.setAttribute('data-seo-jsonld', '')
    el.textContent = JSON.stringify(obj)
    document.head.appendChild(el)
  }
  // 移除预渲染的 SSR 摘要
  document.getElementById('ssr-summary')?.remove()
}

/** 在页面组件中调用；输入为响应式对象时会随语言/路由变化更新 */
export function useSeo(input: Ref<SeoInput | null> | (() => SeoInput | null)) {
  const stop = watchEffect(() => {
    const v = typeof input === 'function' ? input() : input.value
    if (v) applySeo(v)
  })
  onUnmounted(stop)
}

export const breadcrumb = (items: { name: string; path: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: SITE_URL + it.path })),
})
