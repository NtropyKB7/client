<!-- CancelSubscriptionConfirmModal.vue -->
<script setup>
import { useModalStore } from '@/shared/store/modal'
import Button from '@/shared/components/Button.vue'

const modalStore = useModalStore()

function cancel() {
  modalStore.close(false)
}

function confirmCancel() {
  modalStore.close(true)
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <h2 class="text-center text-base font-semibold text-[#111110]">구독을 해지 예약할까요?</h2>
    <p class="text-center text-sm text-[#6B6A65]">
      해지 예약하면 다음 결제일부터 Basic 플랜으로 전환돼요. 이번 결제 주기 동안은 Pro 기능을 계속
      이용할 수 있어요.
    </p>
    <div class="flex gap-2">
      <div class="flex-1">
        <Button variant="outline" @click="cancel">취소</Button>
      </div>
      <div class="flex-1">
        <Button variant="danger" @click="confirmCancel">해지 예약</Button>
      </div>
    </div>
  </div>
</template>
