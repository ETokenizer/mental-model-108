<template>
  <div class="quiz-page">
    <van-nav-bar title="思维测试" left-text="返回" left-arrow @click-left="goBack" fixed placeholder />

    <div class="quiz-content" v-if="!quizComplete">
      <!-- 进度头部 -->
      <div class="quiz-header">
        <div class="progress-info">
          <span class="question-count">第 {{ currentQuestion + 1 }} / {{ questions.length }} 题</span>
          <span class="score-display">{{ score }} 分</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill" :style="{ width: questionProgress + '%' }"></div>
        </div>
      </div>

      <!-- 问题卡片 -->
      <div class="question-card">
        <div class="question-visual">
          <div class="question-icon-bg">
            <span class="question-emoji">✦</span>
          </div>
          <div class="question-content-box">
            <p class="question-text-content">{{ currentQuestionData.question }}</p>
          </div>
        </div>
      </div>

      <!-- 选项 -->
      <div class="options">
        <div
          v-for="(option, index) in currentQuestionData.options"
          :key="index"
          class="option-item"
          :class="getOptionClass(index)"
          @click="selectOption(index)"
        >
          <span class="option-letter">{{ getOptionLetter(index) }}</span>
          <span class="option-text">{{ option }}</span>
          <span class="option-status" v-if="answered">
            <van-icon
              :name="index === currentQuestionData.correct ? 'checked' : 'close'"
              size="16"
              :color="index === currentQuestionData.correct ? '#34c759' : '#ff3b30'"
            />
          </span>
        </div>
      </div>

      <!-- 反馈 -->
      <div class="feedback-section" v-if="answered">
        <div class="feedback-banner" :class="currentQuestionData.correct === selectedOption ? 'correct' : 'wrong'">
          <div class="feedback-icon">
            <van-icon :name="currentQuestionData.correct === selectedOption ? 'checked' : 'info-o'" size="20" color="white" />
          </div>
          <div class="feedback-content">
            <p class="feedback-title">{{ currentQuestionData.correct === selectedOption ? '回答正确' : '回答错误' }}</p>
            <p class="feedback-text">{{ currentQuestionData.explanation }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 完成页面 -->
    <div class="complete-page" v-else>
      <div class="complete-header">
        <div class="complete-icon">{{ getCompleteIcon() }}</div>
        <h2 class="complete-title">{{ getCompleteTitle() }}</h2>
      </div>

      <div class="score-card">
        <div class="score-circle" :style="{ borderColor: getScoreColor() }">
          <span class="score-number" :style="{ color: getScoreColor() }">{{ score }}</span>
          <span class="score-total">/ {{ questions.length * 10 }}</span>
        </div>
        <div class="score-percent">{{ getScorePercent() }}%</div>
        <p class="complete-message">{{ getMessageByScore() }}</p>
      </div>

      <div class="complete-actions">
        <van-button type="primary" size="large" round block @click="retryQuiz" icon="replay">
          再测一次
        </van-button>
        <van-button color="linear-gradient(135deg, #00a86b 0%, #00c47e 100%)" size="large" round block @click="goBack" icon="home-o">
          返回首页
        </van-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useModelStore } from '@/stores/model'
import { getRandomQuestions } from '@/data/questions'

const route = useRoute()
const router = useRouter()
const store = useModelStore()

const model = ref(null)
const currentQuestion = ref(0)
const score = ref(0)
const selectedOption = ref(null)
const answered = ref(false)
const quizComplete = ref(false)
const questions = ref([])

const currentQuestionData = computed(() => questions.value[currentQuestion.value] || {})
const questionProgress = computed(() => ((currentQuestion.value + 1) / questions.value.length) * 100)

function getOptionLetter(index) {
  return String.fromCharCode(65 + index)
}

function getOptionClass(index) {
  if (!answered.value) return selectedOption.value === index ? 'selected' : ''
  if (index === currentQuestionData.value.correct) return 'correct'
  if (index === selectedOption.value && index !== currentQuestionData.value.correct) return 'wrong'
  return ''
}

function selectOption(index) {
  if (answered.value) return
  selectedOption.value = index
  answered.value = true
  if (index === currentQuestionData.value.correct) score.value += 10

  setTimeout(() => {
    if (currentQuestion.value < questions.value.length - 1) {
      currentQuestion.value++
      selectedOption.value = null
      answered.value = false
    } else {
      quizComplete.value = true
      if (model.value) store.updateProgress(model.value.id, true)
    }
  }, 1500)
}

function getMessageByScore() {
  const percentage = score.value / (questions.value.length * 10)
  if (percentage === 1) return '完美！全部答对了！'
  if (percentage >= 0.8) return '太棒了！继续保持～'
  if (percentage >= 0.6) return '不错哦！还可以更好～'
  if (percentage >= 0.4) return '再接再厉！'
  return '加油！建议重新学习这个模型～'
}

