<!-- src/features/mypage/components/PaymentMethodModal.vue -->
<script setup>
import { ref } from 'vue'
import { useModalStore } from '@/shared/store/modal'
import { issueBillingKey, forceCloseBillingKeyUI } from '../payment'
import { updatePaymentMethod } from '../api'
import Button from '@/shared/components/Button.vue'
import CardIcon from '@/shared/components/icons/CardIcon.vue'
import KakaoIcon from '@/shared/components/icons/KakaoIcon.vue'
import TossIcon from '@/shared/components/icons/TossIcon.vue'

const modalStore = useModalStore()

const selectedMethod = ref('CARD')
const isSubmitting = ref(false)
const errorMessage = ref('')

async function submit() {
  if (isSubmitting.value) return
  isSubmitting.value = true
  errorMessage.value = ''
  try {
    const billingKey = await issueBillingKey(selectedMethod.value)
    await updatePaymentMethod({ billingKey })
    modalStore.close(true)
  } catch (error) {
    errorMessage.value = error.message ?? '결제 수단 등록에 실패했어요. 잠시 후 다시 시도해주세요.'
  } finally {
    isSubmitting.value = false
  }
}

function cancelIssuing() {
  forceCloseBillingKeyUI()
  isSubmitting.value = false
  errorMessage.value = ''
}
</script>

<template>
  <div class="flex flex-col gap-5">
    <div>
      <h2 class="text-head2 text-grey-500">결제수단 변경</h2>
      <p class="mt-1 text-caption text-grey-300">등록할 결제 방법을 선택해 주세요.</p>
    </div>

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

    <div class="rounded-2xl bg-grey-30 p-4">
      <p class="text-caption font-bold text-primary-800">다음 결제일부터 적용돼요</p>
      <p class="mt-1 text-caption text-grey-300">기존 결제수단은 새 수단 등록 후 안전하게 교체됩니다.</p>
    </div>

    <p v-if="errorMessage" class="text-center text-caption text-[#e53d33]">{{ errorMessage }}</p>

    <Button :disabled="isSubmitting" @click="submit">
      {{ isSubmitting ? '등록 처리중...' : '결제수단 등록' }}
    </Button>

    <button
      v-if="isSubmitting"
      type="button"
      class="text-center text-caption text-grey-300 underline"
      @click="cancelIssuing"
    >
      결제창이 응답하지 않나요? 취소하기
    </button>

    <p class="text-center text-caption text-grey-300">
      카드 및 간편결제 정보는 안전하게 암호화되어 저장됩니다.
    </p>
  </div>
</template>
