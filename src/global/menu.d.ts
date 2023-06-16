export namespace Menu {
	// 获取所有菜单信息返回数据
	export interface ResAllMenu {
		result: []
	}

	// 添加主菜单请求参数
	export interface ReqAddMenu {
		name: string
		title: string
		icon: string
		path: string
	}

	// 添加子菜单请求参数
	export interface ReqAddChildMenu {
		name: string
		title: string
		icon: string
		path: string
	}
}
