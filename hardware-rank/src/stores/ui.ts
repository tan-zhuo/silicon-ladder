import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUi = defineStore('ui', () => {
  const searchOpen = ref(false)
  return { searchOpen }
})
