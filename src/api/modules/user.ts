import http from '@/api'
import type { User } from '@/api/interface/index'

// 获取用户信息
export const getUserInfo = () => {
	return http.get<User.ResUserInfo>('/admin/getInfo', {}, { noLoading: true })
}

// 获取用户操作菜单
export const getUserMenu = () => {
	return http.get<User.ResUserMenu[]>('/getMenusByAdmin')
}
