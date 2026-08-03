import { defineStore } from 'pinia'
import { ref } from 'vue'

const STORAGE_KEY = 'ntropy_report'

function loadPersisted() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export const useReportStore = defineStore('report', () => {
  const persisted = loadPersisted()

  const kakaoDelivery = ref(persisted?.kakaoDelivery ?? true)
  const emailDelivery = ref(persisted?.emailDelivery ?? true)

  function persist() {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          kakaoDelivery: kakaoDelivery.value,
          emailDelivery: emailDelivery.value,
        }),
      )
    } catch {
      // localStorage 쓰기 실패 시 무시 — 인메모리 상태는 유지
    }
  }

  function toggleKakaoDelivery() {
    kakaoDelivery.value = !kakaoDelivery.value
    persist()
  }

  function toggleEmailDelivery() {
    emailDelivery.value = !emailDelivery.value
    persist()
  }

  return {
    kakaoDelivery,
    emailDelivery,
    toggleKakaoDelivery,
    toggleEmailDelivery,
  }
})
