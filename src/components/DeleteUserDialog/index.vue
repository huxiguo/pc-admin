<script setup lang="ts">
import { useDeviceStore } from '@/stores/modules/device'
import { useUserManngerStore } from '@/stores/modules/userMannger'
const deviceStore = useDeviceStore()
const userManngerStore = useUserManngerStore()
const { deviceList, total } = storeToRefs(deviceStore)
const dialogVisible = ref(false)
const userIds = ref('')
const deviceNos = ref([])
const handleDeviceVisibleChange = (visiable: boolean) => {
	if (visiable) {
		deviceStore.getAllDeviceInfoAction({}, 1, total.value)
	}
}
const acceptParams = (params: any) => {
	dialogVisible.value = true
	userIds.value = params
}
const handleBtnClick = async () => {
	console.log(deviceNos.value)
	console.log(userIds.value)
	const params = {
		userIds: [userIds.value],
		deviceNos: deviceNos.value
	}
	await userManngerStore.deleteUserAction(params)
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
