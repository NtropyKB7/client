<!-- src/features/calendar/components/WorkPlanModal.vue -->
<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useModalStore } from '@/shared/store/modal'
import Button from '@/shared/components/Button.vue'
import ChevronDownIcon from '@/shared/components/icons/ChevronDownIcon.vue'
import CheckIcon from '@/shared/components/icons/CheckIcon.vue'
import TimePickerField from './TimePickerField.vue'

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

const isJobOpen = ref(false)
const jobFieldRef = ref(null)

function selectJob(jobId) {
  draft.value.jobId = jobId
  isJobOpen.value = false
}

function handleOutsideClick(event) {
  if (jobFieldRef.value && !jobFieldRef.value.contains(event.target)) {
    isJobOpen.value = false
  }
}

onMounted(() => document.addEventListener('mousedown', handleOutsideClick))
onUnmounted(() => document.removeEventListener('mousedown', handleOutsideClick))

const selectedJob = computed(() => props.jobs.find((job) => job.id === draft.value.jobId) ?? null)
const isCountJob = computed(() => selectedJob.value?.incomeMethodLabel === '건당 정산')
const isConfirmMode = computed(() => props.mode === 'confirm')
const isEditMode = computed(() => props.mode === 'edit')
// 이미 확정된(CONFIRMED) 과거 근무일지를 수정하는 경우: confirm 바텀시트와 동일한 요청 스키마
// (jobId/startTime/endTime/fatigue/taskCount)를 쓰므로, 필드 구성도 confirm 모드와 동일하게 맞춘다.
const isEditingConfirmedEntry = computed(
  () => isEditMode.value && props.entry?.status === 'CONFIRMED',
)
const showDetailFields = computed(() => isConfirmMode.value || isEditingConfirmedEntry.value)

const FATIGUE_LABELS = { 1: '여유', 3: '보통', 5: '힘듦' }

// confirm 모드는 entry 유무로 나뉜다: entry가 있으면 그 계획을 확정, 없으면 계획 없이 새 근무일지를 작성.
const confirmActionLabel = computed(() => (props.entry ? '근무일지 확정' : '근무일지 작성'))

const title = computed(() => {
  const [, month, day] = props.dateKey.split('-')
  const label = isConfirmMode.value
    ? confirmActionLabel.value
    : isEditingConfirmedEntry.value
      ? '근무일지 수정'
      : isEditMode.value
        ? '근무 시간 계획 수정'
        : '근무 시간 계획'
  return `${Number(month)}월 ${Number(day)}일 ${label}`
})

const isValid = computed(() => draft.value.jobId && draft.value.startTime && draft.value.endTime)

function submit() {
  if (!isValid.value) return
  const job = selectedJob.value
  if (!job) return
  const payload = {
    jobId: job.id,
    startTime: draft.value.startTime,
    endTime: draft.value.endTime,
    count: showDetailFields.value
      ? isCountJob.value
        ? Number(draft.value.count) || 0
        : null
      : (props.entry?.count ?? null),
    fatigue: showDetailFields.value ? draft.value.fatigue : (props.entry?.fatigue ?? null),
  }
  modalStore.close(payload)
}

function requestDelete() {
  modalStore.close({ delete: true })
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <h2 class="text-center text-body1 text-grey-500">{{ title }}</h2>

    <div>
      <p class="mb-1.5 text-caption font-medium text-grey-400">잡 선택</p>
      <div ref="jobFieldRef" class="relative">
        <button
          type="button"
          class="flex w-full items-center justify-between rounded-xl bg-grey-30 px-3.5 py-3 text-left text-body4"
          @click="isJobOpen = !isJobOpen"
        >
          <span :class="selectedJob ? 'text-grey-500' : 'text-grey-300'">
            {{ selectedJob ? selectedJob.name : '잡을 선택해주세요' }}
          </span>
          <ChevronDownIcon
            class="size-4 shrink-0 text-grey-400 transition-transform"
            :class="isJobOpen ? 'rotate-180' : ''"
          />
        </button>

        <div
          v-if="isJobOpen"
          class="absolute z-10 mt-1.5 w-full rounded-2xl border border-grey-50 bg-grey-white p-1.5 shadow-lg"
        >
          <button
            v-for="job in jobs"
            :key="job.id"
            type="button"
            class="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-body4"
            :class="draft.jobId === job.id ? 'bg-primary-50 text-primary-800' : 'text-grey-500'"
            @click="selectJob(job.id)"
          >
            {{ job.name }}
            <CheckIcon v-if="draft.jobId === job.id" class="size-4 text-primary-600" />
          </button>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-2">
      <div>
        <p class="mb-1.5 text-caption font-medium text-grey-400">시작 시간</p>
        <TimePickerField v-model="draft.startTime" placeholder="예) 09:00" />
      </div>
      <div>
        <p class="mb-1.5 text-caption font-medium text-grey-400">종료 시간</p>
        <TimePickerField v-model="draft.endTime" placeholder="예) 18:00" />
      </div>
    </div>

    <label v-if="showDetailFields && isCountJob" class="block">
      <p class="mb-1.5 text-caption font-medium text-grey-400">총 건수</p>
      <input
        v-model="draft.count"
        type="number"
        placeholder="예) 10"
        class="w-full rounded-xl bg-grey-30 px-3.5 py-3 text-body4 text-grey-500 placeholder:text-grey-300 focus:outline-none"
      />
    </label>

    <div v-if="showDetailFields">
      <p class="mb-1.5 text-caption font-medium text-grey-400">오늘 노동 피로도</p>
      <div class="flex gap-1.5">
        <div v-for="level in 5" :key="level" class="flex flex-1 flex-col items-center gap-1">
          <button
            type="button"
            class="h-9 w-full rounded-[11px] text-body3 font-bold transition-colors"
            :class="
              draft.fatigue === level ? 'bg-primary-500 text-white' : 'bg-grey-30 text-grey-400'
            "
            @click="draft.fatigue = level"
          >
            {{ level }}
          </button>
          <span v-if="FATIGUE_LABELS[level]" class="text-caption text-grey-300">
            {{ FATIGUE_LABELS[level] }}
          </span>
        </div>
      </div>
    </div>

    <p
      v-if="!showDetailFields"
      class="rounded-lg bg-primary-50 px-3.5 py-3 text-caption text-primary-800"
    >
      계획한 시간은 캘린더와 피로도 추천에 반영돼요.
    </p>

    <Button :disabled="!isValid" @click="submit">
      {{ isConfirmMode ? confirmActionLabel : isEditingConfirmedEntry ? '근무일지 수정' : '근무 시간 저장' }}
    </Button>

    <button
      v-if="(isEditMode || isConfirmMode) && entry"
      type="button"
      class="text-center text-caption text-red-600 underline"
      @click="requestDelete"
    >
      삭제하기
    </button>
  </div>
</template>
