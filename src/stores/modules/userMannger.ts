import { defineStore } from 'pinia'
import piniaPersistConfig from '@/config/piniaPersist'
import type { User } from '@/global/user'
import { getAllUserList, getUserInOutInfo } from '@/api/modules/userMannger'

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

		return {
			total,
			userInOutData,
			userTotal,
			userList,
			getUserInOutListAction,
			getAllUserListAction
		}
	},
	{
		persist: piniaPersistConfig('userMannger', [])
	}
)
