<!-- src/features/mypage/components/PaymentMethodsSection.vue -->
<script setup>
import { computed } from 'vue'
import { useMypageStore } from '../store'
import { PLAN_OPTIONS } from '../api'
import AppHeader from '@/shared/components/AppHeader.vue'

const props = defineProps({
  subscription: { type: Object, required: true },
})

const emit = defineEmits(['back'])

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
              <p class="text-grey-300">{{ props.subscription.startedAt }}</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <p class="text-body1 text-grey-500">변경 가능한 상품</p>
        <div class="mt-2.5 flex flex-col gap-3">
          <div
            v-for="plan in PLAN_OPTIONS"
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
                @click="selectPlan(plan.id)"
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
          class="mt-2.5 flex items-center justify-between rounded-2xl border border-grey-50 bg-grey-white p-4"
        >
          <p class="text-body4 text-grey-500">
            {{ props.subscription.paymentMethod.label }}
            {{ props.subscription.paymentMethod.maskedNumber }}
          </p>
          <button
            type="button"
            class="rounded-full bg-primary-50 px-3 py-1.5 text-[10px] font-bold text-primary-800"
            @click="changePaymentMethod"
          >
            변경
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
