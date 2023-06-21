import http from '@/api'
import type { Viewer } from '@/global/viewer.d'

// 获取所有监视人信息
export const getAllViewer = (
	params: Viewer.ReqAllViewer,
	currentPage: number,
	pageSize: number
) => {
	return http.post<Viewer.ResAllView>(
		`/viewer/getAllViewer/${currentPage}/${pageSize}`,
		params
	)
}

// 删除监视人
export const deleteViewer = (params: Viewer.ReqDelViewer) => {
	return http.delete<any>('/viewer/delViewer', params)
}
