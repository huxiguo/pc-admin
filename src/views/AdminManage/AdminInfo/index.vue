<script setup lang="ts">
import type { FormRules, FormInstance } from 'element-plus'
import { Edit, Delete, Plus, Key } from '@element-plus/icons-vue'
import { useAdminStore } from '@/stores/modules/admin'
import { useMenuStore } from '@/stores/modules/menu'
import type { dialogForm, admin } from './Interface/form'
import { ElMessage, ElTable } from 'element-plus'

const adminStore = useAdminStore()
const menuStore = useMenuStore()

const menuTreeRef = ref()
// 编辑权限树形控件props配置项
const props = {
	label: 'title',
	children: ''
}

// 分页器数据
const currentPage = ref(1)
const pageSize = ref(10)
/*
 * 分页大小改变回调
 */
const handleSizeChange = (newSize: number) => {
	adminStore.getAllAdminAction(currentPage.value, newSize)
}
/*
 * 页码改变回调
 */
const handleCurrentChange = (newPage: number) => {
	adminStore.getAllAdminAction(newPage, pageSize.value)
}

// 表单验证规则
const rules = reactive<FormRules>({
	name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
	address: [{ required: true, message: '请输入地址', trigger: 'blur' }],
	telephone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
	password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
	username: [{ required: true, message: '请输入用户名', trigger: 'blur' }]
})

// 获取表格数据
onMounted(async () => {
	await adminStore.getAllAdminAction(currentPage.value, pageSize.value)
	await menuStore.getAllMenuAction()
})

// 编辑框的类型（添加和编辑）
const dialogType = ref('')
/**
 * 是否显示编辑用户对话框
 */
const dialogVisible = ref(false)
// 添加管理员、编辑管理员信息表单数据
const dialogForm = ref<dialogForm>({
	name: '',
	telephone: '',
	address: '',
	password: '',
	username: '',
	avatar: '',
	id: 0
})
// 当前选中的管理员的权限
const selectAdminMenu = ref()

/*
 * 添加管理员按钮回调
 */
const handleAddBtnClick = () => {
	dialogType.value = 'addAdmin'
	dialogVisible.value = true
}
// 选中禁用的管理员按钮的回调
const handleSelectDisableClick = () => {
	multipleTableRef.value!.clearSelection()
	adminStore.adminList.forEach((item: admin) => {
		if (item.enabled === 0) {
			multipleTableRef.value!.toggleRowSelection(item, true)
		}
	})
}
// 选中可用的管理员按钮的回调
const handleSelectAbleClick = () => {
	multipleTableRef.value!.clearSelection()
	adminStore.adminList.forEach((item: admin) => {
		if (item.enabled === 1) {
			multipleTableRef.value!.toggleRowSelection(item, true)
		}
	})
}
// 取消选中按钮的回调
const handleCancelSelectClick = () => {
	multipleTableRef.value!.clearSelection()
}
// 批量删除管理员按钮的回调
const handleBatchDeleteClick = async () => {
	let arr: string[] = []
	multipleSelection.value.forEach((item: admin) => {
		arr.push(item.id)
	})
	await adminStore.deleteAdminAction(arr)
	await adminStore.getAllAdminAction(currentPage.value, pageSize.value)
	ElMessage({
		message: '删除成功',
		type: 'success'
	})
}

// table表格元素节点
const multipleTableRef = ref<InstanceType<typeof ElTable>>()
// table表格多选框数据
const multipleSelection = ref<admin[]>([])
// 存储表格选中的数据
const handleSelectionChange = (val: admin[]) => {
	multipleSelection.value = val
}
/**
 * 表格编辑管理员信息按钮
 * @param rowData 行内数据
 */
