<template>
  <div>
    <div class="flex gap-6 h-[90vh]">
      <!-- 左边：部门树 -->
       <div class="w-1/4 bg-white p-4 rounded shadow">
        <h2 class="text-lg mb-2">部门信息</h2>
        <hr class="my-2 border-t border-gray-300">
        <GenericTree
          :data="departmentTree"
          :props="{ children: 'children', label: 'label' }"
          default-expand-all
          node-key="id"
          @node-click="handleNodeClick"
        >
        <template #node="{ node, data }">
            <span class="custom-node" :style="{ fontWeight: node.isLeaf ? 'normal' : 'bold' }">
              🔹 {{ data.label }}
            </span>
          </template>
        </GenericTree>
    </div>
      
      <!-- 右边：用户表格 -->
    <div class="w-3/4 bg-white p-4 rounded shadow">
      <h2 class="text-lg mb-2">用户信息</h2>
      <hr class="my-2 border-t border-gray-300">
        <div class="mt-5 mb-4 flex gap-4" v-if="showSearch">
          <BaseSearchForm
            v-model="searchForm"
            :schema="searchSchema"
            @search="handleSearch"
          />
        </div>

        <div class="mt-5 mb-4 flex items-center gap-4 w-full">
          <el-button type="primary" plain icon="Plus" @click="onAdd" class="mr-2" v-hasPermi="['system:user:add']">新增</el-button>
          <Tedd v-model:show-search="showSearch" @query-table="handleQueryTable" />
        </div>
        <CommonTable
          :columns="columns"
          :data="users"
          :show-selection="false"
          @sort-change="handleSortChange"
          @selection-change="handleSelectionChange"
        >
          <!-- 自定义状态列渲染 -->
          <template #custom-status="{ row }">
            <el-switch v-model="row.status" active-value="0" inactive-value="1" @change="(newStatus:string) => handleStatusChange(newStatus, row)"></el-switch>
            
          </template>
          <!-- 自定义操作列 -->
          <template #action="{ row }">
            <div class="flex flex-wrap justify-center items-center gap-y-1 gap-x-1">
            <el-button size="small" text type="primary" v-if="row.userId !== 1" @click="handleEdit(row)" v-hasPermi="['system:user:edit']">修改</el-button>
            <el-button size="small" text type="primary" v-if="row.userId !== 1" @click="handleUpdatePassword(row)" v-hasPermi="['system:user:resetPwd']">重置密码</el-button>
            <el-button size="small" text type="danger" v-if="row.userId !== 1" @click="handleDelete(row)" v-hasPermi="['system:user:remove']">删除</el-button>
            </div>
          </template>
          <!-- 底部插槽 -->
          <!-- <template #footer="{ selectedRows }">
            <div class="mt-4 text-sm text-gray-600">
              当前已选中 {{ selectedRows.length }} 条记录
            </div>
          </template> -->
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
      module="user"
      path="system"
      :title="title"
      @success="handleSuccess"
      :api="submitUser"
      :formData="formData"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { TreeNode, User } from '@/type/system'
import { deptTree, userInfo, changeUserStatus, addUser, updateUser, deleteUser, updatePassword } from '@/services/system/userSservice'
import { ElMessage, ElMessageBox } from 'element-plus'


const title = ref('新增用户');
// 角色页面搜索字段
const searchSchema = [
  {
    label: '用户名',
    key: 'userName',
    component: 'Input',
    span: 6
  },
  {
    label: '状态',
    key: 'status',
    component: 'Select',
    options: [
      { label: '启用', value: 1 },
      { label: '禁用', value: 0 }
    ],
    span: 6
  }
]

// 表格列定义
const columns = [
  { label: '用户编号', prop: 'userId', align: 'center', sortable: true },
  { label: '用户名称', prop: 'userName' },
  { label: '用户昵称', prop: 'nickName' },
  { label: '部门', prop: 'dept.deptName' },
  { label: '手机号码', prop: 'phonenumber' },
  { label: '状态', prop: 'status', customRender: true },
  { label: '创建时间', prop: 'createTime', sortable: true },
]

// 当前选中的行
const selectedRows = ref<any[]>([])

const dialogVisible = ref(false)

// 选中处理
const handleSelectionChange = (row: any) => {
  selectedRows.value = row
}

// 新增用户
function onAdd() {
  dialogVisible.value = true
  title.value = '新增用户'
}


const submitUser = async (data: any) => {

  if(title.value === '新增用户'){
    await addUser(data)
  }else if(title.value === '修改用户'){
    await updateUser(data)
  }else if(title.value === '重置密码'){
    await updatePassword(data.userId, data.password)
  }
  onSearch()
}

const formData = ref<any>({})

const handleSuccess = () => {
  ElMessage.success('用户保存成功')
}

// 修改逻辑
const handleEdit = (row: any) => {
  title.value = '修改用户'
  dialogVisible.value = true
  formData.value = row
}

// 删除逻辑
const handleDelete = async (row: any) => {

  await ElMessageBox.confirm(`确定要删除用户：${row.userName}？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      await deleteUser(row.userId)
      ElMessage.success('删除成功')
      onSearch()
    }).catch(() => {
      console.log('取消删除')
    })
}


const handleUpdatePassword = async (row: any) => {
  
  title.value = '重置密码'
  dialogVisible.value = true
  formData.value = row
}
// 排序处理
const handleSortChange = (payload: any) => {
  console.log('排序变化:', payload)
}

const totalItems = ref(0)

onMounted(() => {
  tree()
  onSearch()
})

interface UserSearch {
  userName: string
  status: number | null
  deptId: number | null
  pageSize: number
  pageNum: number
}

const searchForm = ref<UserSearch>({
  userName: '',
  status: null,
  deptId: null,
  pageSize: 10,
  pageNum: 1
})

const handleSearch = (val: Record<string, any>) => {
  const form = val as UserSearch
  searchForm.value = form
  onSearch()
}

function handleSizeChange(val: number) {
  searchForm.value.pageSize = val
  onSearch()
}

function handleCurrentChange(val: number) {
  searchForm.value.pageNum = val
  onSearch()
}

const handleNodeClick = (data: TreeNode) => {
  searchForm.value.deptId = Number(data.id)
  onSearch()
}

const departmentTree = ref<TreeNode[]>([])

const tree = async () => {
  const treeData = await deptTree()
  departmentTree.value = treeData
} 

const showSearch = ref(true);

const users = ref<User[]>([])

let isFirstTrigger = true;
const handleStatusChange = (val:string, row: User) => {
  if (isFirstTrigger) {
    isFirstTrigger = false;
    return;
  }
  const userId = row.userId;
  changeUserStatus(userId, val)
}

const handleQueryTable = () => {
  onSearch()
}

// 搜索功能
async function onSearch() {
  const res = await userInfo(searchForm.value);
  users.value = res.rows
  totalItems.value = res.total
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