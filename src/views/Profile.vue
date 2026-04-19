<template>
  <div class="profile-page">
    <!-- 用户信息卡片 - 绿色渐变 -->
    <div class="user-card">
      <div class="avatar">🧠</div>
      <div class="user-info">
        <h3 class="username">思维模型学习者</h3>
        <p class="user-desc">每天进步一点点</p>
        <div class="user-level" v-if="store.progressPercent > 0">
          <van-tag color="rgba(255,255,255,0.3)" text-color="#fff" size="small">
            Lv.{{ getUserLevel() }}
          </van-tag>
        </div>
      </div>
    </div>

    <!-- 学习统计卡片 -->
    <div class="stats-card">
      <div class="stat-item">
        <div class="stat-icon" style="background: var(--module-strategy-start);">📚</div>
        <div class="stat-number">{{ store.models.length }}</div>
        <div class="stat-label">总模型数</div>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item">
        <div class="stat-icon" style="background: var(--module-cognitive-start);">✅</div>
        <div class="stat-number">{{ store.completedCount }}</div>
        <div class="stat-label">已掌握</div>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item">
        <div class="stat-icon" style="background: var(--module-organization-start);">⭐</div>
        <div class="stat-number">{{ store.favorites.length }}</div>
        <div class="stat-label">收藏夹</div>
      </div>
    </div>

    <!-- 学习进度 -->
    <div class="section">
      <div class="section-header">
        <h3 class="section-title">📊 学习进度</h3>
      </div>
      <div class="progress-card">
        <div class="progress-header">
          <span class="progress-label">总进度</span>
          <span class="progress-value">{{ store.progressPercent }}%</span>
        </div>
        <van-progress
          :percentage="store.progressPercent"
          color="var(--primary-color)"
          stroke-width="10"
          round
        />
        <div class="progress-tip" v-if="store.progressPercent > 0">
          <van-tag color="var(--success-bg)" text-color="var(--success-color)" size="medium">
            🎉 已掌握 {{ store.completedCount }} 个模型
          </van-tag>
        </div>
      </div>
    </div>

    <!-- 我的收藏 -->
    <div class="section">
      <div class="section-header">
        <h3 class="section-title">⭐ 我的收藏</h3>
        <span class="section-count" v-if="favoriteModels.length > 0">{{ favoriteModels.length }}</span>
      </div>
      <div class="card-list" v-if="favoriteModels.length > 0">
        <div
          v-for="model in favoriteModels"
          :key="model.id"
          class="card-list-item"
          @click="goToDetail(model.id)"
        >
          <div class="item-icon">{{ getModelIcon(model.module) }}</div>
          <div class="item-content">
            <h4 class="item-title">{{ model.name }}</h4>
            <p class="item-desc">{{ model.description }}</p>
          </div>
          <van-icon name="star" color="#1098ad" size="20" />
        </div>
      </div>
      <div class="empty-state" v-else>
        <div class="empty-image">⭐️</div>
        <p class="empty-desc">还没有收藏任何模型</p>
      </div>
    </div>

    <!-- 已掌握模型 -->
    <div class="section">
      <div class="section-header">
        <h3 class="section-title">✅ 已掌握</h3>
        <span class="section-count" v-if="completedModels.length > 0">{{ completedModels.length }}</span>
      </div>
      <div class="card-list" v-if="completedModels.length > 0">
        <div
          v-for="model in completedModels"
          :key="model.id"
          class="card-list-item"
          @click="goToDetail(model.id)"
        >
          <div class="item-icon">{{ getModelIcon(model.module) }}</div>
          <div class="item-content">
            <h4 class="item-title">{{ model.name }}</h4>
            <p class="item-desc">{{ model.description }}</p>
          </div>
          <van-icon name="checked" color="#00a86b" size="20" />
        </div>
      </div>
      <van-empty v-else description="还没有掌握的模型" image="search" />
    </div>

    <!-- 浏览历史 -->
    <div class="section">
      <div class="section-header">
        <h3 class="section-title">🕒 浏览历史</h3>
        <div class="history-actions">
          <span class="section-count" v-if="historyModels.length > 0">{{ historyModels.length }}</span>
          <van-icon name="clear" color="#969799" size="18" @click="clearHistory" v-if="historyModels.length > 0" />
        </div>
      </div>
      <div class="card-list" v-if="historyModels.length > 0">
        <div
          v-for="model in historyModels"
          :key="model.id"
          class="card-list-item"
          @click="goToDetail(model.id)"
        >
          <div class="item-icon">{{ getModelIcon(model.module) }}</div>
          <div class="item-content">
            <h4 class="item-title">{{ model.name }}</h4>
            <p class="item-desc">{{ model.description }}</p>
          </div>
          <van-icon name="clock-o" color="#969799" size="20" />
        </div>
      </div>
      <van-empty v-else description="还没有浏览记录" image="search" />
    </div>

    <!-- 每日打卡 -->
    <div class="section">
      <div class="section-header">
        <h3 class="section-title">📅 每日打卡</h3>
        <span class="section-count" v-if="checkInStore.streakDays > 0">🔥{{ checkInStore.streakDays }}天</span>
      </div>
      <div class="checkin-card" @click="goToCheckIn">
        <div class="checkin-preview">
          <div class="checkin-status">{{ checkInStore.hasCheckedInToday ? '✅' : '⭕' }}</div>
          <div class="checkin-text">
            <strong>{{ checkInStore.hasCheckedInToday ? '今日已打卡' : '快去打卡吧' }}</strong>
            <p>连续打卡 {{ checkInStore.streakDays }} 天</p>
          </div>
        </div>
        <van-icon name="arrow" color="#969799" />
      </div>
    </div>

    <!-- 设置 -->
    <div class="section">
      <div class="section-header">
        <h3 class="section-title">⚙️ 设置</h3>
      </div>
      <div class="settings-list">
        <div class="settings-item" @click="toggleDarkMode">
          <span class="settings-icon">{{ themeStore.isDark ? '🌙' : '☀️' }}</span>
          <span class="settings-text">{{ themeStore.isDark ? '暗色模式' : '浅色模式' }}</span>
          <van-switch
            v-model:checked="themeStore.isDark"
            size="20px"
            active-color="#00a86b"
            @change="toggleDarkMode"
          />
        </div>
        <div class="settings-item" @click="toggleFollowSystem">
          <span class="settings-icon">🔄</span>
          <span class="settings-text">跟随系统</span>
          <van-switch
            v-model:checked="themeStore.followSystem"
            size="20px"
            active-color="#00a86b"
            @change="toggleFollowSystem"
          />
        </div>
        <div class="settings-item" @click="confirmClear">
          <span class="settings-icon">🗑️</span>
          <span class="settings-text">清空学习进度</span>
          <van-icon name="arrow" color="#969799" />
        </div>
        <div class="settings-item" @click="showAbout">
          <span class="settings-icon">ℹ️</span>
          <span class="settings-text">关于我们</span>
          <van-icon name="arrow" color="#969799" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useModelStore } from '@/stores/model'
