<template>
    <div class="flex-1 justify-center items-center gap-6 h-[90vh] bg-white">
      <div class="p-4 rounded shadow h-full" >
        <h2 class="text-lg font-bold mb-4">属性管理</h2>
        <hr class="my-2 border-t border-gray-300">
          <div class="mt-5 mb-4 flex gap-4" v-if="showSearch">
            <BaseSearchForm
              v-model="searchForm"
              :schema="searchSchema"
              @search="handleSearch"
            />
          </div>

          <div class="mt-5 mb-4 flex justify-between items-center gap-4 w-full">
            <el-button type="primary" plain icon="Plus" @click="onAdd" v-hasPermi="['meta:property:add']">新增</el-button>
            <Tedd v-model:show-search="showSearch" @query-table="handleQueryTable" />
          </div>
          <CommonTable
            :columns="columns"
            :data="tableData"
            :show-selection="false"
            operWindth="150rem"
          >
            <template #custom-propertyValueType="{ row }">
                 <span>{{ row.propertyValueType === 'string' ? '字符型' : row.propertyValueType === 'boolean' ? '布尔型' : row.propertyValueType === 'numeric' ? '数字型' : row.propertyValueType === 'datetime' ? '日期型' : row.propertyValueType === 'reference' ? '引用型' : '' }}</span>
            </template>
            <template #custom-propertyReferenceType="{ row }">
                <span>{{ row.propertyReferenceType === 'dict' ? '字典' : row.propertyReferenceType === 'file' ? '单附件' : row.propertyReferenceType === 'files' ? '多附件' :'' }}</span>
            </template>
            <template #action="{ row }">
              <div class="flex flex-wrap justify-center items-center gap-y-1 gap-x-1">
              <el-button size="small" text type="primary" @click="handleEdit(row)" v-hasPermi="['meta:property:edit']">修改</el-button>
              <el-button size="small" text type="danger" @click="handleDelete(row)" v-hasPermi="['meta:property:remove']">删除</el-button>
              </div>
            </template>
          </CommonTable> 
          <div class="mt-5">
         <Pagination
          v-model:modelValue="searchForm.pageNum"
          :page-size="searchForm.pageSize"
          :total="totalItems"
          layout="sizes,prev, pager, next"
          :small="false"
          :disabled="false"
          :background="true"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
      </div>
    </div>
    <BaseFormDialog
      v-model="dialogVisible"
      module="property"
      path="meta"
      :title="title"
      width="30%"
      @success="handleSuccess"
      :api="submit"
      :formData="formData"
    />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { post } from '../../type/system'
import { info, edit, add, del } from '../../services/metaData/propertyService'
import { ElMessage, ElMessageBox } from 'element-plus'


const title = ref('新增属性');
// 菜单搜索表单定义
const searchSchema = [
  {
    label: '名称',
    key: 'propertyName',
    component: 'Input',
    span: 4
  },
  {
    label: '显示名称',
    key: 'propertyDisplayName',
    component: 'Input',
    span: 4
  }
]

interface search {
  propertyName: string
  propertyDisplayName: string
  pageSize: number
  pageNum: number
}

const searchForm = ref<search>({
  propertyName: '',
  propertyDisplayName: '',
  pageSize: 10,
  pageNum: 1
})

const tableData = ref<post[]>([])

const handleSearch = (val: Record<string, any>) => {
  const form = val as search
  searchForm.value = form
  onSearch()
}

const totalItems = ref(0)

// 搜索功能
async function onSearch() {
  const res = await info(searchForm.value);  
  tableData.value = res.rows
  totalItems.value = res.total
}

// 表格列定义
const columns = [
  { label: '名称', prop: 'propertyName', align: 'center' },
  { label: '显示名称', prop: 'propertyDisplayName' },
  { label: '值类型', prop: 'propertyValueType', customRender: true },
  { label: '值长度', prop: 'propertyValueLength' },
  { label: '引用类型', prop: 'propertyReferenceType', customRender: true },
  { label: '引用值', prop: 'propertyReferenceValue'},
  { label: '描述', prop: 'propertyDescription'},
]

const dialogVisible = ref(false)
const formData = ref<any>({})

// 新增
function onAdd() {
  title.value = '新增属性'
  dialogVisible.value = true
}

const submit = async (data: any) => {
  if(title.value === '新增属性'){
    await add(data) 
  }else{
    await edit(data)
  }
  dialogVisible.value = false
  onSearch()
}

const handleSuccess = () => {
  ElMessage.success('保存成功')
}

const handleEdit = (row: any) => {
  title.value = '修改属性'
  dialogVisible.value = true
  formData.value = row
}

const handleDelete = async (row: any) => {
  await ElMessageBox.confirm(`确定要删除吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      await del(row.propertyId)
      ElMessage.success('删除成功')
      onSearch()
    }).catch(() => {
      console.log('取消删除')
    })
}

function handleSizeChange(val: number) {
  searchForm.value.pageSize = val
  onSearch()
}

function handleCurrentChange(val: number) {
  searchForm.value.pageNum = val
  onSearch()
}

onMounted(() => {
  onSearch()
})

const showSearch = ref(true);

const handleQueryTable = () => {
  onSearch()
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