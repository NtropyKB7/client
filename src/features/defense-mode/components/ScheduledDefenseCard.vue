<!-- src/features/defense-mode/components/ScheduledDefenseCard.vue -->
<script setup>
import DefenseIcon from '@/shared/components/icons/DefenseIcon.vue'

defineProps({
  causeName: { type: String, default: '' },
  startDate: { type: String, default: '' },
  endDate: { type: String, default: '' },
})
</script>

<template>
  <div class="flex flex-col gap-3 rounded-2xl border border-grey-50 bg-grey-white p-4">
    <div class="flex items-center gap-2.5 rounded-2xl bg-grey-30 px-3 py-3.5">
      <span class="flex size-9 shrink-0 items-center justify-center rounded-full bg-grey-white">
        <DefenseIcon class="size-5 text-grey-500" />
      </span>
      <p class="text-body3 text-grey-500">예약된 방어모드</p>
    </div>

    <div class="flex flex-col gap-2 px-1">
      <p class="text-caption text-grey-400">{{ startDate }}부터 시작 예정</p>
      <div class="flex items-center justify-between text-caption">
        <span class="text-grey-300">사유</span>
        <span class="font-medium text-grey-500">{{ causeName }}</span>
      </div>
      <div class="flex items-center justify-between text-caption">
        <span class="text-grey-300">예상 기간</span>
        <span class="font-medium text-grey-500">{{ startDate }} ~ {{ endDate }}</span>
      </div>
    </div>
  </div>
</template>
