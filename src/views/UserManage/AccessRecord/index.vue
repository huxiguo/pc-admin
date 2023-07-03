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
								clearable
							/>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="班级:" prop="className">
							<el-cascader
								v-model="searchForm.className"
								:options="classList"
								:props="props"
								clearable
							/>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="学号:" prop="schNo">
							<el-input
								v-model:model-value="searchForm.schNo"
								placeholder="请输入学号"
								clearable
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
								type="daterange"
								range-separator="到"
								start-placeholder="开始时间"
								end-placeholder="结束时间"
								format="YYYY-MM-DD"
								unlink-panels
								value-format="YYYY-MM-DD"
								:shortcuts="shortcuts"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="届数:" prop="session">
							<el-input
								v-model.number="searchForm.session"
								placeholder="请输入年份"
								clearable
							/>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<div class="operation">
							<el-button
								type="danger"
								:icon="Search"
								@click="handleDeleteBtnClick"
								>删除</el-button
							>
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
			<el-table
				:data="userInOutData"
				border
				style="width: 100%"
				@selection-change="handleSelectionChange"
			>
				<el-table-column type="selection" width="55" />
				<el-table-column type="index" label="#" align="center" />
				<el-table-column
					prop="user.schNo"
					show-overflow-tooltip
					label="学号"
					align="center"
					width="180"
				/>
				<el-table-column
					prop="user.name"
					label="姓名"
					show-overflow-tooltip
					align="center"
					width="100"
				/>
				<el-table-column
					label="角色"
					show-overflow-tooltip
					align="center"
					width="100"
				>
					<template #default="scope">
						{{
							scope.row.user.role === '0'
								? '学生'
								: scope.row.user.role === '1'
								? '老师'
								: '其他'
						}}
					</template>
				</el-table-column>
				<el-table-column
					prop="user.unitsName"
					show-overflow-tooltip
					label="班级"
					align="center"
					width="180"
				/>
				<el-table-column
					prop="user.session"
					show-overflow-tooltip
					label="届"
					align="center"
					width="180"
				/>
				<el-table-column label="状态" width="80" align="center">
					<template #default="scope">
						<el-tag effect="plain" type="success" v-if="scope.row.type === '1'">
							进
						</el-tag>
						<el-tag effect="plain" type="danger" v-else>出</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="stuTime" label="进出时间" align="center" />
			</el-table>
			<el-pagination
				v-model:current-page="currentPage"
				v-model:page-size="pageSize"
				:page-sizes="[10, 50, 200, 500]"
				layout="total, sizes, prev, pager, next, jumper"
				:total="total"
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ElNotification } from 'element-plus'
import { useUnitManngerStore } from '@/stores/modules/unitMannger'
import { useUserManngerStore } from '@/stores/modules/userMannger'
import { deleteAccessRecord } from '@/api/modules/userMannger'
import { Delete, Search } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'
const unitManngerStore = useUnitManngerStore()
unitManngerStore.getUnitListAction()
const { classList } = storeToRefs(unitManngerStore)
// 班级选项的配置
const props = {
	value: 'name',
	label: 'name',
	checkStrictly: true
}
const userMannger = useUserManngerStore()

const { total, userInOutData, defaultRole, defaultSession } =
	storeToRefs(userMannger)
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
	className: [],
	// 年份
	session: defaultSession,
	// 学号
	schNo: '',
	// 角色
	role: defaultRole,
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
// 修改表单数据，将日期数组分成开始时间和结束时间
// 将班级数组拼接
const comSearchForm = computed(() => {
	let { date, className, ...rest } = searchForm
	// className 可能为null
	className = className || []
	// 将数组的每一项加上| 拼接成字符串
	const unitsName = className.join('|')
	const [startTime, endTime] = date
	return {
		unitsName,
		...rest,
		startTime,
		endTime
	}
})
// 首次进入页面时，获取数据
onMounted(async () => {
	await userMannger.getUserInOutListAction(comSearchForm.value)
})

// 表格选中的数据
const selection = ref([])

// 表格选中的数据改变时触发
const handleSelectionChange = (val: any) => {
	// 将所有的选中的数据的recordId放入selection中
	selection.value = val.map((item: any) => item.recordId)
}

/**
 * 删除按钮点击事件
 */
const handleDeleteBtnClick = async () => {
	// 判断是否选中了数据
	if (selection.value.length === 0) {
		return ElNotification({
			title: '提示',
			message: '请选择要删除的记录',
			type: 'warning'
		})
	}
	// 删除选中的数据
	await userMannger.deleteAccessRecordAction(selection.value)
	// 清空选中的数据
	selection.value = []
	// 重新获取数据
	await userMannger.getUserInOutListAction(comSearchForm.value)
}

/**
 * 查询按钮点击事件
 */
const handleSearchBtnClick = async () => {
	await userMannger.getUserInOutListAction(comSearchForm.value)
}
/**
 * 重置按钮点击事件
 */
const handleResetBtnClick = async (formEl: FormInstance | undefined) => {
	if (!formEl) return
	formEl.resetFields()
	await userMannger.getUserInOutListAction(comSearchForm.value)
}
// 分页数据
const currentPage = ref(1)
const pageSize = ref(10)

/**
 * 分页大小改变回调
 * @param a 新的分页大小
 */
const handleSizeChange = async (pageSize: number) => {
	await userMannger.getUserInOutListAction(
		comSearchForm.value,
		currentPage.value,
		pageSize
	)
}
/**
 * 页码发生变化回调
 * @param b 新的页码
 */
const handleCurrentChange = async (currentPage: number) => {
	await userMannger.getUserInOutListAction(
		comSearchForm.value,
		currentPage,
		pageSize.value
	)
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
