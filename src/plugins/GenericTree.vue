<!-- src/components/GenericTree.vue -->
<template>
  <div class=" w-full">
    <el-tree
       ref="treeRef"
      :data="data"
      :props="resolvedProps"
      :lazy="lazy"
      :load="load"
      :show-checkbox="showCheckbox"
      :default-expand-all="defaultExpandAll"
      :default-expanded-keys="defaultExpandedKeys"
      :node-key="nodeKey"
      @node-click="handleNodeClick"
      @node-expand="handleNodeExpand"
      @node-collapse="handleNodeCollapse"
      @current-change="handleCurrentChange"
    >
      <!-- 默认插槽支持自定义节点 -->
      <template #default="{ node, data }">
        <slot name="node" :node="node" :data="data">
          <span>{{ node.label }}</span>
        </slot>
      </template>
    </el-tree>
  </div>
</template>

<script setup lang="ts">
import { ref} from 'vue'
import type { TreeNode } from '../type/system'
import type { ElTree } from 'element-plus'

// Props
const props = defineProps<{
  data: TreeNode[]
  props?: {
    children?: string
    label?: string
    isLeaf?: string
  }
  lazy?: boolean
  load?: (node: any, resolve: (data: TreeNode[]) => void) => void
  defaultExpandAll?: boolean
  nodeKey?: string 
  showCheckbox?: boolean
  defaultExpandedKeys?: []
}>()

const treeRef = ref<InstanceType<typeof ElTree> | null>(null)

// 暴露方法给父组件
defineExpose({
  // 暴露 el-tree 的实例
  treeRef,
  
  // 也可以直接暴露常用方法
  setCurrentKey(key: any) {
    treeRef.value?.setCurrentKey(key)
  },
  getCurrentKey() {
    return treeRef.value?.getCurrentKey()
  }
})

// 默认 props
const resolvedProps = {
  children: props.props?.children ?? 'children',
  label: props.props?.label ?? 'label',
  isLeaf: props.props?.isLeaf ?? 'isLeaf',
}

const emit = defineEmits<{
  (e: 'node-click', data: TreeNode): void
  (e: 'node-expand', node: any, data: TreeNode): void
  (e: 'node-collapse', node: any, data: TreeNode): void
  (e: 'current-change',data: TreeNode,  node: any): void
}>()

const handleCurrentChange = (data: any, node: any) => {
  emit('current-change', data, node)
}

// 事件透传
const handleNodeClick = (data: TreeNode) => {
  emit('node-click', data)
}

const handleNodeExpand = (data: TreeNode, node: any) => {
  emit('node-expand', node, data)
}

const handleNodeCollapse = (data: TreeNode, node: any) => {
  emit('node-collapse', node, data)
}
</script>

<style scoped>

</style>