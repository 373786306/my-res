<template>
    <div class="flex-1 justify-center items-center gap-6 h-[90vh] bg-white">
      <div class="p-4 rounded shadow h-[70vh]" >
        <h2 class="text-lg font-bold mb-4"></h2>
        <hr class="my-2 border-t border-gray-300">
          <div class="mt-5 mb-4 flex gap-4" v-if="showSearch">
            <BaseSearchForm
              v-model="searchForm"
              :schema="searchSchema"
              @search="handleSearch"
            />
          </div>

          <div class="mt-5 mb-4 flex justify-between items-center gap-4 w-full">
            <el-button type="warning" plain icon="Download" @click="onExport" v-hasPermi="['system:post:add']">导出</el-button>
            <Tedd v-model:show-search="showSearch" @query-table="handleQueryTable" />
          </div>
          <div class="h-full overflow-auto">
            <CommonTable
            :columns="columns"
            :data="tableData"
            :show-selection="false"
            >
              <template #action="{ row }">
                <div class="flex flex-wrap justify-center items-center gap-y-1 gap-x-1">
                <el-button size="small" text type="primary" @click="handleEdit(row)" v-hasPermi="['system:post:edit']">修改</el-button>
                <el-button size="small" text type="danger" @click="handleDelete(row)" v-hasPermi="['system:post:remove']">删除</el-button>
                </div>
              </template>
            </CommonTable> 
          </div>
          
          <!-- <div class="mt-5">
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
          </div> -->
      </div>
    </div>
    <BaseFormDialog
      v-model="dialogVisible"
      module="feedback"
      path="feedback"
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
import { info, edit, del, feedbackExport } from '../../services/feedback/feedbackService'
import { ElMessage, ElMessageBox } from 'element-plus'


const title = ref('');
// 菜单搜索表单定义
const searchSchema = [
    {
    label: '标准编号',
    key: 'standardNo',
    component: 'Input',
    span: 4
  },
  {
    label: '标准名称',
    key: 'standardName',
    component: 'Input',
    span: 4
  }
]

interface postSearch {
  standardNo: string
  standardName: string
  pageSize: number
  pageNum: number
}

const searchForm = ref<postSearch>({
  standardNo: '',
  standardName: '',
  pageSize: 10,
  pageNum: 1
})

const tableData = ref<post[]>([])

const handleSearch = (val: Record<string, any>) => {
  const form = val as postSearch
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
  // { label: '产品组成', prop: 'productComposition', align: 'center' },
  { label: '标准分类', prop: 'industryName' },
  { label: '标准编号', prop: 'standardNo' },
  { label: '标准名称', prop: 'standardName' },
  { label: '适用情况', prop: 'suitSituation' },
  { label: '填报单位', prop: 'fillUnit'},
  { label: '填报人', prop: 'fillBy'},
  { label: '联系方式', prop: 'contact'},
  { label: '评估状态', prop: 'assessStatus'},
  { label: '贯标情况', prop: 'implementationSituation' },
]

const dialogVisible = ref(false)
const formData = ref<any>({})

// 新增
const onExport = async() => {
    await feedbackExport(searchForm.value)
}

const submit = async (data: any) => {
  
  await edit(data)
  dialogVisible.value = false
  onSearch()
}

const handleSuccess = () => {
  ElMessage.success('反馈意见保存成功')
}

// 修改逻辑
const handleEdit = (row: any) => {
  title.value = '修改反馈意见'
  dialogVisible.value = true
  formData.value = row
}

// 删除逻辑
const handleDelete = async (row: any) => {

  await ElMessageBox.confirm(`确定要删除该条信息吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      await del(row.feedbackId)
      ElMessage.success('删除成功')
      onSearch()
    }).catch(() => {
      console.log('取消删除')
    })
}

// function handleSizeChange(val: number) {
//   searchForm.value.pageSize = val
//   onSearch()
// }

// function handleCurrentChange(val: number) {
//   searchForm.value.pageNum = val
//   onSearch()
// }

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