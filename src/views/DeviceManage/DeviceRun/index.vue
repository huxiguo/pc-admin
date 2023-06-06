<script setup lang="ts">
import { Edit, Delete, Search } from '@element-plus/icons-vue'
import { getAllDeviceList } from '@/api/modules/device'

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
// 设备参数
const deviceDto = ref({})

// 获取表格数据
getAllDeviceList(deviceDto.value, 1, 10).then(res => {
	deviceList.value = res.result.deviceList
	total.value = res.result.total
	console.log(res.result)
})

/**
 * 是否显示编辑用户对话框
 */
const editDialogVisible = ref(false)

/**
 * 表格编辑按钮
 * @param rowData 行内数据
 */
const handleEditBtnClick = (rowData: any) => {
	editDialogVisible.value = true
	// 1. 回显表格行内数据
	// for (const key in dialogForm) {
	// 	console.log('item', key)
	// 	dialogForm[key] = rowData[key]
	// }
	// 2. 获取表格最新数据
	// 3. 发送请求更新数据
}

/**
 * 表格删除按钮
 * @param rowData 行内数据
 */
const handleDeleteBtnClick = (rowData: any) => {
	console.log('row', rowData.number)
}

// 编辑表单数据
const dialogForm = ref({})
</script>

<template>
	<div class="table-box">
		<!-- 搜索表单 -->
		<div class="card table-search">123</div>
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
							<el-button
								text
								type="primary"
								:icon="Delete"
								@click="handleDeleteBtnClick(scope.row)"
								>删除</el-button
							>
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
		<!-- 编辑用户对话框 -->
		<!-- <el-dialog
			class="dialogBox"
			v-model:model-value="editDialogVisible"
			title="编辑用户"
			width="30%"
			center
		>
			<el-form :model="dialogForm" label-position="left" label-width="70px">
				<el-form-item label="学号：" prop="number">
					<el-input v-model="dialogForm.number" />
				</el-form-item>
				<el-form-item label="姓名：" prop="name">
					<el-input v-model="dialogForm.name" />
				</el-form-item>
				<el-form-item label="性别：" prop="gender">
					<el-input v-model="dialogForm.gender" />
				</el-form-item>
				<el-form-item label="手机号：" prop="phone">
					<el-input v-model="dialogForm.phone" />
				</el-form-item>
				<el-form-item label="密码：" prop="password">
					<el-input v-model="dialogForm.password" />
				</el-form-item>
				<el-form-item label="班级：" prop="class">
					<el-input v-model="dialogForm.class" />
				</el-form-item>
				<el-form-item label="学院：" prop="college">
					<el-input v-model="dialogForm.college" />
				</el-form-item>
			</el-form>
			<template #footer>
				<div class="dialog-footer">
					<el-button @click="editDialogVisible = false">Cancel</el-button>
					<el-button type="primary" @click="editDialogVisible = false">
						Confirm
					</el-button>
				</div>
			</template>
		</el-dialog> -->
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
