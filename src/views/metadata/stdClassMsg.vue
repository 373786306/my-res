<template>
    <div class="flex-1 justify-center items-center gap-6 h-[90vh] bg-white">
      <div class="p-4 rounded shadow h-full" >
        <!-- <h2 class="text-lg font-bold mb-4">岗位列表</h2>
        <hr class="my-2 border-t border-gray-300"> -->
          <div class="mt-5 mb-4 flex gap-4" v-if="showSearch">
            <BaseSearchForm
              v-model="searchForm"
              :schema="searchSchema"
              @search="handleSearch"
            />
          </div>

          <div class="mt-5 mb-4 flex justify-between items-center gap-4 w-full">
            <el-button type="primary" plain icon="Plus" @click="onAdd" v-hasPermi="['meta:level:add']">新增</el-button>
            <Tedd v-model:show-search="showSearch" @query-table="handleQueryTable" />
          </div>
          <CommonTable
            :columns="columns"
            :data="tableData"
            :show-selection="false"
          >
            <!-- 自定义状态列渲染 -->
            <template #custom-industryStatus="{ row }">
              <span :class="{
                'text-green-500': row.industryStatus == '2',
                'text-red-500': row.industryStatus == '1'
              }">{{ row.industryStatus == '2' ? '已生效' : '未生效' }}</span>
            </template>
            <!-- 自定义操作列 -->
            <template #action="{ row }">
              <div class="flex flex-wrap justify-center items-center gap-y-1 gap-x-1">
              <el-button size="small" text type="primary" @click="handleEdit(row)" v-hasPermi="['meta:level:edit']">修改</el-button>
              <el-button size="small" text type="danger" @click="handleDelete(row)" v-hasPermi="['meta:level:remove']">删除</el-button>
              <el-button size="small" text type="primary" @click="handleCreate(row)" :disabled="row.industryStatus == '2'" v-hasPermi="['meta:level:create']">生效</el-button>
              <el-button size="small" text type="primary" @click="handleProperty(row)" v-hasPermi="['meta:level:add']">属性</el-button>
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
      module="meta"
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
import { info, edit, add, del, createTable } from '../../services/metaData/metaService'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'


const router = useRouter()

const title = ref('新增标准行业');
// 菜单搜索表单定义
const searchSchema = [
  {
    label: '级别名称',
    key: 'industryName',
    component: 'Input',
    span: 4
  },
  {
    label: '级别表名',
    key: 'industryTableName',
    component: 'Input',
    span: 4
  }
]

interface search {
  industryName: string
  industryTableName: string
  pageSize: number
  pageNum: number
}

const searchForm = ref<search>({
  industryName: '',
  industryTableName: '',
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
  { label: '级别名称', prop: 'industryName', align: 'center' },
  { label: '级别表名', prop: 'industryTableName' },
  { label: '级别顺序', prop: 'industryDescription', sortable: true },
  { label: '级别状态', prop: 'industryStatus', customRender: true },
]

const dialogVisible = ref(false)
const formData = ref<any>({})

// 新增
function onAdd() {
  title.value = '新增标准行业'
  dialogVisible.value = true
}

const submit = async (data: any) => {
  if(title.value === '新增标准行业'){
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
  title.value = '修改标准行业'
  dialogVisible.value = true
  formData.value = row
}

const handleDelete = async (row: any) => {
  await ElMessageBox.confirm(`确定要删除吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      await del(row.industryId)
      ElMessage.success('删除成功')
      onSearch()
    }).catch(() => {
      console.log('取消删除')
    })
}

const handleCreate = async (row: any) => {
  await ElMessageBox.confirm(`确定要生效吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
  }).then(async () => {
    await createTable(row.industryId)
    ElMessage.success('操作成功')
    onSearch()
  }).catch(() => {
    console.log('取消操作')
  })
}

const handleProperty = (row: any) => {

  router.push("/metadata/meta-data/property/" + row.industryId + "/" + row.industryStatus)
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