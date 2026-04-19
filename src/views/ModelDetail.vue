<template>
  <div class="model-detail" v-if="model">
    <!-- 导航栏 -->
    <van-nav-bar
      title="思维模型"
      left-text="返回"
      left-arrow
      @click-left="goBack"
      fixed
      placeholder
      right-text="首页"
      right-icon="wap-home-o"
      @click-right="goHome"
    />

    <!-- 分享弹窗 -->
    <van-popup v-model:show="showShare" position="bottom" round :style="{ maxHeight: '85%' }">
      <ShareModal :model="model" @close="showShare = false" />
    </van-popup>

    <!-- 内容区域 -->
    <div class="content">
      <!-- 头部信息 -->
      <div class="detail-header" :style="{ background: getModuleGradient(model.module) }">
        <div class="header-module-icon">
          <ModuleIcon :module="model.module" class="header-icon" />
        </div>
        <div class="header-badge">
          <span class="badge-number">{{ String(model.id).padStart(3, '0') }}</span>
        </div>
        <h1 class="model-title">{{ model.name }}</h1>
        <p class="model-subtitle">{{ model.description }}</p>
      </div>

      <!-- PDF 原图 - 居中显示 -->
      <div class="pdf-section-centered">
        <PdfImageViewer :pageNum="model.page" />
      </div>

      <!-- 应用场景 -->
      <div class="info-section">
        <div class="section-label">
          <van-icon name="star-o" />
          <span>应用场景</span>
        </div>
        <div class="application-tags">
          <van-tag
            v-for="(app, index) in parseApplications(model.application)"
            :key="index"
            :color="getModuleSoftColor(model.module)"
            :text-color="getModuleColor(model.module)"
            size="medium"
            round
          >
            {{ app }}
          </van-tag>
        </div>
      </div>

      <!-- 相关推荐 -->
      <div class="related-section" v-if="relatedModels.length > 0">
        <div class="section-label">
          <van-icon name="like-o" />
          <span>相关推荐</span>
        </div>
        <div class="related-list">
          <RouterLink
            v-for="m in relatedModels"
            :key="m.id"
            :to="`/model/${m.id}`"
            class="related-item"
          >
            <div class="related-icon-wrapper" :style="{ background: getModuleSoftColor(m.module) }">
              <ModuleIcon :module="m.module" :style="{ color: getModuleColor(m.module) }" />
            </div>
            <div class="related-info">
              <div class="related-header">
                <span class="related-num">#{{ m.id }}</span>
                <span class="related-module" :style="{ color: getModuleColor(m.module) }">
                  {{ getModuleShortName(m.module) }}
                </span>
              </div>
              <h4 class="related-title">{{ m.name }}</h4>
            </div>
            <van-icon name="chevron-right" color="var(--text-tertiary)" size="18" />
          </RouterLink>
        </div>
      </div>

      <!-- 占位空间 -->
      <div class="bottom-spacer"></div>
    </div>

    <!-- 底部操作栏 -->
    <div class="action-bar">
      <div class="action-bar-inner">
        <button class="action-btn icon-btn" :class="{ active: isFavorite }" @click="toggleFavorite">
          <van-icon :name="isFavorite ? 'star' : 'star-o'" />
        </button>
        <button class="action-btn secondary" :class="{ completed: isCompleted }" @click="markAsComplete">
          <van-icon name="checked" v-if="isCompleted" />
          <span>{{ isCompleted ? '已掌握' : '标记为已学' }}</span>
        </button>
        <button class="action-btn primary" @click="goToQuiz">
          <van-icon name="edit" />
          <span>开始测试</span>
        </button>
      </div>
    </div>
  </div>

  <div class="loading-state" v-else>
    <van-loading color="#00a86b" size="24px">加载中...</van-loading>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useModelStore } from '@/stores/model'
import { showToast } from 'vant'
import ShareModal from '@/components/ShareModal.vue'
import PdfImageViewer from '@/components/PdfImageViewer.vue'

const route = useRoute()
const router = useRouter()
const store = useModelStore()

