<template>
  <div class="flex flex-col sm:flex-row items-center justify-end gap-4 px-4 py-3 bg-white">
    <!-- 标签 -->
    <!-- <div class="text-sm text-gray-600">
      总条数：{{ total }}
    </div> -->

    <!-- Element Plus 分页器 -->
    <el-pagination
      :hide-on-single-page="true"
      v-model:current-page="localCurrentPage"
      :page-size="pageSize"
      :small="small"
      :disabled="disabled"
      :background="background"
      :layout="layout"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Props
const props = defineProps<{
  modelValue: number
  pageSize: number
  total: number
  layout?: string
  small?: boolean
  disabled?: boolean
  background?: boolean
}>()

// Emits
const emit = defineEmits<{
  (e: 'update:modelValue', val: number): void
  (e: 'size-change', val: number): void
  (e: 'current-change', val: number): void
}>()

// 双向绑定 currentPage
const localCurrentPage = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

// 事件处理
const handleSizeChange = (val: number) => {
  emit('size-change', val)
}

const handleCurrentChange = (val: number) => {
  emit('current-change', val)
}
</script>