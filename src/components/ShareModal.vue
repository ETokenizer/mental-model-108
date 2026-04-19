<template>
  <div class="share-modal">
    <!-- 分享卡片预览 -->
    <div class="share-card" ref="shareCardRef" id="share-card">
      <div class="card-header">
        <div class="logo">🧠 思维模型 108</div>
        <div class="subtitle">每天进步一点点</div>
      </div>

      <div class="card-body">
        <div class="model-icon">{{ getModelIcon(model.module) }}</div>
        <h2 class="model-name">{{ model.name }}</h2>
        <p class="model-desc">{{ model.description }}</p>

        <div class="model-info">
          <div class="info-item">
            <span class="info-label">模块</span>
            <span class="info-value">{{ model.module }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">编号</span>
            <span class="info-value">#{{ model.id }}</span>
          </div>
        </div>

        <div class="quote-card">
          <div class="quote-icon">"</div>
          <p class="quote-text">{{ model.description }}</p>
        </div>
      </div>

      <div class="card-footer">
        <div class="qr-placeholder">
          <div class="qr-text">扫码一起学习</div>
        </div>
        <div class="user-info">
          <div class="username">{{ userName }}</div>
          <div class="date">{{ currentDate }}</div>
        </div>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="share-actions">
      <van-button
        type="primary"
        size="large"
        round
        block
        @click="saveImage"
        icon="photograph"
      >
        保存到相册
      </van-button>
      <van-button
        color="#07c160"
        size="large"
        round
        block
        @click="shareToWeChat"
        icon="share"
      >
        分享给好友
      </van-button>
    </div>

    <!-- 提示弹窗 -->
    <van-dialog
      v-model:show="showTipDialog"
      title="💡 分享提示"
      :show-confirm-button="false"
      class="tip-dialog"
    >
      <div class="tip-content">
        <p>请长按图片选择"发送给朋友"</p>
        <p>或截图后分享到朋友圈</p>
      </div>
    </van-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { showToast, showDialog } from 'vant'

const props = defineProps({
  model: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close'])

const shareCardRef = ref(null)
const showTipDialog = ref(false)
const userName = ref('思维模型学习者')
const currentDate = computed(() => {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
})

const moduleIcons = {
  '认知模块': '🧠',
  '决策模块': '🎯',
  '组织模块': '👥',
  '创新模块': '💡',
  '战略模块': '📈',
  '其他': '📌'
}

function getModelIcon(module) {
  return moduleIcons[module] || moduleIcons['其他']
}

// 保存为图片
async function saveImage() {
  try {
    // 使用 html2canvas 截图（需要安装此依赖）
    const html2canvas = (await import('html2canvas')).default
    const canvas = await html2canvas(shareCardRef.value, {
      scale: 2,
      backgroundColor: null,
      useCORS: true
    })

    // 转换为图片
    const imgUrl = canvas.toDataURL('image/png')

    // 创建下载链接
    const link = document.createElement('a')
    link.download = `思维模型-${props.model.name}-${currentDate.value}.png`
    link.href = imgUrl
    link.click()

    showToast('保存成功！')
  } catch (error) {
    console.error('保存失败:', error)
    showToast('保存失败，请截图分享')
  }
}

// 分享到微信
function shareToWeChat() {
  showTipDialog.value = true
}

onMounted(() => {
  // 从本地存储获取用户名
  const stored = localStorage.getItem('mental_models_user')
  if (stored) {
    userName.value = JSON.parse(stored).name || '思维模型学习者'
  }
})
</script>

<style scoped>
.share-modal {
  padding: 20px;
}

/* 分享卡片 */
.share-card {
  background: linear-gradient(180deg, #f0f9f4 0%, #ffffff 100%);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  margin-bottom: 20px;
}

.card-header {
  background: linear-gradient(135deg, #07c160 0%, #12c78a 100%);
  color: white;
  padding: 20px;
  text-align: center;
}

.logo {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 4px;
}

.subtitle {
  font-size: 13px;
  opacity: 0.9;
}

.card-body {
  padding: 24px 20px;
}

.model-icon {
  font-size: 64px;
  text-align: center;
  margin-bottom: 16px;
}

.model-name {
  font-size: 24px;
  font-weight: 700;
  color: #323233;
  margin: 0 0 8px;
  text-align: center;
}

.model-desc {
  font-size: 15px;
  color: #646566;
  margin: 0 0 20px;
  text-align: center;
  line-height: 1.6;
}

.model-info {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-bottom: 24px;
}

.info-item {
  text-align: center;
}

.info-label {
  display: block;
  font-size: 12px;
  color: #969799;
  margin-bottom: 4px;
}

.info-value {
  font-size: 15px;
  font-weight: 600;
  color: #07c160;
  background: #f0f9f4;
  padding: 4px 12px;
  border-radius: 8px;
}

.quote-card {
  background: linear-gradient(135deg, rgba(7, 193, 96, 0.05), rgba(18, 199, 138, 0.05));
  border-left: 4px solid #07c160;
  border-radius: 8px;
  padding: 16px 20px;
  position: relative;
}

.quote-icon {
  font-size: 32px;
  color: #07c160;
  opacity: 0.3;
  position: absolute;
  top: 8px;
  left: 12px;
}

.quote-text {
  font-size: 14px;
  color: #323233;
  margin: 0;
  line-height: 1.8;
  font-style: italic;
}

.card-footer {
  background: #f7f8fa;
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.qr-placeholder {
  width: 80px;
  height: 80px;
  background: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed #07c160;
}

.qr-text {
  font-size: 12px;
  color: #969799;
  text-align: center;
}

.user-info {
  text-align: right;
}

.username {
  font-size: 14px;
  font-weight: 600;
  color: #323233;
  margin-bottom: 4px;
}

.date {
  font-size: 12px;
  color: #969799;
}

/* 操作按钮 */
.share-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* 提示弹窗 */
.tip-content {
  padding: 24px;
  text-align: center;
}

.tip-content p {
  margin: 8px 0;
  font-size: 15px;
  color: var(--text-secondary);
}
</style>
