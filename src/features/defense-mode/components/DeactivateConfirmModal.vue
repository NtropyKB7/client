<!-- src/features/defense-mode/components/DeactivateConfirmModal.vue -->
<script setup>
import { useModalStore } from '@/shared/store/modal'
import Button from '@/shared/components/Button.vue'

const modalStore = useModalStore()

function cancel() {
  modalStore.close(false)
}

function confirmDeactivate() {
  modalStore.close(true)
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <h2 class="text-center text-base font-semibold text-[#111110]">방어모드를 해제할까요?</h2>
    <p class="text-center text-sm text-[#6B6A65]">
      해제하면 성장모드(근무 추천·자동 저축)가 다시 시작되고, 체크리스트 진행 상황은 초기화돼요.
    </p>
    <div class="flex gap-2">
      <div class="flex-1">
        <Button variant="outline" @click="cancel">취소</Button>
      </div>
      <div class="flex-1">  
        <Button variant="danger" @click="confirmDeactivate">해제</Button>
      </div>
    </div>
  </div>
</template>