import { useCheckInStore } from '@/stores/checkin'
import { useThemeStore } from '@/stores/theme'
import { showDialog, showConfirmDialog, showToast } from 'vant'

const router = useRouter()
const store = useModelStore()
const checkInStore = useCheckInStore()
const themeStore = useThemeStore()

const favoriteModels = computed(() => {
  return store.models.filter(m => store.favorites.includes(m.id))
})

const completedModels = computed(() => {
  return store.models.filter(m => store.learningProgress[m.id]?.completed)
})

const historyModels = computed(() => {
  return store.getViewHistory()
})

function clearHistory() {
  store.clearViewHistory()
  showToast('浏览历史已清空')
}

const moduleIcons = {
  '认知模块': '🧠',
  '竞争模块': '🏆',
  '组织模块': '👥',
  '创新模块': '💡',
  '战略模块': '📈',
  '其他': '📌'
}

function getModelIcon(module) {
  return moduleIcons[module] || moduleIcons['其他']
}

function getUserLevel() {
  if (store.progressPercent >= 80) return 5
  if (store.progressPercent >= 60) return 4
  if (store.progressPercent >= 40) return 3
  if (store.progressPercent >= 20) return 2
  if (store.progressPercent >= 1) return 1
  return 0
}

function goToDetail(id) {
  router.push(`/model/${id}`)
}

function goToCheckIn() {
  router.push('/checkin')
}

function toggleDarkMode() {
  themeStore.toggleDark()
}

function toggleFollowSystem() {
  themeStore.setFollowSystem(themeStore.followSystem)
  showToast(themeStore.followSystem ? '已开启跟随系统' : '已关闭跟随系统')
}

function showAbout() {
  showDialog({
    title: '关于思维模型 108',
    message: `
      <div style="text-align: left; padding: 16px; line-height: 1.8;">
        <p style="margin-bottom: 12px;"><strong>版本：</strong>v1.0.0</p>
        <p style="margin-bottom: 12px;"><strong>简介：</strong>这是一个互动式思维模型学习工具，收录了 108 个经典思维模型。</p>
        <p style="margin-bottom: 12px;"><strong>特色：</strong></p>
        <ul style="padding-left: 20px; margin-bottom: 12px;">
          <li>漫画式教学方式</li>
          <li>互动测试巩固知识</li>
          <li>随时随地学习</li>
        </ul>
        <p style="text-align: center; margin-top: 20px; color: #00a86b; font-weight: 600;">让学习变得更有趣！</p>
      </div>
    `,
    allowHTML: true
  })
}

