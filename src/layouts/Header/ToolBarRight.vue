<template>
	<div class="tool-bar-ri">
		<span class="username">{{ username }}</span>
		<Avatar />
	</div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/modules/user'
import Avatar from './components/Avatar.vue'

const userStore = useUserStore()
const username = computed(() => userStore.userInfo.name)
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
