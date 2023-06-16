<script setup lang="ts">
import { useMenuStore } from '@/stores/modules/menu'
import { Plus, Delete, Download, Upload } from '@element-plus/icons-vue'
import type { FormRules, FormInstance } from 'element-plus'
import type { dialogForm } from './Interface/form.d'
import { ElMessage } from 'element-plus'
import IconSelector from '@/components/IconSelector/index.vue'

const menuStore = useMenuStore()

const dialogVisible = ref(false)
const dialogFormRef = ref<FormInstance>()

// 添加菜单对话框form表单数据
const dialogForm = ref<dialogForm>({
	name: '',
	parentId: 0,
	title: '',
	icon: '',
	path: ''
})
// 对话框类型（主菜单或子菜单）
const dialogType = ref('')

// 添加单位对话框表单校验规则
const rules = reactive<FormRules>({
	name: [{ required: true, message: '请输入组件名', trigger: 'blur' }],
	title: [{ required: true, message: '请输入菜单名', trigger: 'blur' }],
	path: [{ required: true, message: '请输入路由地址', trigger: 'blur' }]
})

// 获取单位数据
onActivated(() => {
	menuStore.getAllMenuAction()
})

// 添加菜单按钮回调（表格顶部和表格内部共用）
const handleAddMenuClick = (type: string, parentId: number = 0) => {
	dialogType.value = type
	dialogVisible.value = true
	if (type === 'childMenu') {
		dialogForm.value.parentId = parentId
	}
}

// 删除单位按钮回调
const handleDeleteBtnClick = async (menuId: number) => {
	await menuStore.deleteMenuAction(menuId)
	ElMessage.success('删除成功')
	await menuStore.getAllMenuAction()
}
// 添加对话框确认按钮回调
const handleConfirmBtnClick = async (formEl: FormInstance | undefined) => {
	if (!formEl) return
	await formEl.validate(async valid => {
		if (valid) {
			if (dialogType.value === 'menu') {
				await menuStore.addMenuAction(dialogForm.value)
			} else if (dialogType.value === 'childMenu') {
				await menuStore.addChildMenuAction(
					dialogForm.value.parentId,
					dialogForm.value
				)
			}
			await menuStore.getAllMenuAction()
			dialogVisible.value = false
			dialogFormRef.value?.resetFields()
			ElMessage.success('添加成功')
		}
	})
}
// 对话框关闭回调
const handleDialogClose = () => {
	dialogVisible.value = false
	dialogFormRef.value?.resetFields()
}
</script>

<template>
	<div class="table-box">
		<!-- 表格及导入导出按钮 -->
		<div class="card table-main">
			<!-- 导入导出按钮 -->
			<div class="table-header">
				<div class="header-button-lf">
					<el-button
						type="primary"
						:icon="Plus"
						@click="handleAddMenuClick('menu')"
						>添加主菜单</el-button
					>
				</div>
			</div>
			<!-- 表格 -->
			<el-table
				:data="menuStore.menuList"
				style="width: 100%"
				row-key="id"
				border
				lazy
			>
				<el-table-column prop="title" label="菜单名"> </el-table-column>
				<el-table-column prop="name" label="组件名" align="center">
				</el-table-column>
				<el-table-column prop="path" label="路由地址" align="center">
				</el-table-column>
				<el-table-column label="操作" align="center">
					<template #default="scope">
						<div class="perate">
							<el-button
								text
								type="primary"
								:icon="Plus"
								v-if="!scope.row.parentId"
								@click="handleAddMenuClick('childMenu', scope.row.id)"
								>添加子菜单</el-button
							>
							<el-popconfirm
								title="是否删除该菜单?"
								icon-color="#ff4949"
								icon="WarnTriangleFilled"
								@confirm="handleDeleteBtnClick(scope.row.id)"
							>
								<template #reference>
									<el-button text type="primary" :icon="Delete"
										>删除菜单</el-button
									>
								</template>
							</el-popconfirm>
						</div>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<!-- 添加菜单对话框 -->
		<el-dialog
			class="dialogBox"
			v-model="dialogVisible"
			:title="dialogType === 'menu' ? '添加主菜单' : '添加子菜单'"
			:width="500"
			center
			@closed="handleDialogClose"
		>
			<el-form
				:model="dialogForm"
				ref="dialogFormRef"
				label-position="right"
				label-width="95px"
				:rules="rules"
			>
				<el-form-item label="菜单名：" prop="title">
					<el-input
						v-model="dialogForm.title"
						placeholder="请输入菜单名"
					></el-input>
				</el-form-item>
				<el-form-item label="组件名：" prop="name">
					<el-input
						v-model.number="dialogForm.name"
						placeholder="请输入组件名"
					></el-input>
				</el-form-item>
				<el-form-item label="路由地址：" prop="path">
					<el-input
						v-model.number="dialogForm.path"
						placeholder="请输入路由地址"
					></el-input>
				</el-form-item>
				<el-form-item label="图标：" prop="icon">
					<IconSelector v-model="dialogForm.icon"></IconSelector>
				</el-form-item>
			</el-form>
			<template #footer>
				<div class="dialog-footer">
					<el-button @click="handleDialogClose">取 消</el-button>
					<el-button
						type="primary"
						@click="handleConfirmBtnClick(dialogFormRef)"
					>
						确 定
					</el-button>
				</div>
			</template>
		</el-dialog>
	</div>
</template>

<style lang="scss" scoped>
.perate {
	display: flex;
	justify-content: center;
	.el-button {
		margin-left: 0;
	}
}

.header-button-lf {
	display: flex;
	:nth-child(2) {
		margin-left: 12px;
	}
}
</style>
