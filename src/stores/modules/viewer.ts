import { defineStore } from 'pinia'
import piniaPersistConfig from '@/config/piniaPersist'
import type { Viewer } from '@/global/viewer'
import {
	getAllViewer,
	deleteViewer,
	getViewerBindUser,
	deleteBeUser,
	addBeUser
} from '@/api/modules/viewer'

export const useViewerStore = defineStore(
	'viewer',
	() => {
		// 监视人总数
		const total = ref(0)
		// 监视人列表
		const viewerList = ref()
		// 获取监视人数据
		async function getAllViewerAction(
			params: Viewer.ReqAllViewer,
			currentPage: number = 1,
			pageSize: number = 10
		) {
			const { result } = await getAllViewer(params, currentPage, pageSize)
			total.value = result.total
			viewerList.value = result.viewerList
		}
		// 删除监视人
		async function deleteViewerAction(params: Viewer.ReqDelViewer) {
			await deleteViewer(params)
		}
		// 获取监视人绑定的用户
		async function getViewerBindUserAction(viewId: number) {
			const { result } = await getViewerBindUser(viewId)
			return result
		}
		// 解绑被监视人
		async function deleteBeUserAction(params: Viewer.ReqDeleteOrAddBeUser) {
			await deleteBeUser(params)
		}
		// 绑定被监视人
		async function addBeUserAction(params: Viewer.ReqDeleteOrAddBeUser) {
			await addBeUser(params)
		}
		return {
			total,
			viewerList,
			getAllViewerAction,
			deleteViewerAction,
			getViewerBindUserAction,
			deleteBeUserAction,
			addBeUserAction
		}
	},
	{
		persist: piniaPersistConfig('viewer', [])
	}
)
