<template>
	<div class="card content-box">
		<span>{{ count }}</span>
		<button @click="handleAdd">+1</button>
	</div>
</template>

<script setup lang="ts">
const count = ref(0)
const handleAdd = () => {
	count.value++
}
</script>

<style scoped lang="scss"></style>
