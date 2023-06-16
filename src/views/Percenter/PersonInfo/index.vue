<script setup lang="ts">
import type { FormRules, FormInstance } from 'element-plus'
import { useAdminStore } from '@/stores/modules/admin'
import { useUserStore } from '@/stores/modules/user'
import { ElMessage } from 'element-plus'

const adminStore = useAdminStore()
const userStore = useUserStore()

// 当前用户信息
const currentUserInfo = ref(JSON.parse(localStorage.getItem('user')!).userInfo)

//  是否显示编辑用户对话框
const DialogVisible = ref(false)
// dialogForm表单数据
const dialogForm = ref(currentUserInfo.value)
const dialogFormRef = ref<FormInstance>()
// 表单验证规则
const rules = reactive<FormRules>({
	name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
	address: [{ required: true, message: '请输入地址', trigger: 'blur' }],
	telephone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
	username: [{ required: true, message: '请输入用户名', trigger: 'blur' }]
})

//对话框关闭回调
const handleEditClose = () => {
	dialogFormRef.value?.resetFields()
	DialogVisible.value = false
}

// 对话框确认按钮回调
const handleConfirmClick = async (formEl: FormInstance | undefined) => {
	if (!formEl) return
	await formEl.validate(async valid => {
		if (valid) {
			await adminStore.editAdminAction(dialogForm.value)
			DialogVisible.value = false
			dialogFormRef.value?.resetFields()
			await userStore.getUserInfoAction()
			ElMessage({
				message: '编辑成功',
				type: 'success'
			})
		}
	})
}
</script>

<template>
	<div class="card table-main">
		<!-- 个人信息描述列表 -->
		<el-descriptions direction="vertical" :column="3" size="large" border>
			<!-- 自定义title -->
			<template v-slot:title>
				<div class="desc-title">
					<span> 个人信息 </span>
					<el-button @click="DialogVisible = true">编辑个人信息</el-button>
				</div>
			</template>
			<el-descriptions-item label="姓名">{{
				currentUserInfo.name
			}}</el-descriptions-item>
			<el-descriptions-item label="用户名">{{
				currentUserInfo.username
			}}</el-descriptions-item>
			<el-descriptions-item label="用户id">{{
				currentUserInfo.id
			}}</el-descriptions-item>
			<el-descriptions-item label="联系电话">
				{{ currentUserInfo.telephone }}
			</el-descriptions-item>
			<el-descriptions-item label="地址">
				{{ currentUserInfo.address }}
			</el-descriptions-item>
			<el-descriptions-item label="用户状态">
				<el-tag type="success" v-if="currentUserInfo.enabled === 1"
					>可用</el-tag
				>
				<el-tag v-else>禁用</el-tag>
			</el-descriptions-item>
			<el-descriptions-item label="用户头像">
				<img :src="currentUserInfo.avatar" style="width: 250px" />
			</el-descriptions-item>
		</el-descriptions>
		<!-- 编辑个人信息对话框 -->

		<!-- 编辑、添加对话框 -->
		<el-dialog
			class="dialogBox"
			:model-value="DialogVisible"
			title="编辑个人信息"
			:width="500"
			center
			@closed="handleEditClose"
		>
			<el-form
				:model="dialogForm"
				label-position="left"
				label-width="95px"
				ref="dialogFormRef"
				:rules="rules"
			>
				<el-form-item label="姓名：" prop="name">
					<el-input v-model="dialogForm.name" placeholder="请输入姓名" />
				</el-form-item>
				<el-form-item label="用户名：" prop="username">
					<el-input
						v-model.number="dialogForm.username"
						placeholder="请输入用户名"
					/>
				</el-form-item>
				<el-form-item label="联系电话：" prop="telephone">
					<el-input
						v-model="dialogForm.telephone"
						placeholder="请输入联系电话"
					/>
				</el-form-item>
				<el-form-item label="地址：" prop="address">
					<el-input
						v-model.number="dialogForm.address"
						placeholder="请输入地址"
					/>
				</el-form-item>
			</el-form>
			<template #footer>
				<div class="dialog-footer">
					<el-button @click="handleEditClose">取消</el-button>
					<el-button type="primary" @click="handleConfirmClick(dialogFormRef)">
						保存
					</el-button>
				</div>
			</template>
		</el-dialog>
	</div>
</template>

<style lang="scss" scoped>
.desc-title {
	display: flex;
	align-items: center;
	.el-button {
		margin-left: 15px;
	}
}
</style>
