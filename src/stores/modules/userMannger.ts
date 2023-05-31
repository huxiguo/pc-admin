import { defineStore } from 'pinia'
import piniaPersistConfig from '@/config/piniaPersist'
import type { User } from '@/global/user'
import { getUserInOutInfo } from '@/api/modules/userMannger'

export const useUserManngerStore = defineStore(
	'userMannger',
	() => {
		// 表单数据
		const userInOutData = ref()
		// 总数
		const total = ref(0)

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

		return {
			total,
			userInOutData,
			getUserInOutListAction
		}
	},
	{
		persist: piniaPersistConfig('global', [])
	}
)
