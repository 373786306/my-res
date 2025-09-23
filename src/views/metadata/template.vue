<template>
    <div class="flex-1 justify-center items-center gap-6 h-[90vh] bg-white">
      <div class="p-4 rounded shadow h-full" >
        <h2 class="text-lg font-bold mb-4">模板管理</h2>
        <hr class="my-2 border-t border-gray-300">
          <div class="mt-5 mb-4 flex gap-4" v-if="showSearch">
            <BaseSearchForm
              v-model="searchForm"
              :schema="searchSchema"
              @search="handleSearch"
            />
          </div>

          <div class="mt-5 mb-4 flex justify-between items-center gap-4 w-full">
            <el-button type="primary" plain icon="Plus" @click="onAdd" v-hasPermi="['meta:template:add']">新增</el-button>
            <Tedd v-model:show-search="showSearch" @query-table="handleQueryTable" />
          </div>
          <CommonTable
            :columns="columns"
            :data="tableData"
            :show-selection="false"
          >
            <template #action="{ row }">
              <div class="flex flex-wrap justify-center items-center gap-y-1 gap-x-1">
              <el-button size="small" text type="primary" @click="handleEdit(row)" v-hasPermi="['meta:template:edit']">修改</el-button>
              <el-button size="small" text type="danger" @click="handleDelete(row)" v-hasPermi="['meta:template:remove']">删除</el-button>
              <el-button size="small" text type="primary" @click="handleProperty(row)" v-hasPermi="['meta:template:edit']">编辑属性</el-button>
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
      <BaseFormDialog
        v-model="dialogVisible"
        module="template"
        path="meta"
        :title="title"
        width="30%"
        @success="handleSuccess"
        :api="submit"
        :formData="formData"
        />

    <el-dialog
        v-model="dialogTemplateVisible"
        title="编辑属性"
        width="50%"
        append-to-body
        :close-on-click-modal="false"
        >
            <div class="flex flex-col items-center">
                <el-transfer v-model="propertyValue" :data="propertyData" :titles="['基本属性', '模板属性']"></el-transfer>
                <el-button type="primary" plain size="small" @click="handleAddTemplateProperty" class="mt-6 text-xl">保存模板属性</el-button>
            </div>
       </el-dialog>
    </div>
    
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { post } from '../../type/system'
import { info, edit, add, del, allProperty, templateProperty, addTemplateProperty } from '../../services/metaData/templateService'
import { ElMessage, ElMessageBox } from 'element-plus'

const propertyValue = ref<any[]>([])
const propertyData = ref<any[]>([])



const title = ref('新增属性');
// 菜单搜索表单定义
const searchSchema = [
  {
    label: '模板名称',
    key: 'templateName',
    component: 'Input',
    span: 4
  }
]

interface search {
  templateName: string
  pageSize: number
  pageNum: number
}

const searchForm = ref<search>({
  templateName: '',
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
  { label: '模板名称', prop: 'templateName', align: 'center' },
  { label: '模板描述', prop: 'templateDescription' },
]

const dialogVisible = ref(false)
const dialogTemplateVisible = ref(false)
const formData = ref<any>({})
const templateId = ref('')

const handleProperty = async(row: any) => {

    templateId.value = row.templateId;
    propertyData.value = [];
    propertyValue.value = []
    
    const res =await allProperty();
    res.data.forEach((property: any) => {
      propertyData.value.push({
        label: property.propertyDisplayName,    
        key: property.propertyId
      })
    })

    const result = await templateProperty(row.templateId);

    result.data.forEach((property: any) => {
      propertyValue.value.push(property.propertyId)
    })
      
    dialogTemplateVisible.value = true
}

const handleAddTemplateProperty = async () => {

    let templatePropertyList: any[] = [];
    propertyValue.value.forEach((property) => {
    templatePropertyList.push({
        propertyId: property,
        templateId: templateId.value
        });
    });
    await addTemplateProperty(templatePropertyList)
    ElMessage.success('编辑属性成功')
    dialogTemplateVisible.value = false

}

const onAdd = () => {
    title.value = '新增模板'
    dialogVisible.value = true
}

const submit = async (data: any) => {
  if(title.value === '新增模板'){
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
  title.value = '修改模板'
  dialogVisible.value = true
  formData.value = row
}

const handleDelete = async (row: any) => {
  await ElMessageBox.confirm(`确定要删除吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      await del(row.templateId)
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