<template>
  <div class="flex justify-center w-full min-h-screen bg-white px-4 py-8">
    <div class="w-full max-w-6xl">
      <!-- 标题区 -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-semibold text-blue-500">全文检索</h1>
        <p class="mt-2 text-gray-500">输入关键词，查找相关内容</p>
      </div>
      <!-- 搜索框 -->
      <div class="mb-8 max-w-4xl mr-auto ml-auto">
        <el-input
          ref="inputRef"
          v-model="searchForm.keyword"
          placeholder=""
          @keyup.enter="handleSearch"
          prefix-icon="Search"
          clearable
          size="large"
          class="w-full shadow-sm"
        >
          <template #append>
            <el-button size="large" class="bg-blue-500 text-white !bg !text" type="primary" :loading="loading" @click="handleSearch">
              搜索
            </el-button>
          </template>
        </el-input>
      </div>

      <!-- 结果数量 -->
      <div v-if="!loading && results.length > 0" class="text-sm text-gray-500 mb-2">
        找到 <span class="font-medium text-gray-700">{{ totalItems }}</span> 篇相关文档
      </div>

      <!-- 搜索结果列表 -->
      <ul class="space-y-4">
        <li
          v-for="item in results"
          :key="item.id"
          class="p-5 rounded-lg border border-transparent hover:border-blue-200 bg-white hover:shadow-sm transition-all duration-150 cursor-pointer"
          @click="goToDetail()"
        >
          <!-- 标题 -->
          <h3 class="text-lg font-medium text-gray-800 leading-tight">
            <span v-html="item.stdCname"></span>
          </h3>

          <!-- 摘要 -->
          <p class="mt-2 text-gray-600 leading-relaxed line-clamp-2">
            <span v-html="item.content"></span>
          </p>

          <!-- 元信息 -->
          <div class="mt-3 flex items-center text-xs text-gray-400 space-x-4">
            <span  class="text-blue-500 font-medium">标准编号: {{item.stdNo}}</span>
            <span>•</span>
            <span class="text-blue-500 font-medium">标准状态: {{item.stdSta}}</span>
            <span>•</span>
            <span  class="text-blue-500 font-medium" @click="openInNewTab(item.documen)">查看PDF</span>
          </div>
        </li>
      </ul>

      <!-- 无结果 -->
      <div v-if="!loading && results.length === 0 && keyword" class="text-center py-12 text-gray-500">
        <p>未找到与 “{{ keyword }}” 相关的文档</p>
        <p class="mt-1 text-sm">请尝试更换关键词，或浏览 <a href="#/docs" class="text-blue-500 hover:underline">全部文档目录</a></p>
      </div>

      <!-- 加载中 -->
      <div v-if="loading" class="text-center py-8">
        <p class="mt-3 text-gray-500 text-sm">搜索中...</p>
      </div>
      <div class="mt-5">
              <Pagination
              v-show="totalItems >0"
              v-model:modelValue="searchForm.pageNum"
              :page-size="searchForm.pageSize"
              :total="totalItems"
              layout="prev, pager, next"
              :small="false"
              :disabled="false"
              :background="false"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              />
          </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, shallowRef, onMounted } from 'vue'
import { search } from '../../services/resource/searchService'

const totalItems = ref(0)
const keyword = ref('')
const loading = ref(false)
const results = shallowRef<any[]>([])
const inputRef = ref()

const searchForm = ref({
    keyword: keyword.value,
    pageNum: 1,
    pageSize: 10,
})
const openInNewTab = (url: string) => {
  
  // 构建完整 URL
  const baseUrl = import.meta.env.VITE_API_BASE_URL as string;
  const fullUrl = baseUrl + url;
console.log('baseUrl: ', baseUrl)
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

const handleSearch = async () => {
  if (!searchForm.value.keyword.trim()) return
  loading.value = true
  try {
    const data = await search(searchForm.value)
    results.value = data.rows
    totalItems.value = data.total
    
  } catch (err) {
    results.value = []
  } finally {
    loading.value = false
  }
}
function handleSizeChange(val: number) {
  searchForm.value.pageSize = val
  handleSearch()
}

function handleCurrentChange(val: number) {
  searchForm.value.pageNum = val
  handleSearch()
}

// 点击跳转（可替换为真实路由）
const goToDetail = () => {
  
  // 示例：router.push(`/docs/${item.id}`)
}

// 自动聚焦
onMounted(() => {
  inputRef.value?.focus()
})
</script>

<style scoped>


</style>