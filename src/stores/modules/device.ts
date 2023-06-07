import { defineStore } from 'pinia'
import piniaPersistConfig from '@/config/piniaPersist'
import type { Device } from '@/global/device'
import { getAllDeviceInfo } from '@/api/modules/device'

export const useDeviceStore = defineStore(
	'device',
	() => {
		// 设备总数
		const total = ref(0)
		// 用户列表
		const deviceList = ref()
		// 获取进出表单数据
		async function getAllDeviceInfoAction(
			params: Device.ReqAllDevice,
			currentPage: number = 1,
			pageSize: number = 10
		) {
			const { result } = await getAllDeviceInfo(params, currentPage, pageSize)
			total.value = result.total
			deviceList.value = result.deviceList
		}

		return {
			total,
			deviceList,
			getAllDeviceInfoAction
		}
	},
	{
		persist: piniaPersistConfig('device', [])
	}
)
