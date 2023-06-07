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
}