const handleEditInfoBtnClick = (rowData: any) => {
	dialogType.value = 'editAdminInfo'
	dialogVisible.value = true
	nextTick(() => {
		dialogForm.value = JSON.parse(JSON.stringify(rowData))
	})
}
// 表格删除按钮回调
const handleDeleteBtnClick = async (id: string) => {
	let arr = []
	arr.push(id)
	await adminStore.deleteAdminAction(arr)
	await adminStore.getAllAdminAction(currentPage.value, pageSize.value)
	ElMessage({
		message: '删除成功',
		type: 'success'
	})
}
// 编辑管理员权限按钮回调
const handleEditMenuBtnClick = async (rowData: any) => {
	const { id } = rowData
	dialogForm.value.id = id
	const data = await adminStore.getAdminMenusAction(id)
	selectAdminMenu.value = data.map((item: any) => {
		return item.id
	})
	dialogType.value = 'editAdminMenu'
	dialogVisible.value = true
}

const dialogFormRef = ref<FormInstance>()
/*
 * 对话框关闭回调
 */
const handleEditClose = () => {
	dialogVisible.value = false
	nextTick(() => {
		dialogType.value = ''
		dialogFormRef.value?.resetFields()
	})
}
// /*
//  * 对话框确认按钮回调
//  */
const handleConfirmClick = async (formEl: FormInstance | undefined) => {
	if (dialogType.value === 'editAdminMenu') {
		const data = menuTreeRef.value.getCheckedNodes().map((item: any) => {
			return item.id
		})
		let addIds: number[] = data.filter(
			(id: number) => selectAdminMenu.value.indexOf(id) === -1
		)
		let deleteIds: number[] = selectAdminMenu.value.filter(
			(id: number) => data.indexOf(id) === -1
		)
		if (addIds.length > 0) {
			await adminStore.addAdminMenuAction(dialogForm.value.id, data)
		}
		if (deleteIds.length > 0) {
			await adminStore.deleteAdminMenuAction(dialogForm.value.id, deleteIds)
		}
		ElMessage({
			message: '编辑成功',
			type: 'success'
		})
		dialogVisible.value = false
	} else {
		if (!formEl) return
		await formEl.validate(async valid => {
			if (valid) {
				if (dialogType.value === 'addAdmin') {
					await adminStore.addAdminAction(dialogForm.value)
					dialogVisible.value = false
					dialogFormRef.value?.resetFields()
					await adminStore.getAllAdminAction(currentPage.value, pageSize.value)
					ElMessage({
						message: '添加成功',
						type: 'success'
					})
				} else if (dialogType.value === 'editAdminInfo') {
					await adminStore.editAdminAction(dialogForm.value)
					dialogVisible.value = false
					dialogFormRef.value?.resetFields()
					await adminStore.getAllAdminAction(currentPage.value, pageSize.value)
					ElMessage({
						message: '编辑成功',
						type: 'success'
					})
				}
			}
		})
	}
}
</script>

