<template>
    <div class="flex-1 justify-center items-center gap-6 h-[90vh] bg-white">
      <div class="p-4 rounded shadow h-full" >
        <h2 class="text-lg mb-4">登录日志</h2>
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
            <el-button type="primary" plain icon="Lock" @click="handleUnlock" :disabled = unlock v-hasPermi="['monitor:logininfor:unlock']">解锁</el-button>
            <!-- <el-button type="warning" plain icon="Lock" @click="handleExport" v-hasPermi="['monitor:logininfor:export']">解锁</el-button> -->
            <Tedd v-model:show-search="showSearch" @query-table="handleQueryTable"  />
          </div>
          <CommonTable
            :columns="columns"
            :data="loginLogs"
            :show-selection="true"
            :show-operation="false"
            @selection-change="handleSelectionChange"
          >
            <!-- 自定义状态列渲染 -->
            <template #custom-status="{ row }">
              <span :class="{
                'text-green-500': row.status === '0',
                'text-red-500': row.status === '1'
              }">{{ row.status === '0' ? '正常' : '停用' }}</span>
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
import type { loginLog } from '../../../type/system'
import { loginInfo, deleteInfo, deleteClear, unlockUser } from '../../../services/system/logService'
import { ElMessage, ElMessageBox } from 'element-plus'

const searchSchema = [
  {
    label: '登录地址',
    key: 'ipaddr',
    component: 'Input',
    span: 4
  },
  {
    label: '用户名称',
    key: 'userName',
    component: 'Input',
    span: 4
  },
  {
    label: '状态',
    key: 'status',
    component: 'Select',
    options: [
      { label: '停用', value: 1 },
      { label: '正常', value: 0 }
    ],
    span: 4
  }
  ,
  {
    label: '登录时间',
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
  ipaddr: string
  userName: string
  status: number | null
  params: {
    beginTime?: string
    endTime?: string
  }
  pageSize: number
  pageNum: number
}

const searchForm = ref<logSearch>({
  status: null,
  ipaddr: '',
  userName: '',
  params: {},
  pageSize: 10,
  pageNum: 1
})

const loginLogs = ref<loginLog[]>([])

const handleSearch = (val: Record<string, any>) => {
  const { dateRange = [] } = val || {}
  const [startDate, endDate] = dateRange
  const form = val as logSearch
  searchForm.value = {...form, params: { beginTime: startDate ? `${startDate} 00:00:00` : '', endTime: endDate ? `${endDate} 23:59:59` : ''}}
  onSearch()
}

const totalItems = ref(0)

// 搜索功能
async function onSearch() {
  const res = await loginInfo(searchForm.value);  
  loginLogs.value = res.rows
  totalItems.value = res.total
}

// 表格列定义
const columns = [
  { label: '访问编号', prop: 'infoId', align: 'center' },
  { label: '用户名称', prop: 'userName' },
  { label: '登录地址', prop: 'ipaddr' },
  { label: '登录地点', prop: 'loginLocation'},
  { label: '浏览器', prop: 'browser'},
  { label: '操作系统', prop: 'os'},
  { label: '登录状态', prop: 'status', customRender: true },
  { label: '操作信息', prop: 'msg'},
  { label: '登录日期', prop: 'loginTime', sortable: true },
]

const handleDelete = async () => {

  await ElMessageBox.confirm(`您确定要删除吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      await deleteInfo(multipleSelection.value)
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
      await deleteClear()
      ElMessage.success('清空成功')
      onSearch()
    }).catch(() => {
      console.log('取消清空')
    })
}

const unlock = ref(true)
const selectUser = ref<string>('')

const handleUnlock = async () => {
  
  if (!unlock.value){
    await ElMessageBox.confirm(`是否解锁该用户？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      await unlockUser(selectUser.value)
      ElMessage.success('解锁成功')
      onSearch()
    }).catch(() => {
      console.log('取消清空')
    })
  }
}

// const handleExport = async() => {

//   await exportExcel()

// }

const multipleSelection = ref<number[]>([])
const multiple = ref(true)

const handleSelectionChange = (val: loginLog[]) => {
  multipleSelection.value = val.map(item => item.infoId)
  unlock.value = multipleSelection.value?.length === 1 ? false : true
  selectUser.value = val[0]?.userName
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