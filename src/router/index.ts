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
			component: () => import('@/views/login/Login.vue')
		},
		{
			path: '/main',
			meta: {
				title: '首页'
			},
			component: () => import('@/views/main/Main.vue')
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
		console.log('from', from)
		if (userStore.token) return next(from.fullPath)
		return next()
	}

	// 5.判断是否有 Token，没有重定向到 login 页面
	if (!userStore.token) return next({ path: '/login', replace: true })

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
