import http from '@/api'

// 获取班级列表
export const getUnitList = () => {
	return http.get('/getAllUnits')
}
