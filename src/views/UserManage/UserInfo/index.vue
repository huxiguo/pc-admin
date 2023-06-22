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
								clearable
							/>
						</el-form-item>
					</el-col>
					<el-col :span="5">
						<el-form-item label="学号:" prop="schNo">
							<el-input
								v-model:model-value="searchForm.schNo"
								placeholder="请输入学号"
								clearable
							/>
						</el-form-item>
					</el-col>
					<el-col :span="5">
						<el-form-item label="班级:" prop="className">
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
			<div class="table-header">
				<div class="header-button-lf">
					<el-button type="primary" @click="downloadFile" :icon="Download"
						>导出用户数据</el-button
					>
					<el-button
						type="primary"
						:icon="Upload"
						@click="handleImportUserClick"
						>批量添加用户</el-button
					>
				</div>
				<div class="header-button-ri">
					<el-button type="primary" @click="addUser"> 添加用户 </el-button>
					<el-button type="danger" @click="deleteUser">删除用户</el-button>
					<el-button type="danger" @click="deleteAllUserByUnit"
						>删除单位所有用户</el-button
					>
					<el-button type="danger" @click="deleteAllUserBySession"
						>删除某届所有学生</el-button
					>
				</div>
			</div>
			<el-table
				:data="userList"
				border
				style="width: 100%"
				@selection-change="handleSelectionChange"
			>
				<!-- 选择框 -->
				<el-table-column type="selection" width="55" align="center" />
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
							:src="imgUrl"
							:preview-src-list="srcList"
							fit="cover"
							hide-on-click-modal
							close-on-press-escape
							preview-teleported
							:z-index="9999"
							@click="handleImgClick(imgUrl)"
						></el-image>
					</template>
				</el-table-column>
				<!-- 班级 -->
				<el-table-column
					prop="unitsName"
					show-overflow-tooltip
					label="班级"
					align="center"
				/>
				<!-- 届 -->
				<el-table-column prop="session" label="届" align="center" width="80" />
				<!-- 操作 -->
				<el-table-column label="操作" align="center" width="180px">
					<template #default="scope">
						<div class="perate">
							<el-button
								text
								type="primary"
								:icon="Edit"
								@click="handleEditBtnClick(scope.row)"
								>编辑信息</el-button
							>
							<el-button
								text
								type="primary"
								:icon="Picture"
								@click="handleChangeImg(scope.row)"
								>更改照片</el-button
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
			:destroy-on-close="true"
			title="编辑用户"
			:width="500"
			center
			draggable
			@close="handleEditDialogClose"
		>
			<el-form
				:model="dialogForm"
				ref="dialogFormRef"
				label-position="left"
				label-width="70px"
				:rules="dialogFormRules"
			>
				<el-form-item label="用户ID:" prop="userId">
					<el-input v-model="dialogForm.userId" disabled />
				</el-form-item>
				<el-form-item label="姓名:" prop="name">
					<el-input v-model="dialogForm.name" clearable />
				</el-form-item>
				<el-form-item label="学号:" prop="schNo">
					<el-input v-model="dialogForm.schNo" clearable />
				</el-form-item>
				<el-form-item label="角色:" prop="role">
					<el-select v-model="dialogForm.role" style="width: 100%">
						<el-option label="学生" value="0" />
						<el-option label="老师" value="1" />
						<el-option label="其他" value="2" />
					</el-select>
				</el-form-item>
			</el-form>
			<template #footer>
				<div class="dialog-footer">
					<el-button @click="editDialogVisible = false">取 消</el-button>
					<el-button type="primary" @click="handleEditDialogConfirm()">
						确 定
					</el-button>
				</div>
			</template>
		</el-dialog>
		<!-- 修改用户人脸照片 -->
		<ChangeUserImg ref="changeUserImgDialogRef" />
		<!-- 导入用户excel -->
		<ImportUserExcel ref="importDialogRef" />
		<!-- 选择设备添加用户 -->
		<AddUserDialog ref="addUserDialogRef" />
		<!-- 删除用户对话框 -->
		<DeleteUserDialog ref="deleteUserDialogRef" />
		<!-- 删除班级下所有用户对话框 -->
		<DeleteUserByUnit ref="deleteUserByUnitRef" />
		<!-- 删除届下所有用户对话框 -->
		<DeleteUserBySession ref="deleteUserBySessionRef" />
	</div>
</template>

<script setup lang="ts">
import {
	Edit,
	Delete,
	Search,
	Picture,
	Download,
	Upload
} from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElNotification, ElMessage } from 'element-plus'
import type { User } from '@/global/user'
import { useDownload } from '@/hooks/useDownload'
import { useUnitManngerStore } from '@/stores/modules/unitMannger'
import { useUserManngerStore } from '@/stores/modules/userMannger'
import { useDeviceStore } from '@/stores/modules/device'
import { useGlobalStore } from '@/stores/modules/global'
import ChangeUserImg from '@/components/ChangeUserImg/index.vue'
import ImportUserExcel from '@/components/ImportUserExcel/index.vue'
import AddUserDialog from '@/components/AddUserDialog/index.vue'
import DeleteUserDialog from '@/components/DeleteUserDialog/index.vue'
import DeleteUserByUnit from '@/components/DeleteUserByUnit/index.vue'
import DeleteUserBySession from '@/components/DeleteUserBySession/index.vue'

// 图片测试
const imgUrl =
	'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg'

let srcList: string[] = [
	'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg'
]

const handleImgClick = (url: string) => {
	console.log(url)
	srcList = []
	srcList.push(url)
}

