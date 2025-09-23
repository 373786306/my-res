<template>
  <div class="w-full h-full p-2 rounded  flex justify-center items-center">
    <div class=" bg-white p-8 h-full w-[99%] shadow">
        <el-tabs v-model="activeTabId" class="demo-tabs" @tab-click="handleClick">
            <el-tab-pane 
                v-for="item in productData" 
                :key="item.relevanceId" 
                :label="item.productName" 
                :name="item.relevanceId"
                class="h-full overflow-y-auto overflow-x-hidden">
            </el-tab-pane>
        </el-tabs>

        <!-- 当前激活的 Tab 内容区 -->
      <div v-loading="loading" class="tab-content p-4 h-full overflow-y-auto">
        <TreeChart
          v-if="treeData"
          :data="treeData"
          width="100%" 
          height="100%" 
          @node-click="handleNodeClick"
        />
        <!-- 无数据提示 -->
        <div v-else-if="!loading && !treeData" class="text-center text-gray-500 mt-10">
          暂无数据
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { info, tree} from '../../services/architecture/structure'
import TreeChart from '../../components/charts/TreeChart.vue'

const activeTabId = ref('1')
const productData = ref<any[]>([])
const treeData = ref<any[]>([])
const loading = ref<boolean>(false)


const handleClick = (tab: any) => {
  activeTabId.value = tab.props.name
  treeInfo()
}

onMounted(() => {
    productList()
})

const productList = async () => {    
    const res = await info()
    productData.value = res.data
    if (productData.value.length > 0) {
        activeTabId.value = productData.value[0].relevanceId
        treeInfo()
    }
}

// 节点点击事件
const handleNodeClick = (node: any) => {
  console.log('Clicked node:', node)
}

const treeInfo = async () => {
    const res = await tree(activeTabId.value)
    treeData.value = res.data
}


</script>