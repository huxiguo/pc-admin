<template>
	<el-form
		ref="loginFormRef"
		:model="loginForm"
		:rules="loginRules"
		size="large"
	>
		<el-form-item prop="username">
			<el-input v-model="loginForm.username" placeholder="请输入用户名">
				<template #prefix>
					<el-icon class="el-input__icon"><user /></el-icon>
				</template>
			</el-input>
		</el-form-item>
		<el-form-item prop="password">
			<el-input
				type="password"
				v-model="loginForm.password"
				placeholder="请输入密码"
				show-password
				autocomplete="new-password"
			>
				<template #prefix>
					<el-icon class="el-input__icon"><lock /></el-icon>
				</template>
			</el-input>
		</el-form-item>
	</el-form>
	<div class="login-btn">
		<el-button
			:icon="CircleClose"
			round
			@click="resetForm(loginFormRef)"
			size="large"
			>重置</el-button
		>
		<el-button
			:icon="UserFilled"
			round
			@click="login(loginFormRef)"
			size="large"
			type="primary"
			:loading="loading"
		>
			登录
		</el-button>
	</div>
</template>

<script setup lang="ts">
import type { Login } from '@/api/interface'
import { ElNotification } from 'element-plus'
// import { loginApi } from '@/api/modules/login'
import { useUserStore } from '@/stores/modules/user'
import { CircleClose, UserFilled } from '@element-plus/icons-vue'
import type { ElForm } from 'element-plus'
import { getTimeState } from '@/utils'

const router = useRouter()
const userStore = useUserStore()

type FormInstance = InstanceType<typeof ElForm>
const loginFormRef = ref<FormInstance>()
const loginRules = reactive({
	username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
	password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
})

const loading = ref(false)
const loginForm = reactive<Login.ReqLoginForm>({
	username: '',
	password: ''
})

// login
const login = (formEl: FormInstance | undefined) => {
	if (!formEl) return
	formEl.validate(async valid => {
		if (!valid) return
		loading.value = true
		try {
			// 1.执行登录接口
			// const { data } = await loginApi({
			// 	...loginForm,
			// 	password: loginForm.password
			// })
			userStore.setToken('data.access_token')

			// 2.添加动态路由

			// 3.清空 tabs、keepAlive 数据

			// 4.跳转到首页
			router.push('/main')
			ElNotification({
				title: getTimeState(),
				message: '欢迎登录 Geeker-Admin',
				type: 'success',
				duration: 3000
			})
		} finally {
			loading.value = false
		}
	})
}

// resetForm
const resetForm = (formEl: FormInstance | undefined) => {
	if (!formEl) return
	formEl.resetFields()
}

onMounted(() => {
	// 监听 enter 事件（调用登录）
	document.onkeydown = (e: KeyboardEvent) => {
		e = (window.event as KeyboardEvent) || e
		if (e.code === 'Enter' || e.code === 'enter' || e.code === 'NumpadEnter') {
			if (loading.value) return
			login(loginFormRef.value)
		}
	}
})
</script>

<style scoped lang="scss">
@import '../index.scss';
</style>
