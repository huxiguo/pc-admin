import { defineStore } from 'pinia'
import piniaPersistConfig from '@/config/piniaPersist'
import type { Admin } from '@/global/admin'
import {
	getAllAdmin,
	addAdmin,
	editAdmin,
	deleteAdmin,
	getAdminMenus,
	addAdminMenu,
	deleteAdminMenu
} from '@/api/modules/admin'

export const useAdminStore = defineStore(
	'admin',
	() => {
		// 管理员总数
		const total = ref(0)
		// 管理员列表
		const adminList = ref()
		// 获取管理员数据
		async function getAllAdminAction(
			currentPage: number = 1,
			pageSize: number = 10
		) {
			const { result } = await getAllAdmin(currentPage, pageSize)
			total.value = result.total
			adminList.value = result.adminList
		}
		// 添加管理员
		async function addAdminAction(params: Admin.ReqAddAdmin) {
			await addAdmin(params)
		}
		// 编辑管理员
		async function editAdminAction(params: Admin.ReqEditAdmin) {
			await editAdmin(params)
		}
		// 删除管理员
		async function deleteAdminAction(params: Admin.ReqDelAdmin) {
			await deleteAdmin(params)
		}
		// 获取管理员权限
		async function getAdminMenusAction(adminId: number) {
			const { result } = await getAdminMenus(adminId)
			return result
		}
		// 添加管理员权限
		async function addAdminMenuAction(adminId: number, menuIds: number[]) {
			await addAdminMenu(adminId, menuIds)
		}
		// 删除管理员权限
		async function deleteAdminMenuAction(adminId: number, menuIds: number[]) {
			await deleteAdminMenu(adminId, menuIds)
		}
		return {
			total,
			adminList,
			getAllAdminAction,
			addAdminAction,
			editAdminAction,
			deleteAdminAction,
			getAdminMenusAction,
			addAdminMenuAction,
			deleteAdminMenuAction
		}
	},
	{
		persist: piniaPersistConfig('admin', [])
	}
)
