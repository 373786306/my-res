<template>
  <el-row :gutter="1">
    <el-col :span="22">
      <el-form-item label="名称" prop="productName">
        <el-input v-model="localForm.productName" placeholder="请输入名称" maxlength="50"/>
      </el-form-item>
    </el-col>

    <el-col :span="22">
      <el-form-item label="型号" prop="productModel">
        <el-input v-model="localForm.productModel" placeholder="请输入型号" maxlength="50"/>
      </el-form-item>
    </el-col>

    <el-col :span="11">
      <el-form-item label="类型" prop="productType">
        <el-select v-model="localForm.productType" placeholder="请选择类型">
          <el-option v-for="dict in productTypes" :key="dict.id" :label="dict.name" :value="dict.name"></el-option>
        </el-select>
      </el-form-item>
    </el-col>

    <el-col :span="11">
      <el-form-item label="状态" prop="productStatus">
        <el-select v-model="localForm.productStatus" placeholder="请选择状态">
          <el-option v-for="dict in optionStatus" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
        </el-select>
      </el-form-item>
    </el-col>

    <el-col :span="22">
      <el-form-item label="产品图片" prop="productImage">
        <ImageUpload
            v-model="images"
            :limit="3"
            :max-size="1"
            accept="image/jpeg, image/png"
            />
      </el-form-item>
    </el-col>

    <el-col :span="22">
      <el-form-item label="产品位置图片" prop="productPositionImage">
        <ImageUpload
            v-model="ppImages"
            :limit="3"
            :max-size="1"
            accept="image/jpeg, image/png"
            />
      </el-form-item>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { productLevelInfo } from '../../../../services/atlas/productModule'

const productTypes = ref<any[]>([])
const images = ref<any[]>([])
const ppImages = ref<any[]>([])
const optionStatus = [
        {value: 0, label: '启用'},
        {value: 1, label: '停用'}
    ]

const props = defineProps<{
  modelValue: Record<string, any>,
  title: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: Record<string, any>): void
}>()

const localForm = ref<Record<string, any>>({ ...props.modelValue })

if (props.modelValue.productImage) {
  images.value = props.modelValue.productImage
    .split(',')
    .map((item: string) => ({
      name: item,
      url: props.modelValue.url  + item
    }))
}

if (props.modelValue.productPositionImage) {
  ppImages.value = props.modelValue.productPositionImage
    .split(',')
    .map((item: string) => ({
      name: item,
      url: props.modelValue.url + item
    }))
}


onMounted(async() => {
    const res = await productLevelInfo()
    productTypes.value = res.rows
})


watch(
  () => localForm.value,
  (newVal) => {
    emit('update:modelValue', newVal)
  },
  { deep: true }
)

watch(
  () => images.value,
  (newVal) => {
    localForm.value.productImage = newVal.map(item => item.name).join(',')
  },
  { deep: true }
)

watch(
  () => ppImages.value,
  (newVal) => {
    localForm.value.productPositionImage = newVal.map(item => item.name).join(',')
  },
    
  { deep: true }
)
</script>


