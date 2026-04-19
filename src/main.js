import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'

// 导入 Vant 组件
import Vant from 'vant'
import 'vant/lib/index.css'

// 导入全局样式
import './style.css'
import { useThemeStore } from './stores/theme'

const app = createApp(App)
const pinia = createPinia()

app.use(Vant)
app.use(pinia)
app.use(router)

// 初始化主题
const themeStore = useThemeStore()
themeStore.init()

app.mount('#app')
