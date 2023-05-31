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

	// 用户出入信息查询接口返回数据
	export interface ResUserList {
		total: number
		recordList: any[]
	}
}
