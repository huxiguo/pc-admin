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

/**
 * 删除用户出入记录
 */
export const deleteAccessRecord = (params: number[]) => {
	return http.delete<any>('/access/delAccessRecord', params)
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
	return http.download(`/user/exportUserExcel/${unitsId}`)
}

// 修改用户人脸照片
export const editUserFace = (params: FormData) => {
	return http.post('user/updateFaceByDevices', params)
}

/**
 * 导入用户信息Excel
 */
export const importUserInfo = (params: FormData) => {
	return http.post('/user/importUserExcel', params)
}

/**
 * 添加用户
 */
export const addUser = (params: FormData) => {
	return http.post<any>('/user/addUser', params)
}

/**
 * 删除用户
 */
export const deleteUser = (params: User.ReqDeleteUser) => {
	const { userIds, deviceNos } = params
	return http.delete<any>(
		'/user/delUserByIds?userIds=' +
			userIds.join(',') +
			'&deviceNos=' +
			deviceNos.join(',')
	)
}

/**
 * 删除某届用户
 */
export const deleteSessionUser = (params: User.ReqDeleteUserBySession) => {
	const { session, deviceNos } = params
	return http.post<any>(
		'/user/delUsersBySession?session=' +
			session +
			'&deviceNos=' +
			deviceNos.join(',')
	)
}

/**
 * 删除某单位用户
 */
export const deleteUnitUser = (params: User.ReqDeleteUserByUnits) => {
	const { unitsId, deviceNos } = params
	return http.delete<any>(
		'/user/delUserByUnits?unitsId=' +
			unitsId +
			'&deviceNos=' +
			deviceNos.join(',')
	)
}

/**
 * 根据字段查找用户
 */
export const searchUserByKeyword = (keyword: string) => {
	return http.get<User.ResUserList>(`/user/searchUserByKeyword/${keyword}`)
}
