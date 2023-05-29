<template>
	<div class="table-box">
		<div class="card table-search">
			<el-form>
				<!-- 第一行 -->
				<el-row :gutter="20" class="row-first">
					<el-col :span="6">
						<el-form-item label="姓名:">
							<el-input />
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="班级:">
							<el-input />
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="学院:">
							<el-input />
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="进出:">
							<el-input />
						</el-form-item>
					</el-col>
				</el-row>
				<!-- 第二行 -->
				<el-row :gutter="20">
					<el-col :span="6">
						<el-form-item label="日期:">
							<el-input />
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="地点:">
							<el-input />
						</el-form-item>
					</el-col>
					<el-col :span="6" :offset="6">
						<div class="operation">
							<el-button :icon="Search" class="searchBtn">查询</el-button>
							<el-button :icon="Delete" class="resetBtn">重置</el-button>
						</div>
					</el-col>
				</el-row>
			</el-form>
		</div>
		<div class="card table-main">
			table
			<h2>1</h2>
			<h2>1</h2>
			<h2>1</h2>
			<h2>1</h2>
		</div>
	</div>
</template>

<script setup lang="ts">
import { Delete, Search } from '@element-plus/icons-vue'
// const searchForm = reactive<ElForm>({})
</script>

<style scoped lang="scss">
.row-first {
	margin-bottom: 10px;
}
.el-input {
	--el-input-focus-border-color: #27ae60;
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
</style>
