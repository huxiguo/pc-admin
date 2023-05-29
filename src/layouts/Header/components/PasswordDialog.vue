<template>
	<el-dialog v-model="dialogVisible" title="修改密码" width="500px" draggable>
		<span>This is Password</span>
	</el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const dialogVisible = ref(false)
const openDialog = () => {
	dialogVisible.value = true
}

defineExpose({ openDialog })
</script>
