import request from '@/request'

export interface LoginParams {
  username: string
  password: string
}

export interface LoginResult {
  accessToken: string
  user: {
    id?: number
    username?: string
    avatar?: string
  }
}

export const loginApi = (data: LoginParams) => {
  // 改成 /user/login
  return request.post<any>('/user/login', data)
}

export const logoutApi = () => {
  return request.get('/user/logout')
}

export const getRouteListApi = () => {
  return request.get<any[]>('/route/list')
}