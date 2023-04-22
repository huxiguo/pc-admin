import { defineStore } from 'pinia'
import piniaPersistConfig from '@/config/piniaPersist'

export const useGlobalStore = defineStore(
	'global',
	() => {
		// 面包屑导航图标
		const isCollapse = ref(true)
		function setIsCollapseAction(value: boolean) {
			isCollapse.value = value
		}
		return {
			isCollapse,
			setIsCollapseAction
		}
	},
	{
		persist: piniaPersistConfig('geeker-user')
	}
)
