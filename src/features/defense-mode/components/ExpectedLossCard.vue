<!-- src/features/defense-mode/components/ExpectedLossCard.vue -->
<script setup>
defineProps({
  amount: { type: Number, required: true },
})
</script>

<template>
  <div class="rounded-2xl border border-grey-50 bg-grey-white p-4">
    <div class="flex items-center justify-between">
      <p class="text-caption text-grey-300">이번 달 예상 손실 소득</p>
      <p class="text-[15px] font-bold text-[#eb3326]">{{ amount.toLocaleString() }}원</p>
    </div>
    <p class="mt-2 text-[11px] text-grey-300">현재 계획된 근무와 비교한 예상치예요.</p>
  </div>
</template>
