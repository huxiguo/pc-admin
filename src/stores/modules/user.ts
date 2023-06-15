import { defineStore } from 'pinia'
import piniaPersistConfig from '@/config/piniaPersist'
import type { Login, User } from '@/api/interface'
import { loginApi } from '@/api/modules/login'
import { getUserInfo, getUserMenu } from '@/api/modules/user'
import { getFlatMenuList } from '@/utils/index'
export const useUserStore = defineStore(
	'user',
	() => {
		const access_token = ref('')
		const refresh_token = ref('')
		const userInfo = ref<User.ResUserInfo>({})
		const userMenu = ref<User.ResUserMenu[]>([])
		const flatUserMenu = computed(() => getFlatMenuList(userMenu.value))
		// login
		async function adminLogin(params: Login.ReqLoginForm) {
			await loginApi(params)
		}
		// userInfo
		async function getUserInfoAction() {
			const data = await getUserInfo()
			userInfo.value = data.result
		}
		// userMenu
		async function getUserMenuAction() {
			const data = await getUserMenu()
			userMenu.value = data.result
		}
		return {
			access_token,
			refresh_token,
			userInfo,
			userMenu,
			flatUserMenu,
			adminLogin,
			getUserInfoAction,
			getUserMenuAction
		}
	},
	{
		persist: piniaPersistConfig('user', [
			'access_token',
			'refresh_token',
			'userInfo'
		])
	}
)
