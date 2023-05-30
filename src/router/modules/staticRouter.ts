import type { RouteRecordRaw } from 'vue-router'
import { HOME_URL } from '@/config'
/**
 * staticRouter (静态路由)
 */
export const staticRouter: RouteRecordRaw[] = [
	{
		path: '/',
		redirect: HOME_URL
	},
	{
		path: '/login',
		name: 'login',
		component: () => import('@/views/login/index.vue'),
		meta: {
			title: '登录'
		}
	},
	{
		path: '/layout',
		name: 'layout',
		redirect: HOME_URL,
		component: () => import('@/layouts/index.vue'),
		children: [
			// 配置一个固定的首页
			{
				path: HOME_URL,
				name: 'home',
				component: () => import('@/views/Home/index.vue'),
				meta: {
					title: '首页',
					icon: 'el-icon-s-home'
				}
			}
		]
	}
]

/**
 * errorRouter (错误页面路由)
 */
export const errorRouter = [
	{
		path: '/403',
		name: '403',
		component: () => import('@/components/ErrorMessage/403.vue'),
		meta: {
			title: '403页面'
		}
	},
	{
		path: '/404',
		name: '404',
		component: () => import('@/components/ErrorMessage/404.vue'),
		meta: {
			title: '404页面'
		}
	},
	{
		path: '/500',
		name: '500',
		component: () => import('@/components/ErrorMessage/500.vue'),
		meta: {
			title: '500页面'
		}
	},
	// Resolve refresh page, route warnings
	{
		path: '/:pathMatch(.*)*',
		component: () => import('@/components/ErrorMessage/404.vue')
	}
]
