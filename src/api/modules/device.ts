import http from '@/api'
import type { Device } from '@/global/device.d'

// 获取所有设备信息
export const getAllDeviceInfo = (
	params: Device.ReqAllDevice,
	currentPage: number,
	pageSize: number
) => {
	return http.post<Device.ResAllDevice>(
		`/device/getAllDevice/${currentPage}/${pageSize}`,
		params
	)
}

// 添加设备
export const addDevice = (params: Device.ReqAddDevice) => {
	return http.post<any>('/device/addDevice', params)
}

// 编辑设备
export const editDevice = (params: Device.ReqEditDevice) => {
	return http.put<any>('/device/editDevice', params)
}

// 删除设备
export const delDevice = (params: Device.ReqDelDevice) => {
	return http.delete<any>('/device/delDevice', params)
}

// 启动设备
export const runDevice = (params: Device.ReqRunOrCloseDevice) => {
	return http.post<any>('/device/runDevice', params)
}

// 关闭设备
export const closeDevice = (params: Device.ReqRunOrCloseDevice) => {
	return http.post<any>('/device/closeDevice', params)
}
