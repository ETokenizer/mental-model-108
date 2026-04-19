<template>
  <div class="app-layout">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>

    <!-- 底部导航栏 -->
    <van-tabbar v-model="activeTab" fixed safe-area-inset-bottom class="main-tabbar">
      <van-tabbar-item icon="home-o" to="/">首页</van-tabbar-item>
      <van-tabbar-item icon="star-o" to="/favorites">收藏</van-tabbar-item>
      <van-tabbar-item icon="user-o" to="/profile">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const activeTab = computed(() => {
  const path = route.path
  if (path === '/' || path.startsWith('/model/')) return 0
  if (path === '/favorites') return 1
  if (path === '/profile') return 2
  return 0
})
</script>

<style scoped>
.app-layout {
  min-height: 100vh;
  padding-bottom: 50px;
}

.main-tabbar {
  background: var(--card-bg);
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
}

.main-tabbar :deep(.van-tabbar-item) {
  font-size: 12px;
}

.main-tabbar :deep(.van-tabbar-item--active) {
  color: var(--primary-color);
}

/* 页面切换动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
