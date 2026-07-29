<!-- src/features/calendar/components/WorkPlanModal.vue -->
<script setup>
import { computed, ref } from 'vue'
import { useModalStore } from '@/shared/store/modal'
import Button from '@/shared/components/Button.vue'

const props = defineProps({
  mode: { type: String, required: true }, // 'create' | 'edit' | 'confirm'
  dateKey: { type: String, required: true },
  jobs: { type: Array, required: true },
  entry: { type: Object, default: null },
})

const modalStore = useModalStore()

const draft = ref({
  jobId: props.entry?.jobId ?? props.jobs[0]?.id ?? '',
  startTime: props.entry?.startTime ?? '',
  endTime: props.entry?.endTime ?? '',
  count: props.entry?.count ?? '',
  fatigue: props.entry?.fatigue ?? 3,
})

const selectedJob = computed(() => props.jobs.find((job) => job.id === draft.value.jobId) ?? null)
const isCountJob = computed(() => selectedJob.value?.incomeMethodLabel === '건당 정산')
const isConfirmMode = computed(() => props.mode === 'confirm')

const title = computed(() => {
  const [, month, day] = props.dateKey.split('-')
  const label = isConfirmMode.value ? '실근무 시간 확정' : '근무 시간 계획'
  return `${Number(month)}월 ${Number(day)}일 ${label}`
})

const isValid = computed(() => draft.value.jobId && draft.value.startTime && draft.value.endTime)

function submit() {
  if (!isValid.value) return
  const job = selectedJob.value
  const payload = {
    jobId: job.id,
    jobName: job.name,
    category: job.category,
    startTime: draft.value.startTime,
    endTime: draft.value.endTime,
    count: isConfirmMode.value
      ? isCountJob.value
        ? Number(draft.value.count) || 0
        : null
      : (props.entry?.count ?? null),
    fatigue: isConfirmMode.value ? draft.value.fatigue : (props.entry?.fatigue ?? null),
    status: isConfirmMode.value ? 'confirmed' : (props.entry?.status ?? 'planned'),
  }
  modalStore.close(payload)
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <h2 class="text-center text-base font-semibold text-[#111110]">{{ title }}</h2>

    <label class="block text-xs text-[#6B6A65]">
      잡 선택
      <select
        v-model="draft.jobId"
        class="mt-1 w-full rounded-lg border border-[#111110]/20 bg-white px-3 py-2 text-sm"
      >
        <option v-for="job in jobs" :key="job.id" :value="job.id">{{ job.name }}</option>
      </select>
    </label>

    <div class="grid grid-cols-2 gap-2">
      <label class="block text-xs text-[#6B6A65]">
        시작 시간
        <input
          v-model="draft.startTime"
          type="text"
          placeholder="예) 11:00"
          class="mt-1 w-full rounded-lg border border-[#111110]/20 px-3 py-2 text-sm"
        />
      </label>
      <label class="block text-xs text-[#6B6A65]">
        종료 시간
        <input
          v-model="draft.endTime"
          type="text"
          placeholder="예) 15:00"
          class="mt-1 w-full rounded-lg border border-[#111110]/20 px-3 py-2 text-sm"
        />
      </label>
    </div>

    <label v-if="isConfirmMode && isCountJob" class="block text-xs text-[#6B6A65]">
      총 건수 (건)
      <input
        v-model="draft.count"
        type="number"
        placeholder="예) 10건"
        class="mt-1 w-full rounded-lg border border-[#111110]/20 px-3 py-2 text-sm"
      />
    </label>

    <div v-if="isConfirmMode">
      <p class="text-xs text-[#6B6A65]">오늘 노동 피로도 (1~5)</p>
      <div class="mt-1 flex gap-2">
        <button
          v-for="level in 5"
          :key="level"
          type="button"
          class="h-9 flex-1 rounded-lg border text-sm font-medium"
          :class="
            draft.fatigue === level
              ? 'border-[#E0B400] text-[#E0B400]'
              : 'border-[#111110]/10 text-[#6B6A65]'
          "
          @click="draft.fatigue = level"
        >
          {{ level }}
        </button>
      </div>
    </div>

    <Button :disabled="!isValid" @click="submit">
      {{ isConfirmMode ? '근무 시간 확정' : '근무 시간 저장' }}
    </Button>
  </div>
</template>
