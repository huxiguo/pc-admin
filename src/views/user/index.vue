<template>
	<div class="table-box">
		<!-- 搜索表单 -->
		<div class="card table-search">
			<el-form :model="searchForm" ref="searchFormRef">
				<!-- 第一行 -->
				<el-row :gutter="20">
					<el-col :span="10">
						<el-form-item label="姓名:" prop="name">
							<el-input v-model:model-value="searchForm.name" />
						</el-form-item>
					</el-col>
					<el-col :span="10">
						<el-form-item label="学号:" prop="stuNumber">
							<el-input v-model:model-value="searchForm.stuNumber" />
						</el-form-item>
					</el-col>
					<el-col :span="4">
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
								@click="handleResetBtnClick(searchFormRef)"
							>
								重置
							</el-button>
						</div>
					</el-col>
				</el-row>
			</el-form>
		</div>
		<div class="card table-main">
			<el-table :data="tableData" border style="width: 100%">
				<!-- 索引 -->
				<el-table-column type="index" label="#" align="center" />
				<!-- 学号 -->
				<el-table-column
					prop="number"
					label="学号"
					align="center"
					width="180"
				/>
				<!-- 姓名 -->
				<el-table-column
					prop="name"
					label="姓名"
					show-overflow-tooltip
					align="center"
					width="100"
				/>
				<!-- 性别 -->
				<el-table-column
					prop="gender"
					label="性别"
					width="80px"
					align="center"
				/>
				<!-- 手机号 -->
				<el-table-column
					prop="phone"
					label="手机号"
					align="center"
					width="180"
				/>
				<!-- 密码 -->
				<el-table-column
					prop="password"
					label="密码"
					align="center"
					width="180"
				/>
				<!-- 班级 -->
				<el-table-column prop="class" label="班级" align="center" width="180" />
				<!-- 学院 -->
				<el-table-column
					prop="college"
					label="学院"
					align="center"
					width="180"
				/>
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
			<el-pagination
				v-model:current-page="currentPage"
				v-model:page-size="pageSize"
				:page-sizes="[10, 20, 30, 40]"
				layout="total, sizes, prev, pager, next, jumper"
				:total="40"
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
			/>
		</div>
		<!-- 编辑用户对话框 -->
		<el-dialog
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
		</el-dialog>
	</div>
</template>

<script setup lang="ts">
import { Edit, Delete, Search } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'

import type { DialogForm } from './Interface/dialogForm'

/**
 * 表单组件实例
 */
const searchFormRef = ref<FormInstance>()
/**
 * form表单数据
 */
const searchForm = reactive({
	name: '',
	stuNumber: ''
})

/**
 * 查询按钮点击事件
 */
const handleSearchBtnClick = () => {
	console.log('searchForm', searchForm)
}
/**
 * 重置按钮点击事件
 */
const handleResetBtnClick = (formEl: FormInstance | undefined) => {
	if (!formEl) return
	formEl.resetFields()
}
// 模拟表格数据
const tableData = [
	{
		number: '111111111111',
		name: '阿里木.买买提.伊莉娜.娜扎特',
		gender: '男',
		phone: '1111111111',
		password: '1123121fdcwcdwxs',
		class: '222222222222',
		college: '11111111'
	},
	{
		number: '111111111111',
		name: 'Tom',
		gender: '女',
		phone: '1111111111',
		password: '1123121fdcwcdwxs',
		class: '222222222222',
		college: '11111111'
	}
]

/**
 * 是否显示编辑用户对话框
 */
const editDialogVisible = ref(false)
/**
 *	编辑表单数据
 */
const dialogForm = reactive<DialogForm>({
	name: '',
	class: '',
	college: '',
	gender: '',
	number: '',
	password: '',
	phone: ''
})
/**
 * 表格编辑按钮
 * @param rowData 行内数据
 */
const handleEditBtnClick = (rowData: any) => {
	editDialogVisible.value = true
	// 1. 回显表格行内数据
	for (const key in dialogForm) {
		console.log('item', key)
		dialogForm[key] = rowData[key]
	}
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

// 分页数据
const currentPage = ref(1)
const pageSize = ref(10)

/**
 * 分页大小改变回调
 * @param a 新的分页大小
 */
const handleSizeChange = (pageSize: number) => {
	console.log('first', pageSize)
}
/**
 * 页码发生变化回调
 * @param b 新的页码
 */
const handleCurrentChange = (currentPage: number) => {
	console.log('b', currentPage)
}
</script>

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
