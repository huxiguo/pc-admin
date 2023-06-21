<script setup lang="ts">
import { deleteSessionUser } from '@/api/modules/userMannger'
import { useDeviceStore } from '@/stores/modules/device'
import { useGlobalStore } from '@/stores/modules/global'
const deviceStore = useDeviceStore()
const globalStore = useGlobalStore()
const { deviceList, total } = storeToRefs(deviceStore)
const { lastDeviceId } = storeToRefs(globalStore)
const handleDeviceVisibleChange = (visiable: boolean) => {
	if (visiable) {
		deviceStore.getAllDeviceInfoAction({}, 1, total.value)
	}
}
const deviceNos = ref(lastDeviceId || [])
const dialogVisible = ref(false)
const acceptParams = () => {
	dialogVisible.value = true
}
const handleBtnClick = async () => {
	const params = {
		deviceNos: deviceNos.value,
		session: 2023
	}
	await deleteSessionUser(params)
}
// 选择设备change事件
const handleDeviceChange = (val: string[]) => {
	globalStore.setLastDeviceIdAction(val)
}
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
		<el-select
			style="width: 100%"
			v-model="deviceNos"
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
		<template #footer>
			<el-button @click="dialogVisible = false">取 消</el-button>
			<el-button type="primary" @click="handleBtnClick">确 定</el-button>
		</template>
	</el-dialog>
</template>
