<template>
  <div>
    <div class="flex gap-6 h-[90vh]">
       <div class="w-1/4 bg-white p-4 rounded shadow">
        <h2 class="text-lg font-bold mb-4">组件体系</h2>
        <hr class="my-2 border-t border-gray-300">
        <GenericTree
          :data="productTree"
          :props="{ children: 'children', label: 'productName' }"
          default-expand-all
          node-key="relevanceId"
          @node-click="handleNodeClick"
          class="mt-6 ml-4"
        />
    </div>
      
    <div class="w-3/4 bg-white p-4 rounded shadow">
      <h2 class="text-lg font-bold mb-4">标准列表</h2>
      <hr class="my-2 border-t border-gray-300">
        <div class="mt-5 mb-4 flex items-center gap-4 w-full">
          <el-button type="primary" plain icon="Plus" @click="onAdd" class="mr-2" v-hasPermi="['system:user:add']">映射</el-button>
        </div>
        <CommonTable
          :columns="columns"
          :data="tableData"
          :showIndex="true"
        >
          <template #action="{ row }">
            <div class="flex flex-wrap justify-center items-center gap-y-1 gap-x-1">
            <el-button size="small" text type="danger"  @click="handleDelete(row)" v-hasPermi="['system:user:remove']">删除</el-button>
            </div>
          </template>
        </CommonTable> 
      
    </div>
    </div>
    <el-dialog title="添加标准映射信息" v-model="dialogVisible" width="60%"  :close-on-click-modal="false">
        
         <BaseSearchForm
            v-model="dialogSearchForm"
            :schema="searchSchema"
            @search="handleSearch"
          />   
        <el-tabs v-model="activeName" @tab-click="handleClick" :stretch = "true">
          <el-tab-pane 
            v-for="item in industryData" 
            :key="item.industryId" 
            :label="item.industryName" 
            :name="item.industryId"
            style="height:500px;overflow-y:auto;overflow-x:hidden;">

            <CommonTable
                :columns="columns"
                :data="stdData"
                :showOperation="false"
                :showSelection="true"
                @selection-change="handleSelectionChange"
            />
            <div class="mt-5">
                <Pagination
                v-model:modelValue="dialogSearchForm.pageNum"
                :page-size="dialogSearchForm.pageSize"
                :total="totalItems"
                layout="sizes,prev, pager, next"
                :small="false"
                :disabled="false"
                :background="true"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                />
            </div>
          </el-tab-pane>
        </el-tabs>
        <div class="flex flex-wrap justify-center items-center gap-y-1 gap-x-1 mt-4">
            <el-button plain type="primary" @click="submit" class="mr-6">确认</el-button>
            <el-button plain type="danger" @click="dialogVisible = false">取消</el-button>
        </div>

    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
//import { showModal } from '../../../plugins/useModal'
import type { TreeNode} from '../../type/system'
import { info, mappingInfo, industryInfo, stdInfo, addMapping, delMapping } from '../../services/atlas/productMpping'
import { ElMessage, ElMessageBox } from 'element-plus'

const activeName = ref('')

const searchSchema = [
  {
    label: '标准编号',
    key: 'stdNo',
    component: 'Input',
    span: 6
  },
  {
    label: '标准名称',
    key: 'stdCname',
    component: 'Input',
    span: 6
  }
  ,
  {
    label: '标准状态',
    key: 'stdSta',
    component: 'Input',
    span: 6
  }
]

interface stdSearch {
  stdNo: string
  stdCname: string
  stdSta: string
  lcatName: string
  industryId: string
 pageSize: number
  pageNum: number
}

const dialogSearchForm = ref<stdSearch>({
    stdNo: '',
    stdCname: '',
    lcatName: '',
    stdSta: '',
    industryId: '',
    pageSize: 10,
    pageNum: 1
})  

const handleSearch = (val: Record<string, any>) => {
  const form = val as stdSearch
  dialogSearchForm.value = form
  stdSearch()
}

const stdSearch = async () => {
  const res = await stdInfo(dialogSearchForm.value)
  stdData.value = res.rows
  totalItems.value = res.total
}

function handleSizeChange(val: number) {
  searchForm.value.pageSize = val
  stdSearch()
}

function handleCurrentChange(val: number) {
  searchForm.value.pageNum = val
  stdSearch()
}

const handleClick = (tab: any) => {
    industryData.value.forEach(item => {
      if(item.industryId === tab.props.name){
        dialogSearchForm.value.industryId = item.industryId
        dialogSearchForm.value.lcatName = item.industryTableName
      }
    })
  activeName.value = tab.props.name
  stdSearch()
}


const stdData = ref<any[]>([])

const columns = [
  { label: '标准编号', prop: 'std_no', align: 'center', sortable: true },
  { label: '标准名称', prop: 'std_cname' },
  { label: '标准状态', prop: 'std_sta' },
]

const dialogVisible = ref(false)
const industryData = ref<any[]>([])

const onAdd = async () => {
    const res = await industryInfo()
    industryData.value = res
    activeName.value = industryData.value[0].industryId
    dialogSearchForm.value.industryId = industryData.value[0].industryId
    dialogSearchForm.value.lcatName = industryData.value[0].industryTableName
    stdSearch()
    dialogVisible.value = true
}

const multipleSelection = ref<any[]>([])

const handleSelectionChange = (val: any) => {
  multipleSelection.value = val.map((item: any) => item.standard_id)
}

const submit = async () => {
    let params = {
        industryId: activeName.value,
        relevanceId: searchForm.value.relevanceId,
        standardIds: multipleSelection.value
    }
    await addMapping(params)
    ElMessage.success('添加成功')
    dialogVisible.value = false
    onSearch()
}

// 删除逻辑
const handleDelete = async (row: any) => {
  await ElMessageBox.confirm(`确定要删除吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      await delMapping(row.standard_id, searchForm.value.relevanceId)
      ElMessage.success('删除成功')
      onSearch()
    }).catch(() => {
      console.log('取消删除')
    })
}


const totalItems = ref(0)

onMounted(() => {
  tree()
})


const searchForm = ref({
    relevanceId: '',
    pageSize: 10,
    pageNum: 1
})

const handleNodeClick = (data: TreeNode) => {
    searchForm.value.relevanceId = data.relevanceId
    onSearch()
}

const productTree = ref<TreeNode[]>([])

const tree = async () => {
  const treeData = await info()
  productTree.value = treeData.rows
  if(productTree.value.length > 0){
    searchForm.value.relevanceId = productTree.value[0].relevanceId
    onSearch()
  }
} 

const tableData = ref<any[]>([])

// 搜索功能
async function onSearch() {
  const res = await mappingInfo(searchForm.value);
  tableData.value = res.rows
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