import http from '@/api'
import type { Admin } from '@/global/admin.d'

// 获取所有设备信息
export const getAllAdmin = (currentPage: number, pageSize: number) => {
	return http.get<any>(`/admin/backGetAllAdmin/${currentPage}/${pageSize}`)
}

// 添加管理员
export const addAdmin = (params: Admin.ReqAddAdmin) => {
	return http.post<any>('/admin/backAddAdminInfo', params)
}

// 编辑管理员
export const editAdmin = (params: Admin.ReqEditAdmin) => {
	return http.put<any>('/admin/backEditAdminInfo', params)
}

// 删除管理员
export const deleteAdmin = (params: Admin.ReqDelAdmin) => {
	return http.delete<any>('/admin/backDelAdmin', params)
}
