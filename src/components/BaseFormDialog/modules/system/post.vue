<template>
  <el-row :gutter="1">
    <el-col :span="22">
      <el-form-item label="岗位名称" prop="postName">
        <el-input v-model="localForm.postName" placeholder="请输入岗位名称" maxlength="20"/>
      </el-form-item>
    </el-col>

    <el-col :span="22">
      <el-form-item label="岗位编码" prop="postCode">
        <el-input v-model="localForm.postCode" placeholder="请输入岗位编码" maxlength="20"/>
      </el-form-item>
    </el-col>
   
    <el-col :span="22">
      <el-form-item label="岗位顺序" prop="postSort">
        <el-input-number v-model="localForm.postSort" controls-position="right" :min="0" :max="100" />
      </el-form-item>
    </el-col>

    <el-col :span="22">
        <el-form-item prop="status" label="状态">
            <el-radio-group v-model="localForm.status">
                <el-radio value="0">正常</el-radio>
                <el-radio value="1">停用</el-radio>
            </el-radio-group>
        </el-form-item>
    </el-col>
    <el-col :span="22">
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" v-model="localForm.remark" controls-position="right" maxlength="500"/>
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
    localForm.value.status= '0'
    localForm.value.postSort= 0
  }else{

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


