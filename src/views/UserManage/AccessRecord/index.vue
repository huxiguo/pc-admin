<template>
	<div class="table-box">
		<!-- 搜索表单 -->
		<div class="card table-search">
			<el-form :model="searchForm" ref="searchFormRef">
				<!-- 第一行 -->
				<el-row :gutter="20" class="row-first">
					<el-col :span="6">
						<el-form-item label="姓名:" prop="cardName">
							<el-input
								v-model:model-value="searchForm.cardName"
								placeholder="请输入姓名"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="班级:" prop="unitsName">
							<el-input
								v-model:model-value="searchForm.unitsName"
								placeholder="请输入班级"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="学号:" prop="schNo">
							<el-input
								v-model:model-value="searchForm.schNo"
								placeholder="请输入学号"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="角色:" prop="role">
							<el-select v-model="searchForm.role" placeholder="请选择角色">
								<el-option label="学生" value="0" />
								<el-option label="老师" value="1" />
								<el-option label="其他" value="2" />
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<!-- 第二行 -->
				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="日期:" class="datePicker" prop="date">
							<el-date-picker
								v-model="searchForm.date"
								type="datetimerange"
								range-separator="到"
								start-placeholder="开始时间"
								end-placeholder="结束时间"
								format="YYYY-MM-DD HH:mm:ss"
								unlink-panels
								value-format="YYYY-MM-DD HH:mm:ss"
								:shortcuts="shortcuts"
								:default-time="defaultTime"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="年份:" prop="session">
							<el-input
								v-model.number="searchForm.session"
								placeholder="请输入年份"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="6">
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
import { useUserManngerStore } from '@/stores/modules/userMannger'
import { Delete, Search } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'

const userMannger = useUserManngerStore()
/**
 * 表单组件实例
 */
const searchFormRef = ref<FormInstance>()
/**
 * form表单数据
 */
const searchForm = reactive({
	// 姓名
	cardName: '',
	// 班级
	unitsName: '',
	// 年份
	session: 2023,
	// 学号
	schNo: '',
	// 角色
	role: '0',
	// 时间[]
	date: ''
})
// dataPicker 快捷选项
const shortcuts = [
	{
		// 昨天
		text: '昨天',
		value: () => {
			const end = new Date()
			const start = new Date()
			start.setTime(start.getTime() - 3600 * 1000 * 24)
			return [start, end]
		}
	},
	{
		text: '最近一周',
		value: () => {
			const end = new Date()
			const start = new Date()
			start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
			return [start, end]
		}
	},
	{
		text: '最近一个月',
		value: () => {
			const end = new Date()
			const start = new Date()
			start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
			return [start, end]
		}
	},
	{
		text: '最近三个月',
		value: () => {
			const end = new Date()
			const start = new Date()
			start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
			return [start, end]
		}
	}
]
// 选择日期后的默认时间
const defaultTime: [Date, Date] = [
	new Date(2000, 1, 1, 0, 0, 0),
	new Date(2000, 1, 1, 23, 59, 59)
]
// 修改表单数据，将日期数组分成开始时间和结束时间
const comSearchForm = computed(() => {
	const { date, ...rest } = searchForm
	const [startTime, endTime] = date
	return {
		...rest,
		startTime,
		endTime
	}
})

/**
 * 查询按钮点击事件
 */
const handleSearchBtnClick = () => {
	userMannger.getUserInOutListAction(comSearchForm.value)
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
