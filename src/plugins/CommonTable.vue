<template>
  <div class="p-4 bg-white rounded shadow">
    <el-table
      :data="sortedData"
      border
      :row-key="rowKey"
      :default-expand-all = "expandAll"
      stripe
      @sort-change="handleSortChange"
      @selection-change="handleSelectionChange"
      @row-click="handleRowClick"
      table-layout="auto"
      class="w-full"
    >
      <!-- 索引列 -->
      <el-table-column type="index" label="#" v-if="showIndex" width="100rem"></el-table-column>
      <!-- 多选列 -->
      <el-table-column v-if="showSelection" type="selection" width="50" />

      
      <!-- 🔥 展开列 -->
      <el-table-column v-if="showExpand" type="expand" width="50">
        <template #default="props">
          <!-- 将展开内容交给父组件自定义 -->
          <slot name="expand" :row="props.row" />
        </template>
      </el-table-column>

      <!-- 动态列 -->
      <el-table-column
        v-for="col in columns"
        :key="col.prop"
        :prop="col.prop"
        :label="col.label"
        :align="col.align || 'center'"
        :width="col.width"
        :min-width="col.minWidth"
        :sortable="col.sortable ? col.sortable : false"
      >
        <!-- 自定义单元格渲染 -->
        <template #default="scope">
          <!-- 自定义渲染 -->
          <slot
            v-if="col.customRender"
            :name="`custom-${col.prop}`"
            :row="scope.row"
          />
          <!-- 默认渲染 -->
          <span v-else class="cell-text">
            {{ scope.row[col.prop] }}
          </span>
        </template>
      </el-table-column>

      <!-- 操作列：通过插槽暴露给父组件 -->
      <el-table-column label="操作" align="left" v-if="showOperation" :width="operWidth">
        <template #default="scope">
          <slot name="action" :row="scope.row" />
        </template>
      </el-table-column>
    </el-table>

    <!-- 插槽：底部内容 -->
    <slot name="footer" :selectedRows="selectedRows" />
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElTable, ElTableColumn } from 'element-plus'

// 定义列类型
interface Column {
  label: string
  prop: string
  align?: string
  width?: string | number
  minWidth?: string | number
  sortable?: boolean | 'custom' // 是否可排序
  customRender?: boolean // 是否需要自定义渲染
}

// 定义 props

const props = withDefaults(
  defineProps<{
    columns: Column[]
    data: any[]
    showSelection?: boolean
    rowKey?: string
    operWidth?: string | number
    expandAll?: boolean
    showOperation?: boolean
    showExpand?: boolean
    showIndex?: boolean
  }>(),
  {
    showOperation: true,
    showSelection: false,
    showExpand: false,
    operWidth: '200rem',
    showIndex: false,
  }
)

// 定义事件
const emit = defineEmits<{
  (e: 'sort-change', payload: { prop: string; order: 'ascending' | 'descending' | null }): void
  (e: 'selection-change', rows: any[]): void 
  (e: 'row-click', row: any): void
}>()

// 多选数据
const selectedRows = ref<any[]>([])

// 多选事件
const handleSelectionChange = (rows: any[]) => {
  selectedRows.value = rows
  emit('selection-change', rows)
}

const handleRowClick = (row: any) => {
  emit('row-click', row)
}

// 排序逻辑
const sortConfig = ref<{
  prop: string | null
  order: 'ascending' | 'descending' | null
}>({
  prop: null,
  order: null,
})

const sortedData = computed(() => {
  const { prop, order } = sortConfig.value
  if (!prop || !order) return props.data

  return [...props.data].sort((a, b) => {
    const valA = a[prop]
    const valB = b[prop]
    if (valA < valB) return order === 'ascending' ? -1 : 1
    if (valA > valB) return order === 'ascending' ? 1 : -1
    return 0
  })
})

// 排序事件
const handleSortChange = (payload: { column: any; prop: string; order: 'ascending' | 'descending' | null }) => {
  sortConfig.value = {
    prop: payload.prop,
    order: payload.order,
  }
  emit('sort-change', payload)
}
</script>



<style scoped>

</style>