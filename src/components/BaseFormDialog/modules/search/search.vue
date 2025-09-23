<template>
  <el-row :gutter="1">
    <el-col :span="22">
      <el-form-item label="产品" prop="productId">
        <el-cascader
          :options="productList"
          :show-all-levels="false"
          clearable
          :props="productProps"
          placeholder="请选择所属菜单"
          v-model="localForm.productId"
          class="w-full"
        />
      </el-form-item>
    </el-col>

    <el-col :span="22">
      <el-form-item label="体系" prop="categoryId">
        <el-cascader
          :options="categoryList"
          :show-all-levels="false"
          clearable
          :props="categoryProps"
          placeholder="请选择所属菜单"
          v-model="localForm.categoryId"
          class="w-full"
        />
      </el-form-item>
    </el-col>
   
  </el-row>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { productInfo, categoryInfo} from '../../../../services/resource/searchService'

const productProps = {
  multiple: false, 
  checkStrictly: true, 
  emitPath: false, 
  changeOnSelect: true, 
  value: 'relevanceId',
  label: 'productName',
  children: 'children',
}

const categoryProps = {
  multiple: false, 
  checkStrictly: true, 
  emitPath: false, 
  changeOnSelect: true, 
  value: 'categoryId',
  label: 'categoryName',
  children: 'children',
}

const props = defineProps<{
  modelValue: Record<string, any>,
  title: string
}>()

const productList = ref<any[]>([])
const categoryList = ref<any[]>([])

const emit = defineEmits<{
  (e: 'update:modelValue', value: Record<string, any>): void
}>()

const localForm = ref<Record<string, any>>({ ...props.modelValue })

onMounted(async() => {
  
    productList.value = await productInfo()
    categoryList.value = await categoryInfo()

})

watch(
  () => localForm.value,
  (newVal) => {
    emit('update:modelValue', newVal)
  },
  { deep: true }
)
// ✅ 正确做法：监听 props.modelValue 变化
</script>


