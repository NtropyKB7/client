import { onMounted, onUnmounted, watch } from 'vue'

const DRAG_THRESHOLD_PX = 5

// 데스크톱에서 마우스로도 터치 스크롤처럼 드래그해서 스크롤할 수 있게 해주는 composable.
// 실제 터치/펜 입력은 브라우저 네이티브 스크롤을 그대로 쓰므로 mouse 포인터만 다룬다.
export function useDragScroll(elRef, { axis = 'y' } = {}) {
  let pointerId = null
  let startX = 0
  let startY = 0
  let startScrollLeft = 0
  let startScrollTop = 0
  let isDragging = false
  let justDragged = false

  function handlePointerDown(event) {
    if (event.pointerType !== 'mouse' || event.button !== 0) return

    pointerId = event.pointerId
    startX = event.clientX
    startY = event.clientY
    startScrollLeft = elRef.value.scrollLeft
    startScrollTop = elRef.value.scrollTop
    isDragging = false
    elRef.value.classList.add('cursor-grabbing')
  }

  function handlePointerMove(event) {
    if (event.pointerId !== pointerId) return

    const el = elRef.value
    const deltaX = event.clientX - startX
    const deltaY = event.clientY - startY

    if (!isDragging) {
      if (Math.hypot(deltaX, deltaY) < DRAG_THRESHOLD_PX) return
      isDragging = true
      el.setPointerCapture(pointerId)
      el.classList.add('select-none')
    }

    if (axis === 'x' || axis === 'both') el.scrollLeft = startScrollLeft - deltaX
    if (axis === 'y' || axis === 'both') el.scrollTop = startScrollTop - deltaY
  }

  function endDrag(event) {
    if (event.pointerId !== pointerId) return

    if (isDragging) {
      elRef.value.releasePointerCapture(pointerId)
      elRef.value.classList.remove('select-none')
    }
    elRef.value.classList.remove('cursor-grabbing')

    justDragged = isDragging
    pointerId = null
    isDragging = false
  }

  // 드래그로 스크롤한 직후의 클릭이 하위 버튼/링크로 전달되지 않도록 캡처 단계에서 막는다.
  function handleClickCapture(event) {
    if (!justDragged) return
    justDragged = false
    event.preventDefault()
    event.stopPropagation()
  }

  function attach(el) {
    el.addEventListener('pointerdown', handlePointerDown)
    el.addEventListener('pointermove', handlePointerMove)
    el.addEventListener('pointerup', endDrag)
    el.addEventListener('pointercancel', endDrag)
    el.addEventListener('click', handleClickCapture, true)
  }

  function detach(el) {
    el.removeEventListener('pointerdown', handlePointerDown)
    el.removeEventListener('pointermove', handlePointerMove)
    el.removeEventListener('pointerup', endDrag)
    el.removeEventListener('pointercancel', endDrag)
    el.removeEventListener('click', handleClickCapture, true)
  }

  onMounted(() => {
    if (elRef.value) attach(elRef.value)
  })

  onUnmounted(() => {
    if (elRef.value) detach(elRef.value)
  })

  watch(elRef, (newEl, oldEl) => {
    if (oldEl) detach(oldEl)
    if (newEl) attach(newEl)
  })
}
