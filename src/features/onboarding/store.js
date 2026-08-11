import { defineStore } from 'pinia'
import { ref } from 'vue'

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

  // AccountSetupView → AccountAnalyzingView로 넘어가는 동안 은행 로그인 비밀번호를 담아 나르는
  // 임시 상태라 localStorage에는 절대 persist하지 않는다(메모리에만 유지).
  const pendingAccountRows = ref([])
  const goal = ref(persisted?.goal ?? { amount: 2500000, fatigue: 3, savingGoalId: null })

  function persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ goal: goal.value }))
    } catch {
      // localStorage 쓰기 실패(용량 초과, 프라이빗 브라우징 등) 시 무시 — 인메모리 상태는 이미 갱신된 상태를 유지
    }
  }

  function setPendingAccountRows(rows) {
    pendingAccountRows.value = rows
  }

  function setGoal(newGoal) {
    goal.value = newGoal
    persist()
  }

  function reset() {
    pendingAccountRows.value = []
    goal.value = { amount: 2500000, fatigue: 3, savingGoalId: null }
    localStorage.removeItem(STORAGE_KEY)
  }

  return {
    pendingAccountRows,
    goal,
    setPendingAccountRows,
    setGoal,
    reset,
  }
})
