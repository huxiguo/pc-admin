<template>
	<template v-for="subItem in menuList" :key="subItem.id">
		<el-sub-menu v-if="subItem.children?.length" :index="subItem.path">
			<template #title>
				<el-icon>
					<component :is="subItem.icon"></component>
				</el-icon>
				<span class="sle">{{ subItem.title }}</span>
			</template>
			<SubMenu :menuList="subItem.children" />
		</el-sub-menu>
		<el-menu-item v-else :index="subItem.path">
			<el-icon>
				<component :is="subItem.icon"></component>
			</el-icon>
			<template #title>
				<span class="sle">{{ subItem.title }}</span>
			</template>
		</el-menu-item>
	</template>
</template>

<script setup lang="ts">
interface Props {
	id?: number
	name?: string
	title?: string
	path?: any
	perms?: any
	component?: any
	icon?: any
	createTime?: string
	parentId?: any
	status?: string
	children?: Props[]
}
defineProps<{ menuList: Props[] }>()
</script>

<style lang="scss">
.el-sub-menu .el-sub-menu__title:hover {
	color: #333333 !important;
	background-color: #e9f7ef !important;
}
.el-menu--collapse {
	.is-active {
		.el-sub-menu__title {
			color: #27ae60 !important;
			background-color: #e1ffee !important;
		}
	}
}
.el-menu-item {
	&:hover {
		color: #333333;
		background-color: #e9f7ef !important;
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
