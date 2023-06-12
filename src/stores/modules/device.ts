import { defineStore } from 'pinia'
import piniaPersistConfig from '@/config/piniaPersist'
import type { Device } from '@/global/device'
import {
	getAllDeviceInfo,
	addDevice,
	editDevice,
	delDevice,
	runDevice,
	closeDevice
} from '@/api/modules/device'

export const useDeviceStore = defineStore(
	'device',
	() => {
		// 设备总数
		const total = ref(0)
		// 设备列表
		const deviceList = ref()
		// 获取设备数据
		async function getAllDeviceInfoAction(
			params: Device.ReqAllDevice,
			currentPage: number = 1,
			pageSize: number = 10
		) {
			const { result } = await getAllDeviceInfo(params, currentPage, pageSize)
			total.value = result.total
			deviceList.value = result.deviceList
		}
		// 添加设备
		async function addDeviceAction(params: Device.ReqAddDevice) {
			await addDevice(params)
		}
		// 编辑设备
		async function editDeviceAction(params: Device.ReqEditDevice) {
			await editDevice(params)
		}
		// 删除设备
		async function delDeviceAction(params: Device.ReqDelDevice) {
			await delDevice(params)
		}
		// 启动设备
		async function runDeviceAction(params: Device.ReqDelDevice) {
			await runDevice(params)
		}
		// 关闭设备
		async function closeDeviceAction(params: Device.ReqDelDevice) {
			await closeDevice(params)
		}
		return {
			total,
			deviceList,
			getAllDeviceInfoAction,
			addDeviceAction,
			editDeviceAction,
			delDeviceAction,
			runDeviceAction
		}
	},
	{
		persist: piniaPersistConfig('device')
	}
)
