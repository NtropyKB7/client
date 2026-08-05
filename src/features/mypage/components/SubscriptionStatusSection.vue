<!-- src/features/mypage/components/SubscriptionStatusSection.vue -->
<script setup>
import { computed } from 'vue'
import { useQuery, useQueryClient } from '@tanstack/vue-query'
import { useModalStore } from '@/shared/store/modal'
import { useMypageStore } from '../store'
import { fetchPaymentHistory, cancelSubscription, revokeCancel } from '../api'
import AppHeader from '@/shared/components/AppHeader.vue'
import ProfileHeader from './ProfileHeader.vue'
import ChevronRightIcon from '@/shared/components/icons/ChevronRightIcon.vue'
import CancelSubscriptionConfirmModal from './CancelSubscriptionConfirmModal.vue'

const props = defineProps({
  subscription: { type: Object, required: true },
  profile: { type: Object, default: null },
  plans: { type: Array, required: true },
})

const emit = defineEmits(['back', 'open-payment-methods'])

const mypageStore = useMypageStore()
const modalStore = useModalStore()
const queryClient = useQueryClient()

const { data: paymentHistory } = useQuery({
  queryKey: ['mypage', 'payments'],
  queryFn: fetchPaymentHistory,
})

const PAYMENT_STATUS_SUFFIX = {
  FAILED: ' · 결제 실패',
  PENDING: ' · 처리중',
  RETRY: ' · 재시도중',
  CANCELLED: ' · 취소됨',
}

const currentPlan = computed(
  () => props.plans.find((plan) => plan.id === mypageStore.planId) ?? props.plans[1],
)

const isCancelScheduled = computed(() => props.subscription.status === 'CANCEL_SCHEDULED')

const statusBadgeLabel = computed(() => {
  if (isCancelScheduled.value) return '해지 예약됨'
  if (props.subscription.status === 'EXPIRED') return '만료됨'
  if (props.subscription.status === 'PAYMENT_FAILED') return '결제 실패'
  return '이용중'
})

function invalidateSubscription() {
  queryClient.invalidateQueries({ queryKey: ['mypage', 'subscription'] })
}

async function openCancelConfirm() {
  const confirmed = await modalStore.open(
    CancelSubscriptionConfirmModal,
    {},
    { position: 'center' },
  )
  if (confirmed) {
    await cancelSubscription()
    invalidateSubscription()
  }
}

async function handleRevokeCancel() {
  await revokeCancel()
  invalidateSubscription()
}
</script>

<template>
  <div class="flex flex-col">
    <AppHeader back title="마이페이지" @back="emit('back')" />

    <div class="flex flex-col gap-4 px-4 pt-5 pb-6">
      <ProfileHeader v-if="profile" :profile="profile" />

      <div class="rounded-2xl border border-grey-50 bg-grey-white p-4">
        <div class="flex items-center justify-between">
          <p class="text-body1 text-grey-500">{{ currentPlan.name }}</p>
          <span
            class="rounded-full px-3 py-1.5 text-[10px] font-bold"
            :class="
              subscription.status === 'PAYMENT_FAILED'
                ? 'bg-[#ffebe5] text-[#e53d33]'
                : isCancelScheduled
                  ? 'bg-grey-30 text-grey-400'
                  : 'bg-primary-50 text-primary-800'
            "
          >
            {{ statusBadgeLabel }}
          </span>
        </div>
        <div class="mt-3 flex items-center justify-between text-caption">
          <p class="text-grey-300">이용 시작일</p>
          <p class="text-grey-300">{{ subscription.startedAt ?? '-' }}</p>
        </div>
        <div class="mt-2 flex items-center justify-between text-caption">
          <p class="text-grey-300">다음 결제일</p>
          <p class="text-grey-300">{{ subscription.nextBillingDate ?? '-' }}</p>
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
          <component
            :is="bill.receiptUrl ? 'a' : 'div'"
            v-for="bill in paymentHistory"
            :key="bill.id"
            v-bind="
              bill.receiptUrl ? { href: bill.receiptUrl, target: '_blank', rel: 'noopener noreferrer' } : {}
            "
            class="flex items-center justify-between gap-2 border-b border-grey-50 py-3 last:border-b-0"
          >
            <div class="min-w-0 flex-1">
              <p class="text-body3 text-grey-500">{{ bill.label }}</p>
              <p class="mt-1 text-caption text-grey-300">
                결제일 {{ bill.date }} · {{ bill.amount.toLocaleString() }}원{{
                  PAYMENT_STATUS_SUFFIX[bill.status] ?? ''
                }}
              </p>
            </div>
            <ChevronRightIcon v-if="bill.receiptUrl" class="size-5 shrink-0 text-grey-300" />
          </component>
          <p v-if="paymentHistory && paymentHistory.length === 0" class="py-3 text-caption text-grey-300">
            결제 내역이 없어요.
          </p>
        </div>
      </div>

      <button
        v-if="isCancelScheduled"
        type="button"
        class="rounded-xl bg-grey-30 py-3.5 text-body3 font-bold text-grey-500"
        @click="handleRevokeCancel"
      >
        해지 예약 취소
      </button>
      <button
        v-else-if="currentPlan.id !== 'basic'"
        type="button"
        class="rounded-xl bg-[#ffebe5] py-3.5 text-body3 font-bold text-[#e53d33]"
        @click="openCancelConfirm"
      >
        해지 예약하기
      </button>
    </div>
  </div>
</template>
