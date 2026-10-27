import axios from 'axios'
import { ElMessage } from 'element-plus' // 引入全局提示
import { useUserStoreWithOut } from '@/store/modules/user' // 引入 Pinia 的 user store

const request = axios.create({
  baseURL: '/api',
  timeout: 10000
})

// 2. 请求拦截器：统一携带 Token
request.interceptors.request.use(
  (config) => {
    // 🔥 修复：直接从 Pinia Store 里拿 Token，不要直接读 localStorage 的旧 key
    const userStore = useUserStoreWithOut()
    const token = userStore.token
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// 3. 响应拦截器：统一处理数据和错误
request.interceptors.response.use(
  (response) => {
    const res = response.data
    
    // 后端统一返回 { code, msg, data }
    if (res.code !== undefined) {
      if (res.code === 200) {
        // 🔥 优化：直接把 data 返回，业务层不需要再点 .data 了
        return res.data 
      } else {
        // 业务错误：弹窗提示，并中断 Promise
        ElMessage.error(res.msg || '请求失败')
        return Promise.reject(new Error(res.msg || 'Error'))
      }
    }
    
    // 如果是个没有包裹的统一体（比如下载文件），直接返回
    return res
  },
  (error) => {
    console.error('网络请求错误:', error)
    // 处理 HTTP 状态码错误（如 401, 500）
    if (error.response?.status === 401) {
      ElMessage.error('登录已过期，请重新登录')
      // 可选：在这里清空 store 并跳转到登录页
    } else {
      ElMessage.error(error.message || '网络请求失败')
    }
    return Promise.reject(error)
  }
)

export default request