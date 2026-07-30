<!-- src/features/mypage/components/SubscriptionPlanModal.vue -->
<script setup>
import { computed } from 'vue'
import { useModalStore } from '@/shared/store/modal'
import { useMypageStore } from '../store'
import { PLAN_OPTIONS } from '../api'
import CloseIcon from '@/shared/components/icons/CloseIcon.vue'

const props = defineProps({
  subscription: { type: Object, required: true },
})

const modalStore = useModalStore()
const mypageStore = useMypageStore()

const currentPlan = computed(
  () => PLAN_OPTIONS.find((plan) => plan.id === mypageStore.planId) ?? PLAN_OPTIONS[1],
)

function selectPlan(planId) {
  mypageStore.setPlan(planId)
}

function changePaymentMethod() {
  // TEMP: 실제 PG/결제수단 변경 연동은 별도 태스크에서 구현 예정. 지금은 콘솔 확인용.
  console.log('change-payment-method requested')
}
</script>

<template>
  <div class="flex h-full flex-col">
    <div class="flex items-center gap-3 px-4 py-4">
      <button type="button" aria-label="닫기" class="text-[#111110]" @click="modalStore.close()">
        <CloseIcon class="h-5 w-5" />
      </button>
      <h2 class="text-base font-semibold text-[#111110]">구독 및 결제 수단 관리</h2>
    </div>

    <div class="flex-1 overflow-y-auto px-4 pb-8">
      <p class="text-sm font-semibold text-[#111110]">이용 중인 상품</p>
      <div class="mt-2 rounded-xl border border-[#111110]/10 bg-white p-4">
        <div class="flex items-center justify-between">
          <p class="text-sm font-semibold text-[#111110]">{{ currentPlan.name }}</p>
          <span
            class="rounded-full bg-amber-100 px-2 py-1 text-[10px] font-semibold text-amber-700"
          >
            이용중
          </span>
        </div>
        <p class="mt-2 text-xs text-[#6B6A65]">이용 시작일 {{ props.subscription.startedAt }}</p>
      </div>

      <p class="mt-6 text-sm font-semibold text-[#111110]">변경 가능한 상품</p>
      <div class="mt-2 flex flex-col gap-3">
        <div
          v-for="plan in PLAN_OPTIONS"
          :key="plan.id"
          class="rounded-xl border border-[#111110]/10 bg-white p-4"
        >
          <p class="text-sm font-semibold text-[#111110]">{{ plan.name }}</p>
          <p class="mt-1 text-xs text-[#6B6A65]">{{ plan.description }}</p>
          <button
            type="button"
            class="mt-3 w-full rounded-lg py-3 text-sm font-semibold"
            :class="
              plan.id === currentPlan.id
                ? 'cursor-default bg-[#F3F1EC] text-[#6B6A65]'
                : 'bg-[#111110] text-white'
            "
            :disabled="plan.id === currentPlan.id"
            @click="selectPlan(plan.id)"
          >
            {{ plan.id === currentPlan.id ? '이용중' : plan.priceLabel }}
          </button>
        </div>
      </div>

      <p class="mt-6 text-sm font-semibold text-[#111110]">이용 중인 결제 수단</p>
      <div
        class="mt-2 flex items-center justify-between rounded-xl border border-[#111110]/10 bg-white p-4"
      >
        <p class="text-sm text-[#111110]">
          {{ props.subscription.paymentMethod.label }}
          {{ props.subscription.paymentMethod.maskedNumber }}
        </p>
        <button
          type="button"
          class="rounded-full border border-[#111110]/20 px-3 py-1 text-xs text-[#111110]"
          @click="changePaymentMethod"
        >
          변경 ↗
        </button>
      </div>
    </div>
  </div>
</template>
