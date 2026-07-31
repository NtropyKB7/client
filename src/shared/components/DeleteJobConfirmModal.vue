<!-- src/shared/components/DeleteJobConfirmModal.vue -->
<script setup>
import { useModalStore } from '@/shared/store/modal'
import Button from './Button.vue'

const modalStore = useModalStore()

function cancel() {
  modalStore.close(false)
}

function confirmDelete() {
  modalStore.close(true)
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <h2 class="text-center text-base font-semibold text-[#111110]">잡을 삭제할까요?</h2>
    <p class="text-center text-sm text-[#6B6A65]">
      삭제하면 해당 잡의 기록과 설정이 사라지며 복구할 수 없어요.
    </p>
    <div class="flex gap-2">
      <div class="flex-1">
        <Button variant="outline" @click="cancel">취소</Button>
      </div>
      <div class="flex-1">
        <Button variant="danger" @click="confirmDelete">삭제</Button>
      </div>
    </div>
  </div>
</template>
