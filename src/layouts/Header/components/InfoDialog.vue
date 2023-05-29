<template>
	<el-dialog v-model="dialogVisible" title="个人信息" width="500px" draggable>
		<el-descriptions direction="horizontal" :column="1" border>
			<el-descriptions-item label="用户名">
				{{ info.username }}
			</el-descriptions-item>
			<el-descriptions-item label="手机号">
				{{ info.telephone }}
			</el-descriptions-item>
			<el-descriptions-item label="地址" :span="2">
				{{ info.address }}
			</el-descriptions-item>
			<el-descriptions-item label="禁用">
				<el-tag size="small" v-if="info.enabled">启用</el-tag>
				<el-tag size="small" type="danger" v-else>禁用</el-tag>
			</el-descriptions-item>
		</el-descriptions>
	</el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
interface Props {
	info: {
		id?: number
		username?: string
		password?: any
		telephone?: string
		address?: string
		enabled?: number
		name?: string
		avatar?: string
	}
}
defineProps<Props>()

const dialogVisible = ref(false)
const openDialog = () => {
	dialogVisible.value = true
}

defineExpose({ openDialog })
</script>
