// 分数校准管道：读取 data-src/calibration.csv（id, metric, value, source），按池内比例把真实评测数据换算为 scores 字段
// 用法：node scripts/calibrate.mjs [--dry]
// CSV 列：id,metric,value,source   metric ∈ cb24_st | cb24_mt | gaming | raster | rt | igpu | read_GBs | write_GBs | latency_ns | seq_read | seq_write | iops_4k_read | write_cache_out
// - cb24_* / read_GBs / write_GBs / latency_ns / seq_* / iops / cache_out：写入原始值
// - gaming / raster / rt / igpu：相对指标，按「同品类 + 同 form」池内最大值归一到 100 后写入 *_rel
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
const dry = process.argv.includes('--dry')
const SRC = 'data-src/calibration.csv'
if (!existsSync(SRC)) { console.log(`未找到 ${SRC}。建立该文件后重新运行；模板见 data-src/README.md`); process.exit(0) }
const rows = readFileSync(SRC, 'utf8').split(/\r?\n/).filter((l) => l && !l.startsWith('#') && !l.startsWith('id,')).map((l) => { const [id, metric, value, source] = l.split(','); return { id: id.trim(), metric: metric.trim(), value: Number(value), source: (source ?? '').trim() } })
const files = { cpu: 'cpus.json', gpu: 'gpus.json', ram: 'rams.json', storage: 'storages.json', psu: 'psus.json' }
const data = Object.fromEntries(Object.entries(files).map(([k, f]) => [k, JSON.parse(readFileSync('public/data/' + f, 'utf8'))]))
const where = new Map(); for (const [cat, arr] of Object.entries(data)) for (const it of arr) where.set(it.id, { cat, it })
const RAW = { cb24_st: ['cpu', 'scores.cb24_st'], cb24_mt: ['cpu', 'scores.cb24_mt'], read_GBs: ['ram', 'scores.read_GBs'], write_GBs: ['ram', 'scores.write_GBs'], latency_ns: ['ram', 'scores.latency_ns'], seq_read: ['storage', 'seq_read'], seq_write: ['storage', 'seq_write'], iops_4k_read: ['storage', 'iops_4k_read'], write_cache_out: ['storage', 'write_cache_out'] }
const REL = { gaming: ['cpu', 'gaming_rel'], raster: ['gpu', 'raster_rel'], rt: ['gpu', 'rt_rel'], igpu: ['cpu', 'igpu_rel'] }
const set = (obj, path, v) => { const ks = path.split('.'); let o = obj; for (const k of ks.slice(0, -1)) o = o[k]; o[ks.at(-1)] = v }
let applied = 0, skipped = 0
const relBuckets = {}
for (const r of rows) {
  const hit = where.get(r.id); if (!hit || !Number.isFinite(r.value)) { skipped++; continue }
  if (RAW[r.metric]) { if (RAW[r.metric][0] !== hit.cat) { skipped++; continue } set(hit.it, RAW[r.metric][1], r.value); hit.it.est = false; applied++ }
  else if (REL[r.metric]) { if (REL[r.metric][0] !== hit.cat) { skipped++; continue } const key = `${hit.cat}:${hit.it.form}:${r.metric}`; (relBuckets[key] ??= []).push({ it: hit.it, v: r.value }) }
  else skipped++
}
for (const [key, list] of Object.entries(relBuckets)) {
  const metric = key.split(':')[2]; const max = Math.max(...list.map((x) => x.v))
  for (const { it, v } of list) { it.scores[REL[metric][1]] = Math.round((v / max) * 1000) / 10; it.est = false; applied++ }
}
console.log(`应用 ${applied} 条，跳过 ${skipped} 条${dry ? '（dry-run，未写入）' : ''}`)
if (!dry) {
  for (const [cat, f] of Object.entries(files)) writeFileSync('public/data/' + f, JSON.stringify(data[cat], null, 2) + '\n')
  const meta = JSON.parse(readFileSync('public/data/meta.json', 'utf8')); meta.updated = new Date().toISOString().slice(0, 10); meta.version += 1
  meta.note = '分数来自校准表 data-src/calibration.csv（公开评测），est=true 的条目仍为估算。'
  writeFileSync('public/data/meta.json', JSON.stringify(meta, null, 2) + '\n'); console.log('meta 版本 ->', meta.version)
}
