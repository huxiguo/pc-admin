export namespace Viewer {
	// 获取所有监视人请求参数
	export interface ReqAllViewer {
		avatar: string
		isEnable: string
		nickname: string
		openId: string
		password: string
		role: string
		telephone: string
		viewId: number
	}

	// 获取所有监视人返回参数
	export interface ResAllView {
		viewerList: any[]
		total: number
	}
	// 删除监视人请求参数
	export type ReqDelViewer = number[]
}
