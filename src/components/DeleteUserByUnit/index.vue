<script setup lang="ts">
import { useDeviceStore } from '@/stores/modules/device'
import { deleteUnitUser } from '@/api/modules/userMannger'
import { useUnitManngerStore } from '@/stores/modules/unitMannger'
import { useGlobalStore } from '@/stores/modules/global'
const unitManngerStore = useUnitManngerStore()
const globalStore = useGlobalStore()
const deviceStore = useDeviceStore()
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
const deviceNos = ref<string[]>([])
const unitsId = ref([])
const dialogVisible = ref(false)
const acceptParams = (params: string[]) => {
	dialogVisible.value = true
	nextTick(() => {
		deviceNos.value = params
	})
}
const handleBtnClick = async () => {
	// 构造参数取出班级ID最后一个
	const params = {
		unitsId: unitsId.value[unitsId.value.length - 1],
		deviceNos: deviceNos.value
	}
	await deleteUnitUser(params)
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
		title="选择班级删除用户"
		v-model="dialogVisible"
		:destroy-on-close="true"
		width="500"
		draggable
		center
	>
		<el-cascader
			v-model="unitsId"
			:options="classList"
			:props="props"
			clearable
			placeholder="请选择班级"
		/>
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
