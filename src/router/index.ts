import { createRouter, createWebHashHistory } from 'vue-router'
import { useUserStore } from '@/stores/modules/user'
import { initDynamicRouter } from '@/router/modules/dynamicRouter'
import { staticRouter, errorRouter } from '@/router/modules/staticRouter'
import NProgress from '@/config/nprogress'

const router = createRouter({
	history: createWebHashHistory(),
	routes: [...staticRouter, ...errorRouter],
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
	// 4.如果没有菜单列表，就重新请求菜单列表并添加动态路由
	if (!userStore.flatUserMenu.length) {
		await initDynamicRouter()
		return next({ ...to, replace: true })
	}
	// 5.判断是否有 Token，没有重定向到 login 页面
	if (!userStore.token) return next({ path: '/login', replace: true })

	// 6.正常访问页面
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
