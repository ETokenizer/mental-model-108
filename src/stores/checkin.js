import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// 本地存储 key
const STORAGE_KEY = 'mental_models_checkin'

// 获取今天的日期字符串 (YYYY-MM-DD)
function getTodayString() {
  const today = new Date()
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
}

// 计算两个日期之间的天数差
function getDaysBetween(date1, date2) {
  const d1 = new Date(date1)
  const d2 = new Date(date2)
  const diffTime = Math.abs(d2 - d1)
  return Math.floor(diffTime / (1000 * 60 * 60 * 24))
}

export const useCheckInStore = defineStore('checkin', () => {
  // 打卡记录
  const checkInRecords = ref([])
  // 连续天数
  const streakDays = ref(0)
  // 总打卡天数
  const totalDays = ref(0)
  // 是否已打卡
  const hasCheckedInToday = ref(false)

  // 初始化数据
  function init() {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const data = JSON.parse(stored)
      checkInRecords.value = data.records || []
      streakDays.value = data.streak || 0
      totalDays.value = data.total || 0
      checkTodayStatus()
    }
  }

  // 检查今天是否已打卡
  function checkTodayStatus() {
    const today = getTodayString()
    hasCheckedInToday.value = checkInRecords.value.includes(today)
  }

  // 执行打卡
  function checkIn() {
    const today = getTodayString()
    if (checkInRecords.value.includes(today)) {
      return { success: false, message: '今天已经打卡过了' }
    }

    // 添加打卡记录
    checkInRecords.value.push(today)
    checkInRecords.value.sort()
    totalDays.value++

    // 计算连续天数
    calculateStreak()

    // 保存到本地存储
    saveToStorage()
    hasCheckedInToday.value = true

    return { success: true, message: '打卡成功！' }
  }

  // 计算连续天数
  function calculateStreak() {
    if (checkInRecords.value.length === 0) {
      streakDays.value = 0
      return
    }

    // 从最近到远排序
    const sorted = [...checkInRecords.value].sort((a, b) => new Date(b) - new Date(a))
    const today = getTodayString()
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayString = yesterday.toISOString().split('T')[0]

    // 检查是否从昨天或今天开始
    if (sorted[0] !== today && sorted[0] !== yesterdayString) {
      streakDays.value = 1
      return
    }

    let streak = 1
    for (let i = 1; i < sorted.length; i++) {
      const prevDate = new Date(sorted[i - 1])
      const currDate = new Date(sorted[i])
      const diff = getDaysBetween(prevDate, currDate)

      if (diff === 1) {
        streak++
      } else if (diff > 1) {
        break
      }
    }

    streakDays.value = streak
  }

  // 保存到本地存储
  function saveToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      records: checkInRecords.value,
      streak: streakDays.value,
      total: totalDays.value
    }))
  }

  // 获取打卡日历数据
  function getCheckInCalendar() {
    const today = new Date()
    const month = today.getMonth()
    const year = today.getFullYear()

    // 获取当月天数
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const calendar = []

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      calendar.push({
        day,
        date: dateStr,
        checkedIn: checkInRecords.value.includes(dateStr),
        isToday: dateStr === getTodayString()
      })
    }

    return calendar
  }

  // 获取激励语
  function getMotivation() {
    const motivations = [
      '🌟 每天进步一点点，成为更好的自己！',
      '💪 坚持就是胜利，继续加油！',
      '📚 学习是最好的投资！',
      '🎯 目标明确，行动有力！',
      '🚀 积跬步以至千里！',
      '✨ 你的努力，时间会证明！',
      '🌈 越努力，越幸运！',
      '🏆 超越自我，从每天开始！'
    ]
    return motivations[Math.floor(Math.random() * motivations.length)]
  }

  // 计算属性
  const weekRecords = computed(() => {
    const today = new Date()
    const week = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      week.push({
        date: dateStr,
        day: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][date.getDay()],
        checkedIn: checkInRecords.value.includes(dateStr)
      })
    }
    return week
  })

  return {
    checkInRecords,
    streakDays,
    totalDays,
    hasCheckedInToday,
    init,
    checkIn,
    checkTodayStatus,
    getCheckInCalendar,
    getMotivation,
    weekRecords
  }
})
