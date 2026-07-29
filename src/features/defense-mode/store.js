import { defineStore } from 'pinia'
import { ref } from 'vue'

const STORAGE_KEY = 'ntropy_defense_mode'

function loadPersisted() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export const useDefenseModeStore = defineStore('defenseMode', () => {
  const persisted = loadPersisted()
  const isActive = ref(persisted?.isActive ?? false)
  const cause = ref(persisted?.cause ?? null)
  const startDate = ref(persisted?.startDate ?? null)
  const endDate = ref(persisted?.endDate ?? null)
  const checkedInsuranceIds = ref(persisted?.checkedInsuranceIds ?? [])

  function persist() {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          isActive: isActive.value,
          cause: cause.value,
          startDate: startDate.value,
          endDate: endDate.value,
          checkedInsuranceIds: checkedInsuranceIds.value,
        }),
      )
    } catch {
      // localStorage 쓰기 실패(용량 초과, 프라이빗 브라우징 등) 시 무시 — 인메모리 상태는 유지
    }
  }

  function activate({ cause: newCause, startDate: newStartDate, endDate: newEndDate }) {
    isActive.value = true
    cause.value = newCause
    startDate.value = newStartDate
    endDate.value = newEndDate
    checkedInsuranceIds.value = []
    persist()
  }

  function deactivate() {
    isActive.value = false
    cause.value = null
    startDate.value = null
    endDate.value = null
    checkedInsuranceIds.value = []
    persist()
  }

  function toggleInsuranceItem(id) {
    const index = checkedInsuranceIds.value.indexOf(id)
    if (index === -1) {
      checkedInsuranceIds.value.push(id)
    } else {
      checkedInsuranceIds.value.splice(index, 1)
    }
    persist()
  }

  return {
    isActive,
    cause,
    startDate,
    endDate,
    checkedInsuranceIds,
    activate,
    deactivate,
    toggleInsuranceItem,
  }
})
