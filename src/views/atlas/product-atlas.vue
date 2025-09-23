<template>
  <div class="w-full h-full rounded ">
    <div class="  flex justify-center items-center h-full w-full shadow">
      <div class=" bg-white p-2 h-full w-1/4 shadow">
        <h2 class="text-lg font-bold mb-4">产品模块</h2>
        <hr class="my-2 border-t border-gray-300">
        <GenericTree
            ref="genericTreeRef"
            :data="productTree"
            :props="{ children: 'children', label: 'productName' }"
            default-expand-all
            node-key="relevanceId"
            @node-click="handleNodeClick"
            class="pl-6 pt-4 "
          >
          <template #node="{ node, data }">
            <span class="custom-node" :style="{ fontWeight: node.isLeaf ? 'normal' : 'bold' }">
              🔹 {{ data.productName }} ({{ data.count }})
            </span>
          </template>
        </GenericTree>
      </div>
      <div class=" bg-white flex ml-4 p-8 h-full w-3/4 shadow">
        <GraphChart :nodes="nodes" :links="links" height-class="h-[95%]" />
      </div>
    </div>

    <div class="flex justify-center items-center mt-2 h-full w-full shadow">
      <div class=" bg-white flex  p-8 h-full w-1/4 shadow">
        <GenericTree
            ref="genericTreeRef"
            :data="categoryTree"
            :props="{ children: 'children', label: 'categoryName' }"
            default-expand-all
            node-key="categoryId"
            @node-click="handleCategoryNodeClick"
            class="pl-6 pt-4 "
          >
          <template #node="{ node, data }">
            <span class="custom-node" :style="{ fontWeight: node.isLeaf ? 'normal' : 'bold' }">
              🔹 {{ data.categoryName }} ({{ data.count }})
            </span>
          </template>
        </GenericTree>
      </div>
      <div class=" bg-white flex ml-4 p-8 h-full w-3/4 shadow">
          <CommonTable
            :columns="columns"
            :data="standardData"
            :show-selection="false"
            class="w-full"
          >
            <template #action="{ row }">
              <div class="flex flex-wrap justify-center items-center gap-y-1 gap-x-1">
              <el-button size="small" text type="primary" @click="handleEdit(row)" v-hasPermi="['pruduct:combination:add']">编辑</el-button>
              <!-- <el-button size="small" text type="danger" @click="handleMark(row)" v-hasPermi="['pruduct:combination:remove']">收藏</el-button> -->
              <el-button size="small" text type="primary" @click="handleView(row)" :disabled = "!row.doc" v-hasPermi="['pruduct:combination:remove']">查看PDF</el-button>
              </div>
            </template>
          </CommonTable>
      </div>
    </div>
  </div>
  <BaseFormDialog
        v-model="dialogVisible"
        module="feedback"
        path="feedback"
        width="30%"
        title="新增反馈信息"
        @success="handleSuccess"
        :api="submit"
    />
</template>
<script lang="ts" setup>
import { ref, onMounted, nextTick } from 'vue'
import { productInfo, getCategoryInfo, getStandardInfo, getGraphData, add } from '../../services/atlas/atlasService'
import GraphChart from '../../components/charts/GraphChart1.vue'
import GenericTree from '../../plugins/GenericTree.vue'
import { ElMessage } from 'element-plus'

const dialogVisible = ref(false)
const productTree = ref<any[]>([])
const categoryTree = ref<any[]>([])
const searchForm = ref<any>({
  relevanceId: '',
  categoryId: ''
})

const nodes = ref<any[]>([])
const links = ref<any[]>([])

const columns = [
  { label: '标准编号', prop: 'stdNo', align: 'center', sortable: true },
  { label: '标准名称', prop: 'stdCname' },
  { label: '级别名称', prop: 'industryName' },
]

const standardId = ref('')
const handleEdit = (row: any) => {
  standardId.value = row.standardId
  dialogVisible.value = true
}

const handleView = (row: any) => {

  let url = row.doc
  // 构建完整 URL
  const baseUrl = import.meta.env.VITE_API_BASE_URL as string;
  const fullUrl = baseUrl + url;
  // 创建 a 标签
  const a = document.createElement('a');
  a.href = fullUrl;
  a.target = '_blank';
  a.id = 'openwin';
  // 添加到 body，触发点击，然后移除
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a); // 立即移除，避免污染 DOM

}

// const handleMark = (row: any) => {


// }

const submit = async (data: any) => {
  data.standardId = standardId.value
  await add(data)
  onSearch()
}
const handleSuccess = () => {
  ElMessage.success('保存成功')
}

const handleNodeClick = (data: any) => {
    searchForm.value.relevanceId = data.relevanceId
    onSearch()
}

const handleCategoryNodeClick = (data: any) => {
  searchForm.value.categoryId = data.categoryId
  onSearch()
}

onMounted(() => {
  getProductTree()
  getCategoryTree()
})

const getCategoryTree = async () => {
    const res = await getCategoryInfo()
    categoryTree.value = res.rows

}

const getProductTree = async () => {
  const treeData = await productInfo()
  productTree.value = treeData.rows
  setDefaultSelected()
}

const standardData = ref<any[]>([])

const getStandardData = async () => {
  const res = await getStandardInfo(searchForm.value.relevanceId, searchForm.value.categoryId)
  standardData.value = res
}

async function onSearch() {
  const res = await getGraphData(searchForm.value.relevanceId, searchForm.value.categoryId)
  nodes.value = res.nodes
  links.value = res.links
  getStandardData()
}

const genericTreeRef = ref<InstanceType<typeof GenericTree> | null>(null)

// 设置默认选中第一个节点
const setDefaultSelected = async() => {
  await nextTick()
  if (productTree.value.length > 0) {
    const firstNode = productTree.value[0]
    searchForm.value.relevanceId = firstNode.relevanceId
    genericTreeRef.value?.setCurrentKey(firstNode.relevanceId) 
    handleNodeClick(firstNode)
  }
}
</script>