<template>
	<div class="table-box">
		<div class="card table-main">
			<div class="table-header">
				<div class="header-button-lf">
					<el-button type="primary" :icon="Plus" @click="handleAddBtnClick"
						>添加管理员</el-button
					>
					<el-button @click="handleSelectDisableClick"
						>选中禁用的管理员</el-button
					>
					<el-button @click="handleSelectAbleClick">选中可用的管理员</el-button>
					<el-button @click="handleCancelSelectClick">取消选中</el-button>
					<el-button
						type="danger"
						:disabled="multipleSelection.length === 0"
						@click="handleBatchDeleteClick"
						>批量删除</el-button
					>
				</div>
			</div>
			<!-- 数据表格 -->
			<el-table
				:data="adminStore.adminList"
				border
				style="width: 100%"
				@selection-change="handleSelectionChange"
				ref="multipleTableRef"
			>
				<!-- 选择框 -->
				<el-table-column type="selection" width="55" align="center" />
				<!-- 索引 -->
				<el-table-column type="index" label="#" width="50" align="center" />
				<!-- 姓名 -->
				<el-table-column prop="name" label="姓名" width="180" align="center" />
				<!-- 用户名 -->
				<el-table-column
					prop="username"
					label="用户名"
					width="180"
					align="center"
				/>

				<!-- 联系电话 -->
				<el-table-column
					prop="telephone"
					label="联系电话"
					align="center"
					width="120"
				/>
				<!-- 状态 -->
				<el-table-column label="状态" width="70" align="center">
					<template #default="{ row }">
						<el-tag type="success" v-if="row.enabled === 1">可用</el-tag>
						<el-tag v-else>禁用</el-tag>
					</template>
				</el-table-column>
				<!-- 头像 -->
				<el-table-column label="头像" width="250" align="center">
					<template #default="{ row }">
						<el-image
							:src="row.avatar"
							:preview-src-list="[row.avatar]"
							style="width: 80px"
							hide-on-click-modal
							close-on-press-escape
							preview-teleported
							:z-index="9999"
							fit="cover"
						/>
					</template>
				</el-table-column>
				<!-- 操作 -->
				<el-table-column label="操作" align="center">
					<template #default="scope">
						<div class="perate">
							<el-button
								text
								type="primary"
								:icon="Key"
								@click="handleEditMenuBtnClick(scope.row)"
								>编辑管理员权限</el-button
							>
							<el-button
								text
								type="primary"
								:icon="Edit"
								@click="handleEditInfoBtnClick(scope.row)"
								>编辑管理员信息</el-button
							>
							<el-popconfirm
								title="是否删除该设备?"
								icon-color="#ff4949"
								icon="WarnTriangleFilled"
								@confirm="handleDeleteBtnClick(scope.row.id)"
							>
								<template #reference>
									<el-button text type="primary" :icon="Delete">删除</el-button>
								</template>
							</el-popconfirm>
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
				:total="adminStore.total"
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
			/>
		</div>
		<!-- 编辑、添加对话框 -->
		<el-dialog
			class="dialogBox"
			:model-value="dialogVisible"
			:title="
				dialogType === 'addAdmin'
					? '添加管理员'
					: dialogType === 'editAdminInfo'
					? '编辑管理员信息'
					: '编辑管理员权限'
			"
			:width="500"
			center
			@closed="handleEditClose"
		>
			<!-- 编辑管理员信息、添加管理员表单 -->
			<el-form
				:model="dialogForm"
				label-position="left"
				label-width="95px"
				ref="dialogFormRef"
				:rules="rules"
				v-if="dialogType !== 'editAdminMenu'"
			>
				<el-form-item label="姓名：" prop="name">
					<el-input v-model="dialogForm.name" placeholder="请输入姓名" />
				</el-form-item>
				<el-form-item label="用户名：" prop="username">
					<el-input
						v-model.number="dialogForm.username"
						placeholder="请输入用户名"
					/>
				</el-form-item>
				<el-form-item label="联系电话：" prop="telephone">
					<el-input
						v-model="dialogForm.telephone"
						placeholder="请输入联系电话"
					/>
				</el-form-item>
				<el-form-item label="地址：" prop="address">
					<el-input
						v-model.number="dialogForm.address"
						placeholder="请输入地址"
					/>
				</el-form-item>
				<el-form-item label="密码：" prop="password">
					<el-input
						v-model.number="dialogForm.password"
						placeholder="请输入密码"
					/>
				</el-form-item>
			</el-form>
			<!-- 编辑管理员权限表单 -->
			<template v-else
				><el-tree
					ref="menuTreeRef"
					:data="menuStore.menuList"
					:props="props"
					show-checkbox
					node-key="id"
					:default-checked-keys="selectAdminMenu"
				/>
			</template>
			<template #footer>
				<div class="dialog-footer">
					<el-button @click="dialogVisible = false">取消</el-button>
					<el-button type="primary" @click="handleConfirmClick(dialogFormRef)">
						{{ dialogType === 'add' ? '添加' : '保存' }}
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
	flex-direction: column;
	.el-button {
		margin-left: 0;
	}
}
</style>
