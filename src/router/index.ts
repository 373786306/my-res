// src/router/index.js
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '../stores/useAuthStore'

// 异步加载页面组件（推荐）
const Login = () => import('@/views/login.vue')
const Home = () => import('@/views/dashboard/index.vue')
const Layout = () => import('@/components/layout/Layout.vue')

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    component: Login,
  },
  {    
    path: '/',
    component: Layout,
    name: '首页',
    children: [
      {
        path: '',
        name: 'Home',
        component: Home
      }
    ]
  },
  { 
  path: '/:pathMatch(.*)*', 
  redirect: '/'
  }
];

// 动态路由，基于用户权限动态去加载
export const dynamicRoutes = [
  {
    path: '/system/user-auth',
    component: Layout,
    hidden: true,
    permissions: ['system:user:edit'],
    children: [
      {
        path: 'role/:userId(\\d+)',
        component: () => import('@/views/system/role/auth-user.vue'),
        name: 'AuthRole',
        meta: { title: '分配角色', activeMenu: '/system/user' }
      }
    ]
  },
  {
    path: '/system/role-auth',
    component: Layout,
    hidden: true,
    permissions: ['system:role:edit'],
    children: [
      {
        path: 'user/:roleId(\\d+)',
        component: () => import('@/views/system/role/auth-user.vue'),
        name: 'AuthUser',
        meta: { title: '分配用户', activeMenu: '/system/role' }
      }
    ]
  },
  {
    path: '/system/dict-data',
    component: Layout,
    hidden: true,
    permissions: ['system:dict:list'],
    children: [
      {
        path: 'index/:dictId(\\d+)',
        component: () => import('@/views/system/role/auth-user.vue'),
        name: 'Data',
        meta: { title: '字典数据', activeMenu: '/system/dict' }
      }
    ]
  },
  {
    path: '/monitor/job-log',
    component: Layout,
    hidden: true,
    permissions: ['monitor:job:list'],
    children: [
      {
        path: 'index/:jobId(\\d+)',
        component: () => import('@/views/system/role/auth-user.vue'),
        name: 'JobLog',
        meta: { title: '调度日志', activeMenu: '/monitor/job' }
      }
    ]
  },
  {
    path: '/tool/gen-edit',
    component: Layout,
    hidden: true,
    permissions: ['tool:gen:edit'],
    children: [
      {
        path: 'index/:tableId(\\d+)',
        component: () => import('@/views/system/role/auth-user.vue'),
        name: 'GenEdit',
        meta: { title: '修改生成配置', activeMenu: '/tool/gen' }
      }
    ]
  },
  {
    path: '/metadata/meta-data',
    component: Layout,
    hidden: true,
    permissions: ['meta:level:list'],
    children: [
      {
        path: 'property/:industryId/:status',
        component: () => import('@/views/metadata/property-data.vue'),
        name: 'Data',
        meta: { title: '属性数据', activeMenu: '/metadata/class' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore()
  const publicPages = ['/login']
  const authRequired = !publicPages.includes(to.path)
  //const roleRequired = to.meta.requiresRole as string
  // 如果用户已登录并且尝试访问登录页面，则重定向到主页
  if (authStore.isAuthenticated() && publicPages.includes(to.path)) {
    next('/')
  }
  else if (authRequired && !authStore.isAuthenticated()) {
    next('/login')
  }
  // 检查角色权限
  // else if (roleRequired && authStore.role !== roleRequired) {
  //   next('/')
  // } 
  // 其他情况则允许导航继续
  else {
    next()
  }
})




export default router