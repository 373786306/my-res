<template>
    <div class="flex-1 justify-center items-center gap-6 h-[90vh] bg-white">
      <div class="p-4 rounded shadow h-full" >
        <h2 class="text-lg font-bold mb-4">岗位列表</h2>
        <hr class="my-2 border-t border-gray-300">
          <div class="mt-5 mb-4 flex gap-4" v-if="showSearch">
            <BaseSearchForm
              v-model="searchForm"
              :schema="searchSchema"
              @search="handleSearch"
            />
          </div>

          <div class="mt-5 mb-4 flex justify-between items-center gap-4 w-full">
            <el-button type="primary" plain icon="Plus" @click="onAdd" v-hasPermi="['system:post:add']">新增</el-button>
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
              <el-button size="small" text type="primary" @click="handleEdit(row)" v-hasPermi="['system:post:edit']">修改</el-button>
              <el-button size="small" text type="danger" @click="handleDelete(row)" v-hasPermi="['system:post:remove']">删除</el-button>
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
      module="post"
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
import type { post } from '../../../type/system'
import { postInfo, editPost, addPost, deletePost } from '../../../services/system/postService'
import { ElMessage, ElMessageBox } from 'element-plus'


const title = ref('新增菜单');
// 菜单搜索表单定义
const searchSchema = [
  {
    label: '岗位编码',
    key: 'postCode',
    component: 'Input',
    span: 6
  },
  {
    label: '岗位名称',
    key: 'postName',
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

interface postSearch {
  postCode: string
  postName: string
  status: number | null
  pageSize: number
  pageNum: number
}

const searchForm = ref<postSearch>({
  postCode: '',
  postName: '',
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
  const res = await postInfo(searchForm.value);  
  posts.value = res.rows
  totalItems.value = res.total
}

// 表格列定义
const columns = [
  { label: '岗位编号', prop: 'postId', align: 'center' },
  { label: '岗位编码', prop: 'postCode' },
  { label: '岗位名称', prop: 'postName' },
  { label: '岗位排序', prop: 'postSort', sortable: true },
  { label: '状态', prop: 'status', customRender: true },
  { label: '创建人', prop: 'createBy'},
  { label: '创建时间', prop: 'createTime', sortable: true },
]

const dialogVisible = ref(false)
const formData = ref<any>({})

// 新增
function onAdd() {
  title.value = '新增岗位'
  dialogVisible.value = true
}

const submit = async (data: any) => {
  if(title.value === '新增岗位'){
    await addPost(data) 
  }else{
    await editPost(data)
  }
  dialogVisible.value = false
  onSearch()
}

const handleSuccess = () => {
  ElMessage.success('岗位保存成功')
}

// 修改逻辑
const handleEdit = (row: any) => {
  title.value = '修改岗位'
  dialogVisible.value = true
  formData.value = row
}

// 删除逻辑
const handleDelete = async (row: any) => {

  await ElMessageBox.confirm(`确定要删除：${row.postName}？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      console.log('点击了确定', row)
      await deletePost(row.postId)
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