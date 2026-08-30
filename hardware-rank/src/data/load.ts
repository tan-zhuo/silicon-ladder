import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Category, Cpu, Gpu, Ram, Storage, Psu, Meta, AnyItem } from '@/types/hardware'
import { FX } from '@/utils/format'

async function fetchJson<T>(path: string): Promise<T> {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '')
  const res = await fetch(`${base}/data/${path}`)
  if (!res.ok) throw new Error(`加载 ${path} 失败: ${res.status}`)
  return res.json()
}

export const useCatalog = defineStore('catalog', () => {
  const loaded = ref(false)
  const error = ref<string | null>(null)
  const meta = ref<Meta>({ updated: '', note: '', version: 0 })
  const cpus = ref<Cpu[]>([])
  const gpus = ref<Gpu[]>([])
  const rams = ref<Ram[]>([])
  const storages = ref<Storage[]>([])
  const psus = ref<Psu[]>([])

  let pending: Promise<void> | null = null

  function load() {
    if (pending) return pending
    pending = (async () => {
      try {
        const [m, c, g, r, s, p] = await Promise.all([
          fetchJson<Meta>('meta.json'),
          fetchJson<Cpu[]>('cpus.json'),
          fetchJson<Gpu[]>('gpus.json'),
          fetchJson<Ram[]>('rams.json'),
          fetchJson<Storage[]>('storages.json'),
          fetchJson<Psu[]>('psus.json'),
        ])
        meta.value = m
        if (m.fx) { FX.USD = m.fx.USD; FX.JPY = m.fx.JPY }
        cpus.value = c
        gpus.value = g
        rams.value = r
        storages.value = s
        psus.value = p
        loaded.value = true
      } catch (e) {
        error.value = (e as Error).message
      }
    })()
    return pending
  }

  function byCategory(cat: Category): AnyItem[] {
    switch (cat) {
      case 'cpu': return cpus.value
      case 'gpu': return gpus.value
      case 'ram': return rams.value
      case 'storage': return storages.value
      case 'psu': return psus.value
    }
  }

  const index = new Map<string, AnyItem>()
  function find(cat: Category, id: string): AnyItem | undefined {
    const key = cat + ':' + id
    if (!index.has(key)) { const hit = byCategory(cat).find((x) => x.id === id); if (hit) index.set(key, hit) }
    return index.get(key)
  }

  return { loaded, error, meta, cpus, gpus, rams, storages, psus, load, byCategory, find }
})
