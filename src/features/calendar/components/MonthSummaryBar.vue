<!-- src/features/calendar/components/MonthSummaryBar.vue -->
<script setup>
defineProps({
  plannedHours: { type: Number, required: true },
  targetHours: { type: Number, required: true },
  plannedIncome: { type: Number, required: true },
  targetIncome: { type: Number, required: true },
})
</script>

<template>
  <div class="grid grid-cols-2 gap-3">
    <div class="rounded-xl border border-[#111110]/10 bg-white p-4 text-center">
      <p class="text-xs text-[#6B6A65]">계획 근무 시간</p>
      <p class="mt-1 text-sm font-semibold text-[#111110]">
        {{ plannedHours }}h / {{ targetHours }}h
      </p>
    </div>
    <div class="rounded-xl border border-[#111110]/10 bg-white p-4 text-center">
      <p class="text-xs text-[#6B6A65]">계획 근무 소득</p>
      <p class="mt-1 text-sm font-semibold text-[#111110]">
        {{ plannedIncome.toLocaleString() }}원 / {{ targetIncome.toLocaleString() }}원
      </p>
    </div>
  </div>
</template>
