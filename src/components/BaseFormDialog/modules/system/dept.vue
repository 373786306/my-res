<template>
  <el-row :gutter="20">
    <el-col :span="12">
      <el-form-item label="上级部门" prop="parentId">
        <el-cascader
          :options="deptOptions"
          :show-all-levels="false"
          clearable
          :props="defaultProps"
          placeholder="请选择所属部门"
          v-model="localForm.parentId"
          class="w-full"
        />
      </el-form-item>
    </el-col>

    <el-col :span="12">
      <el-form-item label="部门名称" prop="deptName">
        <el-input v-model="localForm.deptName" placeholder="请输入部门名称" maxlength="20"/>
      </el-form-item>
    </el-col>
   
    <el-col :span="12">
      <el-form-item label="显示排序" prop="orderNum">
        <el-input-number v-model="localForm.orderNum" controls-position="right" :min="0" :max="100" />
      </el-form-item>
    </el-col>

    <el-col :span="12">
      <el-form-item label="负责人" prop="leader">
        <el-input v-model="localForm.leader" placeholder="请输入负责人名称" maxlength="20" />
      </el-form-item>
    </el-col>

    <el-col :span="12">
      <el-form-item label="联系电话" prop="phone">
        <el-input v-model="localForm.phone" placeholder="请输入联系电话" maxlength="11" />
      </el-form-item>
    </el-col>

    <el-col :span="12">
        <el-form-item label="邮箱" prop="email">
            <el-input v-model="localForm.email" placeholder="请输入邮箱" maxlength="11" />
        </el-form-item>
    </el-col>

    <el-col :span="12">
        <el-form-item prop="status" label="部门状态">
            <el-radio-group v-model="localForm.status">
                <el-radio value="0">正常</el-radio>
                <el-radio value="1">停用</el-radio>
            </el-radio-group>
        </el-form-item>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { deptTree } from '../../../../services/system/deptService'
import type { TreeNode } from '../../../../type/system'

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
  localForm.value.orderNum= 0
}
  
})

// ✅ 部门数据
const deptOptions = ref<TreeNode[]>([])

const defaultProps = {
  multiple: false, // 是否多选
  checkStrictly: true, // 是否父子节点不互相关联
  emitPath: false, // 是否返回选中节点的路径数组
  value: 'deptId',
  label: 'deptName',
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


