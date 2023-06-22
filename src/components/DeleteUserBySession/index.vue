<script setup lang="ts">
import type { FormInstance } from 'element-plus'
import { ElMessage, ElNotification } from 'element-plus'

import { useUserManngerStore } from '@/stores/modules/userMannger'
import { useDeviceStore } from '@/stores/modules/device'
import { useGlobalStore } from '@/stores/modules/global'
const userManngerStore = useUserManngerStore()
const deviceStore = useDeviceStore()
const globalStore = useGlobalStore()
const { deviceList, total } = storeToRefs(deviceStore)

interface formProps {
	session: number
	deviceNos: string[]
}

const handleDeviceVisibleChange = (visiable: boolean) => {
	if (visiable) {
		deviceStore.getAllDeviceInfoAction({}, 1, total.value)
	}
}

// 表单数据
const formData = reactive<formProps>({
	deviceNos: [],
	// 现在的年份
	session: new Date().getFullYear()
})

// 表单ref
const formRef = ref<FormInstance | null>(null)

// 表单验证规则
const rules = {
	deviceNos: [{ required: true, message: '请选择设备', trigger: 'change' }],
	session: [{ required: true, message: '请输入届', trigger: 'blur' }]
}

const dialogVisible = ref(false)
const acceptParams = (params: string[]) => {
	dialogVisible.value = true
	nextTick(() => {
		formData.deviceNos = params
	})
}
const handleBtnClick = async () => {
	await formRef.value?.validate(async valid => {
		if (valid) {
			const params = {
				deviceNos: formData.deviceNos,
				session: formData.session
			}
			await userManngerStore.deleteUserBySessionAction(params)
			ElMessage.success('删除成功')
			await userManngerStore.getAllUserListAction()
			dialogVisible.value = false
		} else {
			ElNotification({
				title: '提示',
				message: '请检查表单是否填写正确',
				type: 'warning',
				zIndex: 3000
			})
		}
	})
}
// 选择设备change事件
const handleDeviceChange = (val: string[]) => {
	globalStore.setLastDeviceIdAction(val)
}

// 关闭对话框
const handleDialogClose = () => {
	formRef.value?.resetFields()
}
defineExpose({ acceptParams })
</script>

<template>
	<el-dialog
		class="dialogBox"
		title="选择设备删除用户"
		v-model="dialogVisible"
		:destroy-on-close="true"
		@close="handleDialogClose"
		width="500"
		draggable
		center
	>
		<el-form :model="formData" ref="formRef" :rules="rules" label-width="50">
			<el-form-item label="届" prop="session">
				<el-input
					v-model.number="formData.session"
					type="number"
					placeholder="请输入届"
					clearable
				/>
			</el-form-item>
			<el-form-item label="设备" prop="deviceNos">
				<el-select
					style="width: 100%"
					v-model="formData.deviceNos"
					placeholder="请选择设备"
					clearable
					multiple
					@visible-change="handleDeviceVisibleChange"
					@change="handleDeviceChange"
				>
					<el-option
						v-for="item in deviceList"
						:key="item.id"
						:label="item.name"
						:value="item.id"
					>
					</el-option>
				</el-select>
			</el-form-item>
		</el-form>

		<template #footer>
			<el-button @click="dialogVisible = false">取 消</el-button>
			<el-button type="primary" @click="handleBtnClick">确 定</el-button>
		</template>
	</el-dialog>
</template>
