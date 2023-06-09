<script setup lang="ts">
import type { FormInstance } from 'element-plus'
import { Delete, Search } from '@element-plus/icons-vue'
import { useDeviceStore } from '@/stores/modules/device'
import type { searchForm, device } from './Interface/form'
import { ElTable } from 'element-plus'

const deviceStore = useDeviceStore()

const searchFormRef = ref<FormInstance>()
// searchForm表单数据
const searchForm = ref<searchForm>({
	name: '',
	m_strIp: '',
	m_nPort: 0,
	id: '',
	type: '',
	status: ''
})
// 状态选择器数据
const statusSelectData = ref([
	{
		value: '0',
		label: '断开'
	},
	{
		value: '1',
		label: '连接'
	}
])
// 类型选择器数据
const typeSelectData = ref([
	{
		value: '0',
		label: '出'
	},
	{
		value: '1',
		label: '进'
	}
])
// 搜索栏重置按钮回调
const handleResetBtnClick = () => {
	searchFormRef.value?.resetFields()
	currentStatus.value = ''
	deviceStore.getAllDeviceInfoAction(
		searchForm.value,
		currentPage.value,
		pageSize.value
	)
}
// 搜索栏搜索按钮回调
const handleSearchBtnClick = () => {
	currentPage.value = 1
	deviceStore.getAllDeviceInfoAction(
		searchForm.value,
		currentPage.value,
		pageSize.value
	)
}

// 分页器数据
const currentPage = ref(1)
const pageSize = ref(10)
/*
 * 分页大小改变回调
 */
const handleSizeChange = (newSize: number) => {
	deviceStore.getAllDeviceInfoAction(
		searchForm.value,
		currentPage.value,
		newSize
	)
}
/*
 * 页码改变回调
 */
const handleCurrentChange = (newPage: number) => {
	deviceStore.getAllDeviceInfoAction(searchForm.value, newPage, pageSize.value)
}

// table表格元素节点
const multipleTableRef = ref<InstanceType<typeof ElTable>>()
// table表格多选框数据
const multipleSelection = ref<device[]>([])
// 获取表格数据
onActivated(() => {
	deviceStore.getAllDeviceInfoAction(
		searchForm.value,
		currentPage.value,
		pageSize.value
	)
})

// 选择断开的设备按钮的回调
const handleSelectUnconnectClick = () => {
	const connectList = deviceStore.deviceList.filter(
		(item: device) => item.status === '0'
	)
	multipleTableRef.value!.clearSelection()
	connectList.forEach((row: device) => {
		multipleTableRef.value!.toggleRowSelection(row, true)
	})
	if (connectList.length !== 0) {
		currentStatus.value = '0'
	} else {
		currentStatus.value = ''
	}
}
// 选择连接中的设备按钮的回调
const handleSelectConnectClick = () => {
	const unconnectList = deviceStore.deviceList.filter(
		(item: device) => item.status === '1'
	)
	multipleTableRef.value!.clearSelection()
	unconnectList.forEach((row: device) => {
		multipleTableRef.value!.toggleRowSelection(row, true)
	})
	if (unconnectList.length !== 0) {
		currentStatus.value = '1'
	} else {
		currentStatus.value = ''
	}
}
// 连接多台设备的按钮的回调
const handleConnectClick = () => {
	multipleSelection.value.forEach(item => {
		item.status = '1'
	})
	multipleSelection.value = []
	currentStatus.value = ''
	deviceStore.getAllDeviceInfoAction(
		searchForm.value,
		currentPage.value,
		pageSize.value
	)
}
// 断开多台设备的按钮的回调
const handleUnconnectClick = () => {
	multipleSelection.value.forEach(item => {
		item.status = '0'
	})
	multipleSelection.value = []
	currentStatus.value = ''
	deviceStore.getAllDeviceInfoAction(
		searchForm.value,
		currentPage.value,
		pageSize.value
	)
}
// 当前选中的设备的状态
const currentStatus = ref('')
// 点击表格多选框的回调
const handleSelectClick = (selection: device[], row: device) => {
	if (selection.length === 1) {
		currentStatus.value = row.status
	} else if (selection.length === 0) {
		currentStatus.value = ''
	}
}
// 判断表格每行的多选框是否可用
const selectable = (row: device) => {
	if (currentStatus.value === '' || currentStatus.value === row.status) {
		return true
	} else {
		return false
	}
}
// 存储表格选中的数据
const handleSelectionChange = (val: device[]) => {
	multipleSelection.value = val
}
// 表格操作栏switch点击回调
const handleSwitchClick = (row: device) => {
	// 表格多选框无选中的情况
	if (multipleSelection.value.length === 0) {
		// 根据row.status发送请求
	} else if (multipleSelection.value.length === 1) {
		//  表格多选框只选中一个的情况
		//表格选中的设备与修改了状态的设备不是同一个
		if (multipleSelection.value.findIndex(item => item.id === row.id) === -1) {
			// 根据row.status发送请求
		} else {
			// 表格选中的设备与修改了状态的设备是同一个
			multipleTableRef.value!.toggleRowSelection(row, false)
			currentStatus.value = ''
			// 根据row.status发送请求
		}
	} else {
		// 表格多选框选中多个的情况
		multipleTableRef.value!.toggleRowSelection(row, false)
		// 根据row.status发送请求
	}
}
</script>

