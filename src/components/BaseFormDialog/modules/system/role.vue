<template>
  <el-row :gutter="1">
    <el-col :span="22">
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="localForm.roleName" placeholder="请输入角色名称" maxlength="20"/>
      </el-form-item>
    </el-col>

    <el-col :span="22">
      <el-form-item label="权限字符" prop="roleKey">
        <el-input v-model="localForm.roleKey" placeholder="请输入权限字符" maxlength="20"/>
      </el-form-item>
    </el-col>
   
    <el-col :span="22">
      <el-form-item label="角色顺序" prop="roleSort">
        <el-input-number v-model="localForm.roleSort" controls-position="right" :min="0" :max="100" />
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
      <el-form-item label="菜单权限">
        <el-button type="primary" text @click="toggleExpand">展开/折叠</el-button>
        <el-button type="primary" text @click="checkedTreeNodeAll">全选/反选</el-button>
        <el-tree 
        class="w-full border mt-4"
        ref="treeRef"
        :data="menuOptions"
        :props="defaultProps"
        :show-checkbox="true"
        :default-expand-all="isExpanded"
        @check-change="handleCheckChange"
        
        node-key="id"
        />
      </el-form-item>
    <el-form-item label="备注" prop>
          <el-input v-model="localForm.remark" type="textarea" placeholder="请输入内容"></el-input>
    </el-form-item>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick  } from 'vue'
import { menuTree, roleMenuTreeselect } from '../../../../services/system/roleService'
import type { TreeNode } from '../../../../type/system'
import { ElTree } from 'element-plus'

// 假设你的 GenericTree 最终使用的是 el-tree

const menuOptions = ref<TreeNode[]>([])
const isExpanded = ref(false)
const isSelected = ref(false)

// 树的配置
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
        treeRef.value.setCheckedKeys(menuOptions.value.map((item) => item.id))
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
    localForm.value.menuIds = getMenuAllCheckedKeys()
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
})

onMounted(async () => {

  if (props.title.includes('新增')) {
    localForm.value.status= '0'
    localForm.value.roleSort= 0
    localForm.value.menuCheckStrictly= true
    localForm.value.deptCheckStrictly= true
    menuOptions.value = await menuTree()
  }else {
    const roleMenuPromise = await roleMenuTreeselect(localForm.value.roleId)
    console.log('roleMenuPromise: ', roleMenuPromise)
    menuOptions.value = roleMenuPromise.menus
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


