<template>
  <template v-for="item in items" :key="item.path">
    <!-- {{ logItem(item) }} -->
    <!-- 有子菜单的项目 -->
    <el-sub-menu v-if="item.children && item.children.length > 0 && !item.hidden" :index="item.path">
      <template #title>
        <span>{{ item.meta?.title }}</span>
      </template>
      <!-- 递归调用自身 -->
      <HorizontalSubMenu :items="item.children" />
    </el-sub-menu>

    <!-- 叶子菜单项 -->
    <el-menu-item v-else :index="item.path" v-show="!item.hidden"> 
      <span>{{ item.meta?.title }}</span>
    </el-menu-item>
  </template>
</template>
<script setup>
defineProps({
  items: {
    type: Array,
    required: true
  }
});

// 调试函数
const logItem = (item) => {
  console.log('当前菜单项:', item.meta?.title, item.path)
  return null // 不影响模板渲染
}

// 图标映射（也可以通过 inject 或全局注册方式优化）
defineEmits(['menu-click']);

</script>

