<template>
  <div class="relative float-right ml-auto">
    <el-row class="flex space-x-2">
      <!-- 显示/隐藏搜索 -->
      <el-tooltip  effect="dark" :content="showSearch ? '隐藏搜索' : '显示搜索'" placement="top">
        <el-button size="small" circle icon="Search" @click="toggleSearch" />
      </el-tooltip>

      <!-- 刷新 -->
      <el-tooltip effect="dark" content="刷新" placement="top">
        <el-button size="small" circle icon="Refresh" @click="refresh" />
      </el-tooltip>

      
    </el-row>

   
  </div>
</template>

<script setup lang="ts">

// Props


const props = defineProps<{
  showSearch: boolean
}>()

// Emits
const emit = defineEmits<{
  (e: 'update:showSearch', value: boolean): void
  (e: 'queryTable'): void
}>()

// Data




// Methods
const toggleSearch = () => {
  emit('update:showSearch', !props.showSearch)
}

const refresh = () => {
  emit('queryTable')
}



</script>

<style scoped>
.check-line {
  width: 90%;
  height: 1px;
  background-color: #ccc;
  margin: 3px auto;
}
</style>