<template>
  <el-row :gutter="20">
    <el-col :span="24">
      <el-form-item label="上级菜单" prop="parentId">
        <el-cascader
          :options="memuOptions"
          :show-all-levels="false"
          clearable
          :props="defaultProps"
          placeholder="请选择所属菜单"
          v-model="localForm.parentId"
          class="w-full"
        />
      </el-form-item>
    </el-col>
    <el-col :span="12">
      <el-form-item label="菜单类型" prop="menuType">
        <el-radio-group v-model="localForm.menuType">
                <el-radio value="M">目录</el-radio>
                <el-radio value="C">菜单</el-radio>
                <el-radio value="F">按钮</el-radio>
              </el-radio-group>
      </el-form-item>
    </el-col>
    <!-- <el-col :span="12">
      <el-form-item label="菜单图标" prop="icon">
        <el-input v-model="localForm.icon" placeholder="菜单图标" />
      </el-form-item>
    </el-col> -->
    <el-col :span="12">
      <el-form-item label="显示排序" prop="orderNum">
        <el-input-number v-model="localForm.orderNum" controls-position="right" :min="0" :max="100" />
      </el-form-item>
    </el-col>

    <el-col :span="12">
      <el-form-item label="菜单名称" prop="menuName">
        <el-input v-model="localForm.menuName" placeholder="请输入菜单名称" maxlength="20"/>
      </el-form-item>
    </el-col>

    <el-col :span="12" v-if="localForm.menuType == 'C'">
      <el-form-item label="路由名称" prop="routeName">
        <el-input v-model="localForm.routeName" placeholder="请输入路由名称" />
      </el-form-item>
    </el-col>
    <el-col :span="12" v-if="localForm.menuType != 'F'">
      <el-form-item label="是否外链" prop="isFrame">
        <el-radio-group v-model="localForm.isFrame">
                <el-radio label="0">是</el-radio>
                <el-radio label="1">否</el-radio>
              </el-radio-group>
      </el-form-item>
    </el-col>

    <el-col :span="12" v-if="localForm.menuType != 'F'">
      <el-form-item prop="path" label="路由地址">
        <el-input v-model="localForm.path" placeholder="请输入路由地址" />
      </el-form-item>
    </el-col>

    <el-col :span="12" v-if="localForm.menuType == 'C'">
      <el-form-item prop="component" label="组件路径">
        <el-input v-model="localForm.component" placeholder="请输入组件路径" />
      </el-form-item>
    </el-col>

    <el-col :span="12" v-if="localForm.menuType != 'M'">
      <el-form-item prop="perms" label="权限标识">
        <el-input v-model="localForm.perms" placeholder="请输入权限标识" maxlength="100" />
      </el-form-item>
    </el-col>

    <el-col :span="12" v-if="localForm.menuType != 'C'">
      <el-form-item prop="query" label="路由参数">
        <el-input v-model="localForm.query" placeholder="请输入路由参数" maxlength="100" />
      </el-form-item>
    </el-col>

    <el-col :span="12" v-if="localForm.menuType != 'C'">
      <el-form-item prop="isCache" label="是否缓存">
        <el-radio-group v-model="localForm.isCache">
            <el-radio value="0">不缓存</el-radio>
            <el-radio value="1">缓存</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-col>

    <el-col :span="12" v-if="localForm.menuType != 'F'">
        <el-form-item prop="visible" label="显示状态">
            <el-radio-group v-model="localForm.visible">
                <el-radio value="0">显示</el-radio>
                <el-radio value="1">隐藏</el-radio>
            </el-radio-group>
        </el-form-item>
    </el-col>

    <el-col :span="12" v-if="localForm.menuType != 'F'">
        <el-form-item prop="status" label="菜单状态">
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
import { type TreeNode } from '../../../../type/system'
import { menuTree } from '../../../../services/system/menuService'

// ✅ 接收父组件传值
const props = defineProps<{
  modelValue: Record<string, any>,
  title: string
}>()

const defaultProps = {
  multiple: false, // 是否多选
  checkStrictly: true, // 是否父子节点不互相关联
  emitPath: false, // 是否返回选中节点的路径数组
  changeOnSelect: true, // (布尔值) 是否允许选择任意一级的选项
  value: 'menuId',
  label: 'menuName',
  children: 'children',
}

const emit = defineEmits<{
  (e: 'update:modelValue', value: Record<string, any>): void
}>()

// ✅ 本地响应式副本
const localForm = ref<Record<string, any>>({ ...props.modelValue })

// 同步 props 到 localForm
onMounted(() => {
   localForm.value = { ...props.modelValue }
   if (props.title.includes('新增')) {
      localForm.value.menuType= 'M'
      localForm.value.isFrame= '1'
      localForm.value.isCache= '0'
      localForm.value.visible= '0'
      localForm.value.status= '0'
   }
   getMenuTree()
})

const memuOptions = ref<TreeNode[]>([]);

// 获取菜单树
const getMenuTree = async () => {   
    const tree = await menuTree()
    memuOptions.value = tree
}


// ✅ 监听 localForm 的变化并同步到父组件
watch(
  () => localForm.value,
  (newVal) => {
    emit('update:modelValue', newVal)
  },
  { deep: true }
)
</script>