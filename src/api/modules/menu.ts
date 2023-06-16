import http from '@/api'
import type { Menu } from '@/global/menu'

// 获取所有菜单信息
export const getAllMenu = () => {
	return http.get<Menu.ResAllMenu>('/menu/backGetAllMenuInfo')
}

// 添加主菜单
export const addMenu = (params: Menu.ReqAddMenu) => {
	return http.post<any>('/menu/backAddMenuInfo', params)
}

// 添加子菜单
export const addChildMenu = (menuId: number, params: Menu.ReqAddMenu) => {
	return http.post<any>(`/menu/backAddChildMenu/${menuId}`, params)
}

// 删除菜单
export const deleteMenu = (menuId: number) => {
	return http.put<any>(`/menu/backDelMenuInfo/${menuId}`)
}
