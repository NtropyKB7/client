<!-- src/features/defense-mode/DefenseModeView.vue -->
<script setup>
import { computed, watch } from 'vue'
import { useQuery, useQueryClient } from '@tanstack/vue-query'
import { useModalStore } from '@/shared/store/modal'
import { useMypageStore } from '@/features/mypage/store'
import { fetchSubscription } from '@/features/mypage/api'
import AppHeader from '@/shared/components/AppHeader.vue'
import Button from '@/shared/components/Button.vue'
import { useDefenseModeStore } from './store'
import { fetchDefenseModeData, fetchDefenseCauses, enterDefenseMode, releaseDefenseMode } from './api'
import { formatDateKey } from './utils'
import DeclarationForm from './components/DeclarationForm.vue'
import SurvivalCalculatorCard from './components/SurvivalCalculatorCard.vue'
import ExpectedLossCard from './components/ExpectedLossCard.vue'
import FixedExpenseChecklist from './components/FixedExpenseChecklist.vue'
import InsuranceClaimChecklist from './components/InsuranceClaimChecklist.vue'
import DeactivateConfirmModal from './components/DeactivateConfirmModal.vue'
import SubscriptionRequiredCard from './components/SubscriptionRequiredCard.vue'
import DefenseIcon from '@/shared/components/icons/DefenseIcon.vue'

const defenseStore = useDefenseModeStore()
const modalStore = useModalStore()
const mypageStore = useMypageStore()
const queryClient = useQueryClient()

const { data: subscription } = useQuery({
  queryKey: ['mypage', 'subscription'],
  queryFn: fetchSubscription,
})

watch(subscription, (value) => {
  if (value) mypageStore.setPlan(value.planId)
})

const isSubscribed = computed(() => mypageStore.planId === 'pro')

const { data: defenseData } = useQuery({
  queryKey: ['defense-mode', 'active'],
  queryFn: fetchDefenseModeData,
  enabled: isSubscribed,
})

watch(
  defenseData,
  (value) => {
    defenseStore.syncFromServer(value ?? null)
  },
  { immediate: true },
)

const { data: causes } = useQuery({
  queryKey: ['defense-mode', 'causes'],
  queryFn: fetchDefenseCauses,
  enabled: isSubscribed,
})

async function activate(payload) {
  await enterDefenseMode({
    causeCode: payload.cause,
    unavailableStartDate: payload.startDate,
    expectedReturnDate: payload.endDate,
  })
  queryClient.invalidateQueries({ queryKey: ['defense-mode'] })
}

async function openDeactivateConfirm() {
  const confirmed = await modalStore.open(DeactivateConfirmModal, {}, { position: 'center' })
  if (confirmed) {
    await releaseDefenseMode({
      defenseId: defenseStore.defenseId,
      returnDate: formatDateKey(new Date()),
    })
    queryClient.invalidateQueries({ queryKey: ['defense-mode'] })
  }
}
</script>

<template>
  <div class="flex flex-col">
    <AppHeader title="방어모드" />

    <div class="flex flex-col gap-4 px-4 pt-5 pb-6">
      <SubscriptionRequiredCard v-if="!isSubscribed" />

      <template v-else-if="defenseStore.isActive">
        <div
          class="flex items-center gap-2.5 rounded-2xl border border-grey-50 bg-primary-50 px-3 py-3.5"
        >
          <span class="flex size-9 shrink-0 items-center justify-center rounded-full bg-grey-white">
            <DefenseIcon class="size-5 text-primary-600" />
          </span>
          <p class="text-body3 text-primary-800">방어모드 활성</p>
        </div>

        <SurvivalCalculatorCard
          v-if="defenseData"
          :finance="defenseData.finance"
          :survival-days="defenseData.survivalDays"
        />

        <ExpectedLossCard v-if="defenseData" :amount="defenseData.expectedLossAmount" />

        <FixedExpenseChecklist v-if="defenseData" :items="defenseData.fixedExpenses" />

        <InsuranceClaimChecklist
          :items="defenseData?.checklist ?? []"
          :checked-ids="defenseStore.checkedInsuranceIds"
          @toggle="defenseStore.toggleInsuranceItem"
        />

        <div class="rounded-2xl border border-grey-50 bg-grey-white p-4">
          <div class="flex items-center justify-between">
            <p class="text-caption font-bold text-grey-500">성장모드</p>
            <span class="rounded-full bg-grey-30 px-3 py-1.5 text-[10px] font-bold text-grey-300">
              {{ defenseData?.growthMode?.isPaused ? '일시정지됨' : '정상 진행중' }}
            </span>
          </div>
          <p class="mt-1 text-[11px] text-grey-300">
            {{ defenseData?.growthMode?.message || '근무 추천과 자동 지출을 잠시 멈춘 상태' }}
          </p>
          <div class="mt-4">
            <Button @click="openDeactivateConfirm">방어모드 해제</Button>
          </div>
        </div>
      </template>

      <DeclarationForm v-else :causes="causes ?? []" @activate="activate" />
    </div>
  </div>
</template>
