// @/directives/index.ts
import type { App } from 'vue'

import hasRole from './permission/hasRole'
import hasPermi from './permission/hasPermi'
// import dialogDrag from './permission/drag'
// import dialogDragWidth from './permission/dragWidth'
// import dialogDragHeight from './permission/dragHeight'
// import clipboard from './permission/clipboard'

// 插件函数
const install = (app: App) => {
  app
    .directive('hasRole', hasRole)
    .directive('hasPermi', hasPermi)
    
}

// 导出插件
export default install

// 导出单个指令（可选）
export {
  hasRole,
  hasPermi,
}