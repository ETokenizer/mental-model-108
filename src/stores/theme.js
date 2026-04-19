import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

const STORAGE_KEY = 'mental_models_theme'

export const useThemeStore = defineStore('theme', () => {
  // 是否开启暗色模式
  const isDark = ref(false)
  // 是否跟随系统
  const followSystem = ref(true)

  // 初始化主题
  function init() {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const data = JSON.parse(stored)
      isDark.value = data.isDark || false
      followSystem.value = data.followSystem !== undefined ? data.followSystem : true
    }

    // 如果跟随系统，监听系统主题变化
    if (followSystem.value) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      isDark.value = mediaQuery.matches

      mediaQuery.addEventListener('change', (e) => {
        if (followSystem.value) {
          isDark.value = e.matches
        }
      })
    }

    applyTheme()
  }

  // 切换暗色模式
  function toggleDark() {
    followSystem.value = false
    isDark.value = !isDark.value
    saveToStorage()
    applyTheme()
  }

  // 设置跟随系统
  function setFollowSystem(value) {
    followSystem.value = value
    if (value) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      isDark.value = mediaQuery.matches
    }
    saveToStorage()
    applyTheme()
  }

  // 应用主题
  function applyTheme() {
    const root = document.documentElement
    if (isDark.value) {
      root.classList.add('dark-mode')
    } else {
      root.classList.remove('dark-mode')
    }
  }

  // 保存到本地存储
  function saveToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      isDark: isDark.value,
      followSystem: followSystem.value
    }))
  }

  // 切换主题色
  function getThemeColors() {
    return {
      primary: '#1098ad',
      primaryDark: '#0ca678',
      secondary: '#0d8a9a',
      accent: '#0ca678'
    }
  }

  return {
    isDark,
    followSystem,
    init,
    toggleDark,
    setFollowSystem,
    getThemeColors
  }
})
