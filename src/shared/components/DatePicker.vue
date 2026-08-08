<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import ChevronDownIcon from './icons/ChevronDownIcon.vue'
import CheckIcon from './icons/CheckIcon.vue'

const props = defineProps({
  modelValue: { type: String, default: '' }, // 'YYYY-MM-DD'
  placeholder: { type: String, default: '날짜를 선택해 주세요' },
  // 값이 비어있을 때 처음 펼쳐 보여줄 연/월. 생략하면 오늘 날짜(당월)로 연다 — 생년월일처럼
  // 오늘에서 멀리 떨어진 날짜를 고르는 화면은 이 prop으로 시작 연/월을 넘겨준다.
  initialYear: { type: Number, default: null },
  initialMonth: { type: Number, default: null },
  // 이 날짜(포함) 이전은 선택할 수 없게 막는다. 'YYYY-MM-DD'.
  minDate: { type: String, default: '' },
})
const emit = defineEmits(['update:modelValue'])

const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토']
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1)

const today = new Date()
const MAX_YEAR = today.getFullYear()
const MIN_YEAR = MAX_YEAR - 100
const YEARS = Array.from({ length: MAX_YEAR - MIN_YEAR + 1 }, (_, i) => MAX_YEAR - i)

function parseValue(value) {
  if (!value) return null
  const [year, month, day] = value.split('-').map(Number)
  if (!year || !month || !day) return null
  return { year, month, day }
}

