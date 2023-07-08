import http from '@/api'
import type { Unit } from '@/global/unit.d'

// 获取班级列表
export const getUnitList = () => {
	return http.get('/getAllUnits')
}

// excel导出单位表
export const exportUnitsByExcel = () => {
	return http.download('/exportUnitsByExcel')
}

// excel导入单位表
export const importUnitByExcel = (params: FormData) => {
	return http.post('/importUnitByExcel', params)
}

// 添加单位
export const addUnits = (params: Unit.ReqAddUnits) => {
	return http.post('/addUnits', params)
}

// 删除单位
export const deleteUnits = (unitsId: number) => {
	return http.delete(`/deleteUnits/${unitsId}`)
}

// 编辑单位
export const edidUnits = (params: Unit.ReqAddUnits) => {
	return http.put('/editUnits', params)
}
