<template>
    <div class="h-[85vh] bg-white shadow-md">
        <el-row gap="10rem">
            <el-col :span="24">
            <div class=" h-[5vh] p-10  ">
              <el-button type="primary" @click="handleProperty" :disabled = "status === '2'">选择属性</el-button>
              <el-button type="primary" @click="handleTemplate" :disabled = "status === '2'">选择模板</el-button>
              <el-button type="warning" @click="goBack">返回</el-button>
            </div>
            </el-col>

            <el-col :span="24" class=" p-10">
            <div class="  h-[80vh] ">
                <CommonTable
                    :columns="columns"
                    :data="tableData"
                    :show-selection="false"
                    :operWindth="100"
                >
                    <template #custom-propertyValueType="{ row }">
                    <span>{{ row.propertyValueType === 'string' ? '字符型' : row.propertyValueType === 'boolean' ? '布尔型' : row.propertyValueType === 'numeric' ? '数字型' : row.propertyValueType === 'datetime' ? '日期型' : row.propertyValueType === 'reference' ? '引用型' : '' }}</span>
                    </template>

                    <template #custom-propertyReferenceType="{ row }">
                    <span>{{ row.propertyReferenceType === 'dict' ? '字典' : row.propertyReferenceType === 'file' ? '单附件' : row.propertyReferenceType === 'files' ? '多附件' :'' }}</span>
                    </template>

                    <template #action="{ row }">
                    <div class="flex flex-wrap justify-center items-center gap-y-1 gap-x-1">
                    <el-button size="small" text type="danger" @click="handleDelete(row)" :disabled = "status === '2'" v-hasPermi="['meta:level:remove']">删除</el-button>
                    </div>
                    </template>
                </CommonTable> 
            </div>
            </el-col>
        </el-row>
        <el-dialog
            v-model="dialogVisible"
            :title="title"
            width="60%"
            append-to-body
            class=""
            :close-on-click-modal="false"
        >
            <CommonTable
                    :columns="customColumns"
                    :data="customData"
                    :show-selection="true"
                    :showOperation="false"
                    @selection-change = "handleSelectionChange"
                >
            </CommonTable> 
            <div class="mt-5 flex justify-end">
                <el-button type="primary" @click="onAdd">保存</el-button>
            </div>
            
        </el-dialog>
    </div>
    
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter  } from 'vue-router'
import { propertyData, propertyInfo, batchAddProperty, templateInfo, addTemplate, deleteProperty } from '../../services/metaData/metaService'
import { ElMessage, ElMessageBox} from 'element-plus'

const route = useRoute()
const router = useRouter()

const industryId = (route.params.industryId as string) || ''
const status = (route.params.status as string) || ''
const tableData = ref([])
const dialogVisible = ref(false)
const title = ref('')
const customData = ref([])

const columns = [
  { label: '名称', prop: 'propertyName', align: 'center' },
  { label: '显示名称', prop: 'propertyDisplayName' },
  { label: '值类型', prop: 'propertyValueType', customRender: true},
  { label: '值长度', prop: 'propertyValueLength' },
  { label: '引用类型', prop: 'propertyReferenceType', customRender: true },
  { label: '引用值', prop: 'propertyReferenceValue'},
  { label: '描述', prop: 'propertyDescription' },
]
const customColumns = ref<any>([])

const propertyColumns = [
  { label: '名称', prop: 'propertyName', align: 'center' },
  { label: '显示名称', prop: 'propertyDisplayName' },
  { label: '值类型', prop: 'propertyValueType'},
]

const templateColumns = [
  { label: '模板名称', prop: 'templateName', align: 'center' },
  { label: '模板描述', prop: 'templateDescription' },
]

onMounted(() => {
    onSearch()
})

const onAdd = async() => {
    dialogVisible.value = false
    if(title.value === '选择属性'){
        await batchAddProperty(industryId, multipleSelection.value)
        ElMessage.success('保存成功')
        onSearch()
    }else{
        if(multipleSelection.value.length === 0){
            ElMessage.error('请选择模板')
            return
        }else if(multipleSelection.value.length > 1){
            ElMessage.error('只能选择一个模板')
            return
        }
        await addTemplate(industryId, multipleSelection.value[0])
        ElMessage.success('保存成功')
        onSearch()
    }
}

const onSearch = async () => {
    const res = await propertyData(industryId)
    tableData.value = res.data
}

const goBack = () => {
  router.back()
}

const multipleSelection = ref<string[]>([])

const handleSelectionChange = (val: any[]) => {
    if(title.value === '选择属性'){
        multipleSelection.value = val.map(item => item.propertyId)
    }else{
        multipleSelection.value = val.map(item => item.templateId)
    }
  
}

const handleProperty = async() => {
    title.value = '选择属性'
    customColumns.value = propertyColumns
    const res = await propertyInfo(industryId)
    customData.value = res.data
    dialogVisible.value = true

}

const handleTemplate = async() => {
    title.value = '选择模板'
    customColumns.value = templateColumns
    const res = await templateInfo()
    customData.value = res.data
    dialogVisible.value = true

}

const handleDelete = async (row: any) => {
  await ElMessageBox.confirm(`确定要删除吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      await deleteProperty(industryId, row.propertyId)
      ElMessage.success('删除成功')
      onSearch()
    }).catch(() => {
      console.log('取消删除')
    })

}

</script>
<style  scoped>
.line-item {
  padding: 16px;
  background-color: #f0f2f5;
  border: 1px solid #dcdfe6;
  margin-bottom: 8px;
  text-align: center;
}
</style>