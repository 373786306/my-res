<template>
    <div class="flex-1 justify-center items-center gap-6 h-[90vh] bg-white">
      <div class="p-4 rounded shadow h-full" >
        <h2 class="text-lg mb-4">操作日志</h2>
        <hr class="my-2 border-t border-gray-300">
          <div class="mt-5 mb-4 flex gap-4" v-if="showSearch">
            <BaseSearchForm
              v-model="searchForm"
              :schema="searchSchema"
              @search="handleSearch"
            />
          </div>

          <div class="mt-5 mb-4 flex  items-center gap-4 w-full">
            <el-button type="danger" plain icon="Delete" @click="handleDelete" :disabled = multiple  v-hasPermi="['monitor:logininfor:remove']">删除</el-button>
            <el-button type="danger" plain icon="Delete" @click="handleClean" v-hasPermi="['monitor:logininfor:remove']">清空</el-button>
            <!-- <el-button type="warning" plain icon="Lock" @click="handleExport" v-hasPermi="['monitor:logininfor:export']">导出</el-button> -->
            <Tedd v-model:show-search="showSearch" @query-table="handleQueryTable"  />
          </div>
          <CommonTable
            :columns="columns"
            :data="tableData"
            :show-selection="true"
            :show-expand="true"
            :show-operation="false"
            @selection-change="handleSelectionChange"
          >

            <template #expand="{ row }">
              <el-descriptions class="m-2 ml-10">
              <el-descriptions-item label="操作模块：">{{ row.title }} / {{ row.businessType === 1 ? '新增' : row.businessType === 2 ? '修改' : row.businessType === 3 ? '删除' : row.businessType === 4 ? '授权' : row.businessType === 5 ? '导出' : row.businessType === 6 ? '导入' : row.businessType === 7 ? '强退' : row.businessType === 8 ? '生成代码' : row.businessType === 9 ? '清空数据' : '其他' }}</el-descriptions-item>
              <el-descriptions-item label="请求地址：">{{row.operUrl}}</el-descriptions-item>
              <el-descriptions-item label="登录信息：">{{row.operName}} / {{ row.operIp }} / {{ row.operLocation }}</el-descriptions-item>
              <el-descriptions-item label="请求方式：">{{row.requestMethod}} </el-descriptions-item>
              <el-descriptions-item label="操作方法：">{{row.method}} </el-descriptions-item>
              <el-descriptions-item label="请求参数：">{{row.operParam}} </el-descriptions-item>
              <el-descriptions-item label="返回参数：">{{row.jsonResult}} </el-descriptions-item>
              <el-descriptions-item label="操作状态：">{{ row.status == '0' ? '成功' : '失败' }} </el-descriptions-item>
              <el-descriptions-item label="返回参数：">{{row.jsonResult}} </el-descriptions-item>
              <el-descriptions-item label="消耗时间：">{{row.costTime}} </el-descriptions-item>
              <el-descriptions-item label="操作时间：">{{row.operTime}} </el-descriptions-item>
            </el-descriptions>
            </template>


            <!-- 自定义状态列渲染 -->
             <template #custom-businessType="{ row }">
              <span :class="{
                'text-green-500': row.businessType == '1',
                'text-blue-500': row.businessType == '2',
                'text-red-500': row.businessType == '3',
                'text-yellow-500': row.businessType == '4',
                'text-amber-500': row.businessType == '5',
                'text-orange-500': row.businessType == '6',
                'text-rose-600': row.businessType == '7',
                'text-cyan-500': row.businessType == '8',
                'text-red-700': row.businessType == '9',
                'text-gray-500': row.businessType == '0'
              }">
                {{ row.businessType === 1 ? '新增' : row.businessType === 2 ? '修改' : row.businessType === 3 ? '删除' : row.businessType === 4 ? '授权' : row.businessType === 5 ? '导出' : row.businessType === 6 ? '导入' : row.businessType === 7 ? '强退' : row.businessType === 8 ? '生成代码' : row.businessType === 9 ? '清空数据' : '其他' }}
              </span>
            </template>
           
            <template #custom-status="{ row }">
              <span :class="{
                'text-green-500': row.status == '0',
                'text-red-500': row.status == '1'
              }">{{ row.status == '0' ? '成功' : '失败' }}</span>
            </template>

            <template #action="{ row }">
            <div class="flex flex-wrap justify-center items-center gap-y-1 gap-x-1">
            <el-button size="small" text type="primary" @click="handleView(row)" v-hasPermi="['system:user:edit']">详情</el-button>
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
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { operLog } from '../../../type/system'
import { operInfo, deleteOperInfo, deleteOperClear } from '../../../services/system/logService'
import { ElMessage, ElMessageBox } from 'element-plus'

