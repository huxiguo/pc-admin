import type { Login } from '@/api/interface/index'
import http from '@/api'
import qs from 'qs'

/**
 * @name 登录模块
 */
// 用户登录
export const loginApi = (params: Login.ReqLoginForm) => {
	return http.post<any>('/admin/login', qs.stringify(params), {
		noLoading: true
	})
}

// 退出登录
export const logoutApi = () => {
	return http.post('/admin/logout')
}
