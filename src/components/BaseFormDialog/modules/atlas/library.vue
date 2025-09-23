<template>
  <el-row :gutter="1">
    <template v-for="field in schema" :key="field.key">
      <el-col :span="getFieldSpan(field)">
        <el-form-item :label="field.label" :prop="field.key">
          <!-- 输入框 -->
          <el-input
            v-if="field.type === 'input' || !field.type"
            v-model="localForm[field.key]"
            :placeholder="`请输入${field.label}`"
            :maxlength="50"
          />

          <!-- 下拉框 -->
          <el-select
            v-else-if="field.type === 'select'"
            v-model="localForm[field.key]"
            :placeholder="`请选择${field.label}`"
          >
            <el-option
              v-for="opt in field.options"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
            />
          </el-select>

          <!-- 图片上传 -->
          <ImageUpload
            v-else-if="field.type === 'file'"
            v-model="imageMap[field.key]"  
            :limit="1"
            :max-size="10"
            
          />

        </el-form-item>
      </el-col>
    </template>
  </el-row>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { stdFieldsInfo} from '../../../../services/atlas/stdLibrary'

interface FormField {
  key: string
  label: string
  type: 'input' | 'select' | 'image' | 'radio' | 'textarea' | 'file'
  required?: boolean
  options?: Array<{ label: string; value: any }>
  [key: string]: any // 其他扩展属性
}
const schema = ref<FormField[]>([])
const imageMap = ref<Record<string, any[]>>({})

const props = defineProps<{
  modelValue: Record<string, any>,
  title: string,
  extraData?: Record<string, any>
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: Record<string, any>): void
}>()

const localForm = ref<Record<string, any>>({ ...props.modelValue })


onMounted(async() => {
    const res = await stdFieldsInfo(props.extraData?.industryId)
    init(res)
})

const init = (res: any) => {

    try {
        schema.value = res.map((item: any) => ({
        key: item.propertyName,
        label: item.propertyDisplayName,
        type: item.propertyValueType === 'String'? 'input': item.propertyValueType === 'reference'? 'file' : 'input',
        options: item.options?.map((opt: any) => ({
            label: opt.name,
            value: opt.name 
            }))
        }))

        if(props.title === '新增标准'){
            schema.value.forEach(field => {
                if (localForm.value[field.key] === undefined) {
                    localForm.value[field.key] = ''
                }
            })
        }
        

  } catch (error) {
    console.error('加载表单配置失败', error)
  }

}

// 根据字段类型决定占位
const getFieldSpan = (field: FormField) => {
  if (field.type === 'image') return 22
  return 11 // 默认两列
}

watch(
  () => localForm.value,
  (newVal) => {
    emit('update:modelValue', newVal)
  },
  { deep: true }
)

watch(schema, (newSchema) => {
  newSchema.forEach(field => {
    if (field.type === 'file') {
      const key = field.key
      // 从 modelValue 初始化
      if (props.modelValue[key]) {
        imageMap.value[key] = props.modelValue[key]
          .split(',')
          .map((name: string) => ({
            name,
            url: import.meta.env.VITE_API_BASE_URL  + name
          }))
      } else {
        imageMap.value[key] = []
      }
    }
  })
}, { immediate: true })

// 监听图片变化，同步到 localForm
watch(imageMap.value, (newVal) => {
  Object.keys(newVal).forEach(key => {
    localForm.value[key] = newVal[key].map(item => item.name).join(',')
  })
}, { deep: true })
</script>


