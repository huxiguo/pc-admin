<script setup lang="ts">
import { Edit, Delete, Search } from '@element-plus/icons-vue'
import { getAllDeviceList } from '@/api/modules/device'
import type { searchForm, dialogForm } from './Interface/form'

// searchForm表单数据
const searchForm = ref<searchForm>({
	name: '',
	m_nPort: '',
	m_strIp: ''
})
// 搜索栏重置按钮回调
const handleResetBtnClick = () => {
	searchForm.value = {
		name: '',
		m_nPort: '',
		m_strIp: ''
	}
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

// 表格数据
const deviceList = ref([])
// 获取表格数据
getAllDeviceList({}, 1, 10).then(res => {
	deviceList.value = res.result.deviceList
	total.value = res.result.total
})

// 编辑框的类型（添加和编辑）
const dialogType = ref('')
/**
 * 是否显示编辑用户对话框
 */
const DialogVisible = ref(false)
// dialogForm表单数据
const dialogForm = ref<dialogForm>({
	name: '',
	m_nPort: '',
	m_strIp: '',
	m_strUser: '',
	m_strPassword: '',
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
	dialogForm.value = rowData
	DialogVisible.value = true
}
/*
 * 对话框关闭回调
 */
const handleEditClose = () => {
	dialogType.value = ''
	DialogVisible.value = false
	dialogForm.value = {
		name: '',
		m_nPort: '',
		m_strIp: '',
		m_strUser: '',
		m_strPassword: '',
		status: ''
	}
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
				<el-row :gutter="20">
					<el-col :span="5">
						<el-form-item label="设备名称:" prop="name">
							<el-input
								v-model:model-value="searchForm.name"
								placeholder="请输入设备名称"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="5">
						<el-form-item label="端口号:" prop="m_nPort">
							<el-input
								v-model:model-value="searchForm.m_nPort"
								placeholder="请输入端口号"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="5">
						<el-form-item label="IP地址:" prop="m_strIp">
							<el-input
								v-model:model-value="searchForm.m_strIp"
								placeholder="请输入IP地址"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="4">
						<div class="operation">
							<el-button :icon="Search" class="searchBtn"> 查询 </el-button>
							<el-button
								:icon="Delete"
								class="resetBtn"
								@click="handleResetBtnClick"
							>
								重置
							</el-button>
						</div>
					</el-col>
					<el-col :span="1">
						<el-button @click="handleAddBtnClick">添加设备</el-button>
					</el-col>
				</el-row>
			</el-form>
		</div>
		<!-- 数据表格 -->
		<div class="card table-main">
			<el-table :data="deviceList" border style="width: 100%">
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
				<el-table-column
					label="操作"
					fixed="right"
					align="center"
					width="180px"
				>
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
			@close="handleEditClose"
		>
			<el-form :model="dialogForm" label-position="left" label-width="85px">
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
				<el-form-item label="状态：" prop="status">
					<el-select
						v-model="dialogForm.status"
						class="m-2"
						placeholder="Select"
					>
						<el-option
							v-for="item in statusSelectData"
							:key="item.value"
							:label="item.label"
							:value="item.value"
						/>
					</el-select>
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
