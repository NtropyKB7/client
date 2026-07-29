<script setup>
import { computed, ref } from 'vue'
import Button from './Button.vue'
import { JOB_CATEGORIES, getJobCategory } from '@/shared/utils/jobCategory'

const FATIGUE_LABELS = ['매우 가벼움', '가벼움', '보통', '힘듦', '매우 힘듦']
const DAYS = ['일', '월', '화', '수', '목', '금', '토']

const props = defineProps({
  job: { type: Object, required: true },
})

const emit = defineEmits(['save', 'edit-income', 'delete'])

function cloneJob(job) {
  return {
    id: job.id,
    name: job.name,
    incomeMethodLabel: job.incomeMethodLabel,
    incomeAmount: job.incomeAmount,
    fatigue: job.fatigue,
    isRegular: job.isRegular,
    workDays: [...job.workDays],
    startTime: job.startTime,
    endTime: job.endTime,
    category: job.category,
  }
}

const isEditing = ref(false)
const draft = ref(cloneJob(props.job))

const summaryFatigueLabel = computed(() => FATIGUE_LABELS[props.job.fatigue - 1])
const draftFatigueLabel = computed(() => FATIGUE_LABELS[draft.value.fatigue - 1])

function startEdit() {
  draft.value = cloneJob(props.job)
  isEditing.value = true
}

function toggleDay(day) {
  const index = draft.value.workDays.indexOf(day)
  if (index === -1) {
    draft.value.workDays.push(day)
  } else {
    draft.value.workDays.splice(index, 1)
  }
}

function toggleRegular() {
  draft.value.isRegular = !draft.value.isRegular
}

function save() {
  emit('save', cloneJob(draft.value))
  isEditing.value = false
}

function requestIncomeEdit() {
  emit('edit-income', cloneJob(props.job))
}

function requestDelete() {
  emit('delete')
}
</script>

<template>
  <div class="rounded-xl border border-[#111110]/10 bg-white p-4">
    <template v-if="!isEditing">
      <div class="flex items-center gap-3">
        <div class="h-10 w-10 shrink-0 rounded-full bg-[#F3F1EC]" />
        <div class="min-w-0 flex-1">
          <p class="text-sm font-semibold text-[#111110]">{{ job.name }}</p>
          <p class="text-xs text-[#6B6A65]">
            {{ job.incomeMethodLabel }} ({{ job.incomeAmount.toLocaleString() }}원)
          </p>
        </div>
        <div class="flex shrink-0 items-center gap-2">
          <button type="button" class="text-xs text-[#6B6A65] underline" @click="startEdit">
            수정
          </button>
          <button type="button" class="text-xs text-[#6B6A65] underline" @click="requestDelete">
            삭제
          </button>
        </div>
      </div>
      <p class="mt-2 text-xs text-[#6B6A65]">
        {{ getJobCategory(job.category).label }} · 피로도 {{ summaryFatigueLabel }}
        <template v-if="job.isRegular">
          · {{ job.workDays.join(', ') }} {{ job.startTime }}~{{ job.endTime }}
        </template>
      </p>
    </template>

    <template v-else>
      <div class="flex items-center gap-3">
        <div class="h-10 w-10 shrink-0 rounded-full bg-[#F3F1EC]" />
        <p class="text-sm font-semibold text-[#111110]">{{ draft.name }}</p>
      </div>

      <p class="mt-3 text-xs text-[#6B6A65]">
        소득 방식 : {{ draft.incomeMethodLabel }} ({{ draft.incomeAmount.toLocaleString() }}원)
      </p>

      <p class="mt-3 text-xs text-[#6B6A65]">노동 피로도 (1~5)</p>
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
      <p class="mt-1 text-xs text-[#E0B400]">{{ draftFatigueLabel }}</p>

      <p class="mt-3 text-xs text-[#6B6A65]">잡 카테고리</p>
      <div class="mt-1 flex gap-2">
        <button
          v-for="category in JOB_CATEGORIES"
          :key="category.value"
          type="button"
          class="h-9 flex-1 rounded-lg border text-xs font-medium"
          :class="
            draft.category === category.value
              ? 'border-[#E0B400] text-[#E0B400]'
              : 'border-[#111110]/10 text-[#6B6A65]'
          "
          @click="draft.category = category.value"
        >
          {{ category.label }}
        </button>
      </div>

      <div class="mt-3 flex items-center justify-between">
        <p class="text-sm text-[#111110]">정기 근무</p>
        <button
          type="button"
          role="switch"
          :aria-checked="draft.isRegular"
          class="relative h-6 w-11 rounded-full transition-colors"
          :class="draft.isRegular ? 'bg-[#111110]' : 'bg-[#111110]/15'"
          @click="toggleRegular"
        >
          <span
            class="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform"
            :class="draft.isRegular ? 'translate-x-5' : 'translate-x-0'"
          />
        </button>
      </div>

      <template v-if="draft.isRegular">
        <p class="mt-3 text-xs text-[#6B6A65]">
          근무 요일을 선택하고, 요일에 해당하는 시간을 입력해 주세요.
        </p>
        <div class="mt-1 flex gap-1">
          <button
            v-for="day in DAYS"
            :key="day"
            type="button"
            class="h-9 flex-1 rounded-lg border text-sm font-medium"
            :class="
              draft.workDays.includes(day)
                ? 'border-[#E0B400] text-[#E0B400]'
                : 'border-[#111110]/10 text-[#6B6A65]'
            "
            @click="toggleDay(day)"
          >
            {{ day }}
          </button>
        </div>

        <div class="mt-3 grid grid-cols-2 gap-2">
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
      </template>

      <div class="mt-4 flex gap-2">
        <div class="flex-1">
          <Button variant="outline" @click="requestIncomeEdit">기본 소득 수정</Button>
        </div>
        <div class="flex-1">
          <Button @click="save">저장</Button>
        </div>
      </div>
    </template>
  </div>
</template>
