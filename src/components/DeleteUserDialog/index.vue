<script setup lang="ts">
import type { FormInstance } from 'element-plus'
import { ElNotification } from 'element-plus'
import type { User } from '@/global/user'
import { useDeviceStore } from '@/stores/modules/device'
import { useUserManngerStore } from '@/stores/modules/userMannger'
import { useGlobalStore } from '@/stores/modules/global'

const globalStore = useGlobalStore()
const deviceStore = useDeviceStore()
const userManngerStore = useUserManngerStore()

const { deviceList, total } = storeToRefs(deviceStore)

// 设备表单ref
const deviceFormRef = ref<FormInstance | null>(null)
interface deviceFormProps {
	deviceNos: string[]
}

// 表单验证规则
const deviceFormRules = {
	deviceNos: [{ required: true, message: '请选择设备', trigger: 'change' }]
}

// dialog状态
const dialogVisible = ref(false)
// 用户id 数组
const userIds = ref<number[]>([])

const deviceForm = reactive<deviceFormProps>({
	// 设备id 数组
	deviceNos: []
})

// 选择设备下拉框显示隐藏回调
const handleDeviceVisibleChange = (visiable: boolean) => {
	if (visiable) {
		deviceStore.getAllDeviceInfoAction({}, 1, total.value)
	}
}

// 接收参数
const acceptParams = (params: User.ReqDeleteUser) => {
	dialogVisible.value = true
	nextTick(() => {
		userIds.value = params.userIds
		deviceForm.deviceNos = params.deviceNos
	})
}

// 确定按钮点击事件
const handleBtnClick = async () => {
	let myValid = false
	await deviceFormRef.value?.validate(valid => {
		myValid = valid
	})
	if (myValid) {
		// 表单校验通过
		const params = {
			userIds: userIds.value,
			deviceNos: deviceForm.deviceNos
		}
		await userManngerStore.deleteUserAction(params)
		dialogVisible.value = false
	} else {
		// 表单校验不通过
		ElNotification({
			title: '提示',
			message: '请完善表单信息',
			type: 'warning'
		})
	}
}
// 选择设备change事件
const handleDeviceChange = (val: string[]) => {
	globalStore.setLastDeviceIdAction(val)
}
// 暴露给父组件的方法
defineExpose({ acceptParams })
</script>

<template>
	<el-dialog
		class="dialogBox"
		title="选择设备删除用户"
		v-model="dialogVisible"
		:destroy-on-close="true"
		width="500"
		draggable
		center
	>
		<el-form :model="deviceForm" ref="deviceFormRef" :rules="deviceFormRules">
			<el-form-item label="选择设备" prop="deviceNos">
				<el-select
					style="width: 100%"
					v-model="deviceForm.deviceNos"
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
