import type { App } from 'vue'
import { Icon } from '@iconify/vue'

export const setupGlobCom = (app: App<Element>): void => {
  // 重新注册全局的 Icon 组件，解决控制台的大量警告
  app.component('Icon', Icon)
}