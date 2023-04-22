<template>
	<el-menu-item index="index">
		<el-icon>
			<Setting />
		</el-icon>
		<template #title>
			<span class="sle">{{ '首页' }}</span>
		</template>
	</el-menu-item>
	<el-menu-item index="user">
		<el-icon>
			<Setting />
		</el-icon>
		<template #title>
			<span class="sle">{{ '用户管理' }}</span>
		</template>
	</el-menu-item>
	<el-menu-item index="record">
		<el-icon>
			<Setting />
		</el-icon>
		<template #title>
			<span class="sle">{{ '打卡记录' }}</span>
		</template>
	</el-menu-item>
	<el-menu-item index="class">
		<el-icon>
			<Setting />
		</el-icon>
		<template #title>
			<span class="sle">{{ '班级管理' }}</span>
		</template>
	</el-menu-item>
	<el-menu-item index="college">
		<el-icon>
			<Setting />
		</el-icon>
		<template #title>
			<span class="sle">{{ '院系管理' }}</span>
		</template>
	</el-menu-item>
</template>

<script setup lang="ts"></script>

<style lang="scss">
.el-sub-menu .el-sub-menu__title:hover {
	color: #333333 !important;
	background-color: #cccccc !important;
}
.el-menu--collapse {
	.is-active {
		.el-sub-menu__title {
			color: #27ae60 !important;
			background-color: #101111 !important;
		}
	}
}
.el-menu-item {
	&:hover {
		color: #333333;
		background-color: #cccccc !important;
	}
	&.is-active {
		color: #27ae60 !important;
		background-color: #e9f7ef !important;
		&::before {
			position: absolute;
			left: 0;
			top: 0;
			bottom: 0;
			width: 4px;
			content: '';
			background-color: #27ae60;
		}
	}
}
</style>
