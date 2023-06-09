<script setup lang="ts">
import type { UploadInstance, FormInstance, FormRules } from 'element-plus'
import { Link, Picture } from '@element-plus/icons-vue'
import { ElNotification } from 'element-plus'
import type { UploadRequestOptions, UploadRawFile } from 'element-plus'
import type { File } from '@/global/File'
import { useDeviceStore } from '@/stores/modules/device'
import { useUserManngerStore } from '@/stores/modules/userMannger'
import { useGlobalStore } from '@/stores/modules/global'

const deviceStore = useDeviceStore()
const { total, deviceList } = storeToRefs(deviceStore)

const userManngerStore = useUserManngerStore()

const globalStore = useGlobalStore()

export interface ImgParameterProps {
	fileType?: File.ExcelMimeType[] // 上传文件的类型
	importApi?: (params: any) => Promise<any> // 上传文件的Api
	getTableList?: () => void // 获取表格数据的Api
}

// 设备表单ref
const step1FormRef = ref<FormInstance | null>(null)

// 上传组件ref
const uploadRef = ref<UploadInstance | null>(null)
// 设备ID
const step1FormData = reactive({
	deviceId: []
})

// 表单验证规则
const step1FormRules: FormRules = {
	deviceId: [{ required: true, message: '请选择设备', trigger: 'change' }]
}

const parameter = ref<ImgParameterProps>({
	// excel类型
	fileType: [
		'application/vnd.ms-excel',
		'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
	],
	importApi: userManngerStore.importUserInfoAction,
	getTableList: userManngerStore.getAllUserListAction
})

// dialog状态
const dialogVisible = ref(false)

// 最大文件上传数
const excelLimit = ref(1)
// 当前步骤
const activeStep = ref(1)

const acceptParams = (params: string[]) => {
	dialogVisible.value = true
	nextTick(() => {
		step1FormData.deviceId = params as any
	})
}
// 上一步
const prevStep = () => {
	activeStep.value--
}
// 下一步
const nextStep = async () => {
	// 判断表单是否验证通过
	await step1FormRef.value?.validate(valid => {
		// 如果验证通过
		if (valid) {
			activeStep.value++
		} else {
			ElNotification({
				title: '温馨提示',
				message: '请先选择设备',
				type: 'warning'
			})
		}
	})
}
// 选择器的显示隐藏
const handleVisibleChange = (visible: boolean) => {
	if (visible) {
		deviceStore.getAllDeviceInfoAction({}, 1, total.value)
	}
}

// 文件上传
const uploadExcel = async (param: UploadRequestOptions) => {
	let imgFormData = new FormData()
	imgFormData.append('file', param.file)
	imgFormData.append('deviceNos', step1FormData.deviceId as any)
	await parameter.value.importApi!(imgFormData)
	parameter.value.getTableList && (await parameter.value.getTableList())
	dialogVisible.value = false
}

/**
 * @description 文件上传之前判断
 * @param file 上传的文件
 * */
const beforeExcelUpload = (file: UploadRawFile) => {
	const isImg = parameter.value.fileType!.includes(
		file.type as File.ExcelMimeType
	)
	const fileSize = file.size / 1024 / 1024 < 5
	if (!isImg)
		ElNotification({
			title: '温馨提示',
			message: '上传文件只能是 xls / xlsx 格式！',
			type: 'warning'
		})
	if (!fileSize)
		setTimeout(() => {
			ElNotification({
				title: '温馨提示',
				message: `上传文件大小不能超过5MB！`,
				type: 'warning'
			})
		}, 0)
	return isImg && fileSize
}

// 文件数超出提示
const handleExceed = () => {
	ElNotification({
		title: '温馨提示',
		message: '最多只能上传一个文件！',
		type: 'warning'
	})
}

// 上传错误提示
const excelUploadError = () => {
	ElNotification({
		title: '温馨提示',
		message: `上传失败，请您重新上传！`,
		type: 'error'
	})
}

// 上传成功提示
const excelUploadSuccess = () => {
	ElNotification({
		title: '温馨提示',
		message: `上传成功！`,
		type: 'success'
	})
}

// 关闭弹窗
const handleClosed = () => {
	activeStep.value = 1
	step1FormRef.value?.resetFields()
	uploadRef.value?.clearFiles()
}

// 选择设备change事件
const handleDeviceChange = (val: string[]) => {
	globalStore.setLastDeviceIdAction(val)
}

// 选择设备清空Tag
const handleSeleceClear = () => {
	globalStore.removeAllLastDeviceIdAction()
}

defineExpose({
	acceptParams
})
</script>

<template>
	<el-dialog
		class="dialogBox"
		title="上传文件"
		destroy-on-close
		v-model="dialogVisible"
		@closed="handleClosed"
		width="500"
		draggable
		center
	>
		<!-- 一个步骤条，先选择设备，在进行文件上传 -->
		<el-steps :active="activeStep" finish-status="success">
			<el-step title="选择设备" :icon="Link" />
			<el-step title="上传文件" :icon="Picture" />
		</el-steps>
		<div style="margin: 40px 10px">
			<el-form
				:model="step1FormData"
				v-show="activeStep === 1"
				ref="step1FormRef"
				:rules="step1FormRules"
			>
				<el-form-item label="选择设备" prop="deviceId">
					<el-select
						style="width: 100%"
						v-model="step1FormData.deviceId"
						placeholder="请选择设备"
						clearable
						multiple
						@visible-change="handleVisibleChange"
						@change="handleDeviceChange"
						@clear="handleSeleceClear"
					>
						<el-option
							v-for="item in deviceList"
							:key="item.id"
							:label="item.name"
							:value="item.id"
						>
						</el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<el-form v-show="activeStep === 2">
				<!-- 步骤二：上传图片 -->
				<el-form-item label="用户excel上传 :">
					<el-upload
						ref="uploadRef"
						action="#"
						style="width: 80%"
						:drag="true"
						:limit="excelLimit"
						:http-request="uploadExcel"
						:before-upload="beforeExcelUpload"
						:on-exceed="handleExceed"
						:on-success="excelUploadSuccess"
						:on-error="excelUploadError"
					>
						<slot name="empty">
							<el-icon class="el-icon--upload">
								<upload-filled />
							</el-icon>
							<div class="el-upload__text">
								将文件拖到此处，或<em>点击上传</em>
							</div>
						</slot>
						<template #tip>
							<slot name="tip">
								<div class="el-upload__tip">
									请上传 .xls , .xlsx 标准格式文件，文件最大为 5M
								</div>
							</slot>
						</template>
					</el-upload>
				</el-form-item>
			</el-form>
		</div>

		<template #footer>
			<div class="dialog-footer">
				<el-button @click="prevStep" v-show="activeStep > 1">上一步</el-button>
				<el-button type="primary" @click="nextStep" v-show="activeStep < 2">
					下一步
				</el-button>
			</div>
		</template>
	</el-dialog>
</template>
