<!-- src/features/mypage/components/JobListSection.vue -->
<script setup>
import { useQuery, useQueryClient } from '@tanstack/vue-query'
import { useModalStore } from '@/shared/store/modal'
import { fetchJobs, createJob } from '@/features/onboarding/api'
import JobFormModal from '@/features/onboarding/components/JobFormModal.vue'
import MyPageJobRow from './MyPageJobRow.vue'

const modalStore = useModalStore()
const queryClient = useQueryClient()

const { data: jobs } = useQuery({ queryKey: ['jobs'], queryFn: fetchJobs })

async function addJob() {
  const created = await modalStore.open(JobFormModal, { mode: 'add' }, { position: 'bottom' })
  if (created) {
    await createJob(created)
    queryClient.invalidateQueries({ queryKey: ['jobs'] })
  }
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between">
      <p class="text-body1 text-grey-500">등록된 잡 ({{ jobs?.length ?? 0 }})</p>
      <button type="button" class="text-caption font-bold text-primary-800" @click="addJob">
        + 추가
      </button>
    </div>
    <div class="mt-3 flex flex-col gap-2">
      <MyPageJobRow v-for="job in jobs" :key="job.id" :job="job" />
    </div>
  </div>
</template>
