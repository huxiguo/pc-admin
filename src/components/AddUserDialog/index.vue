<script setup lang="ts">
import { ElNotification } from 'element-plus'
import type {
	FormInstance,
	UploadRequestOptions,
	UploadRawFile,
	FormRules
} from 'element-plus'
import type { File } from '@/global/File'
import { useUserManngerStore } from '@/stores/modules/userMannger'
import { useUnitManngerStore } from '@/stores/modules/unitMannger'
import { useDeviceStore } from '@/stores/modules/device'
import { useGlobalStore } from '@/stores/modules/global'
const unitManngerStore = useUnitManngerStore()
const globalStore = useGlobalStore()
const deviceStore = useDeviceStore()
const userManngerStore = useUserManngerStore()
const { classList } = storeToRefs(unitManngerStore)
const { deviceList, total } = storeToRefs(deviceStore)
const dialogVisible = ref(false)

// 表单Ref
const dialogFormRef = ref<FormInstance>()

// 级联选择器配置
// 班级选项的配置
const props = {
	value: 'unitsId',
	label: 'name',
	checkStrictly: true,
	expandTrigger: 'hover' as const
}
// 表单数据
const dialogForm = reactive({
	name: '',
	schNo: '',
	session: '',
	unitsId: '',
	deviceNos: [],
	role: '0'
})

// 设备选择器请求数据
const handleDeviceVisibleChange = (visible: boolean) => {
	if (visible) {
		deviceStore.getAllDeviceInfoAction({}, 1, total.value)
	}
}

// 表单验证规则
const dialogFormRules: FormRules = {
	name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
	schNo: [{ required: true, message: '请输入学号', trigger: 'blur' }],
	session: [{ required: true, message: '请输入届', trigger: 'blur' }],
	unitsId: [{ required: true, message: '请选择班级', trigger: 'change' }],
	deviceNos: [{ required: true, message: '请选择设备', trigger: 'change' }],
	role: [{ required: true, message: '请选择角色', trigger: 'change' }]
}

const acceptParams = (params: string[]) => {
	dialogVisible.value = true
	nextTick(() => {
		dialogForm.deviceNos = params as any
	})
}

// 文件上传
const uploadExcel = async (param: UploadRequestOptions) => {
	// 将表单班级数据最后一位取出构造请求数据
	const unitsId = dialogForm.unitsId[dialogForm.unitsId.length - 1]
	let imgFormData = new FormData()
	imgFormData.append('deviceNos', dialogForm.deviceNos as any)
	imgFormData.append('face', param.file)
	imgFormData.append('name', dialogForm.name)
	imgFormData.append('role', dialogForm.role)
	imgFormData.append('schNo', dialogForm.schNo)
	imgFormData.append('session', dialogForm.session)
	imgFormData.append('unitsId', unitsId)
	console.log(imgFormData)
	await userManngerStore.addUserAction(imgFormData)
	await userManngerStore.getAllUserListAction()
	dialogVisible.value = false
}
/**
 * @description 文件上传之前判断
 * @param file 上传的文件
 * */
const beforeExcelUpload = async (file: UploadRawFile) => {
	const isImg = ['image/jpeg', 'image/png', 'image/jpg'].includes(
		file.type as File.ImageMimeType
	)
	// 文件大小限制不超过300kb
	const fileSize = file.size / 1024 < 300

	let isValidate = true
	console.log(11111, isValidate)
	// 判断表单验证是否通过
	await dialogFormRef.value?.validate(valid => {
		isValidate = valid
		console.log(22222, valid)
	})
	console.log(isValidate)

	if (!isValidate)
		ElNotification({
			title: '温馨提示',
			message: '请填写完整的表单信息！',
			type: 'warning'
		})

	if (!isImg)
		setTimeout(() => {
			ElNotification({
				title: '温馨提示',
				message: '上传文件只能是 jpg jpeg png 格式！',
				type: 'warning'
			})
		}, 0)

	if (!fileSize)
		setTimeout(() => {
			ElNotification({
				title: '温馨提示',
				message: `上传文件大小不能超过300kb！`,
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

// 选择设备change事件
const handleDeviceChange = (val: string[]) => {
	globalStore.setLastDeviceIdAction(val)
}

// 关闭弹窗
const handleClose = () => {
	// 重置表单
	dialogFormRef.value?.resetFields()
}

defineExpose({
	acceptParams
})
</script>

<template>
	<el-dialog
		class="dialogBox"
		title="选择设备添加用户"
		v-model="dialogVisible"
		:destroy-on-close="true"
		@close="handleClose"
		width="500"
		draggable
		center
	>
		<el-form
			:model="dialogForm"
			ref="dialogFormRef"
			label-position="left"
			label-width="70px"
			:rules="dialogFormRules"
		>
			<el-form-item label="姓名:" prop="name">
				<el-input v-model="dialogForm.name" clearable />
			</el-form-item>
			<el-form-item label="学号:" prop="schNo">
				<el-input v-model.number="dialogForm.schNo" clearable />
			</el-form-item>
			<el-form-item label="届:" prop="session">
				<el-input v-model="dialogForm.session" clearable />
			</el-form-item>
			<el-form-item label="班级:" prop="unitsId">
				<el-cascader
					style="width: 100%"
					:show-all-levels="false"
					v-model="dialogForm.unitsId"
					:options="classList"
					:props="props"
					clearable
					placeholder="请选择班级"
				/>
			</el-form-item>
			<el-form-item label="设备:" prop="deviceNos">
				<el-select
					style="width: 100%"
					v-model="dialogForm.deviceNos"
					placeholder="请选择设备"
					clearable
					multiple
					@visible-change="handleDeviceVisibleChange"
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
			<el-form-item label="角色:" prop="role">
				<el-select v-model="dialogForm.role" style="width: 100%">
					<el-option label="学生" value="0" />
					<el-option label="老师" value="1" />
					<el-option label="其他" value="2" />
				</el-select>
			</el-form-item>
			<el-form-item label="照片:">
				<el-upload
					action="#"
					style="width: 100%"
					:drag="true"
					:limit="1"
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
								请填写好表单后上传，请上传 jpg,jpeg,png 标准格式文件
							</div>
						</slot>
					</template>
				</el-upload>
			</el-form-item>
		</el-form>
	</el-dialog>
</template>
