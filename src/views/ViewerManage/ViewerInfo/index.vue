<script setup lang="ts">
// 搜索栏表单数据
const searchForm = ref({
	isEnable: '',
	nickName: '',
	openId: '',
	password: ''
})
</script>

<template>
	<div class="table-box">
		<div class="card table-search"></div>
		<div class="card table-main"></div>
	</div>
</template>
