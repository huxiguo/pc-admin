export namespace Admin {
	// 获取所有管理员返回数据
	export interface ResAllAdmin {
		adminList: any[]
		total: number
	}

	// 添加管理员请求参数
	export interface ReqAddAdmin {
		name: string
		telephone: string
		address: string
		password: string
		username: string
		avatar: string
	}

	// 编辑管理员请求参数
	export interface ReqEditAdmin {
		name: string
		telephone: string
		address: string
		password: string
		username: string
		avatar: string
	}

	// 编辑管理员请求参数
	export type ReqDelAdmin = string[]
}