function formatValue(year, month, day) {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

const parsed = computed(() => parseValue(props.modelValue))

const isOpen = ref(false)
const isYearOpen = ref(false)
const isMonthOpen = ref(false)
const fieldRef = ref(null)

const viewYear = ref(parsed.value?.year ?? props.initialYear ?? MAX_YEAR)
const viewMonth = ref(parsed.value?.month ?? props.initialMonth ?? today.getMonth() + 1)

watch(
  () => props.modelValue,
  (value) => {
    const next = parseValue(value)
    if (next) {
      viewYear.value = next.year
      viewMonth.value = next.month
    }
  },
)

function getMonthGrid(year, month) {
  const firstDay = new Date(year, month - 1, 1)
  const startWeekday = firstDay.getDay()
  const daysInMonth = new Date(year, month, 0).getDate()
  const cells = []
  for (let i = 0; i < startWeekday; i += 1) cells.push(null)
  for (let day = 1; day <= daysInMonth; day += 1) cells.push(day)
  return cells
}

const grid = computed(() => getMonthGrid(viewYear.value, viewMonth.value))

function isSelected(day) {
  return (
    !!parsed.value &&
    parsed.value.year === viewYear.value &&
    parsed.value.month === viewMonth.value &&
    parsed.value.day === day
  )
}

// 'YYYY-MM-DD'는 사전식 비교가 곧 날짜 비교와 같아 Date 파싱 없이 문자열로 바로 비교한다.
function isBeforeMinDate(day) {
  if (!props.minDate || !day) return false
  return formatValue(viewYear.value, viewMonth.value, day) < props.minDate
}

function toggleOpen() {
  isOpen.value = !isOpen.value
  if (!isOpen.value) {
    isYearOpen.value = false
    isMonthOpen.value = false
  }
}

function toggleYearOptions() {
  isYearOpen.value = !isYearOpen.value
  isMonthOpen.value = false
}

function toggleMonthOptions() {
  isMonthOpen.value = !isMonthOpen.value
  isYearOpen.value = false
}

function selectYear(year) {
  viewYear.value = year
  isYearOpen.value = false
}

function selectMonth(month) {
  viewMonth.value = month
  isMonthOpen.value = false
}

function selectDay(day) {
  if (!day || isBeforeMinDate(day)) return
  emit('update:modelValue', formatValue(viewYear.value, viewMonth.value, day))
  isOpen.value = false
}

function handleOutsideClick(event) {
  if (fieldRef.value && !fieldRef.value.contains(event.target)) {
    isOpen.value = false
    isYearOpen.value = false
    isMonthOpen.value = false
  }
}

onMounted(() => document.addEventListener('mousedown', handleOutsideClick))
onUnmounted(() => document.removeEventListener('mousedown', handleOutsideClick))
</script>

<template>
  <div ref="fieldRef" class="relative">
    <button
      type="button"
      class="flex w-full items-center justify-between rounded-xl bg-grey-30 px-3.5 py-3.5 text-left"
      @click="toggleOpen"
    >
      <span class="text-body4" :class="modelValue ? 'text-grey-500' : 'text-grey-300'">
        {{ modelValue || placeholder }}
      </span>
      <ChevronDownIcon
        class="size-4 shrink-0 text-grey-400 transition-transform"
        :class="isOpen ? 'rotate-180' : ''"
      />
    </button>

    <div
      v-if="isOpen"
      class="absolute z-10 mt-1.5 w-full min-w-[272px] rounded-2xl border border-grey-50 bg-grey-white p-3 shadow-lg"
    >
      <div class="mb-3 flex gap-2">
        <div class="relative flex-1">
          <button
            type="button"
            class="flex w-full items-center justify-between rounded-xl bg-grey-30 px-3 py-2.5 text-left text-body4 text-grey-500"
            @click="toggleYearOptions"
          >
            {{ viewYear }}년
            <ChevronDownIcon
              class="size-4 shrink-0 text-grey-400 transition-transform"
              :class="isYearOpen ? 'rotate-180' : ''"
            />
          </button>
          <div
            v-if="isYearOpen"
            class="absolute z-20 mt-1.5 max-h-52 w-full overflow-y-auto rounded-2xl border border-grey-50 bg-grey-white p-1.5 shadow-lg"
          >
            <button
              v-for="year in YEARS"
              :key="year"
              type="button"
              class="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-body4"
              :class="year === viewYear ? 'bg-primary-50 text-primary-800' : 'text-grey-500'"
              @click="selectYear(year)"
            >
              {{ year }}년
              <CheckIcon v-if="year === viewYear" class="size-4 text-primary-600" />
            </button>
          </div>
        </div>

        <div class="relative flex-1">
          <button
            type="button"
            class="flex w-full items-center justify-between rounded-xl bg-grey-30 px-3 py-2.5 text-left text-body4 text-grey-500"
            @click="toggleMonthOptions"
          >
            {{ viewMonth }}월
            <ChevronDownIcon
              class="size-4 shrink-0 text-grey-400 transition-transform"
              :class="isMonthOpen ? 'rotate-180' : ''"
            />
          </button>
          <div
            v-if="isMonthOpen"
            class="absolute z-20 mt-1.5 max-h-52 w-full overflow-y-auto rounded-2xl border border-grey-50 bg-grey-white p-1.5 shadow-lg"
          >
            <button
              v-for="month in MONTHS"
              :key="month"
              type="button"
              class="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-body4"
              :class="month === viewMonth ? 'bg-primary-50 text-primary-800' : 'text-grey-500'"
              @click="selectMonth(month)"
            >
              {{ month }}월
              <CheckIcon v-if="month === viewMonth" class="size-4 text-primary-600" />
            </button>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-7 gap-y-1 text-center">
        <span v-for="label in WEEKDAY_LABELS" :key="label" class="py-1 text-caption text-grey-300">
          {{ label }}
        </span>
        <button
          v-for="(day, index) in grid"
          :key="index"
          type="button"
          class="mx-auto flex size-8 items-center justify-center rounded-full text-caption"
          :class="
            !day
              ? 'invisible'
              : isBeforeMinDate(day)
                ? 'cursor-not-allowed text-grey-100'
                : isSelected(day)
                  ? 'bg-primary-500 font-bold text-white'
                  : 'text-grey-500 hover:bg-grey-30'
          "
          :disabled="!day || isBeforeMinDate(day)"
          @click="selectDay(day)"
        >
          {{ day }}
        </button>
      </div>
    </div>
  </div>
</template>
