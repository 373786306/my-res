<template>
    <div class="flex-1 justify-center items-center gap-6 h-[90vh] bg-white">
      <div class="p-4 rounded shadow h-full" >
        <h2 class="text-lg mb-4">部门信息</h2>
        <hr class="my-2 border-t border-gray-300">
          <div class="mt-5 mb-4 flex gap-4" v-if="showSearch">
            <BaseSearchForm
              v-model="searchForm"
              :schema="searchSchema"
              @search="handleSearch"
            />
          </div>

          <div class="mt-5 mb-4 flex justify-between items-center gap-4 w-full">
            <el-button type="primary" plain icon="Plus" @click="onAdd" v-hasPermi="['system:dept:add']">新增</el-button>
            <Tedd v-model:show-search="showSearch" @query-table="handleQueryTable" />
          </div>
          <CommonTable
            :columns="columns"
            :data="depts"
            row-key="deptId"
            expandAll="true"
            :show-selection="false"
          >
            <!-- 自定义状态列渲染 -->
            <template #custom-status="{ row }">
              <span :class="{
                'text-green-500': row.status === '0',
                'text-red-500': row.status === '1'
              }">{{ row.status === '0' ? '正常' : '停用' }}</span>
            </template>
            <!-- 自定义操作列 -->
            <template #action="{ row }">
              <div class="flex flex-wrap justify-center items-center gap-y-1 gap-x-1">
              <el-button size="small" text type="primary" @click="handleEdit(row)" v-hasPermi="['system:dept:edit']">修改</el-button>
              <el-button size="small" text type="danger" @click="handleDelete(row)" v-hasPermi="['system:dept:remove']">删除</el-button>
              </div>
            </template>
          </CommonTable> 
      </div>
    </div>
    <BaseFormDialog
      v-model="dialogVisible"
      module="dept"
      path="system"
      :title="title"
      width="50%"
      @success="handleSuccess"
      :api="submit"
      :formData="formData"
    />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { dept } from '../../../type/system'
import { deptInfo, addDept, editDept, deleteDept } from '../../../services/system/deptService'
import { ElMessage, ElMessageBox } from 'element-plus'


const title = ref('新增菜单');
// 菜单搜索表单定义
const searchSchema = [
  {
    label: '部门名称',
    key: 'deptName',
    component: 'Input',
    span: 6
  },
  {
    label: '状态',
    key: 'status',
    component: 'Select',
    options: [
      { label: '停用', value: 1 },
      { label: '正常', value: 0 }
    ],
    span: 6
  }
]

interface deptSearch {
  deptName: string
  status: number | null
}

const searchForm = ref<deptSearch>({
  deptName: '',
  status: null,
})

const depts = ref<dept[]>([])

const handleSearch = (val: Record<string, any>) => {
  const form = val as deptSearch
  searchForm.value = form
  onSearch()
}

// 搜索功能
async function onSearch() {
  const res = await deptInfo(searchForm.value);
  depts.value = res
}

// 表格列定义
const columns = [
  { label: '部门名称', prop: 'deptName', align: 'center' },
  { label: '排序', prop: 'orderNum' },
  { label: '状态', prop: 'status', customRender: true },
  { label: '创建人', prop: 'createBy'},
  { label: '创建时间', prop: 'createTime', sortable: true },
]

const dialogVisible = ref(false)
const formData = ref<any>({})

// 新增
function onAdd() {
  title.value = '新增部门'
  dialogVisible.value = true
}

const submit = async (data: any) => {
  if(title.value === '新增部门'){
    await addDept(data)
  }else{
    await editDept(data)
  }
  dialogVisible.value = false
  onSearch()
}

const handleSuccess = () => {
  ElMessage.success('部门保存成功')
}

// 修改逻辑
const handleEdit = (row: any) => {
  title.value = '修改部门'
  dialogVisible.value = true
  formData.value = row
}

// 删除逻辑
const handleDelete = async (row: any) => {

  await ElMessageBox.confirm(`确定要删除：${row.deptName}？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      console.log('点击了确定', row)
      await deleteDept(row.deptId)
      ElMessage.success('删除成功')
      onSearch()
    }).catch(() => {
      console.log('取消删除')
    })
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