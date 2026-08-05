<!-- src/features/mypage/components/PaymentModal.vue -->
<script setup>
import { ref } from 'vue'
import { useModalStore } from '@/shared/store/modal'
import { issueBillingKey } from '../payment'
import { initSubscription } from '../api'
import Button from '@/shared/components/Button.vue'
import CardIcon from '@/shared/components/icons/CardIcon.vue'
import KakaoIcon from '@/shared/components/icons/KakaoIcon.vue'
import TossIcon from '@/shared/components/icons/TossIcon.vue'
import CheckIcon from '@/shared/components/icons/CheckIcon.vue'

const props = defineProps({
  plan: { type: Object, required: true },
})

const modalStore = useModalStore()

const selectedMethod = ref('CARD')
const agreed = ref(false)
const isSubmitting = ref(false)
const errorMessage = ref('')

const amountLabel = `${props.plan.price.toLocaleString()}원`

async function submit() {
  if (!agreed.value || isSubmitting.value) return
  isSubmitting.value = true
  errorMessage.value = ''
  try {
    const billingKey = await issueBillingKey(selectedMethod.value)
    await initSubscription({ billingKey })
    modalStore.close(true)
  } catch (error) {
    errorMessage.value = error.message ?? '결제에 실패했어요. 잠시 후 다시 시도해주세요.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="flex flex-col gap-5">
    <h2 class="text-head2 text-grey-500">결제 방법 선택</h2>

    <div class="rounded-2xl bg-grey-30 p-4">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-body3 text-grey-500">{{ plan.name }} 정기 구독</p>
          <p class="mt-1 text-caption text-grey-300">월간 이용권 · 매월 자동 결제</p>
        </div>
        <p class="text-body1 text-grey-500">{{ amountLabel }}</p>
      </div>
    </div>

    <div>
      <p class="mb-3 text-body3 text-grey-500">결제 방법</p>
      <div class="flex flex-col gap-3">
        <button
          type="button"
          class="flex w-full items-center gap-3 rounded-2xl border p-4 text-left"
          :class="
            selectedMethod === 'CARD' ? 'border-primary-600 bg-primary-50' : 'border-grey-50 bg-grey-white'
          "
          @click="selectedMethod = 'CARD'"
        >
          <CardIcon class="shrink-0 text-grey-500" />
          <div class="min-w-0 flex-1">
            <p class="text-body3 text-grey-500">신용·체크카드</p>
            <p class="text-caption text-grey-300">국내 발급 신용·체크카드</p>
          </div>
          <span
            class="flex size-5 shrink-0 items-center justify-center rounded-full border-2"
            :class="selectedMethod === 'CARD' ? 'border-primary-600' : 'border-grey-100'"
          >
            <span v-if="selectedMethod === 'CARD'" class="size-2 rounded-full bg-primary-600" />
          </span>
        </button>

        <div class="flex gap-3">
          <button
            type="button"
            class="flex flex-1 items-center justify-between gap-2 rounded-2xl border p-4"
            :class="
              selectedMethod === 'KAKAOPAY'
                ? 'border-primary-600 bg-primary-50'
                : 'border-grey-50 bg-grey-white'
            "
            @click="selectedMethod = 'KAKAOPAY'"
          >
            <span class="flex items-center gap-1.5 rounded-2xl bg-[#ffdb00] px-3 py-2 text-[#171c1a]">
              <KakaoIcon class="size-4" />
              <span class="text-body3 font-bold">pay</span>
            </span>
            <span
              class="flex size-5 shrink-0 items-center justify-center rounded-full border-2"
              :class="selectedMethod === 'KAKAOPAY' ? 'border-primary-600' : 'border-grey-100'"
            >
              <span v-if="selectedMethod === 'KAKAOPAY'" class="size-2 rounded-full bg-primary-600" />
            </span>
          </button>
          <button
            type="button"
            class="flex flex-1 items-center justify-between gap-2 rounded-2xl border p-4"
            :class="
              selectedMethod === 'TOSSPAY'
                ? 'border-primary-600 bg-primary-50'
                : 'border-grey-50 bg-grey-white'
            "
            @click="selectedMethod = 'TOSSPAY'"
          >
            <span class="flex items-center gap-1.5">
              <TossIcon class="size-5" />
              <span class="text-body3 text-[#1f2e4d]">toss pay</span>
            </span>
            <span
              class="flex size-5 shrink-0 items-center justify-center rounded-full border-2"
              :class="selectedMethod === 'TOSSPAY' ? 'border-primary-600' : 'border-grey-100'"
            >
              <span v-if="selectedMethod === 'TOSSPAY'" class="size-2 rounded-full bg-primary-600" />
            </span>
          </button>
        </div>
      </div>
    </div>

    <div class="rounded-2xl border border-grey-50 p-4">
      <div class="flex items-center justify-between text-caption text-grey-300">
        <p>상품 금액</p>
        <p>{{ amountLabel }}</p>
      </div>
      <div class="mt-3 flex items-center justify-between">
        <p class="text-body3 text-grey-500">최종 결제 금액</p>
        <p class="text-body1 text-primary-800">{{ amountLabel }}</p>
      </div>
    </div>

    <button
      type="button"
      class="flex items-center gap-3 rounded-2xl border border-grey-50 p-4 text-left"
      @click="agreed = !agreed"
    >
      <span
        class="flex size-6 shrink-0 items-center justify-center rounded-[7px]"
        :class="agreed ? 'bg-primary-600 text-white' : 'bg-grey-30 text-grey-30'"
      >
        <CheckIcon class="size-4" />
      </span>
      <p class="text-caption text-grey-500">정기결제 및 이용약관에 동의합니다</p>
    </button>

    <p v-if="errorMessage" class="text-center text-caption text-[#e53d33]">{{ errorMessage }}</p>
    <p class="text-center text-caption text-grey-300">
      선택한 결제수단으로 매월 {{ amountLabel }}이 자동 결제됩니다.
    </p>

    <Button :disabled="!agreed || isSubmitting" @click="submit">
      {{ isSubmitting ? '결제 처리중...' : `${amountLabel} 결제` }}
    </Button>

    <p class="text-center text-caption text-grey-300">
      안전한 결제를 위해 결제정보는 암호화되어 처리됩니다.
    </p>
  </div>
</template>
