import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useToastStore = defineStore('toast', () => {
  const message = ref('')
  const isVisible = ref(false)

  let timeoutId = null
  let requestId = 0

  function show(newMessage, duration = 3000) {
    message.value = newMessage
    isVisible.value = true
    requestId += 1
    const currentRequestId = requestId

    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      if (currentRequestId === requestId) {
        isVisible.value = false
      }
    }, duration)
  }

  function hide() {
    clearTimeout(timeoutId)
    isVisible.value = false
  }

  return { message, isVisible, show, hide }
})
