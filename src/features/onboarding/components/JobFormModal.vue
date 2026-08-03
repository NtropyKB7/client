<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useModalStore } from '@/shared/store/modal'
import { JOB_CATEGORIES, getJobCategory } from '@/shared/utils/jobCategory'
import ChevronDownIcon from '@/shared/components/icons/ChevronDownIcon.vue'
import CheckIcon from '@/shared/components/icons/CheckIcon.vue'

const DAYS = ['월', '화', '수', '목', '금', '토', '일']

const props = defineProps({
  mode: { type: String, default: 'add' }, // 'add' | 'edit'
  job: { type: Object, default: null },
})

const modalStore = useModalStore()

function initialDraft() {
  if (props.job) {
    return {
      id: props.job.id,
      name: props.job.name,
      incomeMethodLabel: props.job.incomeMethodLabel,
      incomeAmount: props.job.incomeAmount,
      fatigue: props.job.fatigue,
      isRegular: props.job.isRegular,
      workDays: [...props.job.workDays],
      startTime: props.job.startTime,
      endTime: props.job.endTime,
      category: props.job.category,
    }
  }
  return {
    id: `custom-${Date.now()}`,
    name: '',
    incomeMethodLabel: '건당 정산',
    incomeAmount: 0,
    fatigue: 3,
    isRegular: false,
    workDays: [],
    startTime: '',
    endTime: '',
    category: '',
  }
}

const draft = ref(initialDraft())

const isCategoryOpen = ref(false)
const categoryFieldRef = ref(null)

function selectCategory(value) {
  draft.value.category = value
  isCategoryOpen.value = false
}

function handleOutsideClick(event) {
  if (categoryFieldRef.value && !categoryFieldRef.value.contains(event.target)) {
    isCategoryOpen.value = false
  }
}

onMounted(() => document.addEventListener('mousedown', handleOutsideClick))
onUnmounted(() => document.removeEventListener('mousedown', handleOutsideClick))

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
  modalStore.close({ ...draft.value, workDays: [...draft.value.workDays] })
}

function cancel() {
  modalStore.close(null)
}
</script>

