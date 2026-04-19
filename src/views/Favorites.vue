<template>
  <div class="favorites-page">
    <div class="page-header">
      <h1 class="page-title">⭐ 我的收藏</h1>
      <p class="page-desc">已收藏 {{ favoriteModels.length }} 个思维模型</p>
    </div>

    <!-- 收藏列表 -->
    <div class="favorites-list" v-if="favoriteModels.length > 0">
      <div
        v-for="model in favoriteModels"
        :key="model.id"
        class="favorite-card"
        @click="goToDetail(model.id)"
      >
        <div class="favorite-number">#{{ model.id }}</div>
        <div class="favorite-icon" :style="{ background: getModuleGradient(model.module) }">
          {{ getModelIcon(model.module) }}
        </div>
        <div class="favorite-info">
          <h3 class="favorite-name">{{ model.name }}</h3>
          <p class="favorite-desc">{{ model.description }}</p>
          <div class="favorite-footer">
            <van-tag :color="getModuleColor(model.module)" text-color="#fff" size="small" round>
              {{ model.module }}
            </van-tag>
          </div>
        </div>
        <div class="favorite-action">
          <van-button
            size="small"
            plain
            color="var(--primary-color)"
            @click.stop="removeFavorite(model.id)"
          >
            取消
          </van-button>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div class="empty-state">
      <div class="empty-image">⭐️</div>
      <p class="empty-desc">还没有收藏任何模型</p>
      <van-button
        type="primary"
        size="small"
        round
        @click="goToHome"
        style="background: var(--primary-color-gradient);"
      >
        去浏览模型
      </van-button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useModelStore } from '@/stores/model'
import { showToast } from 'vant'

const router = useRouter()
const store = useModelStore()

const favoriteModels = computed(() => {
  return store.models.filter(m => store.favorites.includes(m.id))
})

const moduleColors = {
  '认知模块': '#2fb5b0',
  '决策模块': '#0ca678',
  '组织模块': '#4bc9c4',
  '创新模块': '#6ad3ce',
  '战略模块': '#1098ad',
  '其他': '#969799'
}

const moduleIcons = {
  '认知模块': '🧠',
  '决策模块': '🎯',
  '组织模块': '👥',
  '创新模块': '💡',
  '战略模块': '📈',
  '其他': '📌'
}

function getModuleColor(module) {
  return moduleColors[module] || moduleColors['其他']
}

function getModuleGradient(module) {
  return `linear-gradient(135deg, ${getModuleColor(module)}, ${getModuleColor(module)}88)`
}

function getModelIcon(module) {
  return moduleIcons[module] || moduleIcons['其他']
}

function goToDetail(id) {
  router.push(`/model/${id}`)
}

function removeFavorite(id) {
  store.toggleFavorite(id)
  showToast('已取消收藏')
}

function goToHome() {
  router.push('/')
}
</script>

<style scoped>
.favorites-page {
  min-height: 100vh;
  background: var(--primary-bg);
  padding-bottom: 20px;
}

.page-header {
  padding: 24px 16px;
  background: var(--card-bg);
  margin-bottom: 16px;
}

.page-title {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
}

.page-desc {
  margin: 8px 0 0;
  font-size: 14px;
  color: var(--text-secondary);
}

.favorites-list {
  padding: 0 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.favorite-card {
  background: var(--card-bg);
  border-radius: 16px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid var(--border-light);
}

.favorite-card:active {
  transform: scale(0.98);
  border-color: var(--primary-color);
}

.favorite-number {
  font-size: 14px;
  font-weight: 700;
  color: var(--primary-color);
  background: var(--primary-color-soft);
  padding: 4px 10px;
  border-radius: 8px;
  flex-shrink: 0;
}

.favorite-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
  flex-shrink: 0;
}

.favorite-info {
  flex: 1;
  min-width: 0;
}

.favorite-name {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.favorite-desc {
  margin: 4px 0 8px;
  font-size: 13px;
  color: var(--text-secondary);
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.favorite-footer {
  display: flex;
  gap: 4px;
}

.favorite-action {
  flex-shrink: 0;
}

.empty-state {
  padding-top: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.empty-image {
  font-size: 80px;
  opacity: 0.5;
}

.empty-desc {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
}
</style>
