export namespace User {
	// 用户出入信息查询接口参数
	export interface ReqUserList {
		cardName?: string
		unitsName?: string
		session?: number
		schNo?: string
		role?: string
		endTime?: string
		startTime?: string
	}
	// 所有用户信息
	export interface ReqAllUserList {
		name: string
		role: string
		schNo: string
		unitsName: string
	}

	// 编辑用户信息接口参数
	export interface ReqEditUserInfo {
		name: string
		userId: number
		schNo: string
		role: string
		[key: string]: string | number
	}
	// 所有用户信息接口返回数据
	export interface ResAllUserList {
		doctorList: any[]
		total: number
	}
	// 用户出入信息查询接口返回数据
	export interface ResUserList {
		total: number
		recordList: any[]
	}
}
