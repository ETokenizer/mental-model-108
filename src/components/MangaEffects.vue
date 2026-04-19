<template>
  <div class="manga-effects">
    <!-- 闪烁星星 -->
    <div class="sparkle-container" v-if="type === 'sparkle'">
      <span class="sparkle" v-for="i in 5" :key="i" :style="sparkleStyle(i)">✨</span>
    </div>

    <!-- 震惊效果线 -->
    <div class="shock-lines" v-if="type === 'shock'">
      <div class="shock-line" v-for="i in 6" :key="i" :style="shockLineStyle(i)"></div>
    </div>

    <!-- 思考云朵 -->
    <div class="thought-cloud" v-if="type === 'thought'">
      <div class="cloud-bubble">
        <span class="cloud-icon">💭</span>
      </div>
      <div class="cloud-dots">
        <span class="dot" v-for="i in 3" :key="i" :style="dotStyle(i)"></span>
      </div>
    </div>

    <!-- 灵光一现 -->
    <div class="lightbulb-moment" v-if="type === 'idea'">
      <span class="lightbulb">💡</span>
      <div class="rays" :style="raysStyle"></div>
    </div>

    <!-- 掌声效果 -->
    <div class="applause-effect" v-if="type === 'applause'">
      <span class="clap" v-for="i in 3" :key="i" :style="clapStyle(i)">👏</span>
    </div>

    <!-- 目标达成 -->
    <div class="target-effect" v-if="type === 'target'">
      <span class="target">🎯</span>
      <div class="rings">
        <div class="ring" v-for="i in 3" :key="i" :style="ringStyle(i)"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  type: {
    type: String,
    default: 'sparkle',
    validator: (value) => ['sparkle', 'shock', 'thought', 'idea', 'applause', 'target'].includes(value)
  }
})

// 星星样式
function sparkleStyle(index) {
  const positions = [
    { top: '0%', left: '0%' },
    { top: '0%', left: '100%' },
    { top: '50%', left: '50%' },
    { top: '100%', left: '0%' },
    { top: '100%', left: '100%' }
  ]
  const pos = positions[index - 1] || positions[2]
  return {
    top: pos.top,
    left: pos.left,
    animationDelay: `${(index - 1) * 0.15}s`
  }
}

// 震惊线样式
function shockLineStyle(index) {
  const angles = [0, 60, 120, 180, 240, 300]
  return {
    transform: `rotate(${angles[index - 1]}deg) translateY(-30px)`,
    animationDelay: `${(index - 1) * 0.05}s`
  }
}

// 圆点样式
function dotStyle(index) {
  return {
    animationDelay: `${(index - 1) * 0.2}s`,
    transform: `translateX(${index * 8}px)`
  }
}

// 光线样式
const raysStyle = {
  animation: 'rays-rotate 2s linear infinite'
}

// 拍手样式
function clapStyle(index) {
  return {
    animationDelay: `${(index - 1) * 0.2}s`,
    transform: `translateX(${(index - 2) * 20}px) translateY(${Math.abs(index - 2) * 10}px)`
  }
}

// 圆环样式
function ringStyle(index) {
  return {
    animationDelay: `${(index - 1) * 0.15}s`,
    '--ring-size': `${20 + index * 15}px`
  }
}
</script>

<style scoped>
.manga-effects {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ========== 闪烁星星 ========== */
.sparkle-container {
  position: relative;
  width: 100px;
  height: 100px;
}

.sparkle {
  position: absolute;
  font-size: 20px;
  opacity: 0;
  animation: sparkle-anim 0.8s ease-in-out infinite;
}

@keyframes sparkle-anim {
  0%, 100% {
    opacity: 0;
    transform: scale(0) rotate(0deg);
  }
  50% {
    opacity: 1;
    transform: scale(1.2) rotate(180deg);
  }
}

/* ========== 震惊效果线 ========== */
.shock-lines {
  position: relative;
  width: 100px;
  height: 100px;
}

.shock-line {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 4px;
  height: 30px;
  background: linear-gradient(to top, transparent, #333, transparent);
  transform-origin: center bottom;
  opacity: 0;
  animation: shock-anim 0.6s ease-out infinite;
}

@keyframes shock-anim {
  0% {
    opacity: 0;
    transform: scaleY(0);
  }
  50% {
    opacity: 1;
    transform: scaleY(1);
  }
  100% {
    opacity: 0;
    transform: scaleY(0.5);
  }
}

/* ========== 思考云朵 ========== */
.thought-cloud {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.cloud-bubble {
  background: white;
  border-radius: 50%;
  padding: 16px 24px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  animation: cloud-float 2s ease-in-out infinite;
}

.cloud-icon {
  font-size: 32px;
}

.cloud-dots {
  display: flex;
  gap: 4px;
  margin-top: 8px;
}

.dot {
  width: 8px;
  height: 8px;
  background: #ccc;
  border-radius: 50%;
  opacity: 0;
  animation: dot-appear 0.6s ease-out infinite;
}

@keyframes cloud-float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

@keyframes dot-appear {
  0%, 100% {
    opacity: 0;
    transform: scale(0);
  }
  50% {
    opacity: 1;
    transform: scale(1);
  }
}

/* ========== 灵光一现 ========== */
.lightbulb-moment {
  position: relative;
}

.lightbulb {
  font-size: 48px;
  position: relative;
  z-index: 2;
  animation: lightbulb-glow 1.5s ease-in-out infinite;
}

.rays {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120px;
  height: 120px;
  background: conic-gradient(
    from 0deg,
    rgba(255, 255, 0, 0.3) 0deg 30deg,
    transparent 30deg 60deg,
    rgba(255, 200, 0, 0.3) 60deg 90deg,
    transparent 90deg 120deg,
    rgba(255, 180, 0, 0.3) 120deg 150deg,
    transparent 150deg 180deg,
    rgba(255, 160, 0, 0.3) 180deg 210deg,
    transparent 210deg 240deg,
    rgba(255, 140, 0, 0.3) 240deg 270deg,
    transparent 270deg 300deg,
    rgba(255, 120, 0, 0.3) 300deg 330deg,
    transparent 330deg 360deg
  );
  border-radius: 50%;
  z-index: 1;
}

@keyframes lightbulb-glow {
  0%, 100% {
    transform: scale(1);
    filter: brightness(1);
  }
  50% {
    transform: scale(1.1);
    filter: brightness(1.3);
  }
}

@keyframes rays-rotate {
  from {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

/* ========== 掌声效果 ========== */
.applause-effect {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.clap {
  font-size: 32px;
  opacity: 0;
  animation: clap-anim 0.8s ease-in-out infinite;
}

@keyframes clap-anim {
  0%, 100% {
    opacity: 0;
    transform: scale(0.5) rotate(-10deg);
  }
  50% {
    opacity: 1;
    transform: scale(1.2) rotate(10deg);
  }
}

/* ========== 目标达成 ========== */
.target-effect {
  position: relative;
}

.target {
  font-size: 48px;
  position: relative;
  z-index: 2;
  animation: target-pulse 1s ease-in-out infinite;
}

.rings {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100px;
  height: 100px;
}

.ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: var(--ring-size, 30px);
  height: var(--ring-size, 30px);
  border: 3px solid rgba(255, 150, 0, 0.6);
  border-radius: 50%;
  opacity: 0;
  animation: ring-expand 1.2s ease-out infinite;
}

@keyframes target-pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

@keyframes ring-expand {
  0% {
    opacity: 1;
    width: 20px;
    height: 20px;
  }
  100% {
    opacity: 0;
    width: 100px;
    height: 100px;
  }
}
</style>
