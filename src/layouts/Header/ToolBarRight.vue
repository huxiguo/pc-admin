<template>
	<div class="tool-bar-ri">
		<span class="username">{{ username }}</span>
		<Avatar />
	</div>
</template>

<script setup lang="ts">
import Avatar from './components/Avatar.vue'
import { useUserStore } from '@/stores/modules/user'
const userStore = useUserStore()
const username = computed(() => userStore.userInfo.username)
</script>

<style scoped lang="scss">
.tool-bar-ri {
	display: flex;
	align-items: center;
	justify-content: center;
	padding-right: 25px;
	.header-icon {
		display: flex;
		align-items: center;
		& > * {
			margin-left: 21px;
		}
	}
	.username {
		margin: 0 20px;
		font-size: 15px;
	}
}
</style>
