import http from '@/api'
import type { User } from '@/global/user.d'

/**
 * 获取用户进出数据
 */
export const getUserInOutInfo = (
	params: User.ReqUserList,
	currentPage: number,
	pageSize: number
) => {
	return http.post<User.ResUserList>(
		`/access/getAccessRecord/${currentPage}/${pageSize}`,
		params
	)
}

// 获取所有用户信息
export const getAllUserList = (
	parmas: User.ReqAllUserList,
	currentPage: number,
	pageSize: number
) => {
	return http.post<User.ResAllUserList>(
		`/user/getAllUserByPage/${currentPage}/${pageSize}`,
		parmas
	)
}

/**
 * 编辑用户信息
 */
export const editUserInfo = (params: User.ReqEditUserInfo) => {
	return http.put<any>('/user/editUser', params)
}

/**
 * 导出用户信息Excel
 */
export const exportUserInfo = (unitsId: number) => {
	return http.post<any>(`/user/exportUserExcel/${unitsId}`)
}
