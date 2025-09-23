<template>
  <div>
    <div class="flex gap-6 h-[80vh] mt-4 ml-20">
      <!-- 左边：部门树 -->
       <div class="w-3/12 bg-white p-4 rounded shadow">
        <div class="flex justify-between items-center">
            <h2 class="text-lg font-bold mb-4">标准分类体系</h2>    
            <el-button-group >
                <el-button type="primary" plain size="default" icon="Edit"  class="border-0"
                             v-hasPermi="['std:category:edit']" @click="editCategory" ></el-button>
                <el-button type="primary" plain size="default" icon="Delete" class="border-0"
                             v-hasPermi="['std:category:delete']" @click="deleteCategory"></el-button>

                <el-dropdown @command="handleCommand">
                    <el-button type="primary" plain size="default" icon="CirclePlus" class="border-0" v-hasPermi="['std:category:add']"></el-button>
                    <!-- 下拉菜单内容 -->
                    <template #dropdown>
                        <el-dropdown-menu>
                        <el-dropdown-item command="a">顶级分类</el-dropdown-item>
                        <el-dropdown-item command="b">同级分类</el-dropdown-item>
                        <el-dropdown-item command="c">下级分类</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>            
            </el-button-group>    
        </div>
        
        <hr class="my-2 border-t border-gray-300">
        <GenericTree
          :data="categoryTree"
          :props="{ children: 'children', label: 'categoryName' }"
          default-expand-all
          node-key="categoryId"
          @node-click="handleNodeClick"
        />
    </div>
      
      <!-- 右边：用户表格 -->
    <div class="w-8/12 bg-white p-4 rounded shadow ml-12">
      <h2 class="text-lg font-bold mb-4">标准分类信息</h2>
      <hr class="my-2 border-t border-gray-300">
       <div class="p-12 flex justify-center h-screen">
        <el-form ref="localFormRef" :rules="rules" class="w-10/12 mx-auto" :model="localForm" label-width="5rem" >
            <el-form-item prop="name" label="名称">
            <el-input :disabled="!visible" v-model="localForm.name"></el-input>
            </el-form-item>
            <el-form-item prop="desc" label="说明">
            <el-input :disabled="!visible" type="textarea" :autosize="{ minRows: 7, maxRows: 5}" v-model="localForm.desc"></el-input>
            </el-form-item>
            <el-form-item class="mt-8" v-show="visible">
                <div class="flex justify-center w-full space-x-4">
                    <el-button type="primary" @click="onSubmit" class="mr-12">保存</el-button>
                    <el-button @click="localForm.name = ''; localForm.desc = ''" >取消</el-button>
                </div>
            </el-form-item>
        </el-form>
       </div>
      
    </div>
    </div>
    
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { TreeNode } from '../../type/system'
import { categoryTreeInfo, add, edit, del } from '../../services/atlas/stdCategory'
import { ElMessage, ElMessageBox } from 'element-plus'

const categoryTree = ref<TreeNode[]>([])
const localForm = ref<any>({
    id: '', 
    name: '', 
    desc: '', 
    level: ''
})
const rules = {
  name: [
    { required: true, message: '请输入名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],    
  desc: [
    { required: false, message: '请输入说明', trigger: 'blur' },
    { min: 2, max: 200, message: '长度在 2 到 200 个字符', trigger: 'blur' }
  ]
}
const visible = ref(false)
const localFormRef = ref()
const flag = ref(false)

onMounted(() => {
  tree()
})

const onSubmit = async () => {
    
  if (!localFormRef.value) return
  try {
    await localFormRef.value.validate()
    if (flag.value) {
       await add(localForm.value)
        ElMessage.success('新增成功')
        visible.value = false
        tree()
    }else{
       await edit(localForm.value)
       visible.value = false
       ElMessage.success('修改成功')
       tree()
    }
    
  } catch (error) {
    console.log('校验失败:', error)
  }
}

const handleCommand = (command: string) => {
  console.log('command: ', command)
  localForm.value.name = ''
  localForm.value.desc = ''
  flag.value = true
  if (command == 'a') {
        localForm.value.level = "0";
    }else if (command == 'b'){
        if (currentCategoryParentId.value == '') {
           localForm.value.level = "0";         
        }else{
           localForm.value.level = currentCategoryParentId.value;
        }
        
    }else{
        if (currentCategoryParentId.value == '') {
            ElMessage.warning('请先选择父分类')
            return;
        }
        localForm.value.level = currentCategoryId.value;
    }
    visible.value = true
}

const editCategory = () => {
  visible.value = true
  flag.value = false
}



const tree = async () => {
  const treeData = await categoryTreeInfo()
  categoryTree.value = treeData
} 
const currentCategoryId = ref('')
const currentCategoryParentId = ref('')

const handleNodeClick =async (data: TreeNode) => {
  localForm.value = {
    id: data.categoryId || '',
    name: data.categoryName || '',
    desc: data.categoryDescription || '',
  }
  currentCategoryId.value = data.categoryId || ''
  currentCategoryParentId.value = data.categoryParentId || ''
}

// 删除逻辑
const deleteCategory = async () => {

    if (currentCategoryId.value == ''){
        ElMessage.warning('请先选择分类')
        return;
    }

  await ElMessageBox.confirm(`确定要删除吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      await del(currentCategoryId.value)
      ElMessage.success('删除成功')
      tree()
    }).catch(() => {
      console.log('取消删除')
    })
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