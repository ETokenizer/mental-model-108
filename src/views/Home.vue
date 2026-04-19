<template>
  <div class="home-page">
    <!-- 头部 -->
    <div class="page-header">
      <h1 class="page-title">思维模型 108</h1>
      <p class="page-subtitle">每天进步一点点</p>
    </div>

    <!-- 搜索框 -->
    <div class="search-container">
      <div class="search-box">
        <van-icon name="search" size="18" />
        <input v-model="searchQuery" type="text" placeholder="搜索思维模型..." />
      </div>
    </div>

    <!-- 模块筛选 -->
    <div class="module-filter">
      <div
        v-for="mod in modules"
        :key="mod.value"
        class="module-chip"
        :class="{ active: activeModule === mod.value }"
        @click="activeModule = mod.value"
      >
        <span class="chip-label">{{ mod.label }}</span>
        <span class="chip-count">{{ getCountByModule(mod.value) }}</span>
      </div>
    </div>

    <!-- 进度统计 -->
    <div class="stats-bar" v-if="activeModule === 'all'">
      <div class="stat-item">
        <span class="stat-value">{{ store.completedCount }}</span>
        <span class="stat-label">已掌握</span>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item">
        <span class="stat-value">{{ store.favorites.length }}</span>
        <span class="stat-label">收藏</span>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item">
        <span class="stat-value">{{ store.progressPercent }}%</span>
        <span class="stat-label">进度</span>
      </div>
    </div>

    <!-- 模型网格 -->
    <div class="model-section">
      <div class="section-header">
        <h2 class="section-title">{{ getSectionTitle() }}</h2>
        <span class="section-count">{{ filteredModels.length }} 个</span>
      </div>

      <div class="model-grid">
        <div
          v-for="model in filteredModels"
          :key="model.id"
          class="model-card"
          :data-module="model.module"
          @click="goToDetail(model.id)"
        >
          <!-- 顶部状态栏 -->
          <div class="card-status">
            <span class="card-id">{{ String(model.id).padStart(3, '0') }}</span>
            <div class="card-badges">
              <van-icon v-if="store.learningProgress[model.id]" name="checked" color="#34c759" size="14" />
              <van-icon v-if="store.favorites.includes(model.id)" name="star" color="#ff9500" size="14" />
            </div>
          </div>

          <!-- 图标区域 - 使用 thumbnail 图片 -->
          <div class="card-icon-wrapper" :style="{ background: getModuleBgColor(model.module) }">
            <img
              :src="getThumbnailPath(model.page)"
              :alt="model.name"
              class="card-thumbnail"
              loading="lazy"
            />
          </div>

          <!-- 内容区 -->
          <div class="card-content">
            <h3 class="card-title">{{ model.name }}</h3>
            <p class="card-desc">{{ model.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <van-empty v-if="filteredModels.length === 0" image="search" description="没有找到相关模型" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useModelStore } from '@/stores/model'

const router = useRouter()
const store = useModelStore()

const searchQuery = ref('')
const activeModule = ref('all')

const modules = [
  { label: '全部', value: 'all' },
  { label: '认知', value: '认知模块' },
  { label: '组织', value: '组织模块' },
  { label: '创新', value: '创新模块' },
  { label: '战略', value: '战略模块' },
  { label: '竞争', value: '竞争模块' }
]

// 获取 thumbnail 图片路径
function getThumbnailPath(page) {
  return `/thumbnails/thumb-${String(page).padStart(3, '0')}.png`
}

// 模块背景色
const moduleBgColors = {
  '认知模块': 'var(--module-cognitive-bg)',
  '竞争模块': 'var(--module-competition-bg)',
  '组织模块': 'var(--module-organization-bg)',
  '创新模块': 'var(--module-innovation-bg)',
  '战略模块': 'var(--module-strategy-bg)',
  '其他': 'var(--primary-bg-soft)'
}

function getModuleBgColor(module) {
  return moduleBgColors[module] || moduleBgColors['其他']
}

function getCountByModule(module) {
  if (module === 'all') return store.models.length
  return store.models.filter(m => m.module === module).length
}

function getSectionTitle() {
  if (activeModule.value === 'all') return '全部模型'
  return activeModule.value.replace('模块', '')
}

const filteredModels = computed(() => {
  let result = store.models
  if (searchQuery.value) {
    result = result.filter(model =>
      model.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      model.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }
  if (activeModule.value !== 'all') {
    result = result.filter(model => model.module === activeModule.value)
  }
  return result
})

function goToDetail(id) {
  router.push(`/model/${id}`)
}

onMounted(async () => {
  await store.loadModels()
})
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background: var(--primary-bg);
  padding-bottom: 20px;
}

/* ========== 头部 ========== */
.page-header {
  background: var(--primary-color-gradient);
  padding: 40px 20px 20px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.page-header::before {
  content: '';
  position: absolute;
  top: -30%;
  right: -15%;
  width: 150px;
  height: 150px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
}

.page-header::after {
  content: '';
  position: absolute;
  bottom: -20%;
  left: -5%;
  width: 100px;
  height: 100px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 50%;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: white;
  margin: 0;
  letter-spacing: 1px;
  position: relative;
  z-index: 1;
}

.page-subtitle {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  margin: 8px 0 0;
  position: relative;
  z-index: 1;
}

/* ========== 搜索框 ========== */
.search-container {
  padding: 16px 20px;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--card-bg);
  border-radius: 12px;
  padding: 12px 16px;
  border: 1px solid var(--border-color);
}

.search-box:focus-within {
  border-color: var(--accent-blue);
  box-shadow: 0 0 0 3px var(--accent-soft);
}

.search-box .van-icon {
  color: var(--text-tertiary);
}

.search-box input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 15px;
  color: var(--text-primary);
}

