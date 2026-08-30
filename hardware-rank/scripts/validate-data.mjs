// 数据校验：id 唯一与格式、必填字段、枚举、分数为 number|null（禁止 0 假充）、发布日期格式；失败则退出码 1
import { readFileSync } from 'node:fs'
const D = 'public/data/'
const load = (f) => JSON.parse(readFileSync(D + f, 'utf8'))
const errors = []
const err = (f, id, msg) => errors.push(`${f} [${id}] ${msg}`)
const isNumOrNull = (v) => v === null || (typeof v === 'number' && Number.isFinite(v))
const ID = /^[a-z0-9]+(-[a-z0-9+.]+)*$/
const REL = /^\d{4}-\d{2}(-\d{2})?$/

const RULES = {
  'cpus.json': { form: ['desktop', 'laptop'], brand: ['AMD', 'Intel', 'Apple', 'Qualcomm'], req: ['series', 'gen', 'socket', 'cores', 'clocks', 'tdp_w', 'cache_l3', 'mem'], scores: ['cb24_st', 'cb24_mt', 'gaming_rel', 'igpu_rel'] },
  'gpus.json': { form: ['desktop', 'laptop', 'igpu'], brand: ['NVIDIA', 'AMD', 'Intel', 'Apple', 'Qualcomm'], req: ['series', 'gen', 'chip', 'vram_gb', 'vram_type', 'bus_bit', 'tdp_w'], scores: ['raster_rel', 'rt_rel'] },
  'rams.json': { form: ['kit-desktop', 'sodimm', 'onboard'], req: ['type', 'spec', 'capacity_gb', 'speed_mt'], scores: ['read_GBs', 'write_GBs', 'latency_ns'] },
  'storages.json': { form: ['nvme', 'sata', 'hdd'], req: ['interface', 'capacity_gb', 'dram'], nums: ['seq_read', 'seq_write', 'iops_4k_read', 'write_cache_out', 'tbw'] },
  'psus.json': { form: ['atx', 'sfx'], req: ['watt', 'tier', 'efficiency', 'atx31', 'modular', 'oem'], enums: { tier: ['A', 'B', 'C', 'D'], modular: ['full', 'semi', 'none'] } },
}
const allIds = new Map()
let total = 0
for (const [f, rule] of Object.entries(RULES)) {
  const arr = load(f)
  const seen = new Set()
  for (const it of arr) {
    total++
    const id = it.id ?? '?'
    if (!ID.test(id)) err(f, id, 'id 需为小写 kebab-case')
    if (seen.has(id)) err(f, id, 'id 重复'); seen.add(id)
    if (allIds.has(id) && allIds.get(id) !== f) err(f, id, `id 与 ${allIds.get(id)} 冲突`); allIds.set(id, f)
    for (const k of ['name', 'brand', 'form', 'release', 'summary']) if (it[k] === undefined || it[k] === '') err(f, id, `缺少 ${k}`)
    if (!rule.form.includes(it.form)) err(f, id, `form 非法: ${it.form}`)
    if (rule.brand && !rule.brand.includes(it.brand)) err(f, id, `brand 非法: ${it.brand}`)
    if (!REL.test(it.release ?? '')) err(f, id, `release 格式应为 YYYY-MM: ${it.release}`)
    for (const k of rule.req) if (it[k] === undefined) err(f, id, `缺少字段 ${k}`)
    if (it.price_cny !== undefined && !isNumOrNull(it.price_cny)) err(f, id, 'price_cny 需 number|null')
    if (it.price_cny === 0) err(f, id, 'price_cny 不应为 0，缺失请用 null')
    if (rule.scores) {
      if (!it.scores) err(f, id, '缺少 scores')
      else for (const k of rule.scores) {
        if (!(k in it.scores)) err(f, id, `scores 缺少 ${k}`)
        else if (!isNumOrNull(it.scores[k])) err(f, id, `scores.${k} 需 number|null`)
        else if (it.scores[k] === 0) err(f, id, `scores.${k} 为 0，缺失请用 null`)
      }
    }
    if (rule.nums) for (const k of rule.nums) if (!isNumOrNull(it[k])) err(f, id, `${k} 需 number|null`)
    if (rule.enums) for (const [k, vals] of Object.entries(rule.enums)) if (!vals.includes(it[k])) err(f, id, `${k} 非法: ${it[k]}`)
    if (typeof it.summary === 'string' && it.summary.length > 60) err(f, id, `summary 过长 (${it.summary.length})`)
  }
}
if (errors.length) { console.error(errors.join('\n')); console.error(`\n✗ ${errors.length} 个问题，共 ${total} 条`); process.exit(1) }
console.log(`✓ 数据校验通过：${total} 条，${allIds.size} 个唯一 id`)
