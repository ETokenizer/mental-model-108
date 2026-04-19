<template>
  <svg class="module-icon" :class="`module-icon-${moduleClass}`" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <!-- 认知模块 - 大脑/灯泡 -->
    <g v-if="module === '认知模块'" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M9 18h6c.6 0 1 .4 1 1v1a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-1c0-.6.4-1 1-1Z"/>
      <path d="M12 2a7 7 0 0 0-7 7c0 2.5 1.5 4.5 3.5 5.5L9 16h6l.5-1.5c2-1 3.5-3 3.5-5.5a7 7 0 0 0-7-7Z"/>
      <path d="M12 6v2"/>
      <path d="M12 10v.01"/>
      <path d="M14.5 8.5a.5.5 0 0 1 .5.5"/>
      <path d="M9.5 8.5a.5.5 0 0 0-.5.5"/>
    </g>

    <!-- 竞争模块 - 奖杯 -->
    <g v-else-if="module === '竞争模块'" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M8 21h8"/>
      <path d="M12 17v4"/>
      <path d="M7 4h10c0 6-1.5 11-5 13-3.5-2-5-7-5-13Z"/>
      <path d="M17 4v4a3 3 0 0 0 3 3h1"/>
      <path d="M7 4v4a3 3 0 0 1-3 3H3"/>
    </g>

    <!-- 组织模块 - 团队/网络 -->
    <g v-else-if="module === '组织模块'" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="7" r="3"/>
      <circle cx="5" cy="17" r="2"/>
      <circle cx="19" cy="17" r="2"/>
      <path d="M12 10v3"/>
      <path d="M12 13 5.5 15.5"/>
      <path d="M12 13l6.5 2.5"/>
    </g>

    <!-- 创新模块 - 火花/创意 -->
    <g v-else-if="module === '创新模块'" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 3v3"/>
      <path d="M12 18v3"/>
      <path d="M4.22 4.22 6.34 6.34"/>
      <path d="M17.66 17.66l2.12 2.12"/>
      <path d="M3 12h3"/>
      <path d="M18 12h3"/>
      <path d="M4.22 19.78l2.12-2.12"/>
      <path d="M17.66 6.34l2.12-2.12"/>
      <circle cx="12" cy="12" r="4"/>
    </g>

    <!-- 战略模块 - 目标/箭头 -->
    <g v-else-if="module === '战略模块'" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="8"/>
      <path d="M12 2v4"/>
      <path d="M12 18v4"/>
      <path d="M2 12h4"/>
      <path d="M18 12h4"/>
      <circle cx="12" cy="12" r="2"/>
    </g>

    <!-- 其他 - 方块 -->
    <g v-else stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <rect x="5" y="5" width="14" height="14" rx="2"/>
      <path d="M9 9h.01"/>
      <path d="M15 9h.01"/>
      <path d="M9 15h6"/>
    </g>
  </svg>
</template>

<script setup>
const props = defineProps({
  module: {
    type: String,
    default: '其他'
  }
})

const moduleClassMap = {
  '认知模块': 'cognitive',
  '竞争模块': 'competition',
  '组织模块': 'organization',
  '创新模块': 'innovation',
  '战略模块': 'strategy',
  '其他': 'other'
}

const moduleClass = moduleClassMap[props.module] || 'other'
</script>

<style scoped>
.module-icon {
  width: 24px;
  height: 24px;
}
</style>
