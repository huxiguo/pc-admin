<template>
	<div>
		main
		<el-button @click="router.back()">Default</el-button>
	</div>
</template>

<script setup lang="ts">
const router = useRouter()
</script>

<style scoped lang="less"></style>
