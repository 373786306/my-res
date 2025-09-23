<template>
  <el-row :gutter="1">
    <el-col :span="22">
      <el-form-item label="名称" prop="propertyName">
        <el-input v-model="localForm.propertyName" placeholder="请输入名称" maxlength="20"/>
      </el-form-item>
    </el-col>

    <el-col :span="22">
      <el-form-item label="显示名称" prop="propertyDisplayName">
        <el-input v-model="localForm.propertyDisplayName" placeholder="请输入显示名称" maxlength="20"/>
      </el-form-item>
    </el-col>

    <el-col :span="22" >
      <el-form-item label="值类型" prop="propertyValueType">
        <el-select v-model="localForm.propertyValueType" placeholder="请选择值类型" @change="handleValueTypeChange">
          <el-option v-for="dict in valueType" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
        </el-select>
      </el-form-item>
    </el-col>

    <el-col :span="22">
      <el-form-item v-show="localForm.propertyValueType === 'string'" label="长度是否限制：" prop="propertyLengthLimit">
        <el-radio-group v-model="localForm.propertyLengthLimit">
                <el-radio value="1">不限制长度</el-radio>
                <el-radio value="2">限制长度</el-radio>
              </el-radio-group>
        </el-form-item>
        <el-form-item v-show="localForm.propertyValueType === 'string' && localForm.propertyLengthLimit === '2'" label="值长度：" prop="propertyValueLength">
            <el-input-number  v-model="localForm.propertyValueLength" label="请输入属性值长度" :min="0" :max="500"></el-input-number>
        </el-form-item>

        <el-form-item v-show="localForm.propertyValueType === 'numeric'" label="长度是否限制：" prop="propertyLengthLimit">
            <el-radio-group v-model="localForm.propertyReferenceType">
                <el-radio value="1">整型</el-radio>
                <el-radio value="2">浮点型</el-radio>
            </el-radio-group>
        </el-form-item>

        <el-form-item v-show="localForm.propertyValueType === 'reference'" label="选择引用类型" prop="propertyLengthLimit">
            <el-radio-group v-model="localForm.propertyReferenceType">
                <el-radio value="file">单附件</el-radio>
                <el-radio value="files">多附件</el-radio>
            </el-radio-group>
        </el-form-item>
    </el-col>
   
    <el-col :span="22">
      <el-form-item label="描述" prop="propertyDescription">
        <el-input type="textarea" v-model="localForm.propertyDescription"  placeholder="请输入内容描述" maxlength="200"/>
      </el-form-item>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

const valueType = [
    {
        "label": "字符型",
        "value": "string"
    },
    {
        "label": "数字型",
        "value": "numeric"
    },
    {
        "label": "日期型",
        "value": "datetime"
    },
    {
        "label": "引用型",
        "value": "reference"
    }
]

const handleValueTypeChange = (value: string) => {
    if(value === 'string'){
        localForm.value.propertyLengthLimit = '1'
    }

    if(value === 'numeric'){
        localForm.value.propertyReferenceType = '1'
    }

    if(value === 'reference'){
        localForm.value.propertyReferenceType = 'file'
    }
   
}

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


