import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const STORAGE_KEY = 'ntropy_onboarding'

function loadPersisted() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export const useOnboardingStore = defineStore('onboarding', () => {
  const persisted = loadPersisted()

  const accounts = ref(persisted?.accounts ?? [])
  const goal = ref(persisted?.goal ?? { amount: 2500000, fatigue: 3 })

  const hasAccounts = computed(() => accounts.value.length > 0)

  function persist() {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          accounts: accounts.value,
          goal: goal.value,
        }),
      )
    } catch {
      // localStorage 쓰기 실패(용량 초과, 프라이빗 브라우징 등) 시 무시 — 인메모리 상태는 이미 갱신된 상태를 유지
    }
  }

  function setAccounts(newAccounts) {
    accounts.value = newAccounts
    persist()
  }

  function setGoal(newGoal) {
    goal.value = newGoal
    persist()
  }

  function reset() {
    accounts.value = []
    goal.value = { amount: 2500000, fatigue: 3 }
    localStorage.removeItem(STORAGE_KEY)
  }

  return {
    accounts,
    goal,
    hasAccounts,
    setAccounts,
    setGoal,
    reset,
  }
})
