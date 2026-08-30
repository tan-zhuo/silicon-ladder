export const DASH = '—'

export function num(v: number | null | undefined, digits = 0): string {
  if (v === null || v === undefined || Number.isNaN(v)) return DASH
  return v.toLocaleString('zh-CN', { maximumFractionDigits: digits, minimumFractionDigits: digits })
}

export function rel(v: number | null | undefined): string {
  return v === null || v === undefined ? DASH : v.toFixed(1)
}

export function price(v: number | null | undefined): string {
  return v === null || v === undefined ? DASH : `¥${v.toLocaleString('zh-CN')}`
}

export function bool(v: boolean | null | undefined): string {
  if (v === null || v === undefined) return DASH
  return v ? '是' : '否'
}

export function iops(v: number | null | undefined): string {
  if (v === null || v === undefined) return DASH
  return v >= 1000 ? `${Math.round(v / 1000)}K` : String(v)
}

export function capacity(gb: number): string {
  return gb >= 1000 ? `${(gb / 1000).toFixed(gb % 1000 === 0 ? 0 : 1)}TB` : `${gb}GB`
}

export const CATEGORY_LABEL: Record<string, string> = {
  cpu: 'CPU',
  gpu: 'GPU',
  ram: '内存',
  storage: '存储',
  psu: '电源',
}

export const FORM_LABEL: Record<string, string> = {
  desktop: '桌面',
  laptop: '笔记本',
  igpu: '核显',
  'kit-desktop': '台式套装',
  sodimm: '笔记本条',
  onboard: '板载',
  nvme: 'NVMe',
  sata: 'SATA',
  hdd: 'HDD',
  atx: 'ATX',
  sfx: 'SFX',
}

export const INTERFACE_LABEL: Record<string, string> = {
  pcie5: 'PCIe 5.0',
  pcie4: 'PCIe 4.0',
  pcie3: 'PCIe 3.0',
  sata: 'SATA',
  'sata-hdd': 'SATA (HDD)',
}

export const MODULAR_LABEL: Record<string, string> = { full: '全模组', semi: '半模组', none: '非模组' }

export function brandColor(brand: string): string {
  switch (brand) {
    case 'AMD': return '#E65C00'
    case 'NVIDIA': return '#76B900'
    case 'Intel': return '#0071C5'
    case 'Apple': return '#A2AAAD'
    case 'Qualcomm': return '#3253DC'
    default: return '#8B9BB0'
  }
}
