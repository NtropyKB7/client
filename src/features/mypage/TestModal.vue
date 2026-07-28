<script setup>
import { useModalStore } from '@/shared/store/modal'
import Button from '@/shared/components/Button.vue'

const modalStore = useModalStore()
</script>

<template>
  <div class="flex flex-col gap-4">
    <h2 class="text-lg font-bold">테스트 모달</h2>
    <p class="text-sm text-[#57544A]">모달 동작 확인용 임시 컴포넌트입니다.</p>
    <Button @click="modalStore.close(true)">확인</Button>
  </div>
</template>
