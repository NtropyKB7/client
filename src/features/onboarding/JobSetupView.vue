<!-- src/features/onboarding/JobSetupView.vue -->
<script setup>
import { ref, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'
import { fetchDetectedJobs, createJob } from './api'
import { useModalStore } from '@/shared/store/modal'
import DetectedJobCard from './components/DetectedJobCard.vue'
import JobFormModal from './components/JobFormModal.vue'
import OnboardingProgressBar from './components/OnboardingProgressBar.vue'
import Button from '@/shared/components/Button.vue'

const router = useRouter()
const modalStore = useModalStore()

const { data: detectedJobs, isLoading } = useQuery({
  queryKey: ['onboarding', 'detected-jobs'],
  queryFn: fetchDetectedJobs,
})

const jobs = ref([])
const isSubmitting = ref(false)
const allConfirmed = computed(
  () => jobs.value.length > 0 && jobs.value.every((job) => job.confirmed),
)

watch(detectedJobs, (value) => {
  if (value && jobs.value.length === 0) {
    jobs.value = value.map((job) => ({ ...job, confirmed: false }))
  }
})

function updateJob(index, updated) {
  jobs.value[index] = { ...updated, confirmed: true }
}

function confirmJob(index) {
  jobs.value[index] = { ...jobs.value[index], confirmed: true }
}

function removeJob(index) {
  jobs.value.splice(index, 1)
}

async function addCustomJob() {
  const created = await modalStore.open(JobFormModal, { mode: 'add' }, { position: 'bottom' })
  if (created) {
    jobs.value.push({ ...created, confirmed: true })
  }
}

// 계좌 자동감지 잡(fetchDetectedJobs)은 실 카테고리 체계(GET /api/categories) 이전 mock 데이터라
// categoryId가 없다 — job-controller에 등록할 때만 근접한 실 카테고리로 임시 매핑한다.
const LEGACY_CATEGORY_TO_CATEGORY_ID = { driving: 2, delivery: 1, creative: 10, other: 6 }

async function submit() {
  isSubmitting.value = true
  try {
    await Promise.all(
      jobs.value.map((job) =>
        createJob({
          ...job,
          categoryId: job.categoryId ?? LEGACY_CATEGORY_TO_CATEGORY_ID[job.category] ?? 6,
        }),
      ),
    )
    router.push({ name: 'onboarding-goal' })
  } finally {
    isSubmitting.value = false
  }
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
          <DetectedJobCard
            v-for="(job, index) in jobs"
            :key="job.id"
            :job="job"
            @save="(updated) => updateJob(index, updated)"
            @delete="removeJob(index)"
            @confirm="confirmJob(index)"
          />

          <button
            type="button"
            class="rounded-2xl border border-grey-50 py-3.5 text-body4 font-medium text-primary-800"
            @click="addCustomJob"
          >
            + 직접 잡 추가하기
          </button>
        </div>

        <p class="text-center text-caption text-grey-400">
          등록된 잡은 활성화되며, 삭제하거나 다시 확인할 수 있어요.
        </p>
      </template>

      <Button
        class="mt-auto"
        :disabled="jobs.length === 0 || !allConfirmed || isSubmitting"
        @click="submit"
        >다음</Button
      >
    </div>
  </div>
</template>
