<!-- src/features/report/components/JobPerformanceCard.vue -->
<script setup>
import { getCategoryColor } from '@/shared/utils/jobCategory'
import { formatMan, formatWorkMinutes } from '../utils'

defineProps({
  jobs: { type: Array, required: true },
})
</script>

<template>
  <div class="rounded-2xl border border-grey-50 bg-grey-white p-4">
    <p class="text-body3 font-bold text-grey-500">잡별 근무 성과</p>
    <p class="mt-1 text-caption text-grey-300">소득을 비교하고 근무시간을 함께 확인해요</p>

    <div class="mt-4 flex flex-col gap-3">
      <div v-for="job in jobs" :key="job.id" class="flex items-center gap-2.5">
        <span
          class="flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
          :class="getCategoryColor(job.id).colorClass"
        >
          {{ job.name.slice(0, 1) }}
        </span>
        <p class="min-w-0 flex-1 truncate text-[11px] font-bold text-grey-500">{{ job.name }}</p>
        <p class="shrink-0 text-[10px] font-bold text-grey-300">
          {{ formatWorkMinutes(job.totalWorkMinutes) }} ·
          <span class="text-primary-800">{{ formatMan(job.incomeAmount, false) }}원</span>
        </p>
      </div>
    </div>
  </div>
</template>
