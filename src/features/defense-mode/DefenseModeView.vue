<!-- src/features/defense-mode/DefenseModeView.vue -->
<script setup>
import { computed, watch } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { useModalStore } from '@/shared/store/modal'
import { useMypageStore } from '@/features/mypage/store'
import { fetchSubscription } from '@/features/mypage/api'
import Button from '@/shared/components/Button.vue'
import { useDefenseModeStore } from './store'
import { fetchDefenseModeData, CAUSE_OPTIONS } from './api'
import DeclarationForm from './components/DeclarationForm.vue'
import SurvivalCalculatorCard from './components/SurvivalCalculatorCard.vue'
import FixedExpenseChecklist from './components/FixedExpenseChecklist.vue'
import InsuranceClaimChecklist from './components/InsuranceClaimChecklist.vue'
import DeactivateConfirmModal from './components/DeactivateConfirmModal.vue'
import SubscriptionRequiredCard from './components/SubscriptionRequiredCard.vue'
import DefenseIcon from '@/shared/components/icons/DefenseIcon.vue'
import BellIcon from '@/shared/components/icons/BellIcon.vue'

const defenseStore = useDefenseModeStore()
const modalStore = useModalStore()
const mypageStore = useMypageStore()

const { data: subscription } = useQuery({
  queryKey: ['mypage', 'subscription'],
  queryFn: fetchSubscription,
})

watch(subscription, (value) => {
  if (value) mypageStore.initPlan(value.planId)
})

const isSubscribed = computed(() => mypageStore.planId === 'pro')

const { data: defenseData } = useQuery({
  queryKey: ['defense-mode', 'data'],
  queryFn: fetchDefenseModeData,
})

const causeLabel = computed(
  () => CAUSE_OPTIONS.find((option) => option.id === defenseStore.cause)?.label ?? '',
)

const insuranceItems = computed(
  () => defenseData.value?.insuranceChecklistByCause?.[defenseStore.cause] ?? [],
)

function activate(payload) {
  defenseStore.activate(payload)
}

async function openDeactivateConfirm() {
  const confirmed = await modalStore.open(DeactivateConfirmModal, {}, { position: 'center' })
  if (confirmed) {
    defenseStore.deactivate()
  }
}
</script>

<template>
  <div class="flex flex-col gap-4 px-4 py-6">
    <div class="flex items-center justify-between">
      <h1 class="text-lg font-semibold text-[#111110]">방어모드</h1>
      <BellIcon class="h-6 w-6 text-[#111110]" />
    </div>

    <div>
      <p class="text-xs font-semibold tracking-wide text-[#6B6A65]">DEFENSE MODE</p>
      <div class="mt-1 flex items-center gap-2">
        <DefenseIcon class="h-5 w-5 text-[#111110]" />
        <h2 class="text-xl font-bold text-[#111110]">방어모드</h2>
      </div>
      <p class="mt-1 text-xs text-[#6B6A65]">소득 공백 시 자산을 지키는 위기 대응 시스템</p>
    </div>

    <SubscriptionRequiredCard v-if="!isSubscribed" />

    <template v-else-if="defenseStore.isActive">
      <div class="flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-3 text-white">
        <DefenseIcon class="h-5 w-5" />
        <p class="text-sm font-semibold">방어모드 활성 · {{ causeLabel }}</p>
      </div>

      <SurvivalCalculatorCard v-if="defenseData" :finance="defenseData.finance" />

      <FixedExpenseChecklist v-if="defenseData" :items="defenseData.fixedExpenses" />

      <InsuranceClaimChecklist
        :items="insuranceItems"
        :checked-ids="defenseStore.checkedInsuranceIds"
        @toggle="defenseStore.toggleInsuranceItem"
      />

      <div
        class="flex items-center justify-between rounded-xl border border-[#111110]/10 bg-white px-4 py-3"
      >
        <p class="text-xs text-[#6B6A65]">성장모드(근무 추천·자동 저축)</p>
        <span class="rounded-full bg-amber-100 px-2 py-1 text-[10px] font-semibold text-amber-700">
          일시정지됨
        </span>
      </div>

      <Button variant="danger" @click="openDeactivateConfirm">방어모드 해제</Button>
    </template>

    <DeclarationForm v-else @activate="activate" />
  </div>
</template>
