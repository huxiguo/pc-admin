import { defineStore } from 'pinia'
import piniaPersistConfig from '@/config/piniaPersist'
import type { Login, User } from '@/api/interface'
import { loginApi } from '@/api/modules/login'
import { getUserInfo, getUserMenu } from '@/api/modules/user'
export const useUserStore = defineStore(
	'user',
	() => {
		const token = ref('')
		const userInfo = ref<User.ResUserInfo>({})
		const userMenu = ref<User.ResUserMenu[]>([])
		// login
		async function adminLogin(params: Login.ReqLoginForm) {
			const data = await loginApi(params)
			token.value = data.result.token
			return data
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
			token,
			userInfo,
			userMenu,
			adminLogin,
			getUserInfoAction,
			getUserMenuAction
		}
	},
	{
		persist: piniaPersistConfig('user', ['token', 'userInfo'])
	}
)
