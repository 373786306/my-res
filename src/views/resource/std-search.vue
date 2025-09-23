<template>
  <div class="w-full h-full bg-white p-8 rounded shadow">
      <BaseSearchForm
            v-if="searchSchema.length > 0"
            v-model="searchForm"
            :schema="searchSchema"
            @search="handleSearch"
      />   
      <el-tabs v-model="activeName" @tab-click="handleClick" :stretch = "true">
        <el-tab-pane 
          v-for="item in industryData" 
          :key="item.industryId" 
          :label="item.industryName" 
          :name="item.industryId"
          class="h-full overflow-y-auto overflow-x-hidden">
          <CommonTable
              :columns="columns"
              :data="stdData"
              showOperation = "false"
          >
          <template
            v-for="col in columns"
            v-slot:[`custom-${col.prop}`]="{ row }"
            :key="col.prop"
          >
              <template v-if="col.customRender"> <!-- 在内部判断 -->
                
                <template v-if="col.prop === 'documen'">
                  <el-button type="primary" :disabled="!row.documen" text @click="openInNewTab(row.documen)">查看PDF</el-button>
                </template>
                
                <template v-else-if="col.prop === 'std_link'">
                  <el-tag v-for="tag in row.std_link?.split(',')" :key="tag" size="small" class="mr-1">
                    <el-button type="primary" text @click="openInNewTab1(tag)">{{ tag }}</el-button>
                  </el-tag>
                </template>
                <span v-else>自定义渲染: {{ col.prop }}</span>
              </template>
            </template>

            <!-- <template #action="{ row }">
              <div class="flex flex-wrap justify-center items-center gap-y-1 gap-x-1">
              <el-button size="small" text type="primary" v-if="row.userId !== 1" @click="handleMapping(row)" v-hasPermi="['std:library:edit']">添加映射</el-button>
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
        </el-tab-pane>
      </el-tabs>
  </div>
  <BaseFormDialog
      v-model="dialogVisible"
      module="search"
      path="search"
      :title="title"
      @success="handleSuccess"
      :api="submit"
      :formData="formData"
      width = "30%"
      :extra-data="{ industryId: activeName }"
    />
</template>

<script setup lang="ts">
import { ref, onMounted} from 'vue'
import { industryInfo, stdInfo, stdFieldsInfo,  standardUrl} from '../../services/atlas/stdLibrary'
import { mapping } from '../../services/resource/searchService'
import { ElMessage} from 'element-plus'

const dialogVisible = ref(false)
const title = ref('添加映射')
const formData = ref<any>({})

const activeName = ref('')
const columns = ref<any[]>([])
const searchForm = ref<any>({
  industryId: '',
  pageNum: 1,
  pageSize: 10
})

let searchSchema = ref<any[]>([])

const handleSuccess = () => {
  ElMessage.success('保存成功')
}
const submit = async (data: any) => {
  data.industryId = activeName.value
  await mapping(data)
  dialogVisible.value = false
  //stdSearch()
}

const handleSearch = (val: Record<string, any>) => {
  searchForm.value = val
  searchForm.value.industryId = activeName.value
  stdSearch()
}

const industryData = ref<any[]>([])
const stdData = ref<any[]>([])
const totalItems = ref(0)

// const handleMapping = (row: any) => {
//   formData.value = row
//   dialogVisible.value = true
// }

const handleClick = (tab: any) => {
  activeName.value = tab.props.name
  searchForm.value.industryId = tab.props.name
  buildsearchSchemaAndColumns()
  stdSearch()
}

const stdSearch = async () => {
  const res = await stdInfo(searchForm.value)
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

const industryList = async () => {
    const res = await industryInfo()
    industryData.value = res
    if(industryData.value.length > 0){
      activeName.value = industryData.value[0].industryId
      buildsearchSchemaAndColumns()
      searchForm.value.industryId = activeName.value
      stdSearch()
    }
}

const buildsearchSchemaAndColumns = async () => {
  const res = await stdFieldsInfo(activeName.value)
  let search: any[] = []
  let cols: any[] = []
  res.forEach((element: any) => {
    if(element.propertyValueType === 'string'){
        search.push({
            component: 'input',
            label: element.propertyDisplayName,
            key: element.propertyName,
            span: 4
        })

        cols.push({ 
          label: element.propertyDisplayName, 
          prop: element.propertyName, 
          align: 'center', 
          customRender: false
        })
    }
      
    if(element.propertyReferenceType === 'file' || element.propertyName === 'std_link'){
        cols.push({ 
          label: element.propertyDisplayName, 
          prop: element.propertyName, 
          customRender: true
        })
    }
  })

  searchSchema.value = search
  columns.value = cols

}

onMounted(async() => {
  industryList()
})

const openInNewTab = (url: string) => {
  
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

const openInNewTab1 = async (stdLink: string) => {
  
  const url =await standardUrl(stdLink)
  const baseUrl = import.meta.env.VITE_API_BASE_URL as string;
  const fullUrl = baseUrl + url.url;
  const a = document.createElement('a');
  a.href = fullUrl;
  a.target = '_blank';
  a.id = 'openwin';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a); 
};

</script>