<template>
	<div class="table-box">
		<!-- 搜索表单 -->
		<div class="card table-search">
			<el-form :model="searchForm" ref="searchFormRef">
				<!-- 第一行 -->
				<el-row :gutter="20" class="row-first">
					<el-col :span="6">
						<el-form-item label="设备ID:" prop="id">
							<el-input
								v-model:model-value="searchForm.id"
								placeholder="请输入设备ID"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="设备名称:" prop="name">
							<el-input
								v-model:model-value="searchForm.name"
								placeholder="请输入设备名称"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="端口号:" prop="m_nPort">
							<el-input
								v-model.number="searchForm.m_nPort"
								placeholder="请输入端口号"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="IP地址:" prop="m_strIp">
							<el-input
								v-model:model-value="searchForm.m_strIp"
								placeholder="请输入IP地址"
							/>
						</el-form-item>
					</el-col>
				</el-row>
				<!-- 第二行 -->
				<el-row :gutter="20">
					<el-col :span="6">
						<el-form-item label="类型:" prop="type"
							><el-select v-model="searchForm.type" placeholder="请选择类型">
								<el-option
									v-for="item in typeSelectData"
									:key="item.value"
									:label="item.label"
									:value="item.value"
								/>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="类型:" prop="status"
							><el-select v-model="searchForm.status" placeholder="请选择状态">
								<el-option
									v-for="item in statusSelectData"
									:key="item.value"
									:label="item.label"
									:value="item.value"
								/>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<div class="operation">
							<el-button
								:icon="Search"
								class="searchBtn"
								@click="handleSearchBtnClick"
							>
								查询
							</el-button>
							<el-button
								:icon="Delete"
								class="resetBtn"
								@click="handleResetBtnClick"
							>
								重置
							</el-button>
							<el-button @click="handleSelectUnconnectClick">
								选择断开的设备
							</el-button>
							<el-button @click="handleSelectConnectClick">
								选择连接中的设备
							</el-button>
							<el-button
								@click="handleConnectClick"
								type="primary"
								:class="{
									connectBtnDisabled: currentStatus !== '0' ? true : false
								}"
								:disabled="currentStatus !== '0' ? true : false"
							>
								连接
							</el-button>
							<el-button
								@click="handleUnconnectClick"
								type="danger"
								:disabled="currentStatus !== '1' ? true : false"
							>
								断开
							</el-button>
						</div>
					</el-col></el-row
				>
			</el-form>
		</div>
		<!-- 数据表格 -->
		<div class="card table-main">
			<el-table
				:data="deviceStore.deviceList"
				border
				style="width: 100%"
				@select="handleSelectClick"
				@selection-change="handleSelectionChange"
				ref="multipleTableRef"
			>
				<!-- 选择框 -->
				<el-table-column
					type="selection"
					width="55"
					align="center"
					:selectable="selectable"
				/>
				<!-- 索引 -->
				<el-table-column type="index" label="#" width="50" align="center" />
				<!-- 设备名称 -->
				<el-table-column
					prop="name"
					label="设备名称"
					width="180"
					align="center"
				/>
				<!-- 设备ID -->
				<el-table-column prop="id" label="设备ID" width="180" align="center" />
				<!-- 用户名 -->
				<el-table-column
					prop="m_strUser"
					label="用户名"
					width="100"
					align="center"
				/>
				<!-- 端口号 -->
				<el-table-column prop="m_nPort" label="端口号" align="center" />
				<!-- IP地址 -->
				<el-table-column prop="m_strIp" label="IP地址" align="center" />
				<!-- 状态 -->
				<el-table-column prop="m_strIp" label="状态" align="center" width="80">
					<template #default="scope">
						<el-tag effect="dark" type="success" v-if="scope.row.status === '1'"
							>连接</el-tag
						>
						<el-tag effect="dark" type="danger" v-else>断开</el-tag>
					</template>
				</el-table-column>
				<!-- 出入类型 -->
				<el-table-column
					prop="type"
					label="出入类型"
					align="center"
					width="100"
				>
					<template #default="scope">
						<el-tag effect="plain" type="success" v-if="scope.row.type === '1'">
							进
						</el-tag>
						<el-tag effect="plain" type="danger" v-else>出</el-tag>
					</template>
				</el-table-column>
				<!-- 更改设备状态 -->
				<el-table-column label="更改设备状态" align="center" width="140px">
					<template #default="scope">
						<div class="perate">
							<el-switch
								v-model="scope.row.status"
								@change="handleSwitchClick(scope.row)"
								inline-prompt
								style="
									--el-switch-on-color: #13ce66;
									--el-switch-off-color: #ff4949;
								"
								active-text="连接"
								inactive-text="断开"
								active-value="1"
								inactive-value="0"
							/>
						</div>
					</template>
				</el-table-column>
			</el-table>
			<!-- 分页器 -->
			<el-pagination
				v-model:current-page="currentPage"
				v-model:page-size="pageSize"
				:page-sizes="[10, 20, 30, 40]"
				layout="total, sizes, prev, pager, next, jumper"
				:total="deviceStore.total"
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
			/>
		</div>
	</div>
</template>

<style scoped lang="scss">
.row-first {
	margin-bottom: 10px;
}
.el-select-dropdown__item.hover {
	background-color: #e9f7ef;
}
.datePicker {
	width: 100%;
	:deep(.el-input__wrapper) {
		display: flex;
	}
}
.searchBtn {
	--el-button-text-color: #ffffff;
	--el-button-hover-text-color: #ffffff;
	--el-button-bg-color: #27ae60;
	--el-button-hover-bg-color: #68c690;
}
.resetBtn {
	--el-button-hover-bg-color: #e9f7ef;
	--el-button-hover-text-color: #27ae60;
}
.perate {
	display: flex;
	justify-content: center;
	.el-button {
		padding: 0;
	}
}

:deep(.el-table__header) {
	.el-table-column--selection {
		.el-checkbox {
			display: none !important;
		}
	}
}

.connectBtnDisabled {
	background-color: rgba(39, 174, 96, 0.5);
	&:hover {
		background-color: rgba(39, 174, 96, 0.5);
	}
}
</style>
