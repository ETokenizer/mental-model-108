<template>
  <div class="gallery-wall">
    <!-- 头部 -->
    <div class="gallery-header">
      <h2 class="gallery-title">模型图墙</h2>
      <p class="gallery-subtitle">点击卡片查看模型详情</p>
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

    <!-- 图墙网格 -->
    <div class="gallery-grid">
      <div
        v-for="model in filteredModels"
        :key="model.id"
        class="gallery-item"
        @click="goToDetail(model.id)"
      >
        <div class="item-number">{{ String(model.id).padStart(3, '0') }}</div>
        <!-- 抽象线性图标 -->
        <div class="abstract-icon" :style="{ borderColor: getModuleColor(model.module) }">
          <span class="icon-symbol">{{ getModuleSymbol(model.module) }}</span>
        </div>
        <h4 class="item-name">{{ model.name }}</h4>
        <p class="item-desc">{{ model.description }}</p>
        <div class="item-footer">
          <span class="item-module" :style="{ color: getModuleColor(model.module) }">
            {{ getModuleShortName(model.module) }}
          </span>
          <div class="item-status">
            <van-icon v-if="store.learningProgress[model.id]" name="checked" color="#34c759" size="14" />
            <van-icon v-if="store.favorites.includes(model.id)" name="star" color="#ff9500" size="14" />
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <van-empty v-if="filteredModels.length === 0" image="search" description="该分类下暂无模型" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useModelStore } from '@/stores/model'

const router = useRouter()
const store = useModelStore()

const activeModule = ref('all')

const modules = [
  { label: '全部', value: 'all', icon: '📚' },
  { label: '认知', value: '认知模块', icon: '🧠' },
  { label: '决策', value: '决策模块', icon: '🎯' },
  { label: '组织', value: '组织模块', icon: '👥' },
  { label: '创新', value: '创新模块', icon: '💡' },
  { label: '战略', value: '战略模块', icon: '📈' }
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

// 抽象符号
const moduleSymbols = {
  '认知模块': '◈',
  '决策模块': '◎',
  '组织模块': '⟡',
  '创新模块': '◇',
  '战略模块': '⬡',
  '其他': '○'
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

function getModuleSymbol(module) {
  return moduleSymbols[module] || moduleSymbols['其他']
}

function getModuleShortName(module) {
  return moduleShortNames[module] || moduleShortNames['其他']
}

function getCountByModule(module) {
  if (module === 'all') return store.models.length
  return store.models.filter(m => m.module === module).length
}

const filteredModels = computed(() => {
  if (activeModule.value === 'all') return store.models
  return store.models.filter(m => m.module === activeModule.value)
})

function goToDetail(id) {
  router.push(`/model/${id}`)
}

onMounted(async () => {
  await store.loadModels()
})
</script>

<style scoped>
.gallery-wall {
  min-height: 100vh;
  background: var(--bg-secondary);
  padding: 20px;
  padding-bottom: 80px;
}

/* ========== 头部 ========== */
.gallery-header {
  text-align: center;
  margin-bottom: 24px;
  padding: 12px 0;
}

.gallery-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 6px;
  letter-spacing: -0.5px;
}

.gallery-subtitle {
  font-size: 13px;
  color: var(--text-tertiary);
  margin: 0;
}

/* ========== 模块筛选 ========== */
.module-filter {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
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
  background: var(--bg-card);
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
  background: var(--text-primary);
  color: white;
  border-color: var(--text-primary);
}

.chip-label {
  font-weight: 500;
}

.chip-count {
  font-size: 12px;
  opacity: 0.7;
  background: currentColor;
  padding: 2px 8px;
  border-radius: 10px;
}

/* ========== 图墙网格 ========== */
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.gallery-item {
  background: var(--bg-card);
  border-radius: 14px;
  padding: 16px 12px;
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.gallery-item:active {
  transform: scale(0.96);
  background: var(--bg-tertiary);
}

.item-number {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-tertiary);
  margin-bottom: 10px;
  letter-spacing: 0.5px;
}

/* 抽象线性图标 */
.abstract-icon {
  width: 56px;
  height: 56px;
  border: 2.5px solid;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px;
  transition: all 0.3s ease;
}

.icon-symbol {
  font-size: 28px;
  color: var(--text-primary);
  opacity: 0.8;
}

.gallery-item:hover .abstract-icon {
  transform: scale(1.1) rotate(10deg);
}

.item-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 6px;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.item-desc {
  font-size: 11px;
  color: var(--text-tertiary);
  margin: 0 0 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
}

.item-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-module {
  font-size: 11px;
  font-weight: 500;
}

.item-status {
  display: flex;
  gap: 4px;
}
</style>
