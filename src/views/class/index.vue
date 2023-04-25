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
			<div class="table-header">
				<div class="header-button-ri">
					<el-button class="searchBtn" :icon="CirclePlusFilled">
						添加用户
					</el-button>
				</div>
			</div>
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
	</div>
</template>

<script setup lang="ts">
import { Edit, Delete, Search, CirclePlusFilled } from '@element-plus/icons-vue'
import classData from '@/data/class'
import collegeData from '@/data/college'
import type { FormInstance } from 'element-plus'

/**
 * 表单组件实例
 */
const searchFormRef = ref<FormInstance>()
/**
 * form表单数据
 */
const searchForm = reactive({
	name: '',
	class: '',
	college: '',
	type: 1,
	date: '',
	address: ''
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
		class: '222222222222',
		college: '11111111',
		type: true,
		time: '2023-04-24 15:32:46',
		address: '1111111'
	},
	{
		number: '111111111111',
		name: 'Tom',
		gender: '女',
		class: '222222222222',
		college: '11111111',
		type: false,
		time: '2023-04-24 8:32:46',
		address: '1111111'
	}
]

/**
 * 表格编辑按钮
 * @param rowData 行内数据
 */
const handleEditBtnClick = (rowData: any) => {
	console.log('rowData', rowData.name)
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
