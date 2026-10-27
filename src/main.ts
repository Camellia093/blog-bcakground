import 'vue/jsx'
import 'virtual:uno.css'

import { createApp } from 'vue'
import { createI18n } from 'vue-i18n' // <-- 新增：引入 i18n

// 引入状态管理
import { setupStore } from '@/store'

// 引入element-plus
import { setupElementPlus } from '@/plugins/elementPlus'

// 引入全局样式
import '@/styles/index.less' 

// 路由
import { setupRouter } from './router'

import App from './App.vue'
import { setupPermission } from './permission'

// <-- 新增：创建一个最简 i18n 实例，让它直接返回中文，不进行实际翻译
const i18n = createI18n({
  legacy: false,
  locale: 'zh-CN',
  messages: {
    'zh-CN': {} 
  },
  missingWarn: false,
  fallbackWarn: false
})

// 创建实例
const setupAll = async () => {
  const app = createApp(App)

  app.use(i18n) // <-- 新增：挂载 i18n

  setupStore(app)

  // 权限路由守卫需要在路由挂载前初始化
  await setupPermission()

  setupElementPlus(app)

  setupRouter(app)

  app.mount('#app')
}

setupAll()