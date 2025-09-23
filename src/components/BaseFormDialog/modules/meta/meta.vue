<template>
  <el-row :gutter="1">
    <el-col :span="22">
      <el-form-item label="级别名称" prop="industryName">
        <el-input v-model="localForm.industryName" placeholder="请输入级别名称" maxlength="20"/>
      </el-form-item>
    </el-col>

    <el-col :span="22">
      <el-form-item label="级别表名" prop="industryTableName">
        <el-input v-model="localForm.industryTableName" :disabled = 'disabled' placeholder="请输入级别表名" maxlength="20"/>
      </el-form-item>
    </el-col>
   
    <el-col :span="22">
      <el-form-item label="级别顺序" prop="industryDescription">
        <el-input-number v-model="localForm.industryDescription" controls-position="right" :min="0" :max="100" />
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

const disabled = ref(false)

// 同步 props 到 localForm
onMounted(() => {
  localForm.value = { ...props.modelValue }
  if (props.title.includes('新增')) {
    disabled.value = false
    localForm.value.industryDescription= 0
  }else{
    disabled.value = true
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


