<template>
  <el-dialog
    v-model="open"
    :title="title"
    :width="width"
    append-to-body
    :close-on-click-modal="false"
  >
    <el-form
     v-if="formLoaded"
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="120px"
      :validate-on-rule-change="false"
    >
      <component v-if="open" :title ="title" :is="FormComponent" v-model="form" v-bind="extraProps" />
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submitForm" :loading="loading">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { ref, watch, h, shallowRef, computed } from 'vue'

const props = defineProps<{
  modelValue: boolean
  module: string // 模块名，如 user, role, dept
  path: string // 路径
  title: string
  width?: string
  formData?: Record<string, any>
  api?: (data: any) => Promise<any>
  extraData?: Record<string, any>
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'success'): void
}>()

const open = ref(false)
const loading = ref(false)
const rules = ref<Record<string, any>>({})
const form = ref<Record<string, any>>({})
const formRef = ref()

// ✅ 计算要透传给子组件的属性
const extraProps = computed(() => {
  const propsToPass: Record<string, any> = {}
  // 把你想传的字段加进去
  if (props.extraData) propsToPass.extraData = props.extraData
  return propsToPass
})

// 动态加载表单字段组件
const FormComponent = shallowRef<any>()

// 动态加载校验规则
const loadModule = async () => {
  try {
    const moduleComponent = await import(`./modules/${props.path}/${props.module}.vue`)
    FormComponent.value = moduleComponent.default || moduleComponent
  } catch (e) {
    console.warn(`未找到模块组件 ./modules/${props.path}/${props.module}.vue`)
    FormComponent.value = {
      setup() {
        return () => h('div', `未找到模块组件${props.module }`)
      },
    }
  }

  try {
    const moduleRules = await import(`./modules/${props.path}/${props.module}-rules.ts`)
    rules.value = moduleRules.default || {}
  } catch (e) {
    console.warn(`未找到校验规则 ./modules/${props.path}/${props.module}-rules.ts`)
    rules.value = {}
  }
}



// 提交表单
const submitForm = () => {
  formRef.value.validate(async (valid: boolean) => {
    if (valid && props.api) {
      loading.value = true
      try {
        await props.api(form.value)
        emit('success')
        open.value = false
      } catch (err) {
        //ElMessage.error(err)
      } finally {
        loading.value = false
      }
    }
  })
}

// 取消
const cancel = () => {
  open.value = false
}

const formLoaded = ref(false)

// 监听 modelValue 控制弹窗状态
watch(
  () => props.modelValue,
  async (val) => {
    if (val) {
      await loadModule()
      await resetForm()
      formLoaded.value = true
    }
    open.value = val
  },
  { immediate: true }
)

// 初始化表单数据
const resetForm = () => {

  if (props.title.includes('新增')) {
    const defaultForm = Object.keys(rules.value).reduce((acc, key) => {
      acc[key] = ''
      return acc
    }, {} as Record<string, any>)
    form.value = defaultForm
  }else {
    form.value = { ...props.formData }
  }
  
}

// 同步弹窗状态到 modelValue
watch(
  () => open.value,
  (val) => {
    emit('update:modelValue', val)
    
  }
)
</script>

