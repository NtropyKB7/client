<!-- src/features/mypage/components/SubscriptionStatusSection.vue -->
<script setup>
import { computed } from 'vue'
import { useModalStore } from '@/shared/store/modal'
import { useMypageStore } from '../store'
import { PLAN_OPTIONS } from '../api'
import AppHeader from '@/shared/components/AppHeader.vue'
import ChevronRightIcon from '@/shared/components/icons/ChevronRightIcon.vue'
import CancelSubscriptionConfirmModal from './CancelSubscriptionConfirmModal.vue'

defineProps({
  subscription: { type: Object, required: true },
})

const emit = defineEmits(['back', 'open-payment-methods'])

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
  <div class="flex flex-col">
    <AppHeader back title="마이페이지" @back="emit('back')" />

    <div class="flex flex-col gap-4 px-4 pt-5 pb-6">
      <div class="rounded-2xl border border-grey-50 bg-grey-white p-4">
        <div class="flex items-center justify-between">
          <p class="text-body1 text-grey-500">{{ currentPlan.name }}</p>
          <span
            class="rounded-full bg-primary-50 px-3 py-1.5 text-[10px] font-bold text-primary-800"
          >
            이용중
          </span>
        </div>
        <div class="mt-3 flex items-center justify-between text-caption">
          <p class="text-grey-300">이용 시작일</p>
          <p class="text-grey-300">{{ subscription.startedAt }}</p>
        </div>
        <div class="mt-2 flex items-center justify-between text-caption">
          <p class="text-grey-300">다음 결제일</p>
          <p class="text-grey-300">{{ subscription.nextBillingDate }}</p>
        </div>
        <div class="mt-2 flex items-center justify-between text-caption">
          <p class="text-grey-300">자동 연장</p>
          <p class="text-grey-500">{{ subscription.autoRenew ? '켜짐' : '꺼짐' }}</p>
        </div>
        <button
          type="button"
          class="mt-4 w-full border-t border-grey-50 pt-3 text-center text-caption font-bold text-primary-800"
          @click="emit('open-payment-methods')"
        >
          구독 및 결제 수단 변경
        </button>
      </div>

      <div class="rounded-2xl border border-grey-50 bg-grey-white p-4">
        <p class="text-body1 text-grey-500">결제 내역</p>
        <div class="mt-2 flex flex-col">
          <div
            v-for="bill in subscription.billingHistory"
            :key="bill.id"
            class="flex items-center justify-between gap-2 border-b border-grey-50 py-3 last:border-b-0"
          >
            <div class="min-w-0 flex-1">
              <p class="text-body3 text-grey-500">{{ bill.label }}</p>
              <p class="mt-1 text-caption text-grey-300">
                결제일 {{ bill.date }} · {{ bill.amount.toLocaleString() }}원
              </p>
            </div>
            <ChevronRightIcon class="size-5 shrink-0 text-grey-300" />
          </div>
        </div>
      </div>

      <button
        v-if="currentPlan.id !== 'basic'"
        type="button"
        class="rounded-xl bg-[#ffebe5] py-3.5 text-body3 font-bold text-[#e53d33]"
        @click="openCancelConfirm"
      >
        해지 예약하기
      </button>
    </div>
  </div>
</template>
