<!-- src/features/onboarding/JobSetupView.vue -->
<script setup>
import { ref, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'
import { fetchJobCandidates, createJob } from './api'
import { useModalStore } from '@/shared/store/modal'
import DetectedJobCard from './components/DetectedJobCard.vue'
import JobFormModal from './components/JobFormModal.vue'
import OnboardingProgressBar from './components/OnboardingProgressBar.vue'
import Button from '@/shared/components/Button.vue'

const router = useRouter()
const modalStore = useModalStore()

const { data: candidates, isLoading } = useQuery({
  queryKey: ['job-candidates'],
  queryFn: fetchJobCandidates,
})

const jobs = ref([])
const isSubmitting = ref(false)
// 후보가 하나도 없어도(실제 백엔드는 빈 배열을 줄 수 있음) 다음 단계로 진행할 수 있어야 한다 —
// 리스트가 비어있으면 공허하게 true, 남아있는 후보가 있으면 전부 확정(또는 삭제)됐을 때만 true.
const allConfirmed = computed(() => jobs.value.every((job) => job.confirmed))

watch(candidates, (value) => {
  if (value && jobs.value.length === 0) {
    jobs.value = value.map((candidate) => ({ ...candidate, confirmed: false }))
  }
})

function updateJob(index, updated) {
  jobs.value[index] = { ...updated, confirmed: true }
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

async function submit() {
  isSubmitting.value = true
  try {
    await Promise.all(jobs.value.map((job) => createJob(job)))
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
          최근 입금 내역에서 소득으로 보이는 {{ candidates?.length ?? 0 }}건을 찾았어요.<br />
          실제 내 잡이 맞으면 선택해서 등록해 주세요.
        </p>
      </div>

      <p v-if="isLoading" class="text-body4 text-grey-400">불러오는 중...</p>

      <template v-else>
        <span
          class="w-fit rounded-2xl bg-primary-50 px-3 py-1.5 text-caption font-bold text-primary-800"
        >
          발견된 잡 {{ jobs.length }}개
        </span>

        <p v-if="jobs.length === 0" class="text-body4 text-grey-400">
          감지된 잡 후보가 없어요. 아래에서 직접 추가해 주세요.
        </p>

        <div class="flex flex-col gap-3">
          <DetectedJobCard
            v-for="(job, index) in jobs"
            :key="job.id ?? job.categoryId"
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

        <p class="text-center text-caption text-grey-400">
          등록된 잡은 활성화되며, 삭제하거나 다시 확인할 수 있어요.
        </p>
      </template>

      <Button class="mt-auto" :disabled="!allConfirmed || isSubmitting" @click="submit"
        >다음</Button
      >
    </div>
  </div>
</template>
