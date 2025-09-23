<template>
    <div class="flex-1 justify-center items-center gap-6 h-[90vh] bg-white">
        <div class="p-4 rounded shadow h-full" >    
            <div class="mt-5 mb-4 flex gap-4" v-if="showSearch">
            <BaseSearchForm
              v-model="searchForm"
              :schema="searchSchema"
              @search="handleSearch"
            />
          </div>

          <div class="mt-5 mb-4 flex justify-between items-center gap-4 w-full">
                <div class="flex gap-2 ml-4">
                    <el-button type="primary" plain icon="Plus" @click="onAdd" v-hasPermi="['system:role:add']">添加用户</el-button>
                    <el-button type="danger" plain icon="CircleClose" @click="batcheCancelAuthUser" v-hasPermi="['system:role:remove']">批量取消授权</el-button>
                    <el-button type="warning" plain icon="ArrowUpBold" @click="goBack">返回</el-button>
                </div>
                <Tedd v-model:show-search="showSearch" @query-table="handleQueryTable" />
            </div>
          <CommonTable
            :columns="columns"
            :data="users"
            :show-selection="true"
            @selection-change="handleSelectionChange"
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
              <el-button size="small" text type="warning" @click="handleAuthUser(row)" v-hasPermi="['system:role:remove']">取消授权</el-button>
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
            <select-user 
            v-model="showPopUp" 
            :role-id="searchForm.roleId" 
            :api="submit" 
            @success="handleSuccess" 
            />

        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter  } from 'vue-router'
import type { User } from '../../../type/system'
import { allocatedList, cancelAuthUser, batchCancelAuth, batchAddAuth } from '../../../services/system/roleService'
import { ElMessage, ElMessageBox } from 'element-plus'
import selectUser from './select-user.vue'

const route = useRoute()
const router = useRouter()
const showSearch = ref(true);
const showPopUp = ref(false)

const columns = [
  { label: '用户名称', prop: 'userName' },
  { label: '用户昵称', prop: 'nickName' },
  { label: '手机号码', prop: 'phonenumber' },
  { label: '状态', prop: 'status', customRender: true },
  { label: '创建时间', prop: 'createTime', sortable: true },
]

const searchSchema = [
  {
    label: '用户名称',
    key: 'userName',
    component: 'Input',
    span: 6
  },
  {
    label: '手机号码',
    key: 'phonenumber',
    component: 'Input',
    span: 6
  }
]

interface userSearch {
  userName: string
  roleId: number | null
  phonenumber: string
  pageSize: number
  pageNum: number
}

const searchForm = ref<userSearch>({
  userName: '',
  phonenumber: '',
  roleId: null,
  pageSize: 10,
  pageNum: 1
})

const submit = async (data: number[]) => {
  await batchAddAuth({userIds: data, roleId: searchForm.value.roleId})
}

const handleSuccess = () => {
  ElMessage.success('保存成功')
  showPopUp.value = false
  onSearch()
}

const users = ref<User[]>([])
const totalItems = ref(0)

onMounted(() => {
    const roleId = typeof route.params.roleId === 'string' ? parseInt(route.params.roleId, 10) : null;
    searchForm.value.roleId = Number.isNaN(roleId) ? null : roleId;
    onSearch()
})

const goBack = () => {
  router.back()
}

const handleSearch = (val: Record<string, any>) => {
  const form = val as userSearch
  searchForm.value = form
  onSearch()
}

// 搜索功能
async function onSearch() {
  const res = await allocatedList(searchForm.value);  
  users.value = res.rows
  totalItems.value = res.total
}

function onAdd() {
  showPopUp.value = true
}

const handleQueryTable = () => {
  onSearch()
}

const multipleSelection = ref<number[]>([])

const handleSelectionChange = (val: User[]) => {
  multipleSelection.value = val.map(item => item.userId)
}

const batcheCancelAuthUser = async () => {
  if (multipleSelection.value.length === 0) {
    ElMessage.error('请选择需要取消授权的用户')
  } else {
    await ElMessageBox.confirm(`确定要批量取消授权选中的${multipleSelection.value.length}个用户吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      await batchCancelAuth({userIds: multipleSelection.value, roleId: searchForm.value.roleId})
      ElMessage.success('操作成功')
      onSearch()
    }).catch(() => {
      ElMessage.info('已取消')
    })
  }

}


const handleAuthUser = async(row: User) => {

  await ElMessageBox.confirm(`确定要取消用户：${row.userName}的角色吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      console.log('点击了确定', row)
      await cancelAuthUser({userId: row.userId, roleId: searchForm.value.roleId})
      ElMessage.success('操作成功')
      onSearch()
    }).catch(() => {
      ElMessage.info('已取消')
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
</script>