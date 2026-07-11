import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

export const useModelStore = defineStore('model', () => {
  const STORAGE_KEY = 'mental-model-app-data'

  // 从 localStorage 加载数据
  function loadFromStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const data = JSON.parse(stored)
        learningProgress.value = data.learningProgress || {}
        favorites.value = data.favorites || []
        viewHistory.value = data.viewHistory || []
      }
    } catch (error) {
      console.error('加载本地数据失败:', error)
    }
  }

  // 保存到 localStorage
  function saveToStorage() {
    try {
      const data = {
        learningProgress: learningProgress.value,
        favorites: favorites.value,
        viewHistory: viewHistory.value
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch (error) {
      console.error('保存本地数据失败:', error)
    }
  }

  const models = ref([])
  const learningProgress = ref({})
  const favorites = ref([])
  const viewHistory = ref([])
  const activeModule = ref('all')

  // 监听数据变化，自动保存
  watch(learningProgress, saveToStorage, { deep: true })
  watch(favorites, saveToStorage, { deep: true })
  watch(viewHistory, saveToStorage, { deep: true })

  // 初始化时加载本地数据
  loadFromStorage()

  // Fisher-Yates 洗牌算法
  function shuffleArray(array) {
    if (!array || array.length === 0) return array
    let i, j, temp
    for (i = array.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1))
      temp = array[i]
      array[i] = array[j]
      array[j] = temp
    }
    return array
  }

  // 加载思维模型数据
  async function loadModels() {
    try {
      const response = await fetch(`${import.meta.env.BASE_URL}mental_models.json`)
      const data = await response.json()
      models.value = data.models || []
      return true
    } catch (error) {
      console.error('加载数据失败:', error)
      return false
    }
  }

  // 根据 ID 获取模型
  function getModelById(id) {
    return models.value.find(m => m.id === parseInt(id))
  }

  // 获取相关模型（同模块优先 + 随机）
  function getRelatedModels(currentId, limit = 5, excludeIds = []) {
    const currentModel = getModelById(currentId)
    if (!currentModel) return []

    // 排除当前模型和已排除的 ID
    const excludeSet = new Set([currentId, ...excludeIds])

    // 首先获取同模块的模型（排除已看过的）
    const sameModule = models.value.filter(
      m => !excludeSet.has(String(m.id)) && m.module === currentModel.module
    )

    // 随机打乱
    shuffleArray(sameModule)

    // 获取其他模块的模型（排除已看过的）
    const otherModels = models.value.filter(
      m => !excludeSet.has(String(m.id)) && m.module !== currentModel.module
    )
    shuffleArray(otherModels)

    // 优先返回同模块的，不足的用其他模块补充
    const result = [...sameModule]
    if (result.length < limit) {
      const need = limit - result.length
      result.push(...otherModels.slice(0, need))
    }

    return result.slice(0, limit)
  }

  // 按模块分组
  function getModelsByModule() {
    const grouped = {}
    models.value.forEach(model => {
      const module = model.module || '其他'
      if (!grouped[module]) {
        grouped[module] = []
      }
      grouped[module].push(model)
    })
    return grouped
  }

  // 更新学习进度
  function updateProgress(modelId, completed) {
    learningProgress.value[modelId] = {
      completed,
      completedAt: completed ? new Date().toISOString() : null
    }
  }

  // 切换收藏状态
  function toggleFavorite(modelId) {
    const index = favorites.value.indexOf(modelId)
    if (index > -1) {
      favorites.value.splice(index, 1)
    } else {
      favorites.value.push(modelId)
    }
  }

  // 添加浏览记录
  function addViewHistory(modelId) {
    const timestamp = Date.now()
    // 如果已存在，先移除
    viewHistory.value = viewHistory.value.filter(id => id !== modelId)
    // 添加到最前面
    viewHistory.value.unshift(modelId)
    // 只保留最近 20 条
    if (viewHistory.value.length > 20) {
      viewHistory.value = viewHistory.value.slice(0, 20)
    }
  }

  // 获取浏览历史
  function getViewHistory() {
    return viewHistory.value.map(id => getModelById(id)).filter(Boolean)
  }

  // 清除浏览历史
  function clearViewHistory() {
    viewHistory.value = []
  }

  // 计算属性
  const completedCount = computed(() => {
    return Object.values(learningProgress.value).filter(p => p.completed).length
  })

  const progressPercent = computed(() => {
    if (models.value.length === 0) return 0
    return Math.round((completedCount.value / models.value.length) * 100)
  })

  return {
    models,
    learningProgress,
    favorites,
    viewHistory,
    loadModels,
    getModelById,
    getRelatedModels,
    getModelsByModule,
    updateProgress,
    toggleFavorite,
    addViewHistory,
    getViewHistory,
    clearViewHistory,
    activeModule,
    completedCount,
    progressPercent
  }
})
