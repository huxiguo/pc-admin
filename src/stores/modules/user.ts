import { defineStore } from 'pinia'
import piniaPersistConfig from '@/config/piniaPersist'
import { myTest } from '@/api/modules/login'

export const useUserStore = defineStore(
	'geeker-user',
	() => {
		const token = ref('111')
		const userInfo = ref({ name: 'Geeker' })
		// Set Token
		function setToken(userToken: string) {
			token.value = userToken
		}
		// Set setUserInfo
		function setUserInfo(info: any) {
			userInfo.value = info
		}
		async function getTestData() {
			const data = await myTest()
			console.log('data', data)
		}
		return {
			token,
			userInfo,
			setToken,
			setUserInfo,
			getTestData
		}
	},
	{
		persist: piniaPersistConfig('geeker-user', ['token', 'userInfo'])
	}
)