<template>
  <div class="flex flex-col gap-5">
    <h2 class="text-head2 text-grey-500">
      {{ mode === 'edit' ? '잡 정보 수정' : '직접 잡 추가하기' }}
    </h2>

    <div>
      <p class="mb-1.5 text-caption font-medium text-grey-400">잡 이름</p>
      <input
        v-model="draft.name"
        type="text"
        placeholder="예) 주말 카페 아르바이트"
        class="w-full rounded-xl bg-grey-30 px-3.5 py-3 text-body4 text-grey-500 placeholder:text-grey-300 focus:outline-none"
      />
    </div>

    <div>
      <p class="mb-1.5 text-caption font-medium text-grey-400">잡 카테고리</p>
      <div ref="categoryFieldRef" class="relative">
        <button
          type="button"
          class="flex w-full items-center justify-between rounded-xl bg-grey-30 px-3.5 py-3 text-left text-body4"
          @click="isCategoryOpen = !isCategoryOpen"
        >
          <span :class="draft.category ? 'text-grey-500' : 'text-grey-300'">
            {{ draft.category ? getJobCategory(draft.category).label : '잡 카테고리' }}
          </span>
          <ChevronDownIcon
            class="size-4 shrink-0 text-grey-400 transition-transform"
            :class="isCategoryOpen ? 'rotate-180' : ''"
          />
        </button>

        <div
          v-if="isCategoryOpen"
          class="absolute z-10 mt-1.5 w-full rounded-2xl border border-grey-50 bg-grey-white p-1.5 shadow-lg"
        >
          <button
            v-for="option in JOB_CATEGORIES"
            :key="option.value"
            type="button"
            class="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-body4"
            :class="
              draft.category === option.value ? 'bg-primary-50 text-primary-800' : 'text-grey-500'
            "
            @click="selectCategory(option.value)"
          >
            {{ option.label }}
            <CheckIcon v-if="draft.category === option.value" class="size-4 text-primary-600" />
          </button>
        </div>
      </div>
    </div>

    <div>
      <p class="mb-1.5 text-caption font-medium text-grey-400">소득 금액</p>
      <div class="relative">
        <input
          v-model.number="draft.incomeAmount"
          type="number"
          inputmode="numeric"
          placeholder="0"
          class="w-full rounded-xl bg-grey-30 px-3.5 py-3 pr-9 text-body4 text-grey-500 placeholder:text-grey-300 focus:outline-none"
        />
        <span
          class="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-body4 text-grey-400"
          >원</span
        >
      </div>
    </div>

    <div>
      <p class="mb-1.5 text-caption font-medium text-grey-400">
        노동 피로도 <span class="text-grey-300">1 여유로움 · 5 매우 힘듦</span>
      </p>
      <div class="flex gap-1.5">
        <button
          v-for="level in 5"
          :key="level"
          type="button"
          class="h-10 flex-1 rounded-[11px] text-body3 font-bold transition-colors"
          :class="
            draft.fatigue === level ? 'bg-primary-500 text-white' : 'bg-grey-30 text-grey-400'
          "
          @click="draft.fatigue = level"
        >
          {{ level }}
        </button>
      </div>
    </div>

    <div class="flex items-center justify-between rounded-2xl border border-grey-50 px-3.5 py-3">
      <div>
        <p class="text-body3 font-bold text-grey-500">정기 근무</p>
        <p class="text-caption text-grey-400">요일과 시간을 반복 일정으로 저장</p>
      </div>
      <button
        type="button"
        role="switch"
        :aria-checked="draft.isRegular"
        class="relative h-[26px] w-11 shrink-0 rounded-full transition-colors"
        :class="draft.isRegular ? 'bg-primary-500' : 'bg-grey-100'"
        @click="toggleRegular"
      >
        <span
          class="absolute left-0.5 top-0.5 size-[22px] rounded-full bg-white shadow transition-transform"
          :class="draft.isRegular ? 'translate-x-5' : 'translate-x-0'"
        />
      </button>
    </div>

    <div v-if="draft.isRegular" class="rounded-2xl border border-grey-50 p-3.5">
      <p class="mb-2 text-caption font-medium text-grey-400">근무 요일</p>
      <div class="flex gap-1.5">
        <button
          v-for="day in DAYS"
          :key="day"
          type="button"
          class="h-[34px] flex-1 rounded-[10px] border text-caption font-medium transition-colors"
          :class="
            draft.workDays.includes(day)
              ? 'border-primary-100 bg-white text-primary-800'
              : 'border-transparent bg-grey-30 text-grey-400'
          "
          @click="toggleDay(day)"
        >
          {{ day }}
        </button>
      </div>

      <p class="mb-2 mt-3.5 text-caption font-medium text-grey-400">근무 시간</p>
      <div class="flex items-center gap-2">
        <input
          v-model="draft.startTime"
          type="text"
          placeholder="09:00"
          class="w-full rounded-xl bg-grey-30 px-3.5 py-3 text-center text-body4 font-medium text-grey-500 placeholder:text-grey-300 focus:outline-none"
        />
        <span class="text-body4 text-grey-400">—</span>
        <input
          v-model="draft.endTime"
          type="text"
          placeholder="18:00"
          class="w-full rounded-xl bg-grey-30 px-3.5 py-3 text-center text-body4 font-medium text-grey-500 placeholder:text-grey-300 focus:outline-none"
        />
      </div>
    </div>

    <div class="mt-1 flex gap-2">
      <button
        type="button"
        class="rounded-[14px] bg-grey-30 px-6 py-3.5 text-body1 text-grey-400"
        @click="cancel"
      >
        취소
      </button>
      <button
        type="button"
        class="flex-1 rounded-[14px] bg-primary-500 py-3.5 text-body1 text-white"
        @click="save"
      >
        {{ mode === 'edit' ? '변경 저장' : '저장' }}
      </button>
    </div>
  </div>
</template>
