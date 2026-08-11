import { defineStore } from 'pinia'
import { ref } from 'vue'

const STORAGE_KEY = 'ntropy_mypage'

function loadPersisted() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export const useMypageStore = defineStore('mypage', () => {
  const persisted = loadPersisted()

  const planId = ref(persisted?.planId ?? null)

  function persist() {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          planId: planId.value,
        }),
      )
    } catch {
      // localStorage 쓰기 실패(용량 초과, 프라이빗 브라우징 등) 시 무시 — 인메모리 상태는 이미 갱신된 상태를 유지
    }
  }

  function setPlan(id) {
    planId.value = id
    persist()
  }

  function reset() {
    planId.value = null
    persist()
  }

  return {
    planId,
    setPlan,
    reset,
  }
})
