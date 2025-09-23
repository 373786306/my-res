<template>
  <el-row :gutter="1">
    <el-col :span="22">
      <el-form-item label="角色名称" prop="roleName">
        <el-input disabled v-model="localForm.roleName" placeholder="请输入角色名称" maxlength="20"/>
      </el-form-item>
    </el-col>

    <el-col :span="22">
      <el-form-item label="权限字符" prop="roleKey">
        <el-input disabled v-model="localForm.roleKey" placeholder="请输入权限字符" maxlength="20"/>
      </el-form-item>
    </el-col>

    <el-col :span="22">
      <el-form-item label="权限范围" prop="dataScope">
        <el-select v-model="localForm.dataScope" @change="dataScopeSelectChange">
            <el-option
              v-for="item in dataScopeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
      </el-form-item>
    </el-col>

    <el-col :span="22" v-show="localForm.dataScope == 2">
      <el-form-item label="菜单权限">
        <el-button type="primary" text @click="toggleExpand">展开/折叠</el-button>
        <el-button type="primary" text @click="checkedTreeNodeAll">全选/反选</el-button>
        <el-tree 
        class="w-full border mt-4"
        ref="treeRef"
        :data="deptOptions"
        :props="defaultProps"
        :show-checkbox="true"
        :default-expand-all="isExpanded"
        @check-change="handleCheckChange"
        
        node-key="id"
        />
      </el-form-item>
    
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick  } from 'vue'
import { roleDeptTreeselect } from '../../../../services/system/roleService'
import type { TreeNode } from '../../../../type/system'
import { ElTree } from 'element-plus'

const deptOptions = ref<TreeNode[]>([])
const isExpanded = ref(true)
const isSelected = ref(false)

interface DataScopeOption {
  value: string
  label: string
}

// 定义 dataScopeOptions 响应式数据
const dataScopeOptions = ref<DataScopeOption[]>([
  { value: "1", label: "全部数据权限" },
  { value: "2", label: "自定数据权限" },
  { value: "3", label: "本部门数据权限" },
  { value: "4", label: "本部门及以下数据权限" },
  { value: "5", label: "仅本人数据权限" }
])

const dataScopeSelectChange = (value: string) => {
  if(value !== '2') {
        treeRef.value.setCheckedKeys([])
      }
}

const defaultProps = {
  children: 'children',
  label: 'label'
}

const treeRef = ref()

const expandAll = () => {
  treeRef.value.store._getAllNodes().forEach((node:any) => {
    node.expanded = true;
  })
}
const collapseAll = () => {
  treeRef.value.store._getAllNodes().forEach((node:any) => {
    node.expanded = false;
  })
}
const checkedTreeNodeAll = () => {
    isSelected.value = !isSelected.value
    if (isSelected.value) {
        treeRef.value.setCheckedKeys(deptOptions.value.map((item) => item.id))
    } else {
        treeRef.value.setCheckedKeys([])
    }
}

// 切换展开/收起
const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
  if (isExpanded.value) {
    expandAll()
  } else {
    collapseAll()
  }

}

const getMenuAllCheckedKeys = () => {
      // 目前被选中的菜单节点
      let checkedKeys = treeRef.value.getCheckedKeys()
      // 半选中的菜单节点
      let halfCheckedKeys = treeRef.value.getHalfCheckedKeys()
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys)
      return checkedKeys
}
const handleCheckChange = () => {
    localForm.value.deptIds = getMenuAllCheckedKeys()
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
  if (!localForm.value.deptIds){
    localForm.value.deptIds = []
  }
})

onMounted(async () => {
  
    const roleMenuPromise = await roleDeptTreeselect(localForm.value.roleId)
    deptOptions.value = roleMenuPromise.depts
    try {
    await nextTick() // 确保 DOM 更新
    const res = await roleMenuPromise
    const checkedKeys = res.checkedKeys
    // 设置菜单选中状态
    for (const v of checkedKeys) {
      await nextTick()
      treeRef.value?.setChecked(v, true, false)
    }
  } catch (error) {
    console.error('加载角色数据失败:', error)
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


