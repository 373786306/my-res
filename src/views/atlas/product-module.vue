<template>
  <div> 
        <div class="flex gap-6 h-[80vh] mt-4 ml-2">
            <div class="w-4/12 bg-white p-4 rounded shadow">
                <div class="flex justify-between items-center">
                    <h2 class="text-lg font-bold mb-2">标准分类体系</h2>    
                    <el-button type="primary" plain  v-hasPermi="['product:module:add']" @click="onAdd" >新增</el-button>    
                </div>
                <hr class="my-2 border-t border-gray-300">
                <CommonTable
                :columns="LevelColumns"
                :data="tableData"
                :show-selection="false"
                operWidth="120rem"
                @row-click="handleRowClick" 
                >
                <template #action="{ row }">
                    <div class="flex flex-wrap justify-center items-center gap-y-1 gap-x-1">
                    <el-button size="small" text type="primary" v-if="row.userId !== 1" @click="handleEdit(row)" v-hasPermi="['product:module:edit']">修改</el-button>
                    <el-button size="small" text type="danger" v-if="row.userId !== 1" @click="handleDelete(row)" v-hasPermi="['product:module:remove']">删除</el-button>
                    </div>
                </template>
                </CommonTable>
            </div>
            <div class="w-8/12 bg-white p-4 rounded shadow mr-2">
                <div class="flex justify-between items-center">
                    <h2 class="text-lg font-bold mb-4">标准分类信息</h2>
                    <el-button type="primary" plain  v-hasPermi="['product:product:add']" @click="onAdd1" >新增</el-button>   
                </div>
                <hr class="my-2 border-t border-gray-300">
                <div >
                     
                  <CommonTable
                    :columns="columns"
                    :data="tableData1"
                    :show-selection="false"
                    operWidth="140rem"
                    >
                    <template #custom-productStatus="{ row }">
                      <span :class="{
                        'text-green-500': row.productStatus == '0',
                        'text-red-500': row.productStatus == '1'
                      }">{{ row.productStatus == '0' ? '启用' : '禁用' }}</span>
                    </template>
                    <template #action="{ row }">
                        <div class="flex flex-wrap justify-center items-center gap-y-1 gap-x-1">
                        <el-button size="small" text type="primary" v-if="row.userId !== 1" @click="handleModuleEdit(row)" v-hasPermi="['product:product:edit']">修改</el-button>
                        <el-button size="small" text type="danger" v-if="row.userId !== 1" @click="handleModuleDelete(row)" v-hasPermi="['product:product:remove']">删除</el-button>
                        </div>
                    </template>
                  </CommonTable>


                </div>
            </div>
        </div>
            <BaseFormDialog
                v-model="dialogVisible"
                :module="module"
                path="atlas"
                width="30%"
                :title="title"
                @success="handleSuccess"
                :api="submit"
                :formData="formData"
            />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { productLevelInfo, moduleInfo, add, edit, del, addModule, editModule, delModule } from '../../services/atlas/productModule'
import { ElMessage, ElMessageBox } from 'element-plus'

const dialogVisible = ref(false)
const title = ref('新增产品分类');
const formData = ref<any>({})
const tableData = ref<any[]>([])
const totalItems = ref(0)
const tableData1 = ref<any[]>([])

const module = ref('')

const searchForm = ref({
  productCategoryId: '',
  productTier: '',
  pageSize: 1000,
  pageNum: 1
})

const LevelColumns = [
  { label: '名称', prop: 'name', align: 'center' },
  { label: '层级', prop: 'tier' },
  
]

const columns = [
  { label: '名称', prop: 'productName', align: 'center' },
  { label: '类型', prop: 'productType' },
  { label: '型号', prop: 'productModel' },
  { label: '状态', prop: 'productStatus', customRender: true },
]

onMounted(() => {
  onSearch()
})

function onAdd1() {
    title.value = '新增产品模块'
    module.value = 'module'
    dialogVisible.value = true
}

const handleRowClick = (row: any) => {
  searchForm.value.productCategoryId = row.id
  searchForm.value.productTier = row.tier
  productModuleInfo()

}

// 分类逻辑 
function onAdd() {
  module.value = 'level'
  dialogVisible.value = true
  title.value = '新增产品分类'
}

const handleEdit = (row: any) => {
  module.value = 'level'
  title.value = '修改产品分类'
  formData.value = row
  dialogVisible.value = true
  
}

const handleDelete = async (row: any) => {
  await ElMessageBox.confirm(`确定要删除吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      await del(row.id)
      ElMessage.success('删除成功')
      onSearch()
    }).catch(() => {
      console.log('取消删除')
    })
}

const handleModuleEdit = (row: any) => {
  title.value = '修改产品模块'
  module.value ='module'
  formData.value = row
  dialogVisible.value = true
  
}

const handleModuleDelete = async (row: any) => {
  await ElMessageBox.confirm(`确定要删除吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      console.log('row: ', row) 
      await delModule(row.productId)
      ElMessage.success('删除成功')
      productModuleInfo()
    }).catch(() => {
      console.log('取消删除')
    })
}

const submit = async (data: any) => {

  if(title.value === '新增产品分类'){
    await add(data)
  }else if(title.value === '修改产品分类'){
    await edit(data)
  }else if(title.value === '新增产品模块'){
    data.productCategoryId = searchForm.value.productCategoryId
    data.productTier = searchForm.value.productTier
    console.log('data: ', data)
    await addModule(data)
  }else if(title.value === '修改产品模块'){
    data.productCategoryId = searchForm.value.productCategoryId
    await editModule(data)
  }
  onSearch()
}
const handleSuccess = () => {
  ElMessage.success('保存成功')
}



async function onSearch() {
  const res = await productLevelInfo();
  tableData.value = res.rows
  totalItems.value = res.total
  if(tableData.value.length > 0){
    searchForm.value.productCategoryId = tableData.value[0].id
    searchForm.value.productTier = tableData.value[0].tier
  }
  productModuleInfo()
}

const productModuleInfo = async () => {
  const res = await moduleInfo(searchForm.value)
  tableData1.value = res.rows
}


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