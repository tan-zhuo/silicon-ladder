// 将 summaries-*.mjs 的翻译写入 public/data/*.json 的 summary_en / summary_ja
import { readFileSync, writeFileSync } from 'node:fs'
import cpu from './summaries-cpu.mjs'
import gpu from './summaries-gpu.mjs'
import misc from './summaries-misc.mjs'
const T = { ...cpu, ...gpu, ...misc }
let done = 0, missing = []
for (const f of ['cpus', 'gpus', 'rams', 'storages', 'psus']) {
  const p = `public/data/${f}.json`; const arr = JSON.parse(readFileSync(p, 'utf8'))
  for (const it of arr) { const tr = T[it.id]; if (!tr) { missing.push(it.id); continue } it.summary_en = tr[0]; it.summary_ja = tr[1]; done++ }
  writeFileSync(p, JSON.stringify(arr, null, 2) + '\n')
}
console.log(`translated ${done}; missing ${missing.length}${missing.length ? ': ' + missing.join(', ') : ''}`)
