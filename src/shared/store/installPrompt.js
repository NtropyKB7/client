import { defineStore } from 'pinia'
import { ref } from 'vue'

const DISMISSED_KEY = 'ntropy:install-banner-dismissed'

// beforeinstallprompt는 페이지 로드 도중 아무 때나 한 번만 발생하고, 리스너가 없으면 그대로
// 유실된다. 그래서 Pinia store/Vue 마운트보다 먼저, 이 모듈이 import되는 즉시 등록해 이벤트를
// 놓치지 않고 잡아둔다. iOS Safari는 이 이벤트 자체를 지원하지 않으므로 deferredPrompt가 계속
// null로 남아 자연스럽게 설치 배너가 뜨지 않는다.
const deferredPrompt = ref(null)
const isInstalled = ref(window.matchMedia?.('(display-mode: standalone)').matches ?? false)

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault()
  deferredPrompt.value = event
})

window.addEventListener('appinstalled', () => {
  deferredPrompt.value = null
  isInstalled.value = true
})

export const useInstallPromptStore = defineStore('installPrompt', () => {
  const isDismissed = ref(localStorage.getItem(DISMISSED_KEY) === '1')

  function dismiss() {
    isDismissed.value = true
    localStorage.setItem(DISMISSED_KEY, '1')
  }

  async function promptInstall() {
    if (!deferredPrompt.value) return
    await deferredPrompt.value.prompt()
    deferredPrompt.value = null
  }

  return { deferredPrompt, isInstalled, isDismissed, dismiss, promptInstall }
})
