import { defineStore } from 'pinia'
import piniaPersistConfig from '@/config/piniaPersist'
import {
	getUnitList,
	exportUnitsByExcel,
	addUnits,
	deleteUnits,
	importUnitByExcel
} from '@/api/modules/unitMannger'
import type { Unit } from '@/global/unit.d'

export const useUnitManngerStore = defineStore(
	'unitMannger',
	() => {
		// 班级列表
		const classList = ref()

		// 获取班级列表
		async function getUnitListAction() {
			const { result } = await getUnitList()
			classList.value = result
		}
		// excel导出单位表
		async function exportUnitsByExcelAction() {
			const res = await exportUnitsByExcel()
			return res
		}
		// excel导入单位表
		async function importUnitByExcelAction(params: FormData) {
			await importUnitByExcel(params)
		}
		// 添加单位
		async function addUnitsAction(params: Unit.ReqAddUnits) {
			await addUnits(params)
		}
		// 删除单位
		async function deleteUnitsAction(unitsId: number) {
			await deleteUnits(unitsId)
		}
		return {
			classList,
			getUnitListAction,
			exportUnitsByExcelAction,
			addUnitsAction,
			deleteUnitsAction,
			importUnitByExcelAction
		}
	},
	{
		persist: piniaPersistConfig('unitMannger', ['classList'])
	}
)
