<!-- src/features/mypage/components/JobListSection.vue -->
<script setup>
import { ref } from 'vue'
import { useOnboardingStore } from '@/features/onboarding/store'
import JobCard from '@/shared/components/JobCard.vue'

const onboardingStore = useOnboardingStore()
const lastAddedJobId = ref(null)

function updateJob(index, updated) {
  const next = onboardingStore.jobs.map((job, i) => (i === index ? updated : job))
  onboardingStore.setJobs(next)
}

function removeJob(index) {
  const next = onboardingStore.jobs.filter((_, i) => i !== index)
  onboardingStore.setJobs(next)
}

function addJob() {
  const id = `custom-${Date.now()}`
  const next = [
    {
      id,
      name: '새 잡',
      incomeMethodLabel: '건당 정산',
      incomeAmount: 0,
      fatigue: 3,
      isRegular: false,
      workDays: [],
      startTime: '',
      endTime: '',
      category: 'other',
    },
    ...onboardingStore.jobs,
  ]
  onboardingStore.setJobs(next)
  lastAddedJobId.value = id
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between">
      <p class="text-sm font-semibold text-[#111110]">
        등록된 잡 ({{ onboardingStore.jobs.length }})
      </p>
      <button type="button" class="text-xs font-medium text-[#6B6A65]" @click="addJob">
        + 추가
      </button>
    </div>
    <div class="mt-3 flex flex-col gap-2">
      <JobCard
        v-for="(job, index) in onboardingStore.jobs"
        :key="job.id"
        :job="job"
        :start-in-edit="job.id === lastAddedJobId"
        @save="(updated) => updateJob(index, updated)"
        @delete="removeJob(index)"
      />
    </div>
  </div>
</template>
