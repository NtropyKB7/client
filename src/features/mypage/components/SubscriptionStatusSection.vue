<!-- src/features/mypage/components/SubscriptionStatusSection.vue -->
<script setup>
import { computed } from 'vue'
import { useModalStore } from '@/shared/store/modal'
import { useMypageStore } from '../store'
import { PLAN_OPTIONS } from '../api'
import BackLink from './BackLink.vue'
import Button from '@/shared/components/Button.vue'
import CancelSubscriptionConfirmModal from './CancelSubscriptionConfirmModal.vue'

defineProps({
  subscription: { type: Object, required: true },
})

const emit = defineEmits(['back', 'open-plan-modal'])

const mypageStore = useMypageStore()
const modalStore = useModalStore()

const currentPlan = computed(
  () => PLAN_OPTIONS.find((plan) => plan.id === mypageStore.planId) ?? PLAN_OPTIONS[1],
)

async function openCancelConfirm() {
  const confirmed = await modalStore.open(
    CancelSubscriptionConfirmModal,
    {},
    { position: 'center' },
  )
  if (confirmed) {
    mypageStore.setPlan('basic')
  }
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <BackLink @click="emit('back')" />

    <div class="rounded-2xl border border-[#111110]/10 bg-white p-4">
      <div class="flex items-center justify-between">
        <p class="text-base font-semibold text-[#111110]">{{ currentPlan.name }}</p>
        <span class="rounded-full bg-amber-100 px-2 py-1 text-[10px] font-semibold text-amber-700">
          이용중
        </span>
      </div>
      <div class="mt-3 flex items-center justify-between text-sm">
        <p class="text-[#6B6A65]">이용 시작일</p>
        <p class="text-[#111110]">{{ subscription.startedAt }}</p>
      </div>
      <div class="mt-2 flex items-center justify-between text-sm">
        <p class="text-[#6B6A65]">다음 결제일</p>
        <p class="text-[#111110]">{{ subscription.nextBillingDate }}</p>
      </div>
      <div class="mt-2 flex items-center justify-between text-sm">
        <p class="text-[#6B6A65]">자동 연장</p>
        <p class="text-emerald-600">{{ subscription.autoRenew ? '켜짐' : '꺼짐' }}</p>
      </div>
      <div class="mt-4">
        <Button variant="outline" @click="emit('open-plan-modal')">구독 및 결제 수단 변경</Button>
      </div>
    </div>

    <div class="rounded-2xl border border-[#111110]/10 bg-white p-4">
      <p class="text-sm font-semibold text-[#111110]">결제 내역</p>
      <div class="mt-2 flex flex-col">
        <div
          v-for="bill in subscription.billingHistory"
          :key="bill.id"
          class="border-b border-[#111110]/5 py-3 last:border-b-0"
        >
          <p class="text-sm text-[#111110]">{{ bill.label }}</p>
          <p class="mt-1 text-xs text-[#6B6A65]">
            결제일 {{ bill.date }} · {{ bill.amount.toLocaleString() }}원
          </p>
        </div>
      </div>
    </div>

    <Button v-if="currentPlan.id !== 'basic'" variant="danger" @click="openCancelConfirm">
      해지 예약하기
    </Button>
  </div>
</template>
