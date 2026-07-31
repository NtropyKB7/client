<!-- src/shared/components/JobCard.vue -->
<script setup>
import { computed, ref } from 'vue'
import Button from './Button.vue'
import CategoryPickerModal from './CategoryPickerModal.vue'
import IncomeMethodPickerModal from './IncomeMethodPickerModal.vue'
import DeleteJobConfirmModal from './DeleteJobConfirmModal.vue'
import { useModalStore } from '@/shared/store/modal'
import { getJobCategory } from '@/shared/utils/jobCategory'

const FATIGUE_LABELS = ['매우 가벼움', '가벼움', '보통', '힘듦', '매우 힘듦']
const DAYS = ['일', '월', '화', '수', '목', '금', '토']

const props = defineProps({
  job: { type: Object, required: true },
  startInEdit: { type: Boolean, default: false },
})

const emit = defineEmits(['save', 'delete'])

const modalStore = useModalStore()

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

const isEditing = ref(props.startInEdit)
const draft = ref(cloneJob(props.job))
const hasSavedOnce = ref(false)

const summaryFatigueLabel = computed(() => FATIGUE_LABELS[props.job.fatigue - 1])
const draftFatigueLabel = computed(() => FATIGUE_LABELS[draft.value.fatigue - 1])
const draftCategoryLabel = computed(() => getJobCategory(draft.value.category).label)

const saveButtonLabel = computed(() =>
  props.startInEdit && !hasSavedOnce.value ? '추가' : '저장',
)

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

async function pickCategory() {
  const selected = await modalStore.open(
    CategoryPickerModal,
    { selected: draft.value.category },
    { position: 'bottom' },
  )
  if (selected) {
    draft.value.category = selected
  }
}

async function pickIncomeMethod() {
  const selected = await modalStore.open(
    IncomeMethodPickerModal,
    { selected: draft.value.incomeMethodLabel },
    { position: 'bottom' },
  )
  if (selected) {
    draft.value.incomeMethodLabel = selected
  }
}

function save() {
  emit('save', cloneJob(draft.value))
  hasSavedOnce.value = true
  isEditing.value = false
}

function cancelEdit() {
  if (props.startInEdit && !hasSavedOnce.value) {
    emit('delete')
    return
  }
  draft.value = cloneJob(props.job)
  isEditing.value = false
}

async function requestDelete() {
  const confirmed = await modalStore.open(DeleteJobConfirmModal, {}, { position: 'center' })
  if (confirmed) {
    emit('delete')
  }
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
            {{ job.incomeMethodLabel }} : {{ job.incomeAmount.toLocaleString() }}원
          </p>
        </div>
      </div>
      <p class="mt-2 text-xs text-[#6B6A65]">
        {{ getJobCategory(job.category).label }} · 피로도 {{ summaryFatigueLabel }}
        <template v-if="job.isRegular">
          · {{ job.workDays.join(', ') }} {{ job.startTime }}~{{ job.endTime }}
        </template>
      </p>

      <div class="mt-4 flex gap-2">
        <div class="flex-1">
          <Button variant="outline" @click="startEdit">수정</Button>
        </div>
        <div class="flex-1">
          <Button variant="danger" @click="requestDelete">삭제</Button>
        </div>
      </div>
    </template>

    <template v-else>
      <div class="flex items-center gap-3">
        <div class="h-10 w-10 shrink-0 rounded-full bg-[#F3F1EC]" />
        <input
          v-model="draft.name"
          type="text"
          placeholder="잡 이름 입력"
          class="min-w-0 flex-1 rounded-lg border border-[#111110]/20 px-3 py-2 text-sm"
        />
      </div>

      <button
        type="button"
        class="mt-3 flex w-full items-center justify-between rounded-lg border border-[#111110]/20 px-3 py-2 text-left text-sm"
        @click="pickCategory"
      >
        <span :class="draft.category ? 'text-[#111110]' : 'text-[#8A8778]'">
          {{ draft.category ? draftCategoryLabel : '잡 카테고리 선택' }}
        </span>
      </button>

      <p class="mt-3 text-xs text-[#6B6A65]">소득</p>
      <button
        type="button"
        class="mt-1 flex w-full items-center justify-between rounded-lg border border-[#111110]/20 px-3 py-2 text-left text-sm"
        @click="pickIncomeMethod"
      >
        <span :class="draft.incomeMethodLabel ? 'text-[#111110]' : 'text-[#8A8778]'">
          {{ draft.incomeMethodLabel || '소득 방식 선택(건당/시급/월 정산)' }}
        </span>
      </button>
      <input
        v-model.number="draft.incomeAmount"
        type="number"
        placeholder="금액 입력(건당 얼마/시급 얼마)"
        class="mt-2 w-full rounded-lg border border-[#111110]/20 px-3 py-2 text-sm"
      />

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
          <Button variant="outline" @click="cancelEdit">취소</Button>
        </div>
        <div class="flex-1">
          <Button @click="save">{{ saveButtonLabel }}</Button>
        </div>
      </div>
    </template>
  </div>
</template>
