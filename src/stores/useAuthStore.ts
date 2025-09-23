import { defineStore } from 'pinia'
import { ref } from 'vue'
import apiClient from '../lib/axiosConfig'
import { convertBackendRoutesToVueRoutes, filterDynamicRoutes} from '../utils/routerUtils'
import { type Router, type RouteRecordRaw } from 'vue-router'
import {dynamicRoutes} from '../router/index'
import type { GetUserInfoResponse } from '../type/system'
//import { decodeJwt } from '../utils/jwt'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('token'))
  const refreshToken = ref<string | null>(localStorage.getItem('refreshToken'))
  const roles = ref<string[]>([])
  const menus = ref<any[]>([])
  const permissions = ref<String[]>([])
  const user = ref<any>()

  let routerInstance: Router | null = null
  
  // 存储动态添加的路由的移除函数，用于登出时清理
  const dynamicRouteRemovers = ref<(() => void)[]>([])


  function setToken(newToken: string) {
    token.value = newToken
  }

  function setMenu(menu: any[]) {
    menus.value = menu
  }

  function setRefreshToken(newRefreshToken: string) {
    refreshToken.value = newRefreshToken
  }

  function clearTokens() {
    token.value = null
    refreshToken.value = null
    roles.value = []
    menus.value = []
    dynamicRouteRemovers.value.forEach(removeFn => removeFn())
    dynamicRouteRemovers.value = []
  }

  function isAuthenticated(): boolean {
    return !!token.value
  }

  const login = async (username: string, password: string) => {
    
    const response = await apiClient.post('/auth/login', { username, password })
    const { accessToken, refreshToken } = response.data
    setToken(accessToken)
    setRefreshToken(refreshToken)

    // 获取用户角色信息和权限信息
    const userInfo = await apiClient.get<GetUserInfoResponse, GetUserInfoResponse>('/getInfo')
    roles.value = userInfo.roles
    permissions.value = userInfo.permissions
    user.value = userInfo.user

    const menus =await apiClient.get('/getRouters')
    const vueRoutes: RouteRecordRaw[] = convertBackendRoutesToVueRoutes(menus.data)
    console.log('menus :', menus.data)
    setMenu(menus.data)
    // 5. 清理旧的动态路由 (重要！防止重复添加)
    dynamicRouteRemovers.value.forEach(removeFn => removeFn())
    dynamicRouteRemovers.value = []

    const dynamicRoute = filterDynamicRoutes(dynamicRoutes)

    const addRouteRecursively = ( route: RouteRecordRaw) => {
      if (routerInstance) {
        const removeRoute = routerInstance.addRoute(route)
        dynamicRouteRemovers.value.push(removeRoute)
      }
    }
    console.log('dynamicRoute :', dynamicRoute)
      // 3. 遍历顶级路由，并为每个顶级路由启动递归添加
      vueRoutes.forEach(addRouteRecursively)
      dynamicRoute.forEach(addRouteRecursively)

    // 7. 等待路由更新完成，然后跳转
    // 这很重要，确保新添加的路由在跳转前已注册
    if (routerInstance) {
      await routerInstance.isReady()
      await routerInstance.replace('/')
    }
    
  }

 const createAuthStore = (router: Router) => {
    // 保存 router 实例，供 login 等 action 使用
    routerInstance = router
    //console.log('Router instance set in auth store') // 可选：调试
  }

   // ✅ 新增：恢复已持久化的路由（刷新页面时调用）
  const restoreRoutes = () => {
    if (!routerInstance || !isAuthenticated() || !menus.value || menus.value.length === 0) {
      //console.log('跳过路由恢复：未登录或无菜单数据')
      return
    }

    //console.log('正在恢复持久化的动态路由...')
    // 防止重复添加
    dynamicRouteRemovers.value.forEach(removeFn => removeFn())
    dynamicRouteRemovers.value = []

    const vueRoutes: RouteRecordRaw[] = convertBackendRoutesToVueRoutes(menus.value)

    const addRouteRecursively = (route: RouteRecordRaw) => {
      if (routerInstance && !routerInstance.hasRoute(route.name!)) {
        const removeFn = routerInstance.addRoute(route)
        dynamicRouteRemovers.value.push(removeFn)
      }
    }

    vueRoutes.forEach(addRouteRecursively)
    dynamicRoutes.forEach(addRouteRecursively)
    //console.log('✅ 动态路由恢复完成')
  }

  return {
    token,
    refreshToken,
    roles,
    menus,
    setToken,
    setRefreshToken,
    setMenu,
    clearTokens,
    isAuthenticated,
    login,
    createAuthStore,
    user,
    permissions,
    restoreRoutes,
  }
}, {
  // --- Persist 配置 ---
  persist: {
    // 可选：指定存储方式，默认是 localStorage
    storage: localStorage, // 也可以是 sessionStorage

    // 可选：指定 key，不指定则默认使用 store 的 id ('auth')
    // key: 'my_custom_auth_key',

    // 可选：指定要持久化的 state 字段
    // 如果不指定 paths，则持久化整个 state
    // paths: ['token', 'refreshToken', 'menus'], // 只持久化这几个字段

    // 可选：自定义序列化/反序列化 (通常不需要)
    // serializer: {
    //   serialize: (value) => JSON.stringify(value),
    //   deserialize: (value) => JSON.parse(value),
    // },
  }
})