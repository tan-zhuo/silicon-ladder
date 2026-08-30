export type Category = 'cpu' | 'gpu' | 'ram' | 'storage' | 'psu'

export interface Meta {
  updated: string
  note: string
  version: number
  /** 汇率：1 CNY 折合的 USD / JPY */
  fx?: { USD: number; JPY: number; asOf: string }
}

export interface BaseItem {
  id: string
  name: string
  nameEn?: string
  brand: string
  form: string
  release: string
  price_cny?: number | null
  summary: string
  summary_en?: string
  summary_ja?: string
  tags?: string[]
  /** 历史硬件：分数为按公开评测比例换算的估算值 */
  est?: boolean
}

export interface Cpu extends BaseItem {
  brand: 'AMD' | 'Intel' | 'Apple' | 'Qualcomm'
  form: 'desktop' | 'laptop'
  series: string
  gen: string
  socket: string
  cores: string
  clocks: string
  tdp_w: number
  tdp_range?: string
  igpu?: string | null
  cache_l3: string
  mem: string
  tags: string[]
  scores: {
    cb24_st: number | null
    cb24_mt: number | null
    gaming_rel: number | null
    igpu_rel: number | null
  }
  tech?: CpuTech
}

export interface CpuTech {
  die: string | null
  die_mm2: number | null
  transistors_m: number | null
  l2_mb: number | null
  base_ghz: number | null
  boost_ghz: number | null
  power_label: string | null
  power_max_w: number | null
  mem_channels: number | null
  mem_max_mt: number | null
  mem_max_gb: number | null
  pcie: string | null
  igpu_cu: number | null
  igpu_ghz: number | null
  launch_usd: number | null
}

export interface GpuTech {
  die_mm2: number | null
  transistors_m: number | null
  units: number | null
  shaders: number | null
  tmus: number | null
  rops: number | null
  rt_cores: number | null
  tensor_cores: number | null
  base_mhz: number | null
  boost_mhz: number | null
  mem_gbps: number | null
  mem_bw_gbs: number | null
  l2_mb: number | null
  infinity_cache_mb: number | null
  tflops_fp32: number | null
  launch_usd: number | null
}

export interface Gpu extends BaseItem {
  brand: 'NVIDIA' | 'AMD' | 'Intel' | 'Apple'
  form: 'desktop' | 'laptop' | 'igpu'
  series: string
  gen: string
  chip: string
  vram_gb: number
  vram_type: string
  bus_bit: number
  tdp_w: number
  tgp_w?: number
  tgp_range?: string
  tags: string[]
  scores: {
    raster_rel: number | null
    rt_rel: number | null
  }
  tech?: GpuTech
}

export interface Ram extends BaseItem {
  form: 'kit-desktop' | 'sodimm' | 'onboard'
  type: 'DDR5' | 'DDR4' | 'LPDDR5X' | 'LPDDR5'
  spec: string
  capacity_gb: number
  speed_mt: number
  cl: number | null
  latency_ns: number | null
  scores: {
    read_GBs: number | null
    write_GBs: number | null
    latency_ns: number | null
  }
}

export interface Storage extends BaseItem {
  form: 'nvme' | 'sata' | 'hdd'
  interface: 'pcie5' | 'pcie4' | 'pcie3' | 'sata' | 'sata-hdd'
  capacity_gb: number
  nand?: string
  dram: boolean
  seq_read: number | null
  seq_write: number | null
  iops_4k_read: number | null
  write_cache_out: number | null
  tbw: number | null
}

export interface Psu extends BaseItem {
  form: 'atx' | 'sfx'
  watt: number
  tier: 'A' | 'B' | 'C' | 'D'
  efficiency: string
  atx31: boolean
  modular: 'full' | 'semi' | 'none'
  oem: string
}

export type AnyItem = Cpu | Gpu | Ram | Storage | Psu

export interface CategoryMap {
  cpu: Cpu
  gpu: Gpu
  ram: Ram
  storage: Storage
  psu: Psu
}

/** 已计算完毕、可直接渲染的行 */
export interface RankedRow<T extends AnyItem = AnyItem> {
  item: T
  /** 各排序键的原始值（用于展示） */
  raw: Record<string, number | string | boolean | null>
  /** 各排序键的相对分 0–100（null = 缺失） */
  rel: Record<string, number | null>
  /** 当前排序键对应的排序值；null 沉底 */
  sortValue: number | null
  rank: number
}
