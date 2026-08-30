import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export type Theme = 'light' | 'dark'
const KEY = 'sl-theme'

export const useTheme = defineStore('theme', () => {
  let init: Theme = 'light'
  try { const v = localStorage.getItem(KEY); if (v === 'dark' || v === 'light') init = v } catch { /* ignore */ }
  const theme = ref<Theme>(init)
  const apply = () => document.documentElement.classList.toggle('dark', theme.value === 'dark')
  apply()
  watch(theme, () => { apply(); try { localStorage.setItem(KEY, theme.value) } catch { /* ignore */ } })
  const toggle = () => { theme.value = theme.value === 'dark' ? 'light' : 'dark' }
  return { theme, toggle }
})
