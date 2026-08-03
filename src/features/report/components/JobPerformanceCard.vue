<!-- src/features/report/components/JobPerformanceCard.vue -->
<script setup>
import { computed } from 'vue'
import { getJobCategory } from '@/shared/utils/jobCategory'
import { formatMan } from '../utils'

const props = defineProps({
  jobs: { type: Array, required: true },
})

const maxHours = computed(() => Math.max(...props.jobs.map((job) => job.hours), 1))
const maxIncome = computed(() => Math.max(...props.jobs.map((job) => job.income), 1))

function hoursPercent(job) {
  return Math.round((job.hours / maxHours.value) * 100)
}

function incomePercent(job) {
  return Math.round((job.income / maxIncome.value) * 100)
}
</script>

<template>
  <div class="rounded-2xl border border-grey-50 bg-grey-white p-4">
    <div class="flex items-start justify-between">
      <div>
        <p class="text-body3 text-grey-500">잡별 근무 성과</p>
        <p class="mt-1 text-caption text-grey-300">근무시간과 소득을 함께 비교해요</p>
      </div>
      <div class="flex shrink-0 items-center gap-3 pt-1">
        <span class="flex items-center gap-1 text-[10px] text-grey-300">
          <span class="h-1.5 w-3.5 rounded-full bg-primary-500" />
          시간
        </span>
        <span class="flex items-center gap-1 text-[10px] text-grey-300">
          <span class="h-1.5 w-3.5 rounded-full bg-blue-500" />
          소득
        </span>
      </div>
    </div>

    <div class="mt-4 flex flex-col gap-4">
      <div v-for="job in jobs" :key="job.id">
        <div class="flex items-center gap-2">
          <span
            class="flex size-8 shrink-0 items-center justify-center rounded-full text-caption font-bold text-white"
            :class="getJobCategory(job.category).colorClass"
          >
            {{ job.name.slice(0, 1) }}
          </span>
          <p class="min-w-0 flex-1 truncate text-body4 font-bold text-grey-500">{{ job.name }}</p>
          <p class="shrink-0 text-[10px] font-medium text-grey-300">
            {{ job.hours }}시간 · {{ formatMan(job.income, false) }}원
          </p>
        </div>
        <div class="mt-2 flex flex-col gap-1.5 pl-10">
          <div class="h-1.5 w-full overflow-hidden rounded-full bg-grey-100">
            <div
              class="h-full rounded-full bg-primary-500"
              :style="{ width: `${hoursPercent(job)}%` }"
            />
          </div>
          <div class="h-1.5 w-full overflow-hidden rounded-full bg-grey-100">
            <div
              class="h-full rounded-full bg-blue-500"
              :style="{ width: `${incomePercent(job)}%` }"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
