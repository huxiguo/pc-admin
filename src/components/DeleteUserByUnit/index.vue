<script setup lang="ts">
import type { FormInstance } from 'element-plus'
import { ElMessage, ElNotification } from 'element-plus'
import { useDeviceStore } from '@/stores/modules/device'
import { useUnitManngerStore } from '@/stores/modules/unitMannger'
import { useGlobalStore } from '@/stores/modules/global'
import { useUserManngerStore } from '@/stores/modules/userMannger'

interface FormDataTypes {
	unitsId: number[]
	deviceNos: string[]
}

const unitManngerStore = useUnitManngerStore()
const globalStore = useGlobalStore()
const deviceStore = useDeviceStore()
const userManngerStore = useUserManngerStore()
const { deviceList, total } = storeToRefs(deviceStore)
const { classList } = storeToRefs(unitManngerStore)
const handleDeviceVisibleChange = (visiable: boolean) => {
	if (visiable) {
		deviceStore.getAllDeviceInfoAction({}, 1, total.value)
	}
}
// 班级选项的配置
const props = {
	value: 'unitsId',
	label: 'name',
	checkStrictly: true,
	expandTrigger: 'hover' as const
}

// 表单数据
const formData = reactive<FormDataTypes>({
	deviceNos: [],
	unitsId: []
})

// 表单Ref
const formRef = ref<FormInstance | null>(null)

// 表单验证规则
const rules = {
	unitsId: [{ required: true, message: '请选择班级', trigger: 'change' }],
	deviceNos: [{ required: true, message: '请选择设备', trigger: 'change' }]
}

const dialogVisible = ref(false)
const acceptParams = (params: string[]) => {
	dialogVisible.value = true
	nextTick(() => {
		formData.deviceNos = params
	})
}
const handleBtnClick = async () => {
	// 验证表单
	await formRef.value?.validate(async valid => {
		if (valid) {
			// 构造参数取出班级ID最后一个
			const params = {
				unitsId: formData.unitsId[formData.unitsId.length - 1],
				deviceNos: formData.deviceNos
			}
			await userManngerStore.deleteUserByUnitsAction(params)
			ElMessage({
				message: '删除成功',
				type: 'success'
			})
			// 刷新列表
			await userManngerStore.getAllUserListAction()
			// 关闭对话框
			dialogVisible.value = false
		} else {
			// 提示完善表单
			ElNotification({
				title: '提示',
				message: '请完善表单',
				type: 'warning'
			})
			return false
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
		title="选择班级删除用户"
		v-model="dialogVisible"
		:destroy-on-close="true"
		@close="handleDialogClose"
		width="500"
		draggable
		center
	>
		<el-form :model="formData" ref="formRef" :rules="rules">
			<el-form-item label="班级" prop="unitsId">
				<el-cascader
					v-model="formData.unitsId"
					:options="classList"
					:props="props"
					:show-all-levels="false"
					clearable
					placeholder="请选择班级"
					style="width: 100%"
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
