<script setup lang="ts">
import type { FormRules, FormInstance } from 'element-plus'
import { Plus, Delete, Download, Upload } from '@element-plus/icons-vue'
import { useUnitManngerStore } from '@/stores/modules/unitMannger'
import { useDownload } from '@/hooks/useDownload'
import type { dialogForm } from './Interface/form.d'
import { ElMessage } from 'element-plus'
import ImportExcel from '@/components/ImportExcel/index.vue'

const unitManngerStore = useUnitManngerStore()

const dialogVisible = ref(false)
const dialogFormRef = ref<FormInstance>()

// 添加单位对话框form表单数据
const dialogForm = ref<dialogForm>({
	name: '',
	parentId: 0,
	peoples: 0,
	children: []
})

// 添加单位对话框表单校验规则
const rules = reactive<FormRules>({
	name: [{ required: true, message: '请输入单位名称', trigger: 'blur' }],
	peoples: [{ required: true, message: '请输入单位人数', trigger: 'blur' }]
})

// 获取单位数据
onMounted(() => {
	unitManngerStore.getUnitListAction()
})
// 导出单位数据按钮回调
const exportUnitsByExce = () => {
	useDownload(unitManngerStore.exportUnitsByExcelAction, '班级信息')
}
// 删除单位按钮回调
const handleDeleteBtnClick = async (unitsId: number) => {
	await unitManngerStore.deleteUnitsAction(unitsId)
	ElMessage.success('删除成功')
	await unitManngerStore.getUnitListAction()
}
// 添加单位按钮回调
const handleAddBtnClick = (parent: any) => {
	dialogForm.value.parentId = parent.unitsId
	dialogVisible.value = true
	const { code } = parent
	const arr = code.split('.')
}
// 添加对话框确认按钮回调
const handleConfirmBtnClick = async (formEl: FormInstance | undefined) => {
	if (!formEl) return
	await formEl.validate(async valid => {
		if (valid) {
			await unitManngerStore.addUnitsAction(dialogForm.value)
			dialogVisible.value = false
			dialogFormRef.value?.resetFields()
			ElMessage.success('添加成功')
			await unitManngerStore.getUnitListAction()
		}
	})
}
// 对话框关闭回调
const handleDialogClose = () => {
	dialogVisible.value = false
	dialogFormRef.value?.resetFields()
}

// 批量添加单位
const importDialogRef = ref<InstanceType<typeof ImportExcel> | null>(null)
const handleImportUnitsBtnClick = () => {
	const params = {
		title: '单位',
		importApi: unitManngerStore.importUnitByExcelAction,
		getTableList: unitManngerStore.getUnitListAction
	}
	importDialogRef.value?.acceptParams(params)
}
</script>

<template>
	<div class="table-box">
		<!-- 表格及导入导出按钮 -->
		<div class="card table-main">
			<!-- 导入导出按钮 -->
			<div class="table-header">
				<div class="header-button-lf">
					<el-button type="primary" :icon="Download" @click="exportUnitsByExce"
						>导出单位数据</el-button
					>
					<el-button
						type="primary"
						:icon="Upload"
						@click="handleImportUnitsBtnClick"
						>导入单位数据</el-button
					>
				</div>
			</div>
			<!-- 表格 -->
			<el-table
				:data="unitManngerStore.classList"
				style="width: 100%"
				row-key="unitsId"
				border
				lazy
			>
				<el-table-column prop="name" label="名称"> </el-table-column>
				<el-table-column prop="peoples" label="人数" align="center">
				</el-table-column>
				<el-table-column label="操作" align="center">
					<template #default="scope">
						<div class="perate">
							<el-button
								text
								type="primary"
								:icon="Plus"
								@click="handleAddBtnClick(scope.row)"
								>添加单位</el-button
							>
							<el-popconfirm
								title="是否删除该单位?"
								icon-color="#ff4949"
								icon="WarnTriangleFilled"
								@confirm="handleDeleteBtnClick(scope.row.unitsId)"
							>
								<template #reference>
									<el-button text type="primary" :icon="Delete"
										>删除单位</el-button
									>
								</template>
							</el-popconfirm>
						</div>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<!-- 添加单位对话框 -->
		<el-dialog
			class="dialogBox"
			v-model="dialogVisible"
			title="添加单位"
			:width="500"
			center
			@closed="handleDialogClose"
		>
			<el-form
				:model="dialogForm"
				ref="dialogFormRef"
				label-position="left"
				label-width="95px"
				:rules="rules"
			>
				<el-form-item label="单位名称：" prop="name">
					<el-input
						v-model="dialogForm.name"
						placeholder="请输入单位名称"
					></el-input>
				</el-form-item>
				<el-form-item label="单位人数：" prop="peoples">
					<el-input
						v-model.number="dialogForm.peoples"
						placeholder="请输入单位人数"
					></el-input>
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
		<ImportExcel ref="importDialogRef" />
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
