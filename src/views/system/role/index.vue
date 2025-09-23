<template>
    <div class="flex-1 justify-center items-center gap-6 h-[90vh] bg-white">
      <div class="p-4 rounded shadow h-full" >
        <h2 class="text-lg mb-4">角色信息</h2>
        <hr class="my-2 border-t border-gray-300"/>
          <div class="mt-5 mb-4 flex gap-4" v-if="showSearch">
            <BaseSearchForm
              v-model="searchForm"
              :schema="searchSchema"
              @search="handleSearch"
            />
          </div>

          <div class="mt-5 mb-4 flex justify-between items-center gap-4 w-full">
            <el-button type="primary" plain icon="Plus" @click="onAdd" v-hasPermi="['system:role:add']">新增</el-button>
            <Tedd v-model:show-search="showSearch" @query-table="handleQueryTable" />
          </div>
          <CommonTable
            :columns="columns"
            :data="posts"
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
              <el-button size="small" text type="primary" v-if="row.roleId !== 1" @click="handleEdit(row)" v-hasPermi="['system:role:edit']">修改</el-button>
              <el-button size="small" text type="danger" v-if="row.roleId !== 1" @click="handleDelete(row)" v-hasPermi="['system:role:remove']">删除</el-button>
              <el-button size="small" text type="primary" v-if="row.roleId !== 1" @click="onAddScope(row)" v-hasPermi="['system:role:edit']">数据权限</el-button>
              <el-button size="small" text type="primary" v-if="row.roleId !== 1" @click="handleAuthUser(row)" v-hasPermi="['system:role:edit']">分配用户</el-button>
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
      :module="module"
      path="system"
      :title="title"
      width="30%"
      @success="handleSuccess"
      :api="submit"
      :formData="formData"
    />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { post } from '@/type/system'
import { roleInfo, editRole, addRole, deleteRole, dataScope } from '@/services/system/roleService'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'

const router = useRouter()

const module = ref('role')
const title = ref('新增菜单');
// 菜单搜索表单定义
const searchSchema = [
  {
    label: '角色名称',
    key: 'roleName',
    component: 'Input',
    span: 4
  },
  {
    label: '权限字符',
    key: 'roleKey',
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
]

interface postSearch {
  roleName: string
  roleKey: string
  status: number | null
  pageSize: number
  pageNum: number
}

const searchForm = ref<postSearch>({
  roleName: '',
  roleKey: '',
  status: null,
  pageSize: 10,
  pageNum: 1
})

const posts = ref<post[]>([])

const handleSearch = (val: Record<string, any>) => {
  const form = val as postSearch
  searchForm.value = form
  onSearch()
}

const totalItems = ref(0)

// 搜索功能
async function onSearch() {
  const res = await roleInfo(searchForm.value);  
  posts.value = res.rows
  totalItems.value = res.total
}

// 表格列定义
const columns = [
  { label: '角色编号', prop: 'roleId', align: 'center' },
  { label: '角色名称', prop: 'roleName' },
  { label: '权限字符', prop: 'roleKey' },
  { label: '显示顺序', prop: 'roleSort', sortable: true },
  { label: '状态', prop: 'status', customRender: true },
  { label: '创建人', prop: 'createBy'},
  { label: '创建时间', prop: 'createTime', sortable: true },
]

const dialogVisible = ref(false)
const formData = ref<any>({})

const handleAuthUser = async (row: any) => {
  const roleId = row.roleId
  router.push("/system/role-auth/user/" + roleId)
}

// 数据权限
function onAddScope(row: any) {
  title.value = '分配数据权限'
  module.value = 'roleScope'
  dialogVisible.value = true
  formData.value = row

}



// 新增
function onAdd() {
  title.value = '新增角色'
  module.value = 'role'
  dialogVisible.value = true
}

const submit = async (data: any) => {
  if(title.value === '新增角色'){
    await addRole(data) 
  }else if(title.value === '修改角色') {
    await editRole(data)
  }else if(title.value === '分配数据权限') {
    await dataScope(data)
  }
  dialogVisible.value = false
  onSearch()
}

const handleSuccess = () => {
  ElMessage.success('保存成功')
}

// 修改逻辑
const handleEdit = (row: any) => {
  title.value = '修改角色'
  module.value = 'role'
  dialogVisible.value = true
  formData.value = row
}

// 删除逻辑
const handleDelete = async (row: any) => {

  await ElMessageBox.confirm(`确定要删除：${row.roleName}？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      console.log('点击了确定', row)
      await deleteRole(row.roleId)
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