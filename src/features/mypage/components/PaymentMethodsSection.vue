<!-- src/features/mypage/components/PaymentMethodsSection.vue -->
<script setup>
import { computed } from 'vue'
import { useQueryClient } from '@tanstack/vue-query'
import { useModalStore } from '@/shared/store/modal'
import { useMypageStore } from '../store'
import { cancelSubscription } from '../api'
import AppHeader from '@/shared/components/AppHeader.vue'
import CardIcon from '@/shared/components/icons/CardIcon.vue'
import CancelSubscriptionConfirmModal from './CancelSubscriptionConfirmModal.vue'
import PaymentModal from './PaymentModal.vue'
import PaymentMethodModal from './PaymentMethodModal.vue'

const props = defineProps({
  subscription: { type: Object, required: true },
  plans: { type: Array, required: true },
})

const emit = defineEmits(['back'])

const mypageStore = useMypageStore()
const modalStore = useModalStore()
const queryClient = useQueryClient()

const currentPlan = computed(
  () => props.plans.find((plan) => plan.id === mypageStore.planId) ?? props.plans[1],
)

function invalidateSubscription() {
  queryClient.invalidateQueries({ queryKey: ['mypage', 'subscription'] })
}

// 플랜 변경 전용 API가 없어서, Basic으로의 다운그레이드는 해지 예약(POST /subscriptions/cancel)과
// 동일하게 처리한다 — 즉시 전환이 아니라 현재 결제주기 끝까지 Pro를 유지한 뒤 Basic으로 바뀐다.
async function selectPlan(plan) {
  if (plan.id === currentPlan.value.id) return

  if (plan.id === 'basic') {
    const confirmed = await modalStore.open(
      CancelSubscriptionConfirmModal,
      {},
      { position: 'center' },
    )
    if (confirmed) {
      await cancelSubscription()
      invalidateSubscription()
    }
    return
  }

  const success = await modalStore.open(PaymentModal, { plan }, { position: 'bottom' })
  if (success) invalidateSubscription()
}

async function changePaymentMethod() {
  const success = await modalStore.open(PaymentMethodModal, {}, { position: 'bottom' })
  if (success) invalidateSubscription()
}
</script>

<template>
  <div class="flex flex-col">
    <AppHeader back title="마이페이지" @back="emit('back')" />

    <div class="flex flex-col gap-6 px-4 pt-5 pb-6">
      <div>
        <p class="text-body1 text-grey-500">이용 중인 상품</p>
        <div class="mt-2.5 rounded-2xl border border-grey-50 bg-grey-white p-4">
          <div class="flex items-center justify-between">
            <p class="text-body3 text-grey-500">{{ currentPlan.name }}</p>
            <span
              class="rounded-full bg-primary-50 px-3 py-1.5 text-[10px] font-bold text-primary-800"
            >
              이용중
            </span>
          </div>
          <div class="mt-3 border-t border-grey-50 pt-3">
            <div class="flex items-center justify-between text-caption">
              <p class="text-grey-300">이용 시작일</p>
              <p class="text-grey-300">{{ props.subscription.startedAt ?? '-' }}</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <p class="text-body1 text-grey-500">변경 가능한 상품</p>
        <div class="mt-2.5 flex flex-col gap-3">
          <div
            v-for="plan in plans"
            :key="plan.id"
            class="rounded-2xl border border-grey-50 bg-grey-white p-4"
          >
            <p class="text-body2 text-grey-500">{{ plan.name }}</p>
            <p class="mt-1 text-caption text-grey-300">{{ plan.description }}</p>
            <div class="mt-3 border-t border-grey-50 pt-3">
              <button
                type="button"
                class="w-full rounded-xl py-3 text-body3 font-bold"
                :class="
                  plan.id === currentPlan.id
                    ? 'cursor-default bg-grey-30 text-grey-300'
                    : 'bg-primary-500 text-white'
                "
                :disabled="plan.id === currentPlan.id"
                @click="selectPlan(plan)"
              >
                {{ plan.id === currentPlan.id ? '이용중' : plan.priceLabel }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div>
        <p class="text-body1 text-grey-500">이용 중인 결제 수단</p>
        <div
          v-if="props.subscription.paymentMethod"
          class="mt-2.5 flex items-center justify-between rounded-2xl border border-grey-50 bg-grey-white p-4"
        >
          <div class="flex items-center gap-3">
            <CardIcon class="shrink-0 text-grey-500" />
            <p class="text-body4 text-grey-500">
              {{ props.subscription.paymentMethod.label }}
              {{ props.subscription.paymentMethod.maskedNumber }}
            </p>
          </div>
          <button
            type="button"
            class="rounded-full bg-primary-50 px-3 py-1.5 text-[10px] font-bold text-primary-800"
            @click="changePaymentMethod"
          >
            변경
          </button>
        </div>
        <div
          v-else
          class="mt-2.5 flex items-center justify-between rounded-2xl border border-dashed border-grey-100 bg-grey-white p-4"
        >
          <p class="text-body4 text-grey-300">등록된 결제 수단이 없어요</p>
          <button
            type="button"
            class="rounded-full bg-primary-50 px-3 py-1.5 text-[10px] font-bold text-primary-800"
            @click="changePaymentMethod"
          >
            등록하기
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
