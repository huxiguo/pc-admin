<!-- 经典布局 -->
<template>
	<el-container class="layout">
		<el-header>
			<div class="header-lf">
				<div class="logo flx-center">
					<img class="logo-img" src="@/assets/images/logo.svg" alt="logo" />
					<span class="logo-text">Admin</span>
				</div>
				<ToolBarLeft />
			</div>
			<div class="header-ri">
				<ToolBarRight />
			</div>
		</el-header>
		<el-container class="classic-content">
			<el-aside>
				<div
					class="aside-box"
					:style="{ width: isCollapse ? '65px' : '210px' }"
				>
					<el-scrollbar>
						<el-menu
							:default-active="activePath"
							router
							:collapse="isCollapse"
							:collapse-transition="false"
							:unique-opened="true"
							@select="handleSubMenuSelect"
						>
							<el-menu-item index="/main/index">
								<el-icon>
									<component :is="HomeFilled"></component>
								</el-icon>
								<template #title>
									<span class="sle">首页</span>
								</template>
							</el-menu-item>
							<SubMenu :menu-list="userMenu" />
						</el-menu>
					</el-scrollbar>
				</div>
			</el-aside>
			<el-container class="classic-main">
				<Main />
			</el-container>
		</el-container>
	</el-container>
</template>

<script setup lang="ts" name="layoutClassic">
import { useGlobalStore } from '@/stores/modules/global'
import { useUserStore } from '@/stores/modules/user'
import Main from '@/layouts/Main/index.vue'
import SubMenu from '@/layouts/Menu/SubMenu.vue'
import ToolBarLeft from '@/layouts/Header/ToolBarLeft.vue'
import ToolBarRight from '@/layouts/Header/ToolBarRight.vue'
const HomeFilled = 'HomeFilled'
const globalStore = useGlobalStore()
const { isCollapse, activePath } = storeToRefs(globalStore)

const userStore = useUserStore()
const { userMenu } = storeToRefs(userStore)

const handleSubMenuSelect = (path: string) => {
	globalStore.setActivePathAction(path)
}
</script>

<style scoped lang="scss">
@import './index.scss';
</style>
