// @/directives/module/clipboard.ts
import type { Directive, DirectiveBinding } from 'vue'

const clipboard: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding<string>) {
    el.style.cursor = 'pointer'
    el.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(binding.value)
        // 可触发提示：this.$message.success('复制成功')
        console.log('已复制:', binding.value)
      } catch (err) {
        console.error('复制失败:', err)
      }
    })
  }
}

export default clipboard