<!-- src/features/calendar/components/MonthSummaryBar.vue -->
<script setup>
defineProps({
  actualHours: { type: Number, required: true },
  plannedHours: { type: Number, required: true },
  goalHours: { type: Number, required: true },
  plannedIncome: { type: Number, required: true },
  targetIncome: { type: Number, required: true },
})

function progressPercent(value, target) {
  if (!target) return 0
  return Math.min(100, Math.round((value / target) * 100))
}
</script>

<template>
  <div class="rounded-2xl border border-grey-50 bg-grey-white p-4">
    <div class="flex items-center justify-between">
      <p class="text-body3 text-grey-500">계획/추천 근무시간</p>
      <p class="text-caption text-grey-400">{{ actualHours }} / {{ plannedHours }}시간</p>
    </div>
    <div class="mt-2 h-1 rounded-full bg-grey-50">
      <div
        class="h-1 rounded-full bg-primary-500"
        :style="{ width: `${progressPercent(plannedHours, goalHours)}%` }"
      />
    </div>

    <div class="mt-4 flex items-center justify-between">
      <p class="text-body3 text-grey-500">계획/목표 근무 소득</p>
      <p class="text-caption text-grey-400">
        {{ Math.round(plannedIncome / 10000) }} / {{ Math.round(targetIncome / 10000) }}만원
      </p>
    </div>
    <div class="mt-2 h-1 rounded-full bg-grey-50">
      <div
        class="h-1 rounded-full bg-primary-500"
        :style="{ width: `${progressPercent(plannedIncome, targetIncome)}%` }"
      />
    </div>
  </div>
</template>
