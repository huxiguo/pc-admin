<script setup lang="ts">
import type { FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'
import { Edit, Delete, Search, View } from '@element-plus/icons-vue'
import { useViewerStore } from '@/stores/modules/viewer'
import type { searchForm, addUserDialogForm } from './Interface/form'

const viewerStore = useViewerStore()

const dialogVisible = ref(false)

// 添加被监视人对话框表单数据
const addUserDialogForm = ref<addUserDialogForm>({
	id: 0,
	viewId: 0,
	userId: 0
})

// 分页器数据
const currentPage = ref(1)
const pageSize = ref(10)

const searchFormRef = ref<FormInstance>()
// 搜索栏表单数据
const searchForm = ref<searchForm>({
	avatar: '',
	isEnable: '',
	nickname: '',
	openId: '',
	password: '',
	role: '',
	telephone: '',
	viewId: 0
})
// 状态选择器数据
const statusSelectData = ref([
	{
		value: '0',
		label: '禁用'
	},
	{
		value: '1',
		label: '启用'
	}
])
// 身份选择器数据
const roleSelectData = ref([
	{
		value: '0',
		label: '家长'
	},
	{
		value: '1',
		label: '老师'
	}
])
// 搜索栏重置按钮回调
const handleResetBtnClick = () => {
	searchFormRef.value?.resetFields()
	viewerStore.getAllViewerAction(
		searchForm.value,
		currentPage.value,
		pageSize.value
	)
}
// 搜索栏搜索按钮回调
const handleSearchBtnClick = () => {
	currentPage.value = 1
	viewerStore.getAllViewerAction(
		searchForm.value,
		currentPage.value,
		pageSize.value
	)
}

// 获取监视人表格数据
onActivated(() => {
	viewerStore.getAllViewerAction(
		searchForm.value,
		currentPage.value,
		pageSize.value
	)
})

// 删除监视人按钮回调
const handleDeleteClick = async (id: number) => {
	await viewerStore.deleteViewerAction([id])
	ElMessage.success('删除成功')
	await viewerStore.getAllViewerAction(
		searchForm.value,
		currentPage.value,
		pageSize.value
	)
}

// 点击设置被监视人按钮的回调
const handleAddBeUserClick = (viewer: any) => {
	dialogVisible.value = true
	console.log(viewer)
	// addUserDialogForm.viewId=viewer.viewId
	// addUserDialogForm.id = viewer.
}
</script>

<template>
	<div class="table-box">
		<!-- 搜索表单 -->
		<div class="card table-search">
			<el-form :model="searchForm" ref="searchFormRef">
				<!-- 第一行 -->
				<el-row :gutter="20" class="row-first">
					<el-col :span="6">
						<el-form-item label="序列号:" prop="viewId">
							<el-input
								v-model.number="searchForm.viewId"
								placeholder="请输入序列号"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="昵称:" prop="nickname">
							<el-input
								v-model="searchForm.nickname"
								placeholder="请输入昵称"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="微信个人号:" prop="openId">
							<el-input
								v-model.number="searchForm.openId"
								placeholder="请输入微信个人号"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="联系电话:" prop="telephone">
							<el-input
								v-model="searchForm.telephone"
								placeholder="请输入联系电话"
							/>
						</el-form-item>
					</el-col>
				</el-row>
				<!-- 第二行 -->
				<el-row :gutter="20">
					<el-col :span="6">
						<el-form-item label="身份:" prop="type"
							><el-select v-model="searchForm.role" placeholder="请选择身份">
								<el-option
									v-for="item in roleSelectData"
									:key="item.value"
									:label="item.label"
									:value="item.value"
								/>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="类型:" prop="isEnable"
							><el-select
								v-model="searchForm.isEnable"
								placeholder="请选择状态"
							>
								<el-option
									v-for="item in statusSelectData"
									:key="item.value"
									:label="item.label"
									:value="item.value"
								/>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
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
								@click="handleResetBtnClick"
							>
								重置
							</el-button>
							<el-button>添加监视人</el-button>
						</div>
					</el-col></el-row
				>
			</el-form>
		</div>
		<div class="card table-main">
			<el-table :data="viewerStore.viewerList" border style="width: 100%">
				<!-- 索引 -->
				<el-table-column type="index" label="#" width="50" align="center" />
				<!-- 昵称 -->
				<el-table-column
					prop="nickname"
					label="昵称"
					width="180"
					align="center"
				/>
				<!-- 序列号 -->
				<el-table-column
					prop="viewId"
					label="序列号"
					width="180"
					align="center"
				/>
				<!-- 微信个人号 -->
				<el-table-column
					prop="openId"
					label="微信个人号"
					width="180"
					align="center"
				/>
				<!-- 头像 -->
				<el-table-column label="头像" width="180" align="center">
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
				<!-- 联系电话 -->
				<el-table-column
					prop="telephone"
					label="联系电话"
					width="180"
					align="center"
				/>
				<!-- 身份 -->
				<el-table-column label="身份" width="70" align="center">
					<template #default="{ row }">
						<el-tag type="success" v-if="row.role === '1'">老师</el-tag>
						<el-tag v-else>家长</el-tag>
					</template>
				</el-table-column>
				<!-- 状态 -->
				<el-table-column label="状态" width="70" align="center">
					<template #default="{ row }">
						<el-tag type="success" v-if="row.role === '1'">启用</el-tag>
						<el-tag v-else>禁用</el-tag>
					</template>
				</el-table-column>
				<!-- 操作 -->
				<el-table-column label="操作" align="center" width="180px">
					<template #default="{ row }">
						<div class="perate">
							<el-button text type="primary" :icon="Edit">编辑</el-button>
							<el-button
								text
								type="primary"
								:icon="View"
								@click="handleAddBeUserClick(row)"
								>设置被监视人</el-button
							>
							<el-popconfirm
								title="是否删除该监视人?"
								icon-color="#ff4949"
								icon="WarnTriangleFilled"
								@confirm="handleDeleteClick(row.viewId)"
							>
								<template #reference>
									<el-button text type="primary" :icon="Delete">删除</el-button>
								</template>
							</el-popconfirm>
						</div>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<!-- 设置被监视人对话框 -->
		<el-dialog
			v-model="dialogVisible"
			title="设置被监视人"
			width="30%"
			class="dialogBox"
			center
		>
			<el-form :model="addUserDialogForm">
				<el-form-item label="请输入被监视人的id：">
					<el-input
						v-model="addUserDialogForm.userId"
						placeholder="请输入被监视人id"
					></el-input>
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="dialogVisible = false">取消</el-button>
					<el-button type="primary" @click="dialogVisible = false">
						确定
					</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<style lang="scss" scoped>
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
