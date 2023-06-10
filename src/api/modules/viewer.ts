import http from '@/api'
import type { Viewer } from '@/global/viewer.d'

// 获取所有设备信息
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
