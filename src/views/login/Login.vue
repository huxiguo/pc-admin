<template>
	<div>
		login
		<div>
			<el-row class="mb-4">
				<el-button @click="handle">Default</el-button>
				<el-button type="primary">{{ token }}</el-button>
				<el-button type="success">Success</el-button>
				<el-button type="info">Info</el-button>
				<el-button type="warning">Warning</el-button>
				<el-button @click="router.push('/main')" type="danger"
					>Danger</el-button
				>
			</el-row>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/modules/user'

const router = useRouter()
const userStore = useUserStore()

const { token } = storeToRefs(userStore)

const handle = () => {
	userStore.getTestData()
}
</script>

<style scoped lang="less"></style>
