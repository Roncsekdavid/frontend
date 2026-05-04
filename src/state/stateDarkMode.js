import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useDarkModeStore = defineStore('darkMode', () => {
  const getInitialMode = () => {
    const saved = localStorage.getItem('darkMode')
    if (saved !== null) return saved === 'true'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }

  const isDark = ref(getInitialMode())

  const applyTheme = (dark) => {
    if (dark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  applyTheme(isDark.value)

  watch(isDark, (val) => {
    applyTheme(val)
    localStorage.setItem('darkMode', val)
  })

  const systemMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  systemMediaQuery.addEventListener('change', (e) => {
    const hasManualSetting = localStorage.getItem('darkMode') !== null
    if (!hasManualSetting) {
      isDark.value = e.matches
    }
  })

  const toggle = () => {
    isDark.value = !isDark.value
  }

  const resetToSystem = () => {
    localStorage.removeItem('darkMode')
    isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }

  return { isDark, toggle, resetToSystem }
})