import { defineStore } from 'pinia'
import { store } from '../index'

export interface UserInfo {
  id?: number
  username?: string
  avatar?: string
  [key: string]: any
}

export interface LoginResult {
  accessToken: string
  user: UserInfo
}

import { usePermissionStore } from './permission'
import { useTagsViewStore } from './tagsView'
import router, { resetRouter } from '@/router'

interface UserState {
  userInfo?: UserInfo
  token: string
  rememberMe: boolean
  rememberedUsername: string
  rememberedPassword: string // 🔥 新增：记住密码字段
}

export const useUserStore = defineStore('user', {
  state: (): UserState => {
    return {
      userInfo: undefined,
      token: '',
      rememberMe: true,
      rememberedUsername: '',
      rememberedPassword: '' // 🔥 初始化
    }
  },
  getters: {
    isAuthenticated(): boolean {
      if (this.token) return true
      
      const savedStr = localStorage.getItem('vea-session-v1')
      if (savedStr) {
        try {
          const saved = JSON.parse(savedStr)
          return !!saved.token
        } catch {
          return false
        }
      }
      return false
    }
  },
  actions: {
    setSession({ accessToken, user }: LoginResult) {
      this.token = accessToken
      this.userInfo = user
      
      // 🔥 强制同步写入，绕过插件延迟
      const sessionData = {
        token: accessToken,
        userInfo: user,
        rememberMe: this.rememberMe,
        rememberedUsername: this.rememberedUsername,
        rememberedPassword: this.rememberedPassword // 🔥 一并写入
      }
      localStorage.setItem('vea-session-v1', JSON.stringify(sessionData))
    },
    // 🔥 修改记住账号的方法，支持同时记住密码
    rememberAccount(username: string, password: string, remember: boolean) {
      this.rememberMe = remember
      this.rememberedUsername = remember ? username : ''
      this.rememberedPassword = remember ? password : ''
    },
    clearSession() {
      this.token = ''
      this.userInfo = undefined
      usePermissionStore().reset()
      useTagsViewStore().removeAllViews(false)
      resetRouter()
      
      // 退出登录时，清空 Token，但保留记住的账号密码
      const savedStr = localStorage.getItem('vea-session-v1')
      if (savedStr) {
        try {
          const saved = JSON.parse(savedStr)
          saved.token = ''
          saved.userInfo = null
          localStorage.setItem('vea-session-v1', JSON.stringify(saved))
          return
        } catch { /* ignore */ }
      }
      localStorage.removeItem('vea-session-v1')
    },
    async logout() {
      this.clearSession()
      await router.replace('/login')
    }
  },
  persist: {
    key: 'vea-session-v1',
    // 🔥 加上 rememberedPassword
    paths: ['token', 'userInfo', 'rememberMe', 'rememberedUsername', 'rememberedPassword']
  }
})

export const useUserStoreWithOut = () => {
  return useUserStore(store)
}