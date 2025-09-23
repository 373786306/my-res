<template>
    <el-dialog title="选择用户" v-model="visible" width="60%"  :close-on-click-modal="false">
        <div class="p-4 rounded shadow h-full" >    
            <div class="mt-5 mb-4 flex gap-4">
            <BaseSearchForm
                v-model="searchForm"
                :schema="searchSchema"
                @search="handleSearch"
            />
            </div>
            <CommonTable
                :columns="columns"
                :data="users"
                :show-selection="true"
                @selection-change="handleSelectionChange"
                :show-operation="false"
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
            <div class="flex justify-end mt-5">
                <el-button type="primary" @click="handleSelectUser">确 定</el-button>
                <el-button @click="visible = false">取 消</el-button>
            </div>
        </div>
    </el-dialog>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
import type { User } from '../../../type/system'
import { unallocatedList } from '../../../services/system/roleService'
import { ElMessage } from 'element-plus'

const visible = ref(false)
const users = ref<User[]>([])
const totalItems = ref(0)

const props = defineProps<{
  roleId: number | null
  modelValue: boolean
  api?: (selectedIds: number[]) => Promise<any>
}>()



const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'success'): void
  (e: 'roleId', value: number): void

}>()

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

watch(
  () => props.modelValue,
  async (val) => {
    visible.value = val
    if (val) {
        onSearch()
    }
  },
  { immediate: true }
)

watch(
  () => props.roleId,
  async (val) => {
    if (val) {
        searchForm.value.roleId = val
        onSearch()
    }
  },
  { immediate: true }
)

watch(
  () => visible.value,
  (val) => {
    emit('update:modelValue', val)
  }
)

const handleSelectUser = async () => {
    if (props.api){
        if (multipleSelection.value.length === 0) {
            ElMessage.error('请选择需要授权的用户')
        }else{
            await props.api(multipleSelection.value)
            emit('success')
        }
    }
}

const handleSearch = (val: Record<string, any>) => {
  const form = val as userSearch
  searchForm.value = form
  onSearch()
}

// 搜索功能
async function onSearch() {
  const res = await unallocatedList(searchForm.value);  
  users.value = res.rows
  totalItems.value = res.total
}

const multipleSelection = ref<number[]>([])

const handleSelectionChange = (val: User[]) => {
  multipleSelection.value = val.map(item => item.userId)
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