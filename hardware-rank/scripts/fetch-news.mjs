// 抓取厂商官方新闻源（仅标题/链接/日期/来源，不存正文），写入 public/data/news.json
// 用法：node scripts/fetch-news.mjs
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { createHash } from 'node:crypto'

const UA = 'Mozilla/5.0 (compatible; CPUNewsBot/1.0; +https://cpu.news)'
const FEEDS = [
  { brand: 'AMD', source: 'AMD Newsroom (IR)', url: 'https://ir.amd.com/rss/news-releases.xml' },
  { brand: 'NVIDIA', source: 'NVIDIA Newsroom', url: 'https://nvidianews.nvidia.com/releases.xml' },
  { brand: 'NVIDIA', source: 'NVIDIA Blog', url: 'https://blogs.nvidia.com/feed/' },
  { brand: 'Apple', source: 'Apple Newsroom', url: 'https://www.apple.com/newsroom/rss-feed.rss' },
  { brand: 'Samsung', source: 'Samsung Newsroom', url: 'https://news.samsung.com/global/feed' },
]
const decode = (s) => s.replace(/<!\[CDATA\[(.*?)\]\]>/gs, '$1').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#0?39;|&apos;|&#8217;/g, '’').replace(/&#8220;|&#8221;/g, '"').replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(n)).replace(/\s+/g, ' ').trim()
const tag = (xml, name) => { const m = xml.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`)); return m ? m[1] : '' }

function parse(xml) {
  const items = []
  // RSS <item> 与 Atom <entry>
  for (const m of xml.matchAll(/<item>([\s\S]*?)<\/item>/g)) {
    const x = m[1]
    items.push({ title: decode(tag(x, 'title')), url: decode(tag(x, 'link')), date: tag(x, 'pubDate') || tag(x, 'dc:date') })
  }
  if (!items.length) for (const m of xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)) {
    const x = m[1]
    const link = (x.match(/<link[^>]*href="([^"]+)"/) || [])[1] || ''
    items.push({ title: decode(tag(x, 'title')), url: decode(link), date: tag(x, 'updated') || tag(x, 'published') })
  }
  return items
}
const iso = (d) => { const t = new Date(decode(String(d))); return isNaN(t) ? null : t.toISOString().slice(0, 10) }

const out = []
for (const f of FEEDS) {
  try {
    const res = await fetch(f.url, { headers: { 'user-agent': UA, accept: 'application/rss+xml, application/xml, text/xml, */*' }, signal: AbortSignal.timeout(20000) })
    if (!res.ok) { console.error('skip', f.source, res.status); continue }
    const xml = await res.text()
    let n = 0
    for (const it of parse(xml)) {
      const date = iso(it.date)
      if (!it.title || !it.url || !date) continue
      out.push({ id: createHash('md5').update(it.url).digest('hex').slice(0, 12), brand: f.brand, source: f.source, title: it.title, url: it.url, date })
      n++
    }
    console.log(f.source, '+' + n)
  } catch (e) { console.error('fail', f.source, e.message) }
}
// 与已有合并去重（按 url hash），保留 180 天内或每源最新 30 条
const P = 'public/data/news.json'
const prev = existsSync(P) ? JSON.parse(readFileSync(P, 'utf8')).items ?? [] : []
const map = new Map(prev.map((i) => [i.id, i]))
for (const i of out) map.set(i.id, i)
let items = [...map.values()].sort((a, b) => b.date.localeCompare(a.date))
const cutoff = new Date(Date.now() - 180 * 86400e3).toISOString().slice(0, 10)
const bySource = {}
items = items.filter((i) => { bySource[i.source] = (bySource[i.source] ?? 0) + 1; return i.date >= cutoff || bySource[i.source] <= 30 })
writeFileSync(P, JSON.stringify({ updated: new Date().toISOString().slice(0, 10), note: '仅聚合厂商官方新闻源的标题与链接，正文请访问官方原文。', items }, null, 2) + '\n')
console.log('news.json ->', items.length, 'items')
