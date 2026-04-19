<template>
  <div class="category-page">
    <van-nav-bar title="分类浏览" fixed placeholder />

    <!-- 模块选择器 -->
    <div class="module-selector">
      <div
        v-for="mod in modules"
        :key="mod.value"
        class="module-item"
        :class="{ active: activeModule === mod.value }"
        @click="selectModule(mod.value)"
      >
        <div class="module-icon-box" :style="{ background: getModuleColor(mod.value) + '20' }">
          <span class="module-icon" :style="{ color: getModuleColor(mod.value) }">
            {{ mod.icon }}
          </span>
        </div>
        <div class="module-info">
          <span class="module-name">{{ mod.label }}</span>
          <span class="module-count">{{ getCountByModule(mod.value) }} 个模型</span>
        </div>
        <van-icon name="chevron-right" color="var(--text-tertiary)" size="18" />
      </div>
    </div>

    <!-- 图墙网格 -->
    <div class="gallery-section" v-if="filteredModels.length > 0">
      <div class="section-header">
        <h3 class="section-title">{{ getModuleName(activeModule) }}</h3>
        <span class="section-count">{{ filteredModels.length }} 个</span>
      </div>
      <div class="gallery-grid">
        <div
          v-for="model in filteredModels"
          :key="model.id"
          class="gallery-item"
          @click="goToDetail(model.id)"
        >
          <div class="item-number">{{ String(model.id).padStart(3, '0') }}</div>
          <div class="item-icon">{{ getModelIcon(model.module) }}</div>
          <h4 class="item-name">{{ model.name }}</h4>
          <p class="item-desc">{{ model.description }}</p>
          <div class="item-status">
            <van-icon v-if="store.learningProgress[model.id]" name="checked" color="#34c759" size="14" />
            <van-icon v-if="store.favorites.includes(model.id)" name="star" color="#ff9500" size="14" />
          </div>
        </div>
      </div>
    </div>

    <!-- 全部模型视图 -->
    <div class="all-models" v-if="activeModule === 'all'">
      <div class="section-header">
        <h3 class="section-title">全部模型</h3>
        <span class="section-count">{{ store.models.length }} 个</span>
      </div>
      <div class="list-container">
        <div
          v-for="model in store.models"
          :key="model.id"
          class="list-item"
          @click="goToDetail(model.id)"
        >
          <div class="list-number" :style="{ color: getModuleColor(model.module) }">
            {{ String(model.id).padStart(3, '0') }}
          </div>
          <div class="list-info">
            <h4 class="list-name">{{ model.name }}</h4>
            <p class="list-desc">{{ model.description }}</p>
          </div>
          <div class="list-meta">
            <span class="list-module" :style="{ background: getModuleColor(model.module) + '20', color: getModuleColor(model.module) }">
              {{ getModuleShortName(model.module) }}
            </span>
            <van-icon name="chevron-right" color="#c7c7cc" size="16" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useModelStore } from '@/stores/model'

const router = useRouter()
const route = useRoute()
const store = useModelStore()

const activeModule = ref('all')

const modules = [
  { label: '认知模块', value: '认知模块', icon: '🧠' },
  { label: '决策模块', value: '决策模块', icon: '🎯' },
  { label: '组织模块', value: '组织模块', icon: '👥' },
  { label: '创新模块', value: '创新模块', icon: '💡' },
  { label: '战略模块', value: '战略模块', icon: '📈' }
]

// 模块颜色
const moduleColors = {
  '认知模块': '#5d7a8f',
  '决策模块': '#8b7a9e',
  '组织模块': '#c48a7a',
  '创新模块': '#7aa88b',
  '战略模块': '#c4a57a',
  '其他': '#8a8a9a'
}

// 模块图标
const moduleIcons = {
  '认知模块': '🧠',
  '决策模块': '🎯',
  '组织模块': '👥',
  '创新模块': '💡',
  '战略模块': '📈',
  '其他': '📌'
}

// 模块简称
const moduleShortNames = {
  '认知模块': '认知',
  '决策模块': '决策',
  '组织模块': '组织',
  '创新模块': '创新',
  '战略模块': '战略',
  '其他': '其他'
}

function getModuleColor(module) {
  return moduleColors[module] || moduleColors['其他']
}

function getModelIcon(module) {
  return moduleIcons[module] || moduleIcons['其他']
}

function getModuleShortName(module) {
  return moduleShortNames[module] || moduleShortNames['其他']
}

function getModuleName(module) {
  if (module === 'all') return '全部模型'
  return module
}

function getCountByModule(module) {
  if (module === 'all') return store.models.length
  return store.models.filter(m => m.module === module).length
}

function selectModule(module) {
  activeModule.value = module
}

function goToDetail(id) {
  router.push(`/model/${id}`)
}

const filteredModels = computed(() => {
  if (activeModule.value === 'all') {
    return store.models
  }
  return store.models.filter(m => m.module === activeModule.value)
})

// 从 URL 参数读取模块
onMounted(async () => {
  await store.loadModels()
  const moduleParam = route.query.module
  if (moduleParam) {
    activeModule.value = decodeURIComponent(moduleParam)
  }
})
</script>

<style scoped>
.category-page {
  min-height: 100vh;
  background: var(--bg-secondary);
}

/* ========== 模块选择器 ========== */
.module-selector {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.module-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  background: var(--bg-card);
  border-radius: var(--card-radius);
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  transition: all 0.2s;
}

.module-item:active {
  transform: scale(0.98);
  background: var(--bg-tertiary);
}

.module-item.active {
  border: 2px solid var(--accent-blue);
}

.module-icon-box {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.module-icon {
  font-size: 24px;
}

.module-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.module-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
}

.module-count {
  font-size: 12px;
  color: var(--text-tertiary);
}

/* ========== 图墙区域 ========== */
.gallery-section {
  padding: 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.section-count {
  font-size: 13px;
  color: var(--text-tertiary);
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.gallery-item {
  background: var(--bg-card);
  border-radius: 12px;
  padding: 14px 10px;
  text-align: center;
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.gallery-item:active {
  transform: scale(0.95);
  background: var(--bg-tertiary);
}

.item-number {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-tertiary);
  margin-bottom: 8px;
  letter-spacing: 0.5px;
}

.item-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.item-name {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary);
  margin: 0 0 4px;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.item-desc {
  font-size: 11px;
  color: var(--text-tertiary);
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.3;
}

.item-status {
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  gap: 4px;
}

/* ========== 列表视图 ========== */
.all-models {
  padding: 20px;
}

.list-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.list-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px;
  background: var(--bg-card);
  border-radius: var(--card-radius);
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  transition: all 0.2s;
}

.list-item:active {
  transform: scale(0.98);
  background: var(--bg-tertiary);
}

.list-number {
  width: 40px;
  font-size: 13px;
  font-weight: 700;
  flex-shrink: 0;
}

.list-info {
  flex: 1;
  min-width: 0;
}

.list-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.list-desc {
  font-size: 12px;
  color: var(--text-tertiary);
  margin: 4px 0 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.list-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.list-module {
  font-size: 11px;
  font-weight: 500;
  padding: 4px 10px;
  border-radius: 10px;
}
</style>
