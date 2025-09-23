<template>
  <el-row :gutter="1">
    <el-col :span="22">
      <el-form-item label="填报单位" prop="fillUnit">
        <el-input v-model="localForm.fillUnit" placeholder="请输入填报单位" maxlength="50"/>
      </el-form-item>
    </el-col>

    <el-col :span="22">
      <el-form-item label="填报人" prop="fillBy">
        <el-input v-model="localForm.fillBy" placeholder="请输入填报人" maxlength="20"/>
      </el-form-item>
    </el-col>
   
    <el-col :span="22">
      <el-form-item label="联系方式" prop="contact">
        <el-input v-model="localForm.contact" placeholder="请输入联系方式" maxlength="20"/>
      </el-form-item>
    </el-col>

    <el-col :span="22">
      <el-form-item label="评估状态" prop="assessStatus">
        <el-input v-model="localForm.assessStatus" placeholder="请输入评估状态" maxlength="20"/>
      </el-form-item>
    </el-col>
    <el-col :span="22">
      <el-form-item label="适用情况" prop="suitSituation">
        <el-input v-model="localForm.suitSituation" placeholder="请输入适用情况" maxlength="100"/>
      </el-form-item>
    </el-col>
    <el-col :span="22">
      <el-form-item label="贯标情况" prop="implementationSituation">
        <el-input v-model="localForm.implementationSituation" placeholder="请输入贯标情况" maxlength="100"/>
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


