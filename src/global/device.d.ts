export namespace Device {
	// 获取所有设备请求参数
	export interface ReqAllDevice {
		id: string
		m_nPort: number
		m_strIp: string
		name: string
		status: string
		type: string
	}

	// 获取所有设备返回参数
	export interface ResAllDevice {
		deviceList: any[]
		total: number
	}

	// 添加设备请求参数
	export interface ReqAddDevice {
		id: string
		m_nPort: number
		m_strIp: string
		m_strPassword: string
		m_strUser: string
		name: string
		type: string
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
