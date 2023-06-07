<template>
	<div class="table-box">
		<!-- 搜索表单 -->
		<div class="card table-search">
			<el-form :model="searchForm" ref="searchFormRef">
				<!-- 第一行 -->
				<el-row :gutter="20">
					<el-col :span="5">
						<el-form-item label="姓名:" prop="name">
							<el-input
								v-model:model-value="searchForm.name"
								placeholder="请输入姓名"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="5">
						<el-form-item label="学号:" prop="schNo">
							<el-input
								v-model:model-value="searchForm.schNo"
								placeholder="请输入学号"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="5">
						<el-form-item label="班级:" prop="unitsName">
							<el-cascader
								v-model="searchForm.className"
								:options="classList"
								:props="props"
								clearable
								placeholder="请选择班级"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="5">
						<el-form-item label="角色:" prop="role">
							<el-select v-model="searchForm.role" placeholder="请选择角色">
								<el-option label="学生" value="0" />
								<el-option label="老师" value="1" />
								<el-option label="其他" value="2" />
							</el-select>
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
			<el-table :data="userList" border style="width: 100%">
				<!-- 索引 -->
				<el-table-column type="index" label="#" align="center" />
				<!-- 学号 -->
				<el-table-column prop="schNo" label="学号" align="center" width="180" />
				<!-- 姓名 -->
				<el-table-column
					prop="name"
					label="姓名"
					show-overflow-tooltip
					align="center"
					width="100"
				/>
				<!-- 角色 -->
				<el-table-column prop="name" label="角色" align="center" width="100">
					<template #default="scope">
						{{
							scope.row.role === '0'
								? '学生'
								: scope.row.role === '1'
								? '老师'
								: '其他'
						}}
					</template>
				</el-table-column>
				<!-- 人脸照片 -->
				<el-table-column prop="faceUrl" label="照片" align="center">
					<template #default>
						<!-- 一寸照片大小 -->
						<el-image
							style="width: 80px; height: 120px"
							src="https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg"
							fit="cover"
						></el-image>
					</template>
				</el-table-column>
				<!-- 班级 -->
				<el-table-column
					prop="unitsName"
					show-overflow-tooltip
					label="班级"
					align="center"
					width="180"
				/>
				<!-- 届 -->
				<el-table-column prop="session" label="届" align="center" width="180" />
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
				:page-sizes="[10, 50, 200, 500]"
				layout="total, sizes, prev, pager, next, jumper"
				:total="userTotal"
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
import { useUnitManngerStore } from '@/stores/modules/unitMannger'
import { useUserManngerStore } from '@/stores/modules/userMannger'

const userManngerStore = useUserManngerStore()

const unitManngerStore = useUnitManngerStore()
unitManngerStore.getUnitListAction()
const { classList } = storeToRefs(unitManngerStore)
const { userList, userTotal } = storeToRefs(userManngerStore)
// 分页数据
const currentPage = ref(1)
const pageSize = ref(10)

// 班级选项的配置
const props = {
	value: 'name',
	label: 'name',
	checkStrictly: true
}
/**
 * 表单组件实例
 */
const searchFormRef = ref<FormInstance>()
/**
 * form表单数据
 */
const searchForm = reactive({
	name: '',
	role: '',
	schNo: '',
	className: []
})

// 处理表单数据，发送请求
const comSearchForm = computed(() => {
	const { className, ...params } = searchForm
	const unitsName = className.join('|')
	return {
		unitsName,
		...params
	}
})
// 进入页面获取所有用户列表
onMounted(() => {
	userManngerStore.getAllUserListAction(comSearchForm.value)
})
/**
 * 查询按钮点击事件
 */
const handleSearchBtnClick = () => {
	userManngerStore.getAllUserListAction(comSearchForm.value)
}
/**
 * 重置按钮点击事件
 */
const handleResetBtnClick = (formEl: FormInstance | undefined) => {
	if (!formEl) return
	formEl.resetFields()
	userManngerStore.getAllUserListAction(comSearchForm.value)
}

/**
 * 分页大小改变回调
 * @param a 新的分页大小
 */
const handleSizeChange = (pageSize: number) => {
	userManngerStore.getAllUserListAction(
		comSearchForm.value,
		currentPage.value,
		pageSize
	)
}
/**
 * 页码发生变化回调
 * @param b 新的页码
 */
const handleCurrentChange = (currentPage: number) => {
	userManngerStore.getAllUserListAction(
		comSearchForm.value,
		currentPage,
		pageSize.value
	)
}

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