function confirmClear() {
  showConfirmDialog({
    title: '确认清空',
    message: '确定要清空所有学习进度吗？此操作不可恢复！'
  }).then(() => {
    Object.keys(store.learningProgress).forEach(key => {
      delete store.learningProgress[key]
    })
    store.favorites.splice(0, store.favorites.length)
    showToast('已清空')
  }).catch(() => {})
}

onMounted(() => {
  checkInStore.init()
})
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: linear-gradient(180deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
  padding-top: 46px;
  padding-bottom: 20px;
  transition: background 0.3s ease;
}

/* ========== 用户信息卡片 ========== */
.user-card {
  background: var(--primary-color-gradient);
  padding: 24px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  position: relative;
  overflow: hidden;
  margin-bottom: 16px;
}

.user-card::before {
  content: '';
  position: absolute;
  top: -30%;
  right: -15%;
  width: 150px;
  height: 150px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
}

.user-card::after {
  content: '';
  position: absolute;
  bottom: -20%;
  left: -5%;
  width: 100px;
  height: 100px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 50%;
}

.avatar {
  font-size: 48px;
  width: 72px;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.25);
  border-radius: 50%;
  backdrop-filter: blur(10px);
  position: relative;
  z-index: 1;
}

.user-info {
  flex: 1;
  position: relative;
  z-index: 1;
}

.user-info h3 {
  margin: 0;
  color: white;
  font-size: 20px;
  font-weight: 600;
}

.user-desc {
  margin: 4px 0 8px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
}

.user-level {
  display: inline-block;
}

/* ========== 统计卡片 ========== */
.stats-card {
  background: var(--card-bg);
  margin: 0 16px 16px;
  padding: 20px;
  border-radius: 16px;
  box-shadow: var(--shadow-sm);
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.stat-item {
  text-align: center;
  flex: 1;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin: 0 auto 8px;
  color: white;
}

.stat-number {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
}

.stat-label {
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 4px;
}

.stat-divider {
  width: 1px;
  height: 50px;
  background: var(--border-color);
  margin: 0 8px;
}

/* ========== 分区样式 ========== */
.section {
  padding: 0 16px;
  margin-bottom: 16px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.history-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.history-actions .van-icon {
  cursor: pointer;
  padding: 4px;
  transition: all 0.2s;
}

.history-actions .van-icon:active {
  opacity: 0.6;
  transform: scale(0.9);
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.section-count {
  font-size: 12px;
  color: white;
  background: var(--primary-color-gradient);
  padding: 2px 10px;
  border-radius: 12px;
}

/* ========== 进度卡片 ========== */
.progress-card {
  background: var(--card-bg);
  border-radius: 16px;
  padding: 20px;
  box-shadow: var(--shadow-sm);
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.progress-label {
  font-size: 14px;
  color: var(--text-secondary);
}

.progress-value {
  font-size: 18px;
  font-weight: 700;
  color: var(--primary-color-light);
}

.progress-tip {
  margin-top: 12px;
  text-align: center;
}

/* ========== 卡片列表 ========== */
.card-list {
  background: var(--card-bg);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.card-list-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-bottom: 1px solid var(--border-light);
  cursor: pointer;
  transition: background 0.2s;
}

.card-list-item:last-child {
  border-bottom: none;
}

.card-list-item:active {
  background: var(--primary-bg-soft);
}

.item-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(0, 168, 107, 0.1), rgba(0, 196, 126, 0.1));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  flex-shrink: 0;
}

.item-content {
  flex: 1;
  min-width: 0;
}

.item-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 4px;
}

.item-desc {
  font-size: 12px;
  color: var(--text-secondary);
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* ========== 设置列表 ========== */
.settings-list {
  background: var(--card-bg);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.settings-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-bottom: 1px solid var(--border-light);
  cursor: pointer;
  transition: background 0.2s;
}

.settings-item:last-child {
  border-bottom: none;
}

.settings-item:active {
  background: var(--primary-bg-soft);
}

.settings-icon {
  font-size: 20px;
}

.settings-text {
  flex: 1;
  font-size: 15px;
  color: var(--text-primary);
}

/* ========== 打卡卡片 ========== */
.checkin-card {
  background: var(--card-bg);
  border-radius: 16px;
  padding: 16px;
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  transition: all 0.2s;
}

.checkin-card:active {
  transform: scale(0.98);
  background: var(--primary-bg-soft);
}

.checkin-preview {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.checkin-status {
  font-size: 32px;
}

.checkin-text {
  flex: 1;
  padding: 0 12px;
}

.checkin-text strong {
  display: block;
  font-size: 15px;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.checkin-text p {
  margin: 0;
  font-size: 13px;
  color: var(--text-secondary);
}

/* ========== 空状态 ========== */
.empty-state {
  background: var(--card-bg);
  border-radius: 16px;
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  box-shadow: var(--shadow-sm);
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
