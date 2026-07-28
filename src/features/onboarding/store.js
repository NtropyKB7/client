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
  const jobs = ref(persisted?.jobs ?? [])
  const goal = ref(persisted?.goal ?? { amount: 2500000, fatigue: 3 })
  const isComplete = ref(persisted?.isComplete ?? false)

  const hasAccounts = computed(() => accounts.value.length > 0)

  function persist() {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        accounts: accounts.value,
        jobs: jobs.value,
        goal: goal.value,
        isComplete: isComplete.value,
      }),
    )
  }

  function setAccounts(newAccounts) {
    accounts.value = newAccounts
    persist()
  }

  function setJobs(newJobs) {
    jobs.value = newJobs
    persist()
  }

  function setGoal(newGoal) {
    goal.value = newGoal
    persist()
  }

  function complete() {
    isComplete.value = true
    persist()
  }

  function reset() {
    accounts.value = []
    jobs.value = []
    goal.value = { amount: 2500000, fatigue: 3 }
    isComplete.value = false
    localStorage.removeItem(STORAGE_KEY)
  }

  return {
    accounts,
    jobs,
    goal,
    isComplete,
    hasAccounts,
    setAccounts,
    setJobs,
    setGoal,
    complete,
    reset,
  }
})
