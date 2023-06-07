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
