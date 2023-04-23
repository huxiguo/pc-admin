import { defineStore } from 'pinia'
import piniaPersistConfig from '@/config/piniaPersist'

export const useGlobalStore = defineStore(
	'global',
	() => {
		// 面包屑导航图标
		const isCollapse = ref(true)
		// 激活的menu
		const activePath = ref('index')
		/**
		 * 切换侧边栏显示与隐藏
		 * @param value 是否隐藏侧边栏
		 */
		function setIsCollapseAction(value: boolean) {
			isCollapse.value = value
		}
		/**
		 * 设置默认激活页面
		 * @param path 当前激活的页面
		 */
		function setActivePathAction(path: string) {
			activePath.value = path
		}
		return {
			isCollapse,
			activePath,
			setIsCollapseAction,
			setActivePathAction
		}
	},
	{
		persist: piniaPersistConfig('global')
	}
)
