import type { RouteRecordRaw } from 'vue-router'
import NProgress from 'nprogress'
import router from './router'
import { NO_REDIRECT_WHITE_LIST } from '@/constants'
import { useAppStoreWithOut } from '@/store/modules/app'
import { usePermissionStoreWithOut } from '@/store/modules/permission'
import { useUserStoreWithOut } from '@/store/modules/user'
import { ElMessage } from 'element-plus' 
import 'nprogress/nprogress.css'

NProgress.configure({ showSpinner: false })

export const ensureDynamicRoutes = async () => {
  const permissionStore = usePermissionStoreWithOut()
  if (permissionStore.isAddRouters) return false
  permissionStore.setIsAddRouters(true)
  return false 
}

export const setupPermission = async () => {
  const userStore = useUserStoreWithOut()

  if (userStore.isAuthenticated) {
    try {
      await ensureDynamicRoutes()
    } catch {
      userStore.clearSession()
    }
  }

  router.beforeEach(async (to) => {
    NProgress.start()
    useAppStoreWithOut().pageLoading = true

    // 如果没登录
    if (!userStore.isAuthenticated) {
      if (NO_REDIRECT_WHITE_LIST.includes(to.path)) return true
      return { path: '/login', query: { redirect: to.fullPath } }
    }

    // 如果已登录，且还要去登录页，直接踢回首页
    if (to.path === '/login') return { path: '/dashboard' }

    // 🔥 第二道防线：路由守卫拦截非管理员
    const userRole = userStore.userInfo?.role
    if (userRole && String(userRole).toLowerCase() !== 'admin') {
      ElMessage.error('权限不足，请重新登录！')
      userStore.clearSession()
      return { path: '/login' }
    }

    try {
      const routesAdded = await ensureDynamicRoutes()
      if (routesAdded) return { path: to.fullPath, replace: true }
    } catch {
      userStore.clearSession()
      return { path: '/login', query: { redirect: to.fullPath } }
    }

    return true
  })

  router.afterEach(() => {
    NProgress.done()
    useAppStoreWithOut().pageLoading = false
  })
}