import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { Category } from '@/types/hardware'

const KEY = 'hr-compare'
export const MAX_COMPARE = 4

interface Persist {
  category: Category | null
  ids: string[]
}

function read(): Persist {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const p = JSON.parse(raw) as Persist
      if (Array.isArray(p.ids)) return { category: p.category ?? null, ids: p.ids.slice(0, MAX_COMPARE) }
    }
  } catch { /* ignore */ }
  return { category: null, ids: [] }
}

export const useCompare = defineStore('compare', () => {
  const init = read()
  const category = ref<Category | null>(init.category)
  const ids = ref<string[]>(init.ids)
  const notice = ref<string | null>(null)

  watch([category, ids], () => {
    try { localStorage.setItem(KEY, JSON.stringify({ category: category.value, ids: ids.value })) } catch { /* ignore */ }
  }, { deep: true })

  function has(cat: Category, id: string) {
    return category.value === cat && ids.value.includes(id)
  }

  function flash(msg: string) {
    notice.value = msg
    setTimeout(() => { if (notice.value === msg) notice.value = null }, 2500)
  }

  function toggle(cat: Category, id: string): boolean {
    if (category.value !== cat) {
      if (ids.value.length) flash('已切换品类，对比篮已清空')
      category.value = cat
      ids.value = [id]
      return true
    }
    if (ids.value.includes(id)) {
      ids.value = ids.value.filter((x) => x !== id)
      return false
    }
    if (ids.value.length >= MAX_COMPARE) {
      flash(`最多对比 ${MAX_COMPARE} 项`)
      return false
    }
    ids.value = [...ids.value, id]
    return true
  }

  function remove(id: string) {
    ids.value = ids.value.filter((x) => x !== id)
  }

  function clear() {
    ids.value = []
  }

  /** 对比页 query：ids=cpu:xxx,cpu:yyy */
  function queryString() {
    if (!category.value) return ''
    return ids.value.map((id) => `${category.value}:${id}`).join(',')
  }

  return { category, ids, notice, has, toggle, remove, clear, queryString }
})
