import http from '@/api'

// 获取所有设备信息
export const getAllDeviceList = (
	parmas: any,
	currentPage: number,
	pageSize: number
) => {
	return http.post<any>(
		`/device/getAllDevice/${currentPage}/${pageSize}`,
		parmas
	)
}
