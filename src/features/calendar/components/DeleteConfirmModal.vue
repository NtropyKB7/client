<script setup>
import { useModalStore } from '@/shared/store/modal'
import Button from '@/shared/components/Button.vue'

defineProps({
  entry: { type: Object, required: true },
})

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
    <h2 class="text-center text-base font-semibold text-[#111110]">근무 기록을 삭제할까요?</h2>
    <p class="text-center text-sm text-[#6B6A65]">
      {{ entry.jobName }} {{ entry.startTime }}–{{ entry.endTime }} 기록이 삭제되며 되돌릴 수
      없어요.
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
