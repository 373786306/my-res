// utils/routerUtils.ts
import type { RouteRecordRaw } from 'vue-router'
import type { Component } from 'vue'
import auth from '../utils/auth'

// 动态路由遍历，验证是否具备权限
export function filterDynamicRoutes(routes: any[]) {
  const res: RouteRecordRaw[] = []
  routes.forEach(route => {
    if (route.permissions) {
      if (auth.hasPermiOr(route.permissions)) {
        res.push(route)
      }
    } else if (route.roles) {
      if (auth.hasRoleOr(route.roles)) {
        res.push(route)
      }
    }
  })
  return res
}

export function convertBackendRoutesToVueRoutes(backendRoutes: any[]): RouteRecordRaw[] {
  return backendRoutes.map(route => {
    const meta = {
      ...route.meta,
      hidden: route.hidden ?? false,
      alwaysShow: route.alwaysShow ?? false
    }

    // --- 步骤 1: 构建基础路由配置对象 ---
    // 这个对象不包含 children
    const baseRouteConfig = {
      name: route.name,
      path: route.path.startsWith('/') ? route.path : '/' + route.path,
      meta: meta,
      component: getComponent(route.component),
      redirect: route.redirect === 'noRedirect' ? undefined : route.redirect,
    }

    // --- 步骤 2: 创建一个明确的 RouteRecordRaw 变量 ---
    // 先赋值基础配置，此时 children 是 undefined
    const convertedRoute: RouteRecordRaw = baseRouteConfig

    // --- 步骤 3: 有条件地处理 children ---
    if (route.children && Array.isArray(route.children) && route.children.length > 0) {
      // 关键：这里需要告诉 TypeScript，我们明确要给 convertedRoute 添加 children 属性
      // 使用类型断言来断言 convertedRoute 有一个可选的 children 属性
      // 方式一：断言 convertedRoute 有 children 属性
      (convertedRoute as { children?: RouteRecordRaw[] }).children = convertBackendRoutesToVueRoutes(route.children)

      // 方式二：直接断言右侧的数组类型 (更直接，但稍弱)
      // convertedRoute.children = convertBackendRoutesToVueRoutes(route.children) as RouteRecordRaw[]
    }

    // --- 步骤 4: 返回 ---
    return convertedRoute
  })
}

function getComponent(componentStr: string): () => Promise<Component> {
  console.log('getComponent', componentStr)
  if (componentStr === 'Layout') {
    return () => import('@/components/layout/Layout.vue')
  }else if (componentStr === 'ParentView') {
    return () => import('@/components/ParentView/index.vue')   
  }
  const loader = componentMap[componentStr]
  if (!loader) {
    // 没写完... TODO
    console.error(`Async component not found: ${componentStr}`)
    // 可返回一个错误组件
    return () => import('@/views/dashboard/index.vue')
  }
  return loader
}
// ✅ 预定义所有异步组件
const componentMap: Record<string, () => Promise<Component>> = {
  'system/user/index': () => import('@/views/system/user/index.vue'),
  'system/role/index': () => import('@/views/system/role/index.vue'),
  'system/menu/index': () => import('@/views/system/menu/index.vue'),
  'system/dept/index': () => import('@/views/system/dept/index.vue'),
  'system/post/index': () => import('@/views/system/post/index.vue'),

  'monitor/operlog/index': () => import('@/views/monitor/operlog/index.vue'),
  'monitor/logininfor/index': () => import('@/views/monitor/logininfor/index.vue'),

  'architecture/structure': () => import('@/views/architecture/structure.vue'),

  'metadata/stdClassMsg': () => import('@/views/metadata/stdClassMsg.vue'),
  'metadata/property': () => import('@/views/metadata/property.vue'),
  'metadata/template': () => import('@/views/metadata/template.vue'),

  'atlas/product-atlas': () => import('@/views/atlas/product-atlas.vue'),
  'atlas/category-atlas': () => import('@/views/atlas/category-atlas.vue'),

  'resource/std-search': () => import('@/views/resource/std-search.vue'),
  'resource/text-search': () => import('@/views/resource/text-search.vue'),

  'feedback/feedback': () => import('@/views/feedback/feedback.vue'),

  'atlas/std-category': () => import('@/views/atlas/std-category.vue'),
  'atlas/product-module': () => import('@/views/atlas/product-module.vue'),
  'atlas/product-combine': () => import('@/views/atlas/product-combine.vue'),
  'atlas/product-mapping': () => import('@/views/atlas/product-mapping.vue'),
  'atlas/std-category-mapping': () => import('@/views/atlas/std-category-mapping.vue'),
  'atlas/std-library': () => import('@/views/atlas/std-library.vue'),

}