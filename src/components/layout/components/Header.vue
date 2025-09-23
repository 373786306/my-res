<!-- HorizontalMenu.vue -->
<template>
  <el-header class="header">  
    <el-menu
      ref="menuRef"
      v-if="menuData.length > 0"
      :default-active="activeIndex"
      class="menu"
      mode="horizontal"
      :ellipsis="false"
      router
    >
      <el-menu-item index="/">
          <div class="logo">
              <!-- <img src="@/assets/logo.png" alt="Logo" /> -->
              <span>{{ title }}</span>
            </div>
      </el-menu-item>
      <el-menu-item  index="/">
          <span>首页</span>
      </el-menu-item>
      <template v-for="item in menuData" :key="item.path">
        <!-- {{ logItem(item) }} -->
        <!-- 外链菜单 -->
        <el-menu-item
          v-if="item.meta?.link"
          :index="item.path"
          @click="openLink(item.meta.link)"
        >
          <span>{{ item.meta.title }}</span>
        </el-menu-item>
        
        <!-- 带子菜单的一级菜单 -->
        <el-sub-menu v-else-if="item.children && item.children.length > 0 && !item.hidden" :index="item.path">
          <template #title>
            <span>{{ item.meta.title }}</span>
          </template>
          <!-- 使用封装的子菜单组件 -->
          <HorizontalSubMenu :items="item.children" />
        </el-sub-menu>

        <!-- 单个菜单项 -->
        <el-menu-item v-else :index="item.path" v-show="!item.hidden">
          <span>{{ item.meta.title }}</span>
        </el-menu-item>
      </template>
    </el-menu>
    <div class="user-actions">
      <el-button type= 'primary' text @click="logout">退出</el-button>
      <!-- <el-button type="text" @click="handleRegister">注册</el-button> -->
    </div>
  </el-header>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../../stores/useAuthStore';
import HorizontalSubMenu from './HorizontalSubMenu.vue'; // 引入封装组件

const userStore = useAuthStore();
const router = useRouter();
const menuRef = ref(null) 
const activeIndex = ref('/');
const menuData = ref([]);

const logItem = (item) => {
  console.log('当前菜单项:', item)
  return null // 不影响模板渲染
}
const title = ref(import.meta.env.VITE_APP_TITLE)
onMounted (async () => {

  menuData.value = userStore.menus
})

// 打开外链
const openLink = (link) => {
  window.open(link, '_blank');
}
const logout = () => {
  userStore.clearTokens()
  router.push('/login')
}
</script>

<style scoped>

.logo {
  display: flex;
  align-items: center;
}


.logo img {
  width: 32px;
  height: 32px;
  position: absolute;
  top: 9px;
  left: 29px;
}

.logo span {
    height: 70px;
    line-height: 70px;
    display: inline-block;
    font-size: 22px;
    font-weight: 600;
    color: #333;
    padding-left: 42px;
    background-size: 32px;
    background-position: 0 19px;

}

.header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 20px;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
}

/* 让菜单容器横向滚动，而不是折叠 */
.menu {
  flex-grow: 1;
  white-space: nowrap;
}


.el-menu--horizontal > .el-menu-item:nth-child(1) {
  margin-right: auto;
}

/* 关键：移除第一个 el-menu-item 的下划线（border-bottom） */
.el-menu--horizontal > .el-menu-item:nth-child(1),
.el-menu--horizontal > .el-sub-menu:nth-child(1) > .el-sub-menu__title {
  border-bottom: none !important;
}

/* 可选：防止鼠标悬停时出现下划线 */
.el-menu--horizontal > .el-menu-item:nth-child(1):hover,
.el-menu--horizontal > .el-sub-menu:nth-child(1):hover > .el-sub-menu__title {
  border-bottom: none !important;
}

/* 保持其他项的正常样式 */
.el-menu--horizontal > .el-menu-item {
  border-bottom: 2px solid transparent;
}

.el-menu--horizontal > .el-menu-item.is-active {
  border-bottom: 2px solid #409eff;
}

.el-menu--horizontal > .el-menu-item.is-active:nth-child(1) {
  border-bottom: none !important;
}
</style>