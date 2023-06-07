<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import { Edit, Delete, Search } from '@element-plus/icons-vue'
import { useDeviceStore } from '@/stores/modules/device'
import type { searchForm, dialogForm } from './Interface/form'

const deviceStore = useDeviceStore()

// searchForm表单数据
const searchForm = ref<searchForm>({
	name: '',
	m_strIp: '',
	m_nPort: 37777,
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
	searchForm.value = {
		name: '',
		m_nPort: 0,
		m_strIp: '',
		id: '',
		type: '',
		status: ''
	}
}
// 搜索栏搜索按钮回调
const handleSearchBtnClick = () => {
	deviceStore.getAllDeviceInfoAction(searchForm.value)
}

// 分页器数据
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
/*
 * 分页大小改变回调
 */
const handleSizeChange = (newSize: number) => {
	pageSize.value = newSize
}
/*
 * 页码改变回调
 */
const handleCurrentChange = (newPage: number) => {
	currentPage.value = newPage
}

// 表单验证
const ruleFormRef = ref<FormInstance>()

// 获取表格数据
if (typeof searchForm.value.m_nPort === 'string') {
	const newParams = ref()
	newParams.value = {
		...searchForm.value,
		m_nPort: Number(searchForm.value.m_nPort)
	}
	deviceStore.getAllDeviceInfoAction(newParams.value)
}

deviceStore.getAllDeviceInfoAction(searchForm.value)
// 编辑框的类型（添加和编辑）
const dialogType = ref('')
/**
 * 是否显示编辑用户对话框
 */
const DialogVisible = ref(false)
// dialogForm表单数据
const dialogForm = ref<dialogForm>({
	name: '',
	m_nPort: 0,
	m_strIp: '',
	m_strUser: '',
	m_strPassword: '',
	status: '',
	type: '0'
})
/*
 * 添加设备按钮回调
 */
const handleAddBtnClick = () => {
	dialogType.value = 'add'
	DialogVisible.value = true
}
/**
 * 表格编辑按钮
 * @param rowData 行内数据
 */
const handleEditBtnClick = (rowData: any) => {
	dialogType.value = 'edit'
	DialogVisible.value = true
	nextTick(() => {
		dialogForm.value = JSON.parse(JSON.stringify(rowData))
	})
}
/*
 * 对话框关闭回调
 */
const test = ref()
const handleEditClose = () => {
	// setTimeout(() => {
	dialogType.value = ''
	nextTick(() => {
		test.value.resetFields()
	})
	console.log(11111111)
	// dialogForm.value = {
	// 	name: '',
	// 	m_nPort: 0,
	// 	m_strIp: '',
	// 	m_strUser: '',
	// 	m_strPassword: '',
	// 	status: '',
	// 	type: '0'
	// }
	// }, 500)
	DialogVisible.value = false
}
/*
 * 对话框确认按钮回调
 */
const handleConfirmClick = () => {}
</script>

<template>
	<div class="table-box">
		<!-- 搜索表单 -->
		<div class="card table-search">
			<el-form :model="searchForm" ref="searchFormRef">
				<!-- 第一行 -->
				<el-row :gutter="20" class="row-first">
					<el-col :span="8">
						<el-form-item label="设备ID:" prop="id">
							<el-input
								v-model:model-value="searchForm.id"
								placeholder="请输入设备ID"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="设备名称:" prop="name">
							<el-input
								v-model:model-value="searchForm.name"
								placeholder="请输入设备名称"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="端口号:" prop="m_nPort">
							<el-input
								v-model.number="searchForm.m_nPort"
								placeholder="请输入端口号"
							/>
						</el-form-item>
					</el-col>
				</el-row>
				<!-- 第二行 -->
				<el-row :gutter="20">
					<el-col :span="8">
						<el-form-item label="IP地址:" prop="m_strIp">
							<el-input
								v-model:model-value="searchForm.m_strIp"
								placeholder="请输入IP地址"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="8">
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
					<el-col :span="8">
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
							<el-button @click="handleAddBtnClick">添加设备</el-button>
						</div>
					</el-col></el-row
				>
			</el-form>
		</div>
		<!-- 数据表格 -->
		<div class="card table-main">
			<el-table :data="deviceStore.deviceList" border style="width: 100%">
				<!-- 索引 -->
				<el-table-column type="index" label="#" width="180" align="center" />
				<!-- 设备名称 -->
				<el-table-column
					prop="name"
					label="设备名称"
					width="180"
					align="center"
				/>
				<!-- 端口号 -->
				<el-table-column prop="m_nPort" label="端口号" align="center" />
				<!-- IP地址 -->
				<el-table-column prop="m_strIp" label="IP地址" align="center" />
				<!-- 状态 -->
				<el-table-column prop="m_strIp" label="状态" align="center">
					<template #default="scope">
						<el-tag effect="dark" type="success" v-if="scope.row.status === '1'"
							>连接</el-tag
						>
						<el-tag effect="dark" type="danger" v-else>断开</el-tag>
					</template>
				</el-table-column>
				<!-- 出入类型 -->
				<el-table-column prop="type" label="出入类型" align="center">
					<template #default="scope">
						<el-tag effect="plain" type="success" v-if="scope.row.type === '1'">
							进
						</el-tag>
						<el-tag effect="plain" type="danger" v-else>出</el-tag>
					</template>
				</el-table-column>
				<!-- 操作 -->
				<el-table-column label="操作" align="center" width="180px">
					<template #default="scope">
						<div class="perate">
							<el-button
								text
								type="primary"
								:icon="Edit"
								@click="handleEditBtnClick(scope.row)"
								>编辑</el-button
							>
							<el-button text type="primary" :icon="Delete">删除</el-button>
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
				:total="total"
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
			/>
		</div>
		<!-- 编辑、添加对话框 -->
		<el-dialog
			class="dialogBox"
			:model-value="DialogVisible"
			:title="dialogType === 'add' ? '添加设备' : '编辑设备'"
			width="43%"
			center
			@closed="handleEditClose"
		>
			<el-form
				:model="dialogForm"
				label-position="left"
				label-width="85px"
				ref="test"
			>
				<el-form-item label="设备名称：" prop="name">
					<el-input v-model="dialogForm.name" />
				</el-form-item>
				<el-form-item label="端口号：" prop="m_nPort">
					<el-input v-model="dialogForm.m_nPort" />
				</el-form-item>
				<el-form-item label="IP地址：" prop="m_strIp">
					<el-input v-model="dialogForm.m_strIp" />
				</el-form-item>
				<el-form-item label="用户名：" prop="m_strUser">
					<el-input v-model="dialogForm.m_strUser" />
				</el-form-item>
				<el-form-item label="密码：" prop="m_strPassword">
					<el-input v-model="dialogForm.m_strPassword" />
				</el-form-item>
				<el-form-item label="类型：" prop="status">
					<el-switch
						v-model="dialogForm.type"
						class="ml-2"
						inline-prompt
						style="
							--el-switch-on-color: #13ce66;
							--el-switch-off-color: #ff4949;
						"
						active-text="进"
						inactive-text="出"
						active-value="1"
						inactive-value="0"
					/>
				</el-form-item>
			</el-form>
			<template #footer>
				<div class="dialog-footer">
					<el-button @click="handleEditClose">取消</el-button>
					<el-button type="primary" @click="handleConfirmClick">
						保存
					</el-button>
				</div>
			</template>
		</el-dialog>
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
</style>