const model = ref(null)
const showShare = ref(false)
const isFavorite = ref(false)
const isCompleted = ref(false)

// 计算相关模型
const relatedModels = computed(() => {
  if (!model.value) return []
  // 排除浏览历史中的模型，让推荐更丰富
  const excludeIds = [...store.viewHistory]
  return store.getRelatedModels(model.value.id, 5, excludeIds)
})

// 加载模型数据的函数
function loadModel() {
  model.value = store.getModelById(route.params.id)
  if (model.value) {
    isFavorite.value = store.favorites.includes(model.value.id)
    isCompleted.value = !!store.learningProgress[model.value.id]
    // 添加浏览记录
    store.addViewHistory(model.value.id)
  }
}

// 监听路由参数变化
watch(() => route.params.id, () => {
  loadModel()
})

// 模块渐变色 - 蓝绿色系
const moduleGradients = {
  '认知模块': 'linear-gradient(135deg, #2fb5b0 0%, #1098ad 100%)',
  '组织模块': 'linear-gradient(135deg, #4bc9c4 0%, #2fb5b0 100%)',
  '创新模块': 'linear-gradient(135deg, #6ad3ce 0%, #4bc9c4 100%)',
  '战略模块': 'linear-gradient(135deg, #1098ad 0%, #0ca678 100%)',
  '竞争模块': 'linear-gradient(135deg, #0ca678 0%, #0d8a9a 100%)',
  '其他': 'linear-gradient(135deg, #1098ad 0%, #0ca678 100%)'
}

// 模块颜色
const moduleColors = {
  '认知模块': '#2fb5b0',
  '组织模块': '#4bc9c4',
  '创新模块': '#6ad3ce',
  '战略模块': '#1098ad',
  '竞争模块': '#0ca678',
  '其他': '#1098ad'
}

// 模块简称
const moduleShortNames = {
  '认知模块': '认知',
  '组织模块': '组织',
  '创新模块': '创新',
  '战略模块': '战略',
  '竞争模块': '竞争',
  '其他': '其他'
}

// 软色（半透明背景）
const moduleSoftColors = {
  '认知模块': 'var(--module-cognitive-bg)',
  '组织模块': 'var(--module-organization-bg)',
  '创新模块': 'var(--module-innovation-bg)',
  '战略模块': 'var(--module-strategy-bg)',
  '竞争模块': 'var(--module-competition-bg)',
  '其他': 'var(--primary-bg-soft)'
}

function getModuleGradient(module) {
  return moduleGradients[module] || moduleGradients['其他']
}

function getModuleColor(module) {
  return moduleColors[module] || moduleColors['其他']
}

function getModuleSoftColor(module) {
  return moduleSoftColors[module] || moduleSoftColors['其他']
}

function getModuleShortName(module) {
  return moduleShortNames[module] || moduleShortNames['其他']
}

function goBack() {
  router.back()
}

function goHome() {
  router.push('/')
}

function markAsComplete() {
  if (isCompleted.value) return
  store.updateProgress(model.value.id, true)
  isCompleted.value = true
  showToast({ message: '太棒了！继续加油～', icon: 'checked', iconColor: '#34c759', duration: 1500 })
}

function toggleFavorite() {
  store.toggleFavorite(model.value.id)
  isFavorite.value = !isFavorite.value
  showToast({ message: isFavorite.value ? '已加入收藏' : '已取消收藏', duration: 1500 })
}

function goToQuiz() {
  router.push(`/quiz/${model.value.id}`)
}

function goToDetail(id) {
  router.push(`/model/${id}`)
}

function parseApplications(appStr) {
  if (!appStr) return []
  return appStr.split(/[,,|]/).map(s => s.trim()).filter(s => s)
}

onMounted(async () => {
  if (store.models.length === 0) {
    await store.loadModels()
  }
  loadModel()
})
</script>

<style scoped>
.model-detail {
  min-height: 100vh;
  background: var(--primary-bg);
  padding-top: 46px;
}

