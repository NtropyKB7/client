import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

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
  const defenseId = ref(null)
  const isActive = ref(false)
  const status = ref(null)
  const cause = ref(null)
  const startDate = ref(null)
  const endDate = ref(null)
  // GET /defense/active는 진행중과 예약(status: 'SCHEDULED')된 방어모드를 함께 내려준다.
  const isScheduled = computed(() => status.value === 'SCHEDULED')
  // 체크리스트 완료 여부는 백엔드가 추적하지 않는 순수 클라이언트 상태라 계속 로컬에 보관한다.
  const checkedInsuranceIds = ref(persisted?.checkedInsuranceIds ?? [])

  function persist() {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ checkedInsuranceIds: checkedInsuranceIds.value }),
      )
    } catch {
      // localStorage 쓰기 실패(용량 초과, 프라이빗 브라우징 등) 시 무시 — 인메모리 상태는 유지
    }
  }

  // GET /defense/active 응답(정규화된 형태)을 서버가 단일 진실 공급원인 상태로 반영한다.
  function syncFromServer(data) {
    if (!data) {
      clear()
      return
    }
    defenseId.value = data.defenseId
    status.value = data.status
    isActive.value = data.status !== 'SCHEDULED'
    cause.value = data.causeCode
    startDate.value = data.unavailableStartDate
    endDate.value = data.expectedReturnDate
  }

  function clear() {
    defenseId.value = null
    isActive.value = false
    status.value = null
    cause.value = null
    startDate.value = null
    endDate.value = null
    checkedInsuranceIds.value = []
    persist()
  }

  function toggleInsuranceItem(code) {
    const index = checkedInsuranceIds.value.indexOf(code)
    if (index === -1) {
      checkedInsuranceIds.value.push(code)
    } else {
      checkedInsuranceIds.value.splice(index, 1)
    }
    persist()
  }

  return {
    defenseId,
    isActive,
    status,
    isScheduled,
    cause,
    startDate,
    endDate,
    checkedInsuranceIds,
    syncFromServer,
    clear,
    toggleInsuranceItem,
  }
})
