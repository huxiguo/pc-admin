// 请求响应参数（不包含data）
export interface Result {
	code: string | number
	message: string
	success: boolean
	timestamp: number | string
}

// 请求响应参数（包含data）
export interface ResultData<T = any> extends Result {
	result: T
}

// 登录模块
export namespace Login {
	export interface ReqLoginForm {
		username: string
		password: string
		code: string
	}
}

// 用户模块
export namespace User {
	export interface ResUserInfo {
		id?: number
		username?: string
		password?: any
		telephone?: string
		address?: string
		enabled?: number
		name?: string
		avatar?: string
	}
	export interface ResUserMenu {
		id?: number
		name?: string
		title?: string
		path?: any
		perms?: any
		component?: any
		icon?: string
		createTime?: string
		parentId?: any
		status?: string
		children?: ResUserMenu[]
	}
}
