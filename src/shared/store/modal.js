import { defineStore } from 'pinia'
import { ref, shallowRef } from 'vue'

export const useModalStore = defineStore('modal', () => {
  const isOpen = ref(false)
  const component = shallowRef(null)
  const props = ref({})
  const position = ref('center')

  let resolvePromise = null

  function open(newComponent, newProps = {}, options = {}) {
    component.value = newComponent
    props.value = newProps
    position.value = options.position ?? 'center'
    isOpen.value = true

    return new Promise((resolve) => {
      resolvePromise = resolve
    })
  }

  function close(payload) {
    isOpen.value = false
    component.value = null
    props.value = {}

    resolvePromise?.(payload)
    resolvePromise = null
  }

  return { isOpen, component, props, position, open, close }
})
