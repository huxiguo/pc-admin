import { defineStore } from 'pinia'
import piniaPersistConfig from '@/config/piniaPersist'
import type { User } from '@/global/user'
import {
	editUserInfo,
	exportUserInfo,
	getAllUserList,
	getUserInOutInfo
} from '@/api/modules/userMannger'

export const useUserManngerStore = defineStore(
	'userMannger',
	() => {
		// 进出数据
		const userInOutData = ref()
		// 进出数据总数
		const total = ref(0)
		// 用户总数
		const userTotal = ref(0)
		// 用户列表
		const userList = ref()
		// 默认选中角色查询参数 0 -- 学生
		const defaultRole = ref('0')
		// 默认届
		const defaultSession = ref(0)
		// 获取进出表单数据
		async function getUserInOutListAction(
			params: User.ReqUserList,
			currentPage: number = 1,
			pageSize: number = 10
		) {
			const { result } = await getUserInOutInfo(params, currentPage, pageSize)
			total.value = result.total
			userInOutData.value = result.recordList
		}
		// 获取所有用户列表
		async function getAllUserListAction(
			params: User.ReqAllUserList,
			currentPage: number = 1,
			pageSize: number = 10
		) {
			const { result } = await getAllUserList(params, currentPage, pageSize)
			userTotal.value = result.total
			userList.value = result.doctorList
		}
		// 编辑用户信息
		async function editUserInfoAction(params: User.ReqEditUserInfo) {
			await editUserInfo(params)
		}
		// 导出用户信息Excel
		async function exportUserInfoAction(unitsId: number) {
			const res = await exportUserInfo(unitsId)
			return res
		}
		return {
			total,
			userInOutData,
			userTotal,
			userList,
			defaultRole,
			defaultSession,
			exportUserInfoAction,
			getUserInOutListAction,
			getAllUserListAction,
			editUserInfoAction
		}
	},
	{
		persist: piniaPersistConfig('userMannger', [
			'defaultRole',
			'defaultSession'
		])
	}
)
