<template>
  <el-form
    ref="formRef"
    :model="localForm"
    label-width="6rem"
    @submit.prevent="handleSubmit"
    class="w-full"
  >
    <div class="flex flex-wrap md:flex-nowrap gap-4 w-full">
      <template v-for="field in schema" :key="field.key">
        <div :class="getFlexBasisClass(field.span)">
          <el-form-item :label="field.label">
            <component
              :is="getComponent(field.component)"
              v-model="localForm[field.key]"
              :placeholder="field.placeholder || `请输入${field.label}`"
              clearable
              v-bind="field.props || {}"
            >
              <el-option
                v-if="field.component === 'Select' && field.options"
                v-for="option in field.options"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </component>
          </el-form-item>
        </div>
      </template>

      <!-- 操作按钮 -->
      <div class="col-span-1 flex space-x-2">
        <el-button type="primary" native-type="submit">搜索</el-button>
        <el-button @click="handleReset">重置</el-button>
      </div>
    </div>
  </el-form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElInput, ElSelect, ElDatePicker, ElInputNumber, ElOption } from 'element-plus'


// 定义字段类型
interface SearchSchemaField {
  label: string
  key: string
  component: 'Input' | 'Select' | 'DatePicker' | 'InputNumber' | string
  span?: number // 1~24，默认 6
  options?: Array<{ label: string; value: any }>
  placeholder?: string
  props?: Record<string, any>
}

// Props
const props = defineProps<{
  modelValue: Record<string, any>
  schema: SearchSchemaField[]
}>()

// Emits
const emit = defineEmits<{
  (e: 'update:modelValue', val: Record<string, any>): void
  (e: 'search', val: Record<string, any>): void
  (e: 'reset'): void
}>()

// 本地表单数据
const localForm = ref<Record<string, any>>({ ...props.modelValue })

// 同步 modelValue
watch(
  () => props.modelValue,
  (newVal) => {
    localForm.value = { ...newVal }
  }
)

// 组件映射
const componentMap = {
  Input: ElInput,
  Select: ElSelect,
  DatePicker: ElDatePicker,
  InputNumber: ElInputNumber
} as const

type ComponentName = keyof typeof componentMap

const getComponent = (name: ComponentName | string) => {
  const key = name as ComponentName
  return componentMap[key] || ElInput
}

const getFlexBasisClass = (span: number = 6): string => {
  switch (span) {
    case 24: return 'basis-24/24' // 或者 basis-full
    case 12: return 'basis-12/24' // 或者 basis-1/2
    case 8: return 'basis-8/24'   // 或者 basis-1/3
    case 6: return 'basis-6/24'   // 或者 basis-1/4
    case 4: return 'basis-4/24'   // 或者 basis-1/6
    default: return 'basis-6/24'  // 默认值
  }
}



// 提交搜索
const handleSubmit = () => {
  emit('update:modelValue', localForm.value)
  emit('search', localForm.value)
}

// 重置表单
const handleReset = () => {
  const resetForm = Object.keys(localForm.value).reduce((acc, key) => {
    acc[key] = ''
    return acc
  }, {} as Record<string, any>)
  localForm.value = resetForm
  emit('update:modelValue', resetForm)
  emit('reset')
}
</script>