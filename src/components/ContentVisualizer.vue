<template>
  <div class="content-visualizer">
    <!-- 标题区域 -->
    <div class="cv-header" :style="headerStyle">
      <h2 class="cv-title">{{ model.name }}</h2>
      <p class="cv-subtitle">{{ model.description }}</p>
    </div>

    <!-- 结构化内容 - 智能解析 -->
    <div class="cv-body">
      <!-- 如果内容有明显的列表结构，使用卡片展示 -->
      <div class="cv-section" v-if="hasListStructure">
        <div class="cv-card" v-for="(item, index) in parsedContent" :key="index" :style="cardStyle">
          <div class="cv-card-icon" :style="iconStyle">{{ getIcon(index) }}</div>
          <div class="cv-card-content">
            <h4 class="cv-card-title" :style="titleStyle">{{ item.title }}</h4>
            <p class="cv-card-desc">{{ item.desc }}</p>
          </div>
        </div>
      </div>

      <!-- 普通文本内容 -->
      <div class="cv-section" v-else>
        <div class="cv-text-content">
          <p class="cv-text" v-for="(line, index) in textLines" :key="index" :class="getLineClass(index)">
            {{ line }}
          </p>
        </div>
      </div>

      <!-- 应用场景标签 -->
      <div class="cv-section" v-if="model.application">
        <h3 class="cv-section-title">📌 应用场景</h3>
        <div class="app-tags">
          <van-tag
            v-for="(tag, index) in appTags"
            :key="index"
            :color="tagColor"
            text-color="#fff"
            size="medium"
            round
          >
            {{ tag }}
          </van-tag>
        </div>
      </div>

      <!-- 来源信息 -->
      <div class="cv-section" v-if="model.source">
        <h3 class="cv-section-title">📖 来源</h3>
        <p class="cv-source">{{ model.source }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  model: {
    type: Object,
    required: true
  }
})

// 模块颜色配置
const moduleColors = {
  '认知模块': { primary: '#2fb5b0', light: '#1098ad', bg: '#f0f9f4' },
  '决策模块': { primary: '#0ca678', light: '#0d8a9a', bg: '#f0f9f4' },
  '组织模块': { primary: '#4bc9c4', light: '#2fb5b0', bg: '#f0f9f4' },
  '创新模块': { primary: '#6ad3ce', light: '#4bc9c4', bg: '#f0f9f4' },
  '战略模块': { primary: '#1098ad', light: '#0ca678', bg: '#f0f9f4' },
  '其他': { primary: '#969799', light: '#c8c9cc', bg: '#f7f8fa' }
}

const colorScheme = moduleColors[props.model?.module] || moduleColors['其他']

// 头部样式
const headerStyle = computed(() => ({
  background: `linear-gradient(135deg, ${colorScheme.primary} 0%, ${colorScheme.light} 100%)`,
  color: 'white'
}))

// 卡片样式
const cardStyle = computed(() => ({
  borderLeft: `4px solid ${colorScheme.primary}`,
  background: `linear-gradient(90deg, ${colorScheme.bg} 0%, white 100%)`
}))

// 图标样式
const iconStyle = computed(() => ({
  background: `linear-gradient(135deg, ${colorScheme.primary}, ${colorScheme.light})`,
  color: 'white'
}))

// 标题样式
const titleStyle = computed(() => ({
  color: colorScheme.primary
}))

// 标签颜色
const tagColor = colorScheme.primary

// 图标列表
const icons = ['📌', '💡', '🎯', '⭐', '🔑', '📖', '🧠', '💪', '✨', '🌟']

function getIcon(index) {
  return icons[index % icons.length]
}

// 解析内容 - 尝试识别结构
const hasListStructure = computed(() => {
  const content = props.model?.content || ''
  // 检查是否有明显的分点结构
  const lines = content.split('\n').filter(l => l.trim())
  // 如果有多行且包含数字或项目符号
  const hasNumbering = lines.some(l => /^\d+[.,]/.test(l) || /^\d+\s/.test(l))
  const hasBullets = lines.some(l => /^[-•·▪]/.test(l))
  const hasStructure = lines.length > 3 && (hasNumbering || hasBullets)
  return hasStructure
})

// 解析后的内容
const parsedContent = computed(() => {
  const content = props.model?.content || ''
  const lines = content.split('\n').filter(l => l.trim())

  const result = []
  let currentItem = null

  for (const line of lines) {
    const trimmed = line.trim()
    // 识别标题行（较短，可能包含数字）
    if (/^\d+[.,]/.test(trimmed) || trimmed.length < 20) {
      if (currentItem) {
        result.push(currentItem)
      }
      currentItem = {
        title: trimmed.replace(/^\d+[.,]\s*/, ''),
        desc: ''
      }
    } else if (currentItem) {
      // 作为当前项目的描述
      currentItem.desc += (currentItem.desc ? ' ' : '') + trimmed
    } else {
      // 作为独立项
      result.push({ title: trimmed, desc: '' })
    }
  }

  if (currentItem) {
    result.push(currentItem)
  }

  return result.length > 0 ? result : [{ title: lines[0] || '内容', desc: lines.slice(1).join(' ') }]
})

// 纯文本行
const textLines = computed(() => {
  return (props.model?.content || '').split('\n').filter(l => l.trim())
})

// 应用标签
const appTags = computed(() => {
  const app = props.model?.application || ''
  return app.split(/[,,]/).map(t => t.trim()).filter(t => t)
})

// 根据行内容返回样式类
function getLineClass(index) {
  const line = textLines.value[index] || ''
  if (index === 0) return 'cv-text-title'
  if (line.includes('提出') || line.includes('来自')) return 'cv-text-source'
  return ''
}
</script>

<style scoped>
.content-visualizer {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  margin: 16px;
}

/* ========== 头部区域 ========== */
.cv-header {
  padding: 24px 20px;
  text-align: center;
}

.cv-title {
  margin: 0 0 8px;
  font-size: 22px;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.cv-subtitle {
  margin: 0;
  font-size: 14px;
  opacity: 0.95;
}

/* ========== 内容区域 ========== */
.cv-body {
  padding: 20px;
}

.cv-section {
  margin-bottom: 24px;
}

.cv-section:last-child {
  margin-bottom: 0;
}

.cv-section-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 12px;
  display: flex;
  align-items: center;
  gap: 6px;
}

/* ========== 结构化卡片 ========== */
.cv-card {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: transform 0.2s, box-shadow 0.2s;
}

.cv-card:last-child {
  margin-bottom: 0;
}

.cv-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.cv-card-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.cv-card-content {
  flex: 1;
  min-width: 0;
}

.cv-card-title {
  margin: 0 0 6px;
  font-size: 15px;
  font-weight: 600;
}

.cv-card-desc {
  margin: 0;
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.6;
}

/* ========== 文本内容 ========== */
.cv-text-content {
  line-height: 2;
}

.cv-text {
  margin: 0;
  font-size: 14px;
  color: var(--text-secondary);
  padding: 4px 0;
}

.cv-text-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  padding-bottom: 8px;
  border-bottom: 2px solid var(--border-color);
  margin-bottom: 12px;
}

.cv-text-source {
  font-size: 13px;
  color: var(--text-secondary);
  font-style: italic;
  background: var(--bg-secondary);
  padding: 8px 12px;
  border-radius: 8px;
  margin: 8px 0;
}

/* ========== 应用标签 ========== */
.app-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

/* ========== 来源信息 ========== */
.cv-source {
  margin: 0;
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.8;
  background: var(--bg-secondary);
  padding: 12px 16px;
  border-radius: 8px;
  border-left: 3px solid var(--border-color);
}
</style>
