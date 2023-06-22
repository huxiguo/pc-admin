<template>
	<el-main>
		<transition appear name="fade-transform" mode="out-in">
			<router-view />
		</transition>
	</el-main>
	<el-footer>
		<Footer />
	</el-footer>
</template>

<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'
import { useGlobalStore } from '@/stores/modules/global'
import Footer from '@/layouts/Footer/index.vue'

const globalStore = useGlobalStore()
const { isCollapse } = storeToRefs(globalStore)

// 注入刷新页面方法
const isRouterShow = ref(true)
const refreshCurrentPage = (val: boolean) => (isRouterShow.value = val)
provide('refresh', refreshCurrentPage)

// 监听窗口大小变化，折叠侧边栏
const screenWidth = ref(0)
const listeningWindow = useDebounceFn(() => {
	screenWidth.value = document.body.clientWidth
	if (!isCollapse.value && screenWidth.value < 1200)
		globalStore.setIsCollapseAction(true)
	if (isCollapse.value && screenWidth.value > 1200)
		globalStore.setIsCollapseAction(false)
}, 100)
window.addEventListener('resize', listeningWindow, false)
onBeforeUnmount(() => {
	window.removeEventListener('resize', listeningWindow)
})
</script>

<style scoped lang="scss">
@import './index.scss';
</style>
