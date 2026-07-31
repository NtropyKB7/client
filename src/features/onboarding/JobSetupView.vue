<!-- src/features/onboarding/JobSetupView.vue -->
<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'
import { useOnboardingStore } from './store'
import { fetchDetectedJobs } from './api'
import JobCard from '@/shared/components/JobCard.vue'
import OnboardingProgressBar from './components/OnboardingProgressBar.vue'
import Button from '@/shared/components/Button.vue'

const router = useRouter()
const onboardingStore = useOnboardingStore()

const { data: detectedJobs, isLoading } = useQuery({
  queryKey: ['onboarding', 'detected-jobs'],
  queryFn: fetchDetectedJobs,
})

const jobs = ref(onboardingStore.jobs.length > 0 ? onboardingStore.jobs.map((j) => ({ ...j })) : [])

watch(detectedJobs, (value) => {
  if (value && jobs.value.length === 0) {
    jobs.value = value.map((job) => ({ ...job }))
  }
})

function updateJob(index, updated) {
  jobs.value[index] = updated
}

function removeJob(index) {
  jobs.value.splice(index, 1)
}

function addCustomJob() {
  jobs.value.push({
    id: `custom-${Date.now()}`,
    name: '새 잡',
    incomeMethodLabel: '건당 정산',
    incomeAmount: 0,
    fatigue: 3,
    isRegular: false,
    workDays: [],
    startTime: '',
    endTime: '',
    category: 'other',
  })
}

function submit() {
  onboardingStore.setJobs(jobs.value)
  router.push({ name: 'onboarding-goal' })
}
</script>

<template>
  <div class="flex min-h-screen flex-col gap-6 bg-[#F3F1EC] px-6 py-10">
    <OnboardingProgressBar :current-step="2" step-label="잡(Job) 등록" />

    <div>
      <h1 class="text-lg font-semibold text-[#111110]">직업(Job) 등록</h1>
      <p class="mt-1 text-xs text-[#6B6A65]">
        최근 입출금 내역에서 {{ detectedJobs?.length ?? 0 }}건을 찾았어요. 확인 후 수정해 주세요.
      </p>
    </div>

    <p v-if="isLoading" class="text-sm text-[#6B6A65]">불러오는 중...</p>

    <div v-else class="flex flex-col gap-3">
      <JobCard
        v-for="(job, index) in jobs"
        :key="job.id"
        :job="job"
        @save="(updated) => updateJob(index, updated)"
        @delete="removeJob(index)"
      />

      <button
        type="button"
        class="rounded-lg border border-dashed border-[#111110]/30 py-3 text-sm text-[#6B6A65]"
        @click="addCustomJob"
      >
        + 직접 잡 추가하기
      </button>
    </div>

    <Button class="mt-auto" :disabled="jobs.length === 0" @click="submit">잡 설정 완료</Button>
  </div>
</template>
