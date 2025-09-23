<template>
    <div class="flex-1 justify-center items-center gap-6 h-[90vh] bg-white">
      <div class="p-4 rounded shadow h-full" >
        <h2 class="text-lg font-bold mb-4">产品模块体系</h2>
        <hr class="my-2 border-t border-gray-300">
          
          <div class="mt-5 mb-4 flex justify-between items-center gap-4 w-full">
            <el-button type="primary" plain icon="Plus" @click="onAdd" v-hasPermi="['pruduct:combination:add']">添加体系节点</el-button>
          </div>
          <CommonTable
            :columns="columns"
            :data="tableData"
            row-key="relevanceId"
            :show-selection="false"
          >
            <template #custom-productStatus="{ row }">
              <span :class="{
                'text-green-500': row.productStatus == '0',
                'text-red-500': row.productStatus == '1'
              }">{{ row.productStatus == '0' ? '启用' : '停用' }}</span>
            </template>
            <template #action="{ row }">
              <div class="flex flex-wrap justify-center items-center gap-y-1 gap-x-1">
              <el-button size="small" text type="primary" @click="handleAdd(row)" v-hasPermi="['pruduct:combination:add']">添加下级节点</el-button>
              <el-button size="small" text type="danger" @click="handleDelete(row)" v-hasPermi="['pruduct:combination:remove']">删除</el-button>
              </div>
            </template>
          </CommonTable> 
      </div>
    </div>
    <el-dialog title="添加标准产品" v-model="dialogVisible" width="60%"  :close-on-click-modal="false">

        <CommonTable
            :columns="columns"
            :data="productData"
            :showOperation="false"
            :showSelection="true"
            @selection-change="handleSelectionChange"
          >
          <template #custom-productStatus="{ row }">
              <span :class="{
                'text-green-500': row.productStatus == '0',
                'text-red-500': row.productStatus == '1'
              }">{{ row.productStatus == '0' ? '启用' : '停用' }}</span>
            </template>
        </CommonTable>
        <div class="flex flex-wrap justify-center items-center gap-y-1 gap-x-1 mt-4">
            <el-button plain type="primary" @click="submit" class="mr-6">确认</el-button>
            <el-button plain type="danger" @click="dialogVisible = false">取消</el-button>
        </div>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { info, productList, add, del } from '../../services/atlas/productCombine'
import { ElMessage, ElMessageBox } from 'element-plus'

const tableData = ref<any[]>([])
const productData = ref<any[]>([])
const parentId = ref('')

// 搜索功能
async function onSearch() {
  const res = await info()
  tableData.value = res.rows
}

// 表格列定义
const columns = [
  { label: '产品名称', prop: 'productName', align: 'left' },
  { label: '产品型号', prop: 'productModel' },
  { label: '产品类型', prop: 'productType' },
  { label: '状态', prop: 'productStatus', customRender: true },
]

const dialogVisible = ref(false)

const searchForm = ref({
  productStatus: '0',
  productTier: '1',
  pageSize: 10,
  pageNum: 1
})

// 新增用户
const onAdd = async() => {
  parentId.value = '0'
  searchForm.value.productTier = '1'
  await productInfo()
  dialogVisible.value = true
}

const productInfo = async () => {
  const res = await productList(searchForm.value)
  productData.value = res.rows
}

const multipleSelection = ref<string[]>([])

const handleSelectionChange = (val: any[]) => {
  multipleSelection.value = val.map(item => item.productId)
}

const submit = async () => {
  const product: any[] = []
  multipleSelection.value.forEach((item: string) => {
    const params = {
      sonId: item,
      fatherId: parentId.value
    }
    product.push(params)
  })

  await add(product)
  dialogVisible.value = false
  ElMessage.success('添加成功')
  onSearch()
}



// 修改逻辑
const handleAdd = async (row: any) => {
  console.log('handleAdd', row)
  parentId.value = row.relevanceId
  const num: number = parseInt(row.productTier) + 1
  searchForm.value.productTier = num.toString()
  await await productInfo()
  dialogVisible.value = true
}

// 删除逻辑
const handleDelete = async (row: any) => {

  await ElMessageBox.confirm(`确定要删除吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      console.log('点击了确定', row)
      await del(row.relevanceId)
      ElMessage.success('删除成功')
      onSearch()
    }).catch(() => {
      console.log('取消删除')
    })
}

onMounted(() => {
  onSearch()
})

</script>

<style scoped>
.el-button--small {
    font-size: 12px;
    padding: 5px 5px !important;
}
.el-button+.el-button {
    margin-left: 1px !important;
}
</style>