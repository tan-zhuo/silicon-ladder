import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'

export type Theme = 'light' | 'dark'
export type ThemeMode = Theme | 'system'
const KEY = 'sl-theme'
const mq = typeof matchMedia === 'function' ? matchMedia('(prefers-color-scheme: dark)') : null

/** 主题：默认跟随系统；用户点过切换后固定为 light / dark（存 localStorage）。index.html 内联脚本会在首屏前先按同样规则加 .dark，避免闪白。 */
export const useTheme = defineStore('theme', () => {
  let init: ThemeMode = 'system'
  try { const v = localStorage.getItem(KEY); if (v === 'dark' || v === 'light' || v === 'system') init = v } catch { /* ignore */ }
  const mode = ref<ThemeMode>(init)
  const systemDark = ref(!!mq?.matches)
  mq?.addEventListener?.('change', (e) => { systemDark.value = e.matches })
  const theme = computed<Theme>(() => (mode.value === 'system' ? (systemDark.value ? 'dark' : 'light') : mode.value))
  const apply = () => {
    document.documentElement.classList.toggle('dark', theme.value === 'dark')
    document.querySelector('meta[name="theme-color"]:not([media])')?.setAttribute('content', theme.value === 'dark' ? '#09090B' : '#FAFAFB')
  }
  apply()
  watch(theme, apply)
  watch(mode, () => { try { localStorage.setItem(KEY, mode.value) } catch { /* ignore */ } })
  const toggle = () => { mode.value = theme.value === 'dark' ? 'light' : 'dark' }
  const setMode = (m: ThemeMode) => { mode.value = m }
  return { theme, mode, toggle, setMode }
})
