<template>
  <div class="pdf-image-viewer">
    <!-- 加载进度 -->
    <div class="progress-overlay" v-if="loading">
      <van-loading type="spinner" size="24px" color="#00a86b">
        正在加载第{{ pageNum }}页...
      </van-loading>
    </div>

    <!-- 错误提示 -->
    <div class="error-overlay" v-if="error && loading">
      <van-empty :image="errorImage" :description="error" />
    </div>

    <!-- 图片容器 -->
    <div class="image-wrapper">
      <img
        ref="imgRef"
        :src="imageUrl"
        class="page-image"
        :style="imageStyle"
        @load="onImageLoad"
        @error="onImageError"
        alt="PDF Page"
      />
    </div>

    <!-- 缩放控制 -->
    <div class="zoom-controls" v-if="!loading">
      <span class="zoom-label">缩放：</span>
      <van-button icon="minus" size="small" @click="zoomOut" :disabled="scale <= MIN_SCALE" />
      <span class="zoom-level">{{ Math.round(scale * 100) }}%</span>
      <van-button icon="plus" size="small" @click="zoomIn" :disabled="scale >= MAX_SCALE" />
      <van-button icon="refresh" size="small" @click="resetZoom" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick, onBeforeUnmount } from 'vue'

const props = defineProps({
  pageNum: {
    type: Number,
    required: true
  }
})

const loading = ref(true)
const error = ref(null)
const imageUrl = ref('')
const scale = ref(1) // 初始值，会在图片加载后根据屏幕计算
const userAdjusted = ref(false) // 标记用户是否手动调整过缩放
const imgRef = ref(null)
const screenWidth = ref(window.innerWidth)
const screenHeight = ref(window.innerHeight)

const errorImage = 'https://fastly.jsdelivr.net/npm/@vant/assets/custom-empty-image.png'

// 图片原始尺寸
const imgNaturalWidth = ref(1290) // 默认图片宽度
const imgNaturalHeight = ref(1110) // 默认图片高度

// 计算图片样式 - 根据缩放比例设置宽度
const imageStyle = computed(() => {
  // 图片原始宽度 1290px，根据 scale 计算显示宽度
  const displayWidth = imgNaturalWidth.value * scale.value
  return {
    width: `${displayWidth}px`,
    maxWidth: '100%'
  }
})

// 缩放范围
const MIN_SCALE = 0.3
const MAX_SCALE = 2.0
const SCALE_STEP = 0.1

// 根据屏幕宽度和高度计算初始缩放比例 - 让整个图片完整显示
function calculateInitialScale() {
  const containerPadding = 24 // 左右 padding
  const availableWidth = screenWidth.value - containerPadding
  // 减去头部导航栏、底部操作栏、缩放控制等的高度，预留约 280px 空间
  const availableHeight = screenHeight.value - 280

  // 分别计算宽度和高度的缩放比例
  const scaleX = availableWidth / imgNaturalWidth.value
  const scaleY = availableHeight / imgNaturalHeight.value

  // 取较小的缩放比例，确保图片能完整显示
  const initialScale = Math.min(scaleX, scaleY)
  return Math.max(MIN_SCALE, Math.min(MAX_SCALE, initialScale))
}

// 更新屏幕宽度和高度
function updateScreenSize() {
  screenWidth.value = window.innerWidth
  screenHeight.value = window.innerHeight
}

// 监听窗口大小变化
function handleResize() {
  updateScreenSize()
  // 只有在用户没有手动调整过时才重新计算初始缩放
  if (!loading.value && !userAdjusted.value) {
    scale.value = calculateInitialScale()
  }
}

// 生成图片 URL
function getImageUrl(pageNum) {
  const paddedNum = String(pageNum).padStart(3, '0')
  return `${import.meta.env.BASE_URL}pages/page-${paddedNum}.png?t=${Date.now()}`
}

function onImageLoad() {
  loading.value = false
  // 图片加载完成后，获取实际尺寸并计算初始缩放
  nextTick(() => {
    if (imgRef.value) {
      imgNaturalWidth.value = imgRef.value.naturalWidth || 1290
      imgNaturalHeight.value = imgRef.value.naturalHeight || 1110
      scale.value = calculateInitialScale()
      // 滚动到图片位置，使图片居中显示
      setTimeout(() => {
        const viewerEl = document.querySelector('.pdf-image-viewer')
        if (viewerEl) {
          const rect = viewerEl.getBoundingClientRect()
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop
          // 滚动到图片区域，使图片垂直居中
          window.scrollTo({
            top: rect.top + scrollTop - 50,
            behavior: 'auto'
          })
        }
      }, 100)
    }
  })
}

function onImageError(e) {
  console.error('[PdfImageViewer] Image load failed for page', props.pageNum, e)
  error.value = `图片加载失败 (第${props.pageNum}页)`
  loading.value = false
}

// 缩放控制
function zoomIn() {
  userAdjusted.value = true
  scale.value = Math.min(MAX_SCALE, scale.value + SCALE_STEP)
}

function zoomOut() {
  userAdjusted.value = true
  scale.value = Math.max(MIN_SCALE, scale.value - SCALE_STEP)
}

function resetZoom() {
  userAdjusted.value = false
  scale.value = calculateInitialScale()
}

// 初始化
function initViewer() {
  loading.value = true
  error.value = null
  userAdjusted.value = false // 新页面重置用户调整标志
  imageUrl.value = getImageUrl(props.pageNum)
  updateScreenSize()
}

onMounted(() => {
  initViewer()
  // 监听窗口大小变化
  window.addEventListener('resize', handleResize)
})

// 组件卸载时移除监听
onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})

watch(() => props.pageNum, (newPage) => {
  initViewer()
})
</script>

<style scoped>
.pdf-image-viewer {
  position: relative;
  width: 100%;
  background: #f7f8fa;
  border-radius: 12px;
  overflow: visible;
  padding: 80px 0;
}

.image-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 12px;
}

.page-image {
  width: 100%;
  height: auto;
  display: block;
  border-radius: 8px;
  transition: width 0.2s ease;
}

.zoom-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  background: white;
  margin: 12px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.zoom-label {
  font-size: 14px;
  color: #666;
}

.zoom-level {
  min-width: 45px;
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.progress-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.95);
  z-index: 10;
  border-radius: 12px;
}

.error-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 20;
  width: 80%;
}
</style>