function getCompleteIcon() {
  const percentage = score.value / (questions.value.length * 10)
  if (percentage >= 0.8) return '🏆'
  if (percentage >= 0.6) return '🎉'
  return '📚'
}

function getCompleteTitle() {
  const percentage = score.value / (questions.value.length * 10)
  if (percentage >= 0.8) return '太厉害了！'
  if (percentage >= 0.6) return '完成测试！'
  return '继续加油！'
}

function getScoreColor() {
  const percentage = score.value / (questions.value.length * 10)
  if (percentage >= 0.8) return '#34c759'
  if (percentage >= 0.6) return '#00a86b'
  if (percentage >= 0.4) return '#ff9500'
  return '#ff3b30'
}

function getScorePercent() {
  return Math.round((score.value / (questions.value.length * 10)) * 100)
}

function retryQuiz() {
  currentQuestion.value = 0
  score.value = 0
  selectedOption.value = null
  answered.value = false
  quizComplete.value = false
}

function goBack() {
  router.back()
}

onMounted(() => {
  model.value = store.getModelById(route.params.id)
  if (model.value) questions.value = getRandomQuestions(model.value)
})
</script>

<style scoped>
.quiz-page {
  min-height: 100vh;
  background: var(--bg-secondary);
  padding-top: 46px;
}

.quiz-header {
  padding: 20px;
  background: var(--bg-card);
  margin-bottom: 16px;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.question-count {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.score-display {
  font-size: 14px;
  font-weight: 600;
  color: #34c759;
  background: rgba(52, 199, 89, 0.1);
  padding: 6px 12px;
  border-radius: 12px;
}

.progress-track {
  height: 6px;
  background: var(--bg-tertiary);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #00a86b, #00c47e);
  transition: width 0.3s ease;
}

.question-card {
  background: var(--bg-card);
  margin: 0 20px 16px;
  border-radius: var(--card-radius);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.question-visual {
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.question-icon-bg {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #00a86b 0%, #00c47e 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.question-emoji {
  font-size: 24px;
  color: white;
}

.question-content-box {
  background: var(--bg-tertiary);
  border-radius: 12px;
  padding: 18px;
  width: 100%;
}

.question-text-content {
  font-size: 15px;
  font-weight: 500;
  color: var(--text-primary);
  margin: 0;
  line-height: 1.7;
  text-align: center;
}

.options {
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.option-item {
  background: var(--bg-card);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  border: 2px solid var(--border-color);
  transition: all 0.2s;
}

.option-item:active {
  transform: scale(0.98);
}

.option-item.selected {
  border-color: #00a86b;
  background: rgba(0, 168, 107, 0.05);
}

.option-item.correct {
  border-color: #34c759;
  background: rgba(52, 199, 89, 0.05);
}

.option-item.wrong {
  border-color: #ff3b30;
  background: rgba(255, 59, 48, 0.05);
}

.option-letter {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--bg-tertiary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-tertiary);
}

.option-item.selected .option-letter {
  background: #00a86b;
  color: white;
}

.option-item.correct .option-letter {
  background: #34c759;
  color: white;
}

.option-item.wrong .option-letter {
  background: #ff3b30;
  color: white;
}

.option-text {
  flex: 1;
  font-size: 15px;
  color: var(--text-primary);
}

.option-status {
  width: 24px;
}

.feedback-section {
  padding: 0 20px;
  margin-top: 16px;
}

.feedback-banner {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  border-radius: 12px;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.feedback-banner.correct {
  background: linear-gradient(135deg, #34c759 0%, #30d158 100%);
}

.feedback-banner.wrong {
  background: linear-gradient(135deg, #ff3b30 0%, #ff4f45 100%);
}

.feedback-icon {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.feedback-content {
  flex: 1;
}

.feedback-title {
  font-size: 15px;
  font-weight: 600;
  color: white;
  margin: 0 0 6px;
}

.feedback-text {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  line-height: 1.6;
}

.complete-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 24px;
  text-align: center;
}

.complete-header {
  margin-bottom: 32px;
}

.complete-icon {
  font-size: 72px;
  margin-bottom: 16px;
  animation: bounce 0.6s ease;
}

@keyframes bounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.15); }
}

.complete-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.score-card {
  background: var(--bg-card);
  border-radius: var(--card-radius-lg);
  padding: 32px;
  margin-bottom: 24px;
  box-shadow: var(--shadow-md);
  width: 100%;
  max-width: 320px;
}

.score-circle {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  border: 8px solid;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  background: var(--bg-tertiary);
}

.score-number {
  font-size: 42px;
  font-weight: 700;
}

.score-total {
  font-size: 14px;
  color: var(--text-tertiary);
}

.score-percent {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 16px;
}

.complete-message {
  font-size: 15px;
  color: var(--text-tertiary);
  margin: 0;
}

.complete-actions {
  width: 100%;
  max-width: 320px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
