// @/directives/dialog/drag.ts
import type { Directive } from 'vue'

interface El extends HTMLElement {
  _dragHandle?: HTMLElement
  _dragMoveHandler?: (e: MouseEvent) => void
  _dragUpHandler?: () => void
}

const dialogDrag: Directive = {
  mounted(el: El) {
    const dialogHeaderEl = el.querySelector('.el-dialog__header') as HTMLElement
    const dragEl = el.querySelector('.el-dialog') as HTMLElement

    if (!dialogHeaderEl || !dragEl) return

    dialogHeaderEl.style.cursor = 'move'

    const handleMousedown = (e: MouseEvent) => {
      const disX = e.clientX - dialogHeaderEl.offsetLeft
      const disY = e.clientY - dialogHeaderEl.offsetTop

      const moveHandler = (e: MouseEvent) => {
        dragEl.style.transform = `translate(${e.clientX - disX}px, ${e.clientY - disY}px)`
      }

      const upHandler = () => {
        document.removeEventListener('mousemove', moveHandler)
        document.removeEventListener('mouseup', upHandler)
      }

      document.addEventListener('mousemove', moveHandler)
      document.addEventListener('mouseup', upHandler)
    }

    dialogHeaderEl.addEventListener('mousedown', handleMousedown)
    el._dragHandle = dialogHeaderEl
  },
  unmounted(el: El) {
    if (el._dragHandle) {
      el._dragHandle.removeEventListener('mousedown', el._dragMoveHandler!)
    }
  }
}

export default dialogDrag