.search-box input::placeholder {
  color: var(--text-tertiary);
}

/* ========== 模块筛选 ========== */
.module-filter {
  display: flex;
  gap: 8px;
  padding: 0 20px 16px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.module-filter::-webkit-scrollbar {
  display: none;
}

.module-chip {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: var(--card-bg);
  border-radius: 20px;
  font-size: 14px;
  border: 1px solid var(--border-color);
  cursor: pointer;
  transition: all 0.2s;
}

.module-chip:active {
  transform: scale(0.95);
}

.module-chip.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.chip-count {
  font-size: 12px;
  opacity: 0.7;
  background: currentColor;
  padding: 2px 8px;
  border-radius: 10px;
}

/* ========== 进度统计 ========== */
.stats-bar {
  display: flex;
  align-items: center;
  margin: 0 20px 20px;
  padding: 16px;
  background: var(--card-bg);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}

.stat-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-value {
  font-size: 20px;
  font-weight: 600;
}

.stat-label {
  font-size: 12px;
  color: var(--text-secondary);
}

.stat-divider {
  width: 1px;
  height: 36px;
  background: var(--border-color);
}

/* ========== 模型区域 ========== */
.model-section {
  padding: 0 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-title {
  font-size: 17px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.section-count {
  font-size: 13px;
  color: var(--text-secondary);
}

.model-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 14px;
}

/* ========== 模型卡片 ========== */
.model-card {
  background: var(--card-bg);
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.model-card:active {
  transform: scale(0.98);
  box-shadow: var(--shadow-md);
}

/* 顶部状态栏 */
.card-status {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  background: var(--primary-bg-soft);
  border-bottom: 1px solid var(--border-light);
}

.card-id {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-tertiary);
  letter-spacing: 0.5px;
}

.card-badges {
  display: flex;
  gap: 4px;
  align-items: center;
}

/* 图标区域 */
.card-icon-wrapper {
  width: 100%;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  overflow: hidden;
}

.card-thumbnail {
  width: 80px;
  height: 80px;
  object-fit: contain;
  transition: all 0.3s ease;
}

.model-card:active .card-thumbnail {
  transform: scale(1.05);
}

/* 内容区 */
.card-content {
  padding: 14px;
}

.card-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 6px;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-desc {
  font-size: 12px;
  color: var(--text-secondary);
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.5;
}
</style>
