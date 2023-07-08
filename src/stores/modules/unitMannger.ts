import { defineStore } from 'pinia'
import piniaPersistConfig from '@/config/piniaPersist'
import {
	getUnitList,
	exportUnitsByExcel,
	addUnits,
	deleteUnits,
	importUnitByExcel,
	edidUnits
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
		async function addUnitsAction(params: Unit.ReqAddOrEditUnits) {
			await addUnits(params)
		}
		// 删除单位
		async function deleteUnitsAction(unitsId: number) {
			await deleteUnits(unitsId)
		}
		// 编辑单位
		async function editUnitsAction(params: Unit.ReqAddOrEditUnits) {
			await edidUnits(params)
		}
		return {
			classList,
			getUnitListAction,
			exportUnitsByExcelAction,
			addUnitsAction,
			deleteUnitsAction,
			importUnitByExcelAction,
			editUnitsAction
		}
	},
	{
		persist: piniaPersistConfig('unitMannger', ['classList'])
	}
)