const searchSchema = [
  {
    label: '操作地址',
    key: 'operIp',
    component: 'Input',
    span: 4
  },
  {
    label: '系统模块',
    key: 'title',
    component: 'Input',
    span: 4
  },
  {
    label: '操作人员',
    key: 'operName',
    component: 'Input',
    span: 4
  },
  {
    label: '类型',
    key: 'businessType',
    component: 'Select',
    options: [
      { label: '新增', value: 1 },
      { label: '修改', value: 2 },
      { label: '删除', value: 3 },
      { label: '授权', value: 4 },
      { label: '导出', value: 5 },
      { label: '导入', value: 6 },
      { label: '强退', value: 7 },
      { label: '生成代码', value: 8 },
      { label: '清空数据', value: 9 },
      { label: '其他', value: 0 }
    ],
    span: 4
  },
  {
    label: '状态',
    key: 'status',
    component: 'Select',
    options: [
      { label: '失败', value: 1 },
      { label: '成功', value: 0 }
    ],
    span: 4
  }
  ,
  {
    label: '操作时间',
    key: 'dateRange',
    component: 'DatePicker',
    span: 4,
    props: {
      type: 'daterange',
      rangeSeparator: '至',
      startPlaceholder: '开始日期',
      endPlaceholder: '结束日期',
      format: 'YYYY-MM-DD',
      valueFormat: 'YYYY-MM-DD'  
    }
  }
]

interface logSearch {
  operIp: string
  title: string
  operName: string
  businessType: number | null
  status: number | null 
  params: {
    beginTime?: string
    endTime?: string
  }
  pageSize: number
  pageNum: number
}

const searchForm = ref<logSearch>({
  operIp: '',
  title: '',
  operName: '',
  businessType: null,
  status: null,
  params: {},
  pageSize: 10,
  pageNum: 1  
})

const operLog = ref<operLog[]>([])

const handleSearch = (val: Record<string, any>) => {
  const { dateRange = [] } = val || {}
  const [startDate, endDate] = dateRange
  const form = val as logSearch
  searchForm.value = {...form, params: { beginTime: startDate ? `${startDate} 00:00:00` : '', endTime: endDate ? `${endDate} 23:59:59` : ''}}
  onSearch()
}

const totalItems = ref(0)

const tableData = ref<operLog[]>([])
// 搜索功能
async function onSearch() {
  const res = await operInfo(searchForm.value);  
  tableData.value = res.rows
  totalItems.value = res.total
}

// 表格列定义
const columns = [
  { label: '日志编号', prop: 'operId', align: 'center' },
  { label: '系统模块', prop: 'title' },
  { label: '操作类型', prop: 'businessType', customRender: true},
  { label: '操作人员', prop: 'operName' },
  { label: '操作地址', prop: 'operIp' },
  { label: '操作地点', prop: 'operLocation' },
  { label: '操作状态', prop: 'status', customRender: true },
  { label: '操作日期', prop: 'operTime', sortable: true},
  { label: '消耗时间', prop: 'costTime'},
]





const handleDelete = async () => {

  await ElMessageBox.confirm(`您确定要删除吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      await deleteOperInfo(multipleSelection.value)
      ElMessage.success('删除成功')
      onSearch()
    }).catch(() => {
      console.log('取消删除')
    })
}

const handleClean = async() => {
  await ElMessageBox.confirm(`您确定要清空所有日志吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      await deleteOperClear()
      ElMessage.success('清空成功')
      onSearch()
    }).catch(() => {
      console.log('取消清空')
    })
}


const handleView = (row: operLog) => {
  console.log('row:   , ', row)
}



const unlock = ref(true)
const selectUser = ref<string>('')

const multipleSelection = ref<number[]>([])
const multiple = ref(true)

const handleSelectionChange = (val: operLog[]) => {
  multipleSelection.value = val.map(item => item.operId)
  unlock.value = multipleSelection.value?.length === 1 ? false : true
  selectUser.value = val[0]?.operName
  multiple.value = multipleSelection.value?.length > 0 ? false : true
  console.log(multipleSelection.value)
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