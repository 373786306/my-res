<template>
  <div class="universal-upload">
    <!-- 上传组件 -->
    <el-upload
      :action="uploadUrl"
      list-type="picture-card"
      :file-list="fileList"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :on-success="handleSuccess"
      :before-upload="beforeUpload"
      :headers="headers"
      :limit="limit"
      :on-exceed="handleExceed"
      multiple
      :disabled="disabled"
      :accept="accept"
    >
      <el-icon><Plus /></el-icon>
    </el-upload>

    <!-- 预览对话框 -->
    <el-dialog v-model="previewVisible" :title="previewTitle" width="60%" center> <!-- 修改：动态 title -->
      <!-- 修改：根据是否为图片，显示不同内容 -->
      <template v-if="isImage">
        <img :src="previewUrl" alt="预览" class="max-w-full max-h-[80vh] object-contain" />
      </template>
      <template v-else>
        <p class="text-center">
          <strong>文件名：</strong>{{ previewName }}<br/>
          <a :href="previewUrl" target="_blank" class="text-blue-500 hover:underline">在线预览</a> |
          <a :href="previewUrl" download class="text-blue-500 hover:underline">下载</a>
        </p>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { ElMessage, type UploadFile, type UploadRawFile } from 'element-plus'
import type { PropType } from 'vue'
import { useAuthStore } from '../stores/useAuthStore'

const authStore = useAuthStore()
const headers = computed(() => {
  return {
    Authorization: `Bearer ${authStore.token}`
  }
})

// Props 定义
const props = defineProps({
  modelValue: {
    type: Array as PropType<{ url: string, name: string }[]>,
    default: () => []
  },
  // 上传地址
  uploadUrl: {
    type: String,
    default: '/api/common/upload'
  },
  // 最大上传数量
  limit: {
    type: Number,
    default: 5
  },
  // 单个文件最大大小（MB）
  maxSize: {
    type: Number,
    default: 10
  },
  // 允许的图片类型
  accept: {
    type: String,
    default: 'image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar'
  },
  
  // 是否禁用
  disabled: {
    type: Boolean,
    default: false
  }
})

// Emits 定义
const emit = defineEmits(['update:modelValue', 'success', 'remove'])

// 响应式数据
const fileList = ref<UploadFile[]>([])

const previewVisible = ref(false)
const previewUrl = ref('')
const previewName = ref('')
const previewTitle = ref('')

// ============ 新增：判断是否为图片 ============
const isImageFile = (fileName: string): boolean => {
  const ext = fileName.toLowerCase().split('.').pop()
  return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'].includes(ext || '')
}

// 将 modelValue（包含 url 和 name 的对象数组）转为 UploadFile[]
const namesToUploadFiles = (items: { url: string, name: string }[]): UploadFile[] => {
  return items.map((item, index) => ({
    uid: Date.now() + index,
    name: item.name,
    url: item.url,
    status: 'success' as const,
    raw: { name: item.name } as UploadRawFile
  }))
}


// 监听 modelValue 变化，更新 fileList
watch(
  () => props.modelValue,
  (newVal) => {
    fileList.value = namesToUploadFiles(newVal)
    
  },
  { immediate: true }
)

// 上传前校验
const beforeUpload = (file: UploadRawFile): boolean => {
  const { maxSize, accept } = props

  // 新增：支持扩展名和 MIME 类型混合判断
  const fileName = file.name.toLowerCase()
  const allowed = accept
    .split(',')
    .map(t => t.trim())

  const isTypeAllowed = allowed.some(type => {
    if (type === 'image/*') return file.type.startsWith('image/')
    if (type.startsWith('.')) return fileName.endsWith(type)
    return file.type === type
  })

  if (!isTypeAllowed) {
    ElMessage.error(`仅支持 ${accept} 格式`)
    return false
  }

  if (file.size / 1024 / 1024 > maxSize) {
    ElMessage.error(`文件大小不能超过 ${maxSize}MB`)
    return false
  }

  return true
}

// 上传成功
const handleSuccess = (response: any, file: UploadFile) => {
  if (response.code === 200 ) {
    const newItem = {
      url: response.url,
      name: response.fileName // 或者使用 file.name 获取原始文件名
    }

    const newItems = [...props.modelValue, newItem]

    emit('update:modelValue', newItems)
    emit('success', newItem, newItems) // 如果需要在父组件中处理更多细节

    ElMessage.success('上传成功')
  } else {
    ElMessage.error(response.message || '上传失败')
    handleRemove(file)
  }
}

// 删除
const handleRemove = (file: UploadFile) => {
  const newItemName = file.name
  const newItems = props.modelValue.filter(item => item.name !== newItemName)

  emit('update:modelValue', newItems)
  emit('remove', newItemName, newItems)
}

// 预览
const handlePreview  = (file: UploadFile) => {
  previewUrl.value = file.url!
  previewName.value = file.name

  // 动态设置标题
  if (isImageFile(file.name)) {
    previewTitle.value = '图片预览'
  } else {
    previewTitle.value = '文件预览'
  }

  previewVisible.value = true
}

const isImage = computed(() => isImageFile(previewName.value))

const handleExceed = () => {
  ElMessage.warning(`最多只能上传 ${props.limit} 个文件`)
}

</script>

<style scoped>

/* PDF 文件显示 PDF 图标 */
.universal-upload :deep(.el-upload-list__item[name$=".pdf"]) .el-icon {
  background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCI+CiAgPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjRTYzOTQ2Ii8+CiAgPHRleHQgeD0iMTIiIHk9IjE2IiBmb250LXNpZGU9IjEwIiBmaWxsPSIjZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5QREY8L3RleHQ+Cjwvc3ZnPg==') !important;
  background-size: cover;
}

/* Word 文件 */
.universal-upload :deep(.el-upload-list__item[name$=".doc"], [name$=".docx"]) .el-icon {
  background-image: url('data:image/svg+xml;utf8,<svg>...</svg>') !important;
}
/* 修改：class 名称 */
.universal-upload :deep(.el-upload--picture-card) {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 100px;
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
}

/* 新增：文件名换行 */
.universal-upload :deep(.el-upload-list__item-name) {
  word-break: break-all;
}
</style>