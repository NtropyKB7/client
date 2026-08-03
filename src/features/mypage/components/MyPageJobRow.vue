<!-- src/features/mypage/components/MyPageJobRow.vue -->
<script setup>
import { computed } from 'vue'
import { useModalStore } from '@/shared/store/modal'
import JobFormModal from '@/features/onboarding/components/JobFormModal.vue'
import DeleteJobConfirmModal from '@/shared/components/DeleteJobConfirmModal.vue'
import { getJobCategory } from '@/shared/utils/jobCategory'

const FATIGUE_LABELS = ['매우 가벼움', '가벼움', '보통', '힘듦', '매우 힘듦']

const props = defineProps({
  job: { type: Object, required: true },
})

const emit = defineEmits(['save', 'delete'])

const modalStore = useModalStore()

const category = computed(() => getJobCategory(props.job.category))
const fatigueLabel = computed(() => FATIGUE_LABELS[props.job.fatigue - 1])
const metaLabel = computed(() => {
  const parts = [category.value.label, `피로도 ${fatigueLabel.value}`]
  if (props.job.isRegular) {
    parts.push(`${props.job.workDays.join(', ')} ${props.job.startTime}~${props.job.endTime}`)
  }
  return parts.join(' · ')
})

async function edit() {
  const result = await modalStore.open(
    JobFormModal,
    { mode: 'edit', job: props.job },
    { position: 'bottom' },
  )
  if (result) {
    emit('save', result)
  }
}

async function requestDelete() {
  const confirmed = await modalStore.open(DeleteJobConfirmModal, {}, { position: 'center' })
  if (confirmed) {
    emit('delete')
  }
}
</script>

<template>
  <div class="flex items-center gap-3 rounded-2xl border border-grey-50 bg-grey-white p-3.5">
    <span
      class="flex size-[42px] shrink-0 items-center justify-center rounded-xl text-body3 font-bold text-white"
      :class="category.colorClass"
    >
      {{ category.label.slice(0, 1) }}
    </span>

    <div class="min-w-0 flex-1">
      <div class="flex items-center justify-between gap-2">
        <p class="truncate text-body3 text-grey-500">{{ job.name }}</p>
        <div class="flex shrink-0 gap-2.5">
          <button type="button" class="text-caption text-grey-300" @click="edit">수정</button>
          <button type="button" class="text-caption text-grey-300" @click="requestDelete">
            삭제
          </button>
        </div>
      </div>
      <p class="mt-0.5 text-caption text-grey-300">
        {{ job.incomeMethodLabel }} ({{ job.incomeAmount.toLocaleString() }}원)
      </p>
      <p class="mt-0.5 truncate text-[10px] text-grey-300">{{ metaLabel }}</p>
    </div>
  </div>
</template>
