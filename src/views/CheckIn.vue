<template>
  <div class="checkin-page">
    <div class="checkin-header">
      <h1 class="page-title">📅 每日打卡</h1>
      <p class="page-desc">坚持学习，每天进步一点点</p>
    </div>

    <!-- 打卡卡片 -->
    <div class="checkin-card">
      <div class="streak-info">
        <div class="streak-icon">🔥</div>
        <div class="streak-text">
          <div class="streak-number">{{ checkInStore.streakDays }}</div>
          <div class="streak-label">连续打卡</div>
        </div>
      </div>
      <div class="total-info">
        <div class="total-number">{{ checkInStore.totalDays }}</div>
        <div class="total-label">累计打卡</div>
      </div>
    </div>

    <!-- 今日打卡按钮 -->
    <div class="today-checkin">
      <div class="today-status" v-if="checkInStore.hasCheckedInToday">
        <div class="checked-icon">✅</div>
        <h3>今日已打卡</h3>
        <p>明天继续加油哦！</p>
      </div>
      <div class="today-status" v-else>
        <van-button
          type="primary"
          size="large"
          round
          block
          @click="handleCheckIn"
          class="checkin-btn"
        >
          🎯 立即打卡
        </van-button>
        <p class="checkin-tip">完成今日学习后打卡</p>
      </div>
    </div>

    <!-- 本周记录 -->
    <div class="week-section">
      <h3 class="section-title">本周记录</h3>
      <div class="week-grid">
        <div
          v-for="day in checkInStore.weekRecords"
          :key="day.date"
          class="day-item"
          :class="{ checked: day.checkedIn, isToday: day.isToday }"
        >
          <div class="day-name">{{ day.day }}</div>
          <div class="day-status">{{ day.checkedIn ? '✓' : '○' }}</div>
        </div>
      </div>
    </div>

    <!-- 打卡日历 -->
    <div class="calendar-section">
      <h3 class="section-title">📆 打卡日历</h3>
      <div class="calendar-grid">
        <div
          v-for="day in calendar"
          :key="day.date"
          class="calendar-day"
          :class="{ checked: day.checkedIn, isToday: day.isToday }"
        >
          <span class="day-num">{{ day.day }}</span>
          <span class="day-dot" v-if="day.checkedIn"></span>
        </div>
      </div>
    </div>

    <!-- 激励语 -->
    <div class="motivation-card">
      <div class="motivation-icon">💬</div>
      <p class="motivation-text">{{ motivation }}</p>
    </div>

    <!-- 打卡成功弹窗 -->
    <van-dialog
      v-model:show="showSuccessDialog"
      title="🎉 打卡成功"
      :show-confirm-button="false"
      class="success-dialog"
    >
      <div class="success-content">
        <div class="success-icon">🏆</div>
        <p>连续打卡 {{ checkInStore.streakDays }} 天</p>
        <p class="success-msg">{{ checkInStore.getMotivation() }}</p>
      </div>
    </van-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useCheckInStore } from '@/stores/checkin'
import { showToast } from 'vant'

const checkInStore = useCheckInStore()
const showSuccessDialog = ref(false)
const motivation = ref('')

const calendar = computed(() => checkInStore.getCheckInCalendar())

function handleCheckIn() {
  const result = checkInStore.checkIn()
  if (result.success) {
    motivation.value = checkInStore.getMotivation()
    showSuccessDialog.value = true
    showToast('打卡成功！')
  } else {
    showToast(result.message)
  }
}

onMounted(() => {
  checkInStore.init()
})
</script>

<style scoped>
.checkin-page {
  min-height: 100vh;
  background: var(--primary-bg);
  padding-bottom: 20px;
}

.checkin-header {
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

/* 打卡卡片 */
.checkin-card {
  background: var(--primary-color-gradient);
  margin: 16px;
  padding: 24px;
  border-radius: 16px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-shadow: 0 4px 16px rgba(0, 168, 107, 0.2);
}

.streak-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.streak-icon {
  font-size: 48px;
}

.streak-text {
  text-align: center;
}

.streak-number {
  font-size: 32px;
  font-weight: 700;
  color: white;
}

.streak-label {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.9);
}

.total-info {
  text-align: center;
}

.total-number {
  font-size: 32px;
  font-weight: 700;
  color: white;
}

.total-label {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.9);
}

/* 今日打卡 */
.today-checkin {
  padding: 24px 16px;
  text-align: center;
}

.today-status {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.checked-icon {
  font-size: 64px;
}

.today-status h3 {
  margin: 0;
  font-size: 18px;
  color: var(--text-primary);
}

.today-status p {
  margin: 4px 0 0;
  font-size: 14px;
  color: var(--text-secondary);
}

.checkin-btn {
  background: var(--primary-color-gradient);
  border: none;
  height: 52px;
  font-size: 16px;
  font-weight: 600;
}

.checkin-tip {
  margin: 12px 0 0;
  font-size: 13px;
  color: var(--text-secondary);
}

/* 本周记录 */
.week-section {
  padding: 0 16px;
  margin-bottom: 16px;
}

.section-title {
  margin: 0 0 12px;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.week-grid {
  background: var(--card-bg);
  border-radius: 12px;
  padding: 16px;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
}

.day-item {
  text-align: center;
  padding: 12px 4px;
  border-radius: 8px;
  background: var(--primary-bg-soft);
}

.day-item.checked {
  background: var(--primary-color-gradient);
}

.day-item.isToday {
  border: 2px solid var(--primary-color);
}

.day-name {
  font-size: 12px;
  color: var(--text-secondary);
  margin-bottom: 4px;
}

.day-item.checked .day-name {
  color: rgba(255, 255, 255, 0.9);
}

.day-status {
  font-size: 20px;
  font-weight: 600;
  color: var(--primary-color);
}

.day-item.checked .day-status {
  color: white;
}

/* 打卡日历 */
.calendar-section {
  padding: 0 16px;
  margin-bottom: 16px;
}

.calendar-grid {
  background: var(--card-bg);
  border-radius: 12px;
  padding: 16px;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
}

.calendar-day {
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: var(--primary-bg-soft);
  position: relative;
}

.calendar-day.checked {
  background: var(--primary-color-gradient);
}

.calendar-day.isToday {
  border: 2px solid var(--primary-color);
}

.calendar-day.isToday.checked {
  border-color: white;
}

.day-num {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.calendar-day.checked .day-num {
  color: white;
}

.day-dot {
  position: absolute;
  bottom: 4px;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--primary-color);
}

.calendar-day.checked .day-dot {
  background: white;
}

/* 激励语 */
.motivation-card {
  background: var(--card-bg);
  margin: 16px;
  padding: 20px;
  border-radius: 12px;
  display: flex;
  gap: 12px;
  align-items: flex-start;
  box-shadow: var(--shadow-sm);
}

.motivation-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.motivation-text {
  margin: 0;
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.6;
}

/* 成功弹窗 */
.success-content {
  padding: 24px;
  text-align: center;
}

.success-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.success-content p {
  margin: 8px 0;
  font-size: 16px;
  color: var(--text-primary);
}

.success-msg {
  color: var(--primary-color);
  font-weight: 600;
}
</style>
