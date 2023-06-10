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

	// 获取所有设备返回参数
	export interface ResAllView {
		viewerList: any[]
		total: number
	}

	// 添加监视人请求参数
	export interface ReqAddDevice {
		avatar: string
		isEnable: string
		nickname: string
		openId: string
		password: string
		role: string
		telephone: string
		viewId: number
	}

	// 添加设备请求参数
	export interface ReqEditDevice {
		m_nPort: number
		m_strIp: string
		m_strPassword: string
		m_strUser: string
		name: string
		type: string
	}
	// 删除设备请求参数
	export type ReqDelDevice = string[]
	// 启动关闭设备请求参数
	export type ReqRunOrCloseDevice = string[]
}
