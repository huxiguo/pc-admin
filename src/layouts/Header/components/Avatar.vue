<template>
	<el-dropdown trigger="click">
		<div class="avatar">
			<img :src="userInfo.avatar" alt="avatar" />
		</div>
		<template #dropdown>
			<el-dropdown-menu>
				<el-dropdown-item @click="openDialog('infoRef')">
					<el-icon><User /></el-icon>{{ '个人信息' }}
				</el-dropdown-item>
				<el-dropdown-item @click="openDialog('passwordRef')">
					<el-icon><Edit /></el-icon>{{ '修改密码' }}
				</el-dropdown-item>
				<el-dropdown-item @click="logout" divided>
					<el-icon><SwitchButton /></el-icon>{{ '退出登录' }}
				</el-dropdown-item>
			</el-dropdown-menu>
		</template>
	</el-dropdown>
	<!-- infoDialog -->
	<InfoDialog ref="infoRef" :info="userInfo"></InfoDialog>
	<!-- passwordDialog -->
	<PasswordDialog ref="passwordRef"></PasswordDialog>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/modules/user'
import { ElMessageBox, ElMessage } from 'element-plus'
import InfoDialog from './InfoDialog.vue'
import PasswordDialog from './PasswordDialog.vue'
import { logoutApi } from '@/api/modules/login'

const router = useRouter()
const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)

// 退出登录
const logout = () => {
	ElMessageBox.confirm('您是否确认退出登录?', '温馨提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning'
	}).then(async () => {
		// 1.执行退出登录接口
		await logoutApi()
		// 2.清除 Token
		userStore.access_token = ''
		userStore.refresh_token = ''

		// 3.重定向到登陆页
		router.replace('/login')
		ElMessage.success('退出登录成功！')
	})
}

// 打开修改密码和个人信息弹窗
const infoRef = ref<InstanceType<typeof InfoDialog> | null>(null)
const passwordRef = ref<InstanceType<typeof PasswordDialog> | null>(null)
const openDialog = (ref: string) => {
	if (ref == 'infoRef') infoRef.value?.openDialog()
	if (ref == 'passwordRef') passwordRef.value?.openDialog()
}
</script>

<style scoped lang="scss">
.avatar {
	width: 40px;
	height: 40px;
	overflow: hidden;
	cursor: pointer;
	border-radius: 50%;
	img {
		width: 100%;
		height: 100%;
	}
}
</style>
