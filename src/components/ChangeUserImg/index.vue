<script setup lang="ts">
import type { FormInstance } from 'element-plus'
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
const { lastDeviceId } = storeToRefs(globalStore)

export interface ImgParameterProps {
	stuNo: string
	fileType?: File.ImageMimeType[] // 上传文件的类型
	importApi?: (params: any) => Promise<any> // 上传图片的Api
	getTableList?: (param: any) => void // 获取表格数据的Api
}

// 设备表单ref
const step1FormRef = ref<FormInstance | null>(null)

// 设备ID
const step1FormData = reactive({
	deviceId: lastDeviceId.value || []
})

const parameter = ref<ImgParameterProps>({
	stuNo: '',
	// 图片类型
	fileType: ['image/jpeg', 'image/png', 'image/jpg'],
	importApi: userManngerStore.editUserFaceAction,
	getTableList: userManngerStore.getAllUserListAction
})

// dialog状态
const dialogVisible = ref(false)

// 最大文件上传数
const excelLimit = ref(1)
// 当前步骤
const activeStep = ref(1)

const acceptParams = (params: ImgParameterProps) => {
	parameter.value = { ...parameter.value, ...params }
	console.log(parameter.value)
	dialogVisible.value = true
}
// 上一步
const prevStep = () => {
	activeStep.value--
}
// 下一步
const nextStep = () => {
	activeStep.value++
}
// 选择器的显示隐藏
const handleVisibleChange = (visible: boolean) => {
	if (visible) {
		deviceStore.getAllDeviceInfoAction({}, 1, total.value)
	}
}

// 父组件传递的学号参数

// 文件上传
const uploadExcel = async (param: UploadRequestOptions) => {
	let imgFormData = new FormData()
	const { stuNo } = parameter.value
	imgFormData.append('file', param.file)
	imgFormData.append('deviceNos', step1FormData.deviceId as any)
	imgFormData.append('stuNo', stuNo)
	console.log(imgFormData)
	await parameter.value.importApi!(imgFormData)
	parameter.value.getTableList && (await parameter.value.getTableList({}))
	dialogVisible.value = false
}

/**
 * @description 文件上传之前判断
 * @param file 上传的文件
 * */
const beforeExcelUpload = (file: UploadRawFile) => {
	const isImg = parameter.value.fileType!.includes(
		file.type as File.ImageMimeType
	)
	const fileSize = file.size / 1024 / 1024 < 5
	if (!isImg)
		ElNotification({
			title: '温馨提示',
			message: '上传文件只能是 jpg jpeg png 格式！',
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
}

// 选择设备change事件
const handleDeviceChange = (val: string[]) => {
	globalStore.setLastDeviceIdAction(val)
}

defineExpose({
	acceptParams
})
</script>

<template>
	<el-dialog
		class="dialogBox"
		title="修改人脸"
		v-model="dialogVisible"
		:destroy-on-close="true"
		@closed="handleClosed"
		width="500"
		draggable
		center
	>
		<!-- 一个步骤条，先选择设备，在进行图片上传 -->
		<el-steps :active="activeStep" finish-status="success">
			<el-step title="选择设备" :icon="Link" />
			<el-step title="上传图片" :icon="Picture" />
		</el-steps>
		<div style="margin: 40px 10px">
			<el-form
				:model="step1FormData"
				v-show="activeStep === 1"
				ref="step1FormRef"
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
				<el-form-item label="人脸图片上传 :">
					<el-upload
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
								将图片拖到此处，或<em>点击上传</em>
							</div>
						</slot>
						<template #tip>
							<slot name="tip">
								<div class="el-upload__tip">
									请上传 jpg,jpeg,png 标准格式文件
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
