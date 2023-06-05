import { defineStore } from 'pinia'
import piniaPersistConfig from '@/config/piniaPersist'
import { getUnitList } from '@/api/modules/unitMannger'

export const useUnitManngerStore = defineStore(
	'unitMannger',
	() => {
		// 班级列表
		const classList = ref()

		// 获取班级列表
		async function getUnitListAction() {
			const { result } = await getUnitList()
			classList.value = result
		}
		return {
			classList,
			getUnitListAction
		}
	},
	{
		persist: piniaPersistConfig('unitMannger', ['classList'])
	}
)
