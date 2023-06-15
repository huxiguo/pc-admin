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
		<el-form-item prop="code">
			<el-input
				v-model="loginForm.code"
				placeholder="请输入验证码"
				autocomplete="new-password"
				style="flex: 1"
			>
				<template #prefix>
					<el-icon class="el-input__icon"><Message /></el-icon>
				</template>
			</el-input>
			<!-- 验证码图片 -->
			<img
				class="code-img ml30"
				:src="CAPTCHA_URL"
				@click="getCodeImg()"
				alt="验证码"
			/>
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
import { throttle } from 'lodash'
import type { Login } from '@/api/interface'
import { ElMessage, ElNotification } from 'element-plus'
import { useUserStore } from '@/stores/modules/user'
import { useGlobalStore } from '@/stores/modules/global'
import { CircleClose, UserFilled } from '@element-plus/icons-vue'
import type { ElForm } from 'element-plus'
import { getTimeState } from '@/utils'
import { initDynamicRouter } from '@/router/modules/dynamicRouter'
import { HOME_URL } from '@/config'
const router = useRouter()
const userStore = useUserStore()
const globalStore = useGlobalStore()
type FormInstance = InstanceType<typeof ElForm>
const loginFormRef = ref<FormInstance>()
const loginRules = reactive({
	username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
	password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
	code: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
})

const loading = ref(false)
const loginForm = reactive<Login.ReqLoginForm>({
	username: 'admin',
	password: '123456',
	code: ''
})

const CAPTCHA_URL = ref('http://mapi.yunog.cn:9393/captcha')
// 刷新验证码
const getCodeImg = throttle(() => {
	CAPTCHA_URL.value = `${CAPTCHA_URL.value}?t=${Date.now()}`
	ElMessage({
		message: '验证码已刷新',
		type: 'success',
		duration: 1000
	})
}, 5000)

// login
const login = (formEl: FormInstance | undefined) => {
	if (!formEl) return
	formEl.validate(async valid => {
		if (!valid) return
		loading.value = true
		try {
			// 发送登录请求
			await userStore.adminLogin(loginForm)
			// 登录成功
			// 添加动态路由
			await initDynamicRouter()
			// 获取用户信息
			await userStore.getUserInfoAction()
			// 跳转到首页
			router.push(globalStore.activePath || HOME_URL)
			ElNotification({
				title: getTimeState(),
				message: '欢迎登录',
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
.code-img {
	display: inline-block;
	flex: 1;
	height: 40px;
}
</style>
