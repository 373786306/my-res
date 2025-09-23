// @/directives/permission/hasRole.ts
import type { Directive, DirectiveBinding } from 'vue'


type RoleValue = string | string[]

interface El extends HTMLElement {
  _originalDisplay?: string
}

const hasRole: Directive<El, RoleValue> = {
 async mounted(el: El, binding: DirectiveBinding<RoleValue>) {
    const { value } = binding
    const { useAuthStore } = await import('../../stores/useAuthStore')
    const store = useAuthStore()

    if (!value) {
      throw new Error('[v-hasRole] 角色值不能为空')
    }

    const roles: string[] = store.roles || []
    const allRole = 'admin' // 可配置，假设 admin 拥有所有权限

    let roleFlags: string[]
    if (typeof value === 'string') {
      roleFlags = [value]
    } else if (Array.isArray(value)) {
      roleFlags = value
    } else {
      throw new Error('[v-hasRole] 角色值必须是字符串或字符串数组')
    }

    const hasRole = roles.some(role =>
      role === allRole || roleFlags.includes(role)
    )

    if (!hasRole) {
      el.style.display = 'none'
    }
  }
}

export default hasRole