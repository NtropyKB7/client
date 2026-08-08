import { computed, ref } from 'vue'
import { useQuery, useQueryClient } from '@tanstack/vue-query'
import { useModalStore } from '@/shared/store/modal'
import {
  fetchBanks,
  fetchAccounts,
  activateAccount,
  deactivateAccount,
  isAccountActive,
} from '../api'
import BankPickerModal from '../components/BankPickerModal.vue'

function emptyRow() {
  return { bank: null, bankLoginId: '', bankLoginPassword: '', birthDate: '' }
}

/**
 * AccountSetupView(온보딩)와 AccountsManageSection(마이페이지)이 공유하는 계좌 연결 로직.
 * 은행 목록/연결된 계좌 조회, 신규 은행 로그인 row 관리, 활성·비활성 토글, "최소 1개 활성 계좌"
 * 검증을 담당한다. 실제 순차 등록(registerAccountRows)은 화면마다 후속 동작이 달라(온보딩은
 * AccountAnalyzingView로 이동, 마이페이지는 인라인 저장) 각 화면에서 직접 호출한다.
 */
export function useAccountConnections() {
  const modalStore = useModalStore()
  const queryClient = useQueryClient()

  const { data: banks } = useQuery({ queryKey: ['banks'], queryFn: fetchBanks })
  const { data: connectedAccounts, isLoading: isLoadingAccounts } = useQuery({
    queryKey: ['accounts'],
    queryFn: fetchAccounts,
  })

  const pendingRows = ref([emptyRow()])
  const togglingAccountId = ref(null)

  const activeConnectedCount = computed(
    () => connectedAccounts.value?.filter(isAccountActive).length ?? 0,
  )

  const validPendingRows = computed(() =>
    pendingRows.value.filter(
      (row) =>
        row.bank &&
        row.bankLoginId.trim() &&
        row.bankLoginPassword.trim() &&
        (!row.bank.birthDateRequired || row.birthDate),
    ),
  )

  // 온보딩/마이페이지 공통 "최소 1개 활성 계좌" 규칙: 기존 활성 연결 + 아직 제출 전인 유효한 신규 row 합산.
  const canProceed = computed(() => activeConnectedCount.value + validPendingRows.value.length > 0)

  const availableBanks = computed(() => {
    const connectedCodes = new Set(
      (connectedAccounts.value ?? [])
        .filter(isAccountActive)
        .map((account) => account.organizationCode),
    )
    return (banks.value ?? []).filter((bank) => !connectedCodes.has(bank.organizationCode))
  })

  function addRow() {
    pendingRows.value.push(emptyRow())
  }

  function removeRow(index) {
    pendingRows.value.splice(index, 1)
  }

  function removePendingRow(row) {
    const index = pendingRows.value.indexOf(row)
    if (index !== -1) pendingRows.value.splice(index, 1)
  }

  async function pickBank(row) {
    const selected = await modalStore.open(
      BankPickerModal,
      { banks: availableBanks.value, selected: row.bank?.organizationCode },
      { position: 'bottom' },
    )
    if (selected) row.bank = selected
  }

  // 마지막 남은 활성 계좌는 비활성화할 수 없다 — 새로 추가 중인 유효한 row가 있으면 그걸로
  // 대체 가능하다고 보고 허용한다.
  function canDeactivate(account) {
    if (!isAccountActive(account)) return true
    return activeConnectedCount.value + validPendingRows.value.length > 1
  }

  async function toggleAccount(account) {
    togglingAccountId.value = account.accountId
    try {
      if (isAccountActive(account)) {
        await deactivateAccount(account.accountId)
      } else {
        await activateAccount(account.accountId)
      }
      await queryClient.invalidateQueries({ queryKey: ['accounts'] })
    } finally {
      togglingAccountId.value = null
    }
  }

  return {
    banks,
    connectedAccounts,
    isLoadingAccounts,
    pendingRows,
    validPendingRows,
    activeConnectedCount,
    canProceed,
    togglingAccountId,
    addRow,
    removeRow,
    removePendingRow,
    pickBank,
    canDeactivate,
    toggleAccount,
  }
}
