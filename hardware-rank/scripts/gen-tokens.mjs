// design/tokens.json → src/tokens.css（CSS 变量）。App 端可用同一 JSON 另行生成平台常量。
import { readFileSync, writeFileSync } from 'node:fs'
const T = JSON.parse(readFileSync('design/tokens.json', 'utf8'))
const px = (n) => `${n}px`
const ent = (o) => Object.entries(o).filter(([k]) => !k.startsWith("$"))
const lines = []
const emitMode = (mode) => {
  const c = T.color[mode], s = T.shadow[mode]
  for (const [k, v] of ent(c)) lines.push(`  --c-${k}: ${v};`)
  for (const [k, v] of ent(s)) lines.push(`  --shadow-${k}: ${v};`)
  for (const k of ['gold', 'silver', 'bronze']) lines.push(`  --${k}: ${T.brand[k][mode]};`)
  lines.push(`  --bar-track: rgb(var(--c-surface-3));`)
  lines.push(`  --bar-fill: linear-gradient(90deg, rgb(var(--c-accent)), rgb(var(--c-accent-2)));`)
  lines.push(`  --bar-fill-dim: rgb(var(--c-line-3) / .9);`)
  lines.push(`  --logo-dark-fill: rgb(var(--c-fg));`)
  lines.push(`  color-scheme: ${mode};`)
}
lines.push('/* 由 scripts/gen-tokens.mjs 自 design/tokens.json 生成——请勿手改 */')
lines.push(':root {')
lines.push(`  --font-sans: ${T.font.sans.$value.map((f) => (f.includes(' ') ? `"${f}"` : f)).join(', ')};`)
lines.push(`  --font-mono: ${T.font.mono.$value.map((f) => (f.includes(' ') ? `"${f}"` : f)).join(', ')};`)
lines.push(`  --font-features: ${T.font.features.$value};`)
for (const [k, v] of ent(T.radius)) lines.push(`  --r-${k}: ${px(v)};`)
for (const [k, v] of ent(T.space)) lines.push(`  --sp-${k}: ${px(v)};`)
for (const [k, v] of ent(T.motion)) { lines.push(`  --dur-${k}: ${v.duration}ms;`); lines.push(`  --ease-${k}: ${v.easing};`) }
for (const [k, v] of ent(T.type)) { lines.push(`  --t-${k}-size: ${px(v.size)}; --t-${k}-line: ${v.line}; --t-${k}-tracking: ${v.tracking}em; --t-${k}-weight: ${v.weight};`) }
lines.push(`  --sidebar-w: ${px(T.layout.sidebar)}; --content-w: ${px(T.layout.content)}; --touch: ${px(T.layout.touch)};`)
for (const k of ['amd', 'nvidia', 'intel', 'apple', 'qualcomm']) lines.push(`  --brand-${k}: ${T.brand[k]};`)
emitMode('light')
lines.push('}')
lines.push('html.dark {')
emitMode('dark')
lines.push('}')
writeFileSync('src/tokens.css', lines.join('\n') + '\n')
console.log('tokens.css written')
