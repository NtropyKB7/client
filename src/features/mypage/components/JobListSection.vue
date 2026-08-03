<!-- src/features/mypage/components/JobListSection.vue -->
<script setup>
import { useOnboardingStore } from '@/features/onboarding/store'
import { useModalStore } from '@/shared/store/modal'
import JobFormModal from '@/features/onboarding/components/JobFormModal.vue'
import MyPageJobRow from './MyPageJobRow.vue'

const onboardingStore = useOnboardingStore()
const modalStore = useModalStore()

function updateJob(index, updated) {
  const next = onboardingStore.jobs.map((job, i) => (i === index ? updated : job))
  onboardingStore.setJobs(next)
}

function removeJob(index) {
  const next = onboardingStore.jobs.filter((_, i) => i !== index)
  onboardingStore.setJobs(next)
}

async function addJob() {
  const created = await modalStore.open(JobFormModal, { mode: 'add' }, { position: 'bottom' })
  if (created) {
    onboardingStore.setJobs([created, ...onboardingStore.jobs])
  }
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between">
      <p class="text-body1 text-grey-500">등록된 잡 ({{ onboardingStore.jobs.length }})</p>
      <button type="button" class="text-caption font-bold text-primary-800" @click="addJob">
        + 추가
      </button>
    </div>
    <div class="mt-3 flex flex-col gap-2">
      <MyPageJobRow
        v-for="(job, index) in onboardingStore.jobs"
        :key="job.id"
        :job="job"
        @save="(updated) => updateJob(index, updated)"
        @delete="removeJob(index)"
      />
    </div>
  </div>
</template>
