<template>
	<div class="table-box">
		<!-- 搜索表单 -->
		<div class="card table-search">
			<el-form :model="searchForm" ref="searchFormRef">
				<!-- 第一行 -->
				<el-row :gutter="20" class="row-first">
					<el-col :span="6">
						<el-form-item label="姓名:" prop="name">
							<el-input v-model:model-value="searchForm.name" />
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="班级:" prop="class">
							<el-select v-model="searchForm.class" placeholder="请选择班级">
								<el-option
									v-for="item in classData"
									:key="item.lable"
									:label="item.lable"
									:value="item.value"
								/>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="学院:" prop="college">
							<el-select v-model="searchForm.college" placeholder="请选择学院">
								<el-option
									v-for="item in collegeData"
									:key="item.lable"
									:label="item.lable"
									:value="item.value"
								/>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="进出:" prop="type">
							<el-select v-model="searchForm.type" placeholder="请选择状态">
								<el-option label="进入" :value="1" />
								<el-option label="离开" :value="0" />
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<!-- 第二行 -->
				<el-row :gutter="20">
					<el-col :span="6">
						<el-form-item label="日期:" class="datePicker" prop="date">
							<el-date-picker
								v-model="searchForm.date"
								type="date"
								placeholder="选择日期"
								format="YYYY-MM-DD"
								value-format="x"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="地点:" prop="address">
							<el-select
								v-model="searchForm.address"
								placeholder="请选择闸机位置"
							>
								<el-option label="一号机" value="1" />
								<el-option label="二号机" value="2" />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="6" :offset="6">
						<div class="operation">
							<el-button
								:icon="Search"
								class="searchBtn"
								@click="handleSearchBtnClick"
								>查询</el-button
							>
							<el-button
								:icon="Delete"
								class="resetBtn"
								@click="handleResetBtnClick(searchFormRef)"
								>重置</el-button
							>
						</div>
					</el-col>
				</el-row>
			</el-form>
		</div>
		<div class="card table-main">
			<el-table :data="tableData" border style="width: 100%">
				<el-table-column type="index" label="#" align="center" />
				<el-table-column
					prop="number"
					label="学号"
					align="center"
					width="180"
				/>
				<el-table-column
					prop="name"
					label="姓名"
					show-overflow-tooltip
					align="center"
					width="100"
				/>
				<el-table-column
					prop="gender"
					label="性别"
					width="80px"
					align="center"
				/>
				<el-table-column prop="class" label="班级" align="center" width="180" />
				<el-table-column
					prop="college"
					label="学院"
					align="center"
					width="180"
				/>
				<el-table-column label="状态" width="80" align="center">
					<template #default="scope">
						<el-tag effect="plain" type="success" v-if="scope.row.type">
							进
						</el-tag>
						<el-tag effect="plain" type="danger" v-else>出</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="time" label="进出时间" align="center" />
				<el-table-column
					prop="address"
					label="地点"
					align="center"
					width="180"
				/>
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
