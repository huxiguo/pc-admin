import NProgress from '@/config/nprogress'
import { useUserStore } from '@/stores/modules/user'
import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
	history: createWebHashHistory(),
	routes: [
		{
			path: '/',
			redirect: '/main'
		},
		{
			path: '/login',
			meta: {
				title: '登录'
			},
			component: () => import('@/views/login/index.vue')
		},
		{
			path: '/main',
			meta: {
				title: '首页'
			},
			component: () => import('@/views/main/Main.vue'),
			children: [
				{
					path: '/main',
					redirect: '/main/index'
				},
				{
					path: '/main/index',
					meta: {
						title: '首页'
					},
					component: () => import('@/views/index/index.vue')
				},
				{
					path: '/main/user',
					meta: {
						title: '用户管理'
					},
					component: () => import('@/views/user/index.vue')
				},
				{
					path: '/main/record',
					meta: {
						title: '打卡记录'
					},
					component: () => import('@/views/record/index.vue')
				},
				{
					path: '/main/class',
					meta: {
						title: '班级管理'
					},
					component: () => import('@/views/class/index.vue')
				},
				{
					path: '/main/college',
					meta: {
						title: '院系管理'
					},
					component: () => import('@/views/college/index.vue')
				}
			]
		},
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
	],
	strict: false,
	scrollBehavior: () => ({ left: 0, top: 0 })
})

/**
 * @description 路由拦截 beforeEach
 * */
router.beforeEach(async (to, from, next) => {
	const userStore = useUserStore()

	// 1.NProgress 开始
	NProgress.start()

	// 2.动态设置标题
	document.title = to.meta.title ? `${to.meta.title}` : 'Admin'

	// 3.判断是访问登陆页，有 Token 就在当前页面，没有 Token 重置路由到登陆页
	if (to.path.toLocaleLowerCase() === '/login') {
		if (userStore.token) return next(from.fullPath)

		return next()
	}

	// 5.判断是否有 Token，没有重定向到 login 页面
	if (!userStore.token) {
		return next({ path: '/login', replace: true })
	}

	// 8.正常访问页面
	next()
})

/**
 * @description 路由跳转错误
 * */
router.onError(error => {
	NProgress.done()
	console.warn('路由错误', error.message)
})

/**
 * @description 路由跳转结束
 * */
router.afterEach(() => {
	NProgress.done()
})

export default router
