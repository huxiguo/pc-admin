import { defineStore } from 'pinia'
import piniaPersistConfig from '@/config/piniaPersist'
import { HOME_URL } from '@/config'

export const useGlobalStore = defineStore(
	'global',
	() => {
		// 面包屑导航图标
		const isCollapse = ref(false)
		// 激活的menu
		const activePath = ref(HOME_URL)

		// 上一次选择的设备ID
		const lastDeviceId = ref<string[]>([])

		/**
		 * 设置上一次选择的设备ID
		 */
		function setLastDeviceIdAction(value: string[]) {
			lastDeviceId.value = value
		}

		/**
		 * 移除传入的设备ID
		 */
		function removeLastDeviceIdAction(value: string) {
			const index = lastDeviceId.value.findIndex(item => item === value)
			if (index !== -1) {
				lastDeviceId.value.splice(index, 1)
			}
		}

		/**
		 * 移除全部的设备ID
		 */
		function removeAllLastDeviceIdAction() {
			lastDeviceId.value = []
		}

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
			lastDeviceId,
			setIsCollapseAction,
			setActivePathAction,
			setLastDeviceIdAction,
			removeLastDeviceIdAction,
			removeAllLastDeviceIdAction
		}
	},
	{
		persist: piniaPersistConfig('global', [
			'isCollapse',
			'activePath',
			'lastDeviceId'
		])
	}
)
