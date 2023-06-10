<script setup lang="ts">
import type { FormRules, FormInstance } from 'element-plus'
import { Edit, Delete, Search } from '@element-plus/icons-vue'
import { useViewerStore } from '@/stores/modules/viewer'
import type { searchForm, dialogForm } from './Interface/form'

const viewerStore = useViewerStore()

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
						<img :src="row.avatar" alt="" />
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
					<template #default="scope">
						<div class="perate">
							<el-button text type="primary" :icon="Edit">编辑</el-button>
							<el-popconfirm
								title="是否删除该设备?"
								icon-color="#ff4949"
								icon="WarnTriangleFilled"
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
	.el-button {
		padding: 0;
	}
}
</style>
