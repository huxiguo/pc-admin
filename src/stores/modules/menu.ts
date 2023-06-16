import { defineStore } from 'pinia'
import piniaPersistConfig from '@/config/piniaPersist'
import type { Menu } from '@/global/menu'
import {
	getAllMenu,
	addMenu,
	addChildMenu,
	deleteMenu
} from '@/api/modules/menu'

export const useMenuStore = defineStore(
	'menu',
	() => {
		// 菜单信息列表
		const menuList = ref()
		// 获取所有菜单数据
		async function getAllMenuAction() {
			const { result } = await getAllMenu()
			menuList.value = result
		}
		// 添加主菜单
		async function addMenuAction(params: Menu.ReqAddMenu) {
			await addMenu(params)
		}
		// 添加子菜单
		async function addChildMenuAction(menuId: number, params: Menu.ReqAddMenu) {
			await addChildMenu(menuId, params)
		}
		// 删除菜单
		async function deleteMenuAction(menuId: number) {
			await deleteMenu(menuId)
		}
		return {
			menuList,
			getAllMenuAction,
			addMenuAction,
			addChildMenuAction,
			deleteMenuAction
		}
	},
	{
		persist: piniaPersistConfig('device', [])
	}
)
