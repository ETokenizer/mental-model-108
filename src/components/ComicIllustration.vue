<template>
  <div class="comic-illustration" :style="cardStyle">
    <!-- 漫画风格边框 -->
    <div class="comic-border" :style="borderStyle"></div>

    <!-- 背景装饰 -->
    <div class="comic-bg" :style="bgStyle"></div>

    <!-- 主图标区域 -->
    <div class="comic-main">
      <div class="icon-container" :style="iconContainerStyle">
        <span class="main-icon">{{ config.icon }}</span>
        <!-- 漫画风格效果线 -->
        <div class="effect-lines" :style="effectLineStyle"></div>
      </div>
    </div>

    <!-- 对话气泡 -->
    <div class="comic-bubble" v-if="showBubble">
      <div class="bubble-content">
        <p class="bubble-text">{{ bubbleText }}</p>
      </div>
    </div>

    <!-- 模块标签 -->
    <div class="module-badge" :style="badgeStyle">
      {{ model.module }}
    </div>

    <!-- 漫画风格角标 -->
    <div class="comic-corner corner-tl" :style="cornerStyle"></div>
    <div class="comic-corner corner-br" :style="cornerStyle"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  model: {
    type: Object,
    required: true
  },
  showBubble: {
    type: Boolean,
    default: true
  }
})

// 模块配置
const moduleConfig = {
  '认知模块': {
    icon: '🧠',
    colors: ['#2fb5b0', '#1098ad', '#0d8a9a'],
    bubbleIcons: ['💡', '✨', '🔍'],
    gradient: 'linear-gradient(135deg, #2fb5b0 0%, #1098ad 50%, #0d8a9a 100%)'
  },
  '决策模块': {
    icon: '🎯',
    colors: ['#0ca678', '#0d8a9a', '#0a7a88'],
    bubbleIcons: ['🤔', '✅', '⚖️'],
    gradient: 'linear-gradient(135deg, #0ca678 0%, #0d8a9a 50%, #0a7a88 100%)'
  },
  '组织模块': {
    icon: '👥',
    colors: ['#4bc9c4', '#2fb5b0', '#1098ad'],
    bubbleIcons: ['🤝', '👏', '🎉'],
    gradient: 'linear-gradient(135deg, #4bc9c4 0%, #2fb5b0 50%, #1098ad 100%)'
  },
  '创新模块': {
    icon: '💡',
    colors: ['#6ad3ce', '#4bc9c4', '#2fb5b0'],
    bubbleIcons: ['🚀', '⭐', '🌟'],
    gradient: 'linear-gradient(135deg, #6ad3ce 0%, #4bc9c4 50%, #2fb5b0 100%)'
  },
  '战略模块': {
    icon: '📈',
    colors: ['#1098ad', '#0ca678', '#0d8a9a'],
    bubbleIcons: ['👑', '🏆', '💪'],
    gradient: 'linear-gradient(135deg, #1098ad 0%, #0ca678 50%, #0d8a9a 100%)'
  }
}

const defaultConfig = {
  icon: '📌',
  colors: ['#969799', '#c8c9cc', '#ebedf0'],
  bubbleIcons: ['📝', '📚', '💭'],
  gradient: 'linear-gradient(135deg, #969799 0%, #c8c9cc 50%, #ebedf0 100%)'
}

const config = moduleConfig[props.model?.module] || defaultConfig

// 根据模型 ID 生成不同的变化
const variation = props.model?.id ? props.model.id % 3 : 0

// 对话气泡文字
const bubbleText = computed(() => {
  const phrases = [
    `原来如此！${props.model?.name || ''}`,
    `学会啦～${props.model?.name || ''}`,
    `这个${props.model?.name || ''}很有用！`,
    `Get 新技能！${props.model?.name || ''}`,
    `恍然大悟！${props.model?.description?.substring(0, 10) || ''}...`
  ]
  return phrases[variation] || phrases[0]
})

// 卡片样式
const cardStyle = computed(() => ({
  background: config.gradient
}))

// 边框样式
const borderStyle = computed(() => ({
  background: `linear-gradient(45deg, ${config.colors[0]}, ${config.colors[1]}, ${config.colors[2]}, ${config.colors[0]})`,
  backgroundSize: '300% 300%'
}))

// 背景样式
const bgStyle = computed(() => ({
  backgroundImage: `
    radial-gradient(circle at 20% 30%, rgba(255,255,255,0.15) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(255,255,255,0.1) 0%, transparent 50%)
  `
}))

// 图标容器样式
const iconContainerStyle = computed(() => ({
  background: `radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)`,
  boxShadow: `0 8px 32px rgba(${hexToRgb(config.colors[0])}, 0.3), inset 0 2px 8px rgba(255,255,255,0.5)`
}))

// 效果线样式
const effectLineStyle = computed(() => ({
  background: `repeating-conic-gradient(from ${variation * 60}deg, rgba(255,255,255,0.3) 0deg 10deg, transparent 10deg 30deg)`
}))

// 徽章样式
const badgeStyle = computed(() => ({
  background: `rgba(255,255,255,0.25)`,
  backdropFilter: 'blur(10px)'
}))

// 角标样式
const cornerStyle = computed(() => ({
  background: `linear-gradient(45deg, rgba(255,255,255,0.4), transparent)`
}))

// 辅助函数：hex 转 rgb
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ?
    `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` :
    '7, 193, 96'
}
</script>

<style scoped>
.comic-illustration {
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  aspect-ratio: 4/3;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 16px 0;
}

/* 漫画边框 - 动画效果 */
.comic-border {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 20px;
  padding: 4px;
  animation: gradient-rotate 3s linear infinite;
  mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  mask-composite: exclude;
  -webkit-mask-composite: xor;
}

@keyframes gradient-rotate {
  0% { background-position: 0% 50%; }
  100% { background-position: 300% 0%; }
}

/* 背景装饰 */
.comic-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
}

/* 主图标区域 */
.comic-main {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-container {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.main-icon {
  font-size: 56px;
  position: relative;
  z-index: 2;
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));
  animation: icon-float 2s ease-in-out infinite;
}

@keyframes icon-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

.effect-lines {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  z-index: 1;
  opacity: 0.5;
  animation: rotate-effect 10s linear infinite;
}

@keyframes rotate-effect {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 对话气泡 */
.comic-bubble {
  position: absolute;
  top: 10%;
  right: 10%;
  z-index: 2;
  animation: bubble-pop 0.3s ease-out;
}

@keyframes bubble-pop {
  0% { transform: scale(0); opacity: 0; }
  80% { transform: scale(1.1); }
  100% { transform: scale(1); opacity: 1; }
}

.bubble-content {
  background: white;
  border-radius: 16px;
  padding: 10px 14px;
  position: relative;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  max-width: 140px;
}

.bubble-content::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 20%;
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 10px solid white;
}

.bubble-text {
  font-size: 12px;
  color: #333;
  margin: 0;
  line-height: 1.4;
  font-weight: 600;
}

/* 模块标签 */
.module-badge {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  color: white;
  text-shadow: 0 1px 2px rgba(0,0,0,0.2);
  z-index: 2;
}

/* 漫画角标 */
.comic-corner {
  position: absolute;
  width: 60px;
  height: 60px;
  z-index: 1;
  pointer-events: none;
}

.corner-tl {
  top: 0;
  left: 0;
  border-radius: 20px 0 20px 0;
}

.corner-br {
  bottom: 0;
  right: 0;
  border-radius: 0 20px 0 20px;
}
</style>
