<template>
<div id="app">


  <router-view/>
</div>
</template>
<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router' // ✅ 在 setup 中使用 useRouter 是安全的
import { useAuthStore } from './stores/useAuthStore'

const router = useRouter() 
const authStore = useAuthStore()

// 在组件挂载后，用 router 初始化 authStore
onMounted(() => {

  // 任意 .ts 或 .vue 文件中
console.log(import.meta.env.VITE_APP_TITLE)        // "我的应用"
console.log(import.meta.env.VITE_API_BASE_URL)     // 开发: http://localhost:8090/api, 生产: https://api.example.com
console.log(import.meta.env.MODE)                  // "development" 或 "production"
console.log(import.meta.env.PROD)                  // true | false
console.log(import.meta.env.DEV)                   // true | false



  // 调用 store 的 createAuthStore 方法，传入 router
  authStore.createAuthStore(router)

  if (authStore.isAuthenticated() && authStore.menus?.length > 0) {
    authStore.restoreRoutes()
  }

  // 可选：如果未登录，可以跳转到登录页
  // if (!authStore.isAuthenticated) {
  //   router.replace('/login')
  // }

})
</script>
<style scoped>
html, body, #app {
      height: 100%;
      margin: 0;
      padding: 0;
    }
</style>