const userManngerStore = useUserManngerStore()
const unitManngerStore = useUnitManngerStore()
const deviceStore = useDeviceStore()
const globalStore = useGlobalStore()

const { classList } = storeToRefs(unitManngerStore)
const { userList, userTotal, defaultRole } = storeToRefs(userManngerStore)
const { lastDeviceId } = storeToRefs(globalStore)
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
	role: defaultRole,
	schNo: '',
	className: []
})

// 处理表单数据，发送请求
const comSearchForm = computed(() => {
	let { className, ...params } = searchForm
	className = className || []
	const unitsName = className.join('|')
	return {
		unitsName,
		...params
	}
})
// 进入页面获取所有用户列表
onMounted(() => {
	unitManngerStore.getUnitListAction()
	deviceStore.getAllDeviceInfoAction({})
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

// 编辑对话框Ref
const dialogFormRef = ref<FormInstance>()
/**
 * 是否显示编辑用户对话框
 */
const editDialogVisible = ref(false)
/**
 *	编辑表单数据
 */
const dialogForm = reactive<User.ReqEditUserInfo>({
	name: '',
	userId: 0,
	role: '',
	schNo: ''
})
let copyDialogForm: any = {}
// 编辑表单校验规则
const dialogFormRules: FormRules = {
	name: [
		{
			required: true,
			message: '请输入姓名',
			trigger: 'blur'
		}
	],
	schNo: [{ required: true, message: '请输入学号', trigger: 'blur' }],
	role: [{ required: true, message: '请选择角色', trigger: 'blur' }]
}
/**
 * 表格编辑按钮,打开编辑对话框
 * @param rowData 行内数据
 */
const handleEditBtnClick = (rowData: any) => {
	editDialogVisible.value = true
	// 1. 回显表格行内数据
	nextTick(() => {
		for (const key in dialogForm) {
			dialogForm[key] = rowData[key]
		}
	})
	// 深拷贝一份表格行内数据
	copyDialogForm = JSON.parse(JSON.stringify(rowData))
}

// 关闭对话框
const handleEditDialogClose = () => {
	if (!dialogFormRef.value) return
	dialogFormRef.value.resetFields()
	editDialogVisible.value = false
}

// 编辑对话框确认按钮
const handleEditDialogConfirm = async () => {
	// 判断表单数据是否发生变化
	const isChange = Object.keys(dialogForm).some(
		key => dialogForm[key] !== copyDialogForm[key]
	)
	// 如果没有发生变化，直接关闭对话框
	if (!isChange) {
		ElMessage.warning('您没有做任何修改')
		editDialogVisible.value = false
		return
	} else {
		try {
			await userManngerStore.editUserInfoAction(dialogForm)
			ElMessage.success('编辑成功')
		} finally {
			// 重置表单
			dialogFormRef.value?.resetFields()
			// 关闭对话框
			editDialogVisible.value = false
		}
	}
}

const deleteUserDialogRef = ref<InstanceType<typeof DeleteUserDialog> | null>(
	null
)

/**
 * 表格删除按钮
 * @param rowData 行内数据
 */
const handleDeleteBtnClick = (rowData: any) => {
	const params = {
		deviceNos: lastDeviceId.value,
		userIds: [rowData.userId]
	}
	deleteUserDialogRef.value?.acceptParams(params)
}

// 更改用户照片Ref
const changeUserImgDialogRef = ref<InstanceType<typeof ChangeUserImg> | null>(
	null
)
/**
 * 更改用户照片
 */
const handleChangeImg = (rowData: any) => {
	const params = {
		stuNo: rowData.schNo
	}
	changeUserImgDialogRef.value?.acceptParams(params, lastDeviceId.value)
}

// 导出用户数据
const downloadFile = async () => {
	ElMessageBox.confirm('确认导出用户数据?', '温馨提示', {
		type: 'warning'
	}).then(() =>
		useDownload(userManngerStore.exportUserInfoAction, '用户数据', 1)
	)
}

const importDialogRef = ref<InstanceType<typeof ImportUserExcel> | null>(null)
// 上传用户数据
const handleImportUserClick = () => {
	importDialogRef.value?.acceptParams(lastDeviceId.value)
}

const addUserDialogRef = ref<InstanceType<typeof AddUserDialog> | null>(null)

// 选择设备添加用户
const addUser = () => {
	addUserDialogRef.value?.acceptParams(lastDeviceId.value)
}
// 表格多选框数据
const selectUsers = ref<number[]>([])
// 表格多选框
const handleSelectionChange = (val: []) => {
	selectUsers.value = val.map((item: any) => item.userId)
}

// 选择设备删除用户
const deleteUser = async () => {
	if (selectUsers.value.length === 0) {
		ElNotification({
			title: '温馨提示',
			message: '请先选择用户！',
			type: 'warning'
		})
		return
	} else {
		const params = {
			deviceNos: lastDeviceId.value,
			userIds: selectUsers.value
		}
		deleteUserDialogRef.value?.acceptParams(params)
	}
}
const deleteUserByUnitRef = ref<InstanceType<typeof DeleteUserByUnit> | null>(
	null
)

// 删除单位所有用户
const deleteAllUserByUnit = () => {
	deleteUserByUnitRef.value?.acceptParams(lastDeviceId.value)
}

const deleteUserBySessionRef = ref<InstanceType<
	typeof DeleteUserBySession
> | null>(null)
// 删除某届所有学生
const deleteAllUserBySession = () => {
	deleteUserBySessionRef.value?.acceptParams(lastDeviceId.value)
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
	flex-direction: column;
	.el-button {
		margin-left: 0;
	}
}
</style>