.content {
  padding: 0;
}

/* ========== 头部区域 ========== */
.detail-header {
  padding: 40px 20px 32px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.detail-header::before {
  content: '';
  position: absolute;
  top: -30%;
  right: -10%;
  width: 150px;
  height: 150px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 50%;
}

.detail-header::after {
  content: '';
  position: absolute;
  bottom: -20%;
  left: -5%;
  width: 100px;
  height: 100px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
}

.header-badge {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
}

.badge-number {
  font-size: 14px;
  font-weight: 700;
  color: white;
}

.model-title {
  font-size: 24px;
  font-weight: 700;
  color: white;
  margin: 0 0 8px;
}

.model-subtitle {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
}

/* ========== PDF 区域 - 居中显示 ========== */
.pdf-section-centered {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--card-bg);
  margin: 16px;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}

/* ========== 信息区域 ========== */
.info-section {
  background: var(--card-bg);
  padding: 20px;
  margin: 0 16px 16px;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}

.application-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

/* ========== 相关推荐 ========== */
.related-section {
  background: var(--card-bg);
  padding: 20px;
  margin: 0 16px 16px;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}

.related-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.related-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px;
  background: var(--primary-bg);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  z-index: 1;
  text-decoration: none;
  color: inherit;
}

.related-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
}

.related-icon-wrapper {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: var(--primary-bg-soft);
  transition: all 0.2s;
}

.related-item:active .related-icon-wrapper {
  transform: scale(0.95);
}

.related-icon-wrapper .module-icon {
  width: 24px;
  height: 24px;
}

.related-info,
.related-header,
.related-num,
.related-module,
.related-title,
.van-icon {
  pointer-events: none;
}

.related-item:active {
  background: var(--border-color);
  transform: scale(0.98);
}

/* 头部图标 */
.header-module-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0.1;
  pointer-events: none;
}

.header-icon {
  width: 180px;
  height: 180px;
  color: #fff;
}

.related-info {
  flex: 1;
  min-width: 0;
}

.related-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.related-num {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-tertiary);
}

.related-module {
  font-size: 11px;
  font-weight: 500;
}

.related-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ========== 底部占位 ========== */
.bottom-spacer {
  height: 100px;
}

/* ========== 底部操作栏 ========== */
.action-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--card-bg);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-top: 1px solid var(--border-color);
  padding: 12px 16px;
  padding-bottom: calc(12px + env(safe-area-inset-bottom));
  z-index: 100;
}

.action-bar-inner {
  display: flex;
  gap: 12px;
  max-width: 600px;
  margin: 0 auto;
}

.action-btn.icon-btn {
  width: 50px;
  flex-shrink: 0;
  background: var(--primary-bg-soft);
  border: 1px solid var(--border-color);
}

.action-btn.icon-btn.active {
  background: linear-gradient(135deg, #ff9500 0%, #ffb340 100%);
  border-color: #ff9500;
  box-shadow: 0 4px 12px rgba(255, 149, 0, 0.3);
}

.action-btn.icon-btn .van-icon {
  font-size: 22px;
  color: var(--text-secondary);
}

.action-btn.icon-btn.active .van-icon {
  color: white;
}

.action-btn {
  flex: 1;
  height: 50px;
  border-radius: 12px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  -webkit-tap-highlight-color: transparent;
}

.action-btn:active {
  transform: scale(0.96);
}

.action-btn.primary {
  background: linear-gradient(135deg, #00a86b 0%, #00c47e 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(0, 168, 107, 0.3);
}

.action-btn.primary .van-icon {
  color: white;
}

.action-btn.secondary {
  background: var(--primary-bg-soft);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.action-btn.secondary .van-icon {
  color: var(--text-primary);
}

.action-btn.secondary.completed {
  background: var(--success-color);
  color: white;
  border: none;
  box-shadow: 0 4px 12px rgba(52, 199, 89, 0.3);
}

.action-btn.secondary.completed .van-icon {
  color: white;
}

.loading-state {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--primary-bg);
}
</style>
