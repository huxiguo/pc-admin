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

// 获取监视人绑定的用户
export const getViewerBindUser = (viewId: number) => {
	return http.get<any>(`/viewer/getViewerBindUser/${viewId}`)
}

// 解绑被监视人
export const deleteBeUser = (params: Viewer.ReqDeleteOrAddBeUser) => {
	return http.delete<any>('/viewer', params)
}

// 绑定被监视人
export const addBeUser = (params: Viewer.ReqDeleteOrAddBeUser) => {
	return http.post<any>('/viewer/addBeUser', params)
}
