<template>
  <el-row :gutter="20">
    <el-col :span="12" v-if="visible === 0">
      <el-form-item label="用户名" prop="userName">
        <el-input v-model="localForm.userName" placeholder="请输入用户名" />
      </el-form-item>
    </el-col>
    <el-col :span="12" v-if="visible != 2">
      <el-form-item label="用户昵称" prop="nickName">
        <el-input v-model="localForm.nickName" placeholder="请输入用户昵称" />
      </el-form-item>
    </el-col>
    <el-col :span="12" v-if="visible != 2">
      <el-form-item label="手机号" prop="phonenumber">
        <el-input v-model="localForm.phonenumber" placeholder="请输入手机号" />
      </el-form-item>
    </el-col>
    <el-col :span="12" v-if="visible != 2">
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="localForm.email" placeholder="请输入邮箱" />
      </el-form-item>
    </el-col>

    <el-col :span="12" v-if="visible != 2">
      <el-form-item label="所属部门" prop="deptId">
        <el-cascader
          :options="deptOptions"
          :show-all-levels="false"
          clearable
          :props="defaultProps"
          placeholder="请选择所属部门"
          v-model="localForm.deptId"
        />
      </el-form-item>
    </el-col>
    <el-col :span="12" v-if="visible === 0 || visible === 2">
      <el-form-item label="用户密码" prop="password">
        <el-input v-model="localForm.password" placeholder="请输入用户密码" type="password" maxlength="20" show-password />
      </el-form-item>
    </el-col>
    <el-col :span="12" v-if="visible != 2">
      <el-form-item label="用户性别">
        <el-select v-model="localForm.sex" placeholder="请选择性别">
          <el-option v-for="dict in userSex" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
        </el-select>
      </el-form-item>
    </el-col>
    <el-col :span="12" v-if="visible != 2">
      <el-form-item label="状态">
        <el-radio-group v-model="localForm.status">
          <el-radio v-for="dict in userStatus" :key="dict.value" :value="dict.value">{{ dict.label }}</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { deptTree } from '../../../../services/system/userSservice'
import type { TreeNode } from '../../../../type/system'

// ✅ 接收父组件传值
const props = defineProps<{
  modelValue: Record<string, any>,
  title: string
}>()

const userSex = ref([
  { label: '男', value: '1' },
  { label: '女', value: '0' }
])

const userStatus = ref([
  { label: '启用', value: '0' },
  { label: '禁用', value: '1' }
])

const emit = defineEmits<{
  (e: 'update:modelValue', value: Record<string, any>): void
}>()

// ✅ 本地响应式副本
const localForm = ref<Record<string, any>>({ ...props.modelValue })

const visible = ref(0)

// 同步 props 到 localForm
onMounted(() => {
  localForm.value = { ...props.modelValue }
  if (props.title.includes('新增')) {
    visible.value = 0
  }else if (props.title.includes('密码')) {
    visible.value = 2
  }else {
    visible.value = 1
  }
})

// ✅ 部门数据
const deptOptions = ref<TreeNode[]>([])

const defaultProps = {
  multiple: false, // 是否多选
  checkStrictly: false, // 是否父子节点不互相关联
  emitPath: false, // 是否返回选中节点的路径数组
  value: 'id',
  label: 'label',
  children: 'children',
  disabled: 'disabled',
  isLeaf: 'leaf'
}

onMounted(async () => {
  const res = await deptTree()
  deptOptions.value = res
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