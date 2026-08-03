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
  <div class="flex min-h-screen flex-col bg-grey-white">
    <OnboardingProgressBar :current-step="2" />

    <div class="flex flex-1 flex-col gap-6 px-4 pb-8 pt-8">
      <div>
        <h1 class="text-head1 text-grey-500">내 잡을 확인해 주세요</h1>
        <p class="mt-2 text-body4 text-grey-400">
          최근 입금 내역에서 소득으로 보이는 {{ detectedJobs?.length ?? 0 }}건을 찾았어요.<br />
          플랫폼을 확인하면 잡으로 등록돼요.
        </p>
      </div>

      <p v-if="isLoading" class="text-body4 text-grey-400">불러오는 중...</p>

      <template v-else>
        <span
          class="w-fit rounded-2xl bg-primary-50 px-3 py-1.5 text-caption font-bold text-primary-800"
        >
          발견된 잡 {{ jobs.length }}개
        </span>

        <div class="flex flex-col gap-3">
          <JobCard
            v-for="(job, index) in jobs"
            :key="job.id"
            :job="job"
            @save="(updated) => updateJob(index, updated)"
            @delete="removeJob(index)"
          />

          <button
            type="button"
            class="rounded-2xl border border-grey-50 py-3.5 text-body4 font-medium text-primary-800"
            @click="addCustomJob"
          >
            + 직접 잡 추가하기
          </button>
        </div>
      </template>

      <Button class="mt-auto" :disabled="jobs.length === 0" @click="submit">다음</Button>
    </div>
  </div>
</template>
