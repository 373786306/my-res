<template>
  <el-row :gutter="1">
    <el-col :span="22">
      <el-form-item label="名称" prop="name">
        <el-input v-model="localForm.name" placeholder="请输入名称" maxlength="20"/>
      </el-form-item>
    </el-col>

    <el-col :span="22">
      <el-form-item label="层级" prop="tier">
        <el-input-number v-model="localForm.tier"  controls-position="right" />
      </el-form-item>
    </el-col>
   
  </el-row>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

// ✅ 接收父组件传值
const props = defineProps<{
  modelValue: Record<string, any>,
  title: string
}>()


const emit = defineEmits<{
  (e: 'update:modelValue', value: Record<string, any>): void
}>()

// ✅ 本地响应式副本
const localForm = ref<Record<string, any>>({ ...props.modelValue })

// 同步 props 到 localForm
onMounted(() => {
  localForm.value = { ...props.modelValue }
  if (props.title.includes('新增')) {
    localForm.value.tier= 1
  }
})

// ✅ 监听 localForm 的变化并同步到父组件
watch(
  () => localForm.value,
  (newVal) => {
    emit('update:modelValue', newVal)
  },
  { deep: true }
)
// ✅ 正确做法：监听 props.modelValue 变化
</script>


