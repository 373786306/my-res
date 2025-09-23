// @/directives/permission/hasPermi.ts
import type { Directive, DirectiveBinding } from 'vue'
import { nextTick } from 'vue'



// 权限值类型
type PermiValue = string | string[]

// 自定义元素扩展
interface El extends HTMLElement {
  _originalDisplay?: string // 用于保存原始 display 值
}

const hasPermi: Directive<El, PermiValue> = {
  async mounted(el: El, binding: DirectiveBinding<PermiValue>) {
    const { value } = binding
    const { useAuthStore } = await import('../../stores/useAuthStore')
    const store = useAuthStore()
    const allPermission = '*:*:*'
    const permissions = store.permissions
    if (!value) {
      throw new Error('[v-hasPermi] 权限值不能为空')
    }

    let permissionFlags: string[]
    if (typeof value === 'string') {
      permissionFlags = [value]
    } else if (Array.isArray(value)) {
      permissionFlags = value
    } else {
      throw new Error('[v-hasPermi] 权限值必须是字符串或字符串数组')
    }

    const hasPermission = permissions.some(perm =>
      perm === allPermission || permissionFlags.includes(perm as string)
    )
    if (!hasPermission) {
      el._originalDisplay = el.style.display
      nextTick(() => {
        el.style.setProperty('display', 'none', 'important')
      })
    }
  }
}

export default hasPermi