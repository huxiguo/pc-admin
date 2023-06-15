import router from '@/router/index'
import type { RouteRecordRaw } from 'vue-router'
import { ElNotification } from 'element-plus'
import { useUserStore } from '@/stores/modules/user'

// 引入 views 文件夹下所有 vue 文件
const modules = import.meta.glob('@/views/**/*.vue')

/**
 * @description 初始化动态路由
 */
export const initDynamicRouter = async () => {
	const userStore = useUserStore()

	try {
		// 1.获取用户操作菜单
		await userStore.getUserMenuAction()
		// 2.判断当前用户有没有菜单权限
		if (!userStore.flatUserMenu.length) {
			ElNotification({
				title: '无权限访问',
				message: '当前账号无任何菜单权限，请联系系统管理员！',
				type: 'warning',
				duration: 3000
			})
			userStore.access_token = ''
			userStore.refresh_token = ''
			router.replace('login')
			return Promise.reject('No permission')
		}

		// 3.添加动态路由
		userStore.flatUserMenu.forEach((item: any) => {
			if (item.component && typeof item.component === 'string') {
				item.component = modules['/src/views/' + item.component + '/index.vue']
			}
			// path不为null添加为 layout的 二级路由
			if (item.path) {
				const route: RouteRecordRaw = {
					path: item.path,
					name: item.name,
					meta: {
						title: item.title,
						icon: item.icon
					},
					component: item.component
				}
				router.addRoute('layout', route)
			}
		})
	} catch (error) {
		// 当按钮 || 菜单请求出错时，重定向到登陆页
		userStore.access_token = ''
		userStore.refresh_token = ''
		router.replace('/login')
		return Promise.reject(error)
	}
}
