<!-- src/features/calendar/CalendarView.vue -->
<script setup>
import { computed, ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { useToastStore } from '@/shared/store/toast'
import { useDefenseModeStore } from '@/features/defense-mode/store'
import {
  fetchCalendarMonth,
  fetchCalendarDay,
  fetchWeatherForecast,
  MONTH_SUMMARY_TARGET,
} from './api'
import { getMonthGrid, formatDateKey } from './utils'
import CalendarGrid from './components/CalendarGrid.vue'
import WeatherAccordion from './components/WeatherAccordion.vue'
import DayDetailPanel from './components/DayDetailPanel.vue'
import MonthSummaryBar from './components/MonthSummaryBar.vue'
import AppHeader from '@/shared/components/AppHeader.vue'

const toastStore = useToastStore()
const defenseModeStore = useDefenseModeStore()

function isDateInDefenseRange(dateKey) {
  if (!defenseModeStore.isActive || !defenseModeStore.startDate || !defenseModeStore.endDate) {
    return false
  }
  return dateKey >= defenseModeStore.startDate && dateKey <= defenseModeStore.endDate
}

const today = new Date()
const currentYear = ref(today.getFullYear())
const currentMonth = ref(today.getMonth() + 1)
const selectedDateKey = ref(formatDateKey(today))

const { data: monthData } = useQuery({
  queryKey: computed(() => ['calendar', 'month', currentYear.value, currentMonth.value]),
  queryFn: () => fetchCalendarMonth({ year: currentYear.value, month: currentMonth.value }),
})

const { data: dayData } = useQuery({
  queryKey: computed(() => ['calendar', 'day', selectedDateKey.value]),
  queryFn: () => fetchCalendarDay({ dateKey: selectedDateKey.value }),
})

// 오늘부터 5일치 실황 예보(weather-controller). monthly에 내장된 weather는 예보 범위를 벗어나면
// null로 오는 경우가 많아, 가까운 날짜는 이 실황 예보값으로 덮어써 보여준다.
const { data: liveWeatherByDate } = useQuery({
  queryKey: ['calendar', 'weather', 'live'],
  queryFn: () => fetchWeatherForecast(),
})

const daysByDate = computed(() => {
  const map = new Map()
  for (const day of monthData.value?.days ?? []) map.set(day.dateKey, day)
  return map
})

// COMPLETED 외의 값(PENDING 등, 백엔드 enum 전체가 문서화되어 있지 않음)은 전부 정산 예정으로 취급.
function mapSettlementStatus(settlementStatus) {
  return settlementStatus === 'COMPLETED' ? 'settled' : 'pending'
}

const grid = computed(() => getMonthGrid(currentYear.value, currentMonth.value))

const weatherByDate = computed(() => {
  const map = {}
  for (const day of monthData.value?.days ?? []) {
    if (day.weather) map[day.dateKey] = day.weather
  }
  return { ...map, ...liveWeatherByDate.value }
})

const cells = computed(() =>
  grid.value.map((date) => {
    if (!date) return null
    const dateKey = formatDateKey(date)
    const day = daysByDate.value.get(dateKey)
    const isDefenseMode = isDateInDefenseRange(dateKey)
    return {
      date,
      dateKey,
      dayNumber: date.getDate(),
      status: isDefenseMode ? 'defense' : day ? mapSettlementStatus(day.settlementStatus) : 'none',
      // TODO: job/category-controller 연동 후 카테고리별 색상 dot으로 복원(현재 백엔드 jobs[]엔 category 없음)
      hasWork: (day?.jobs?.length ?? 0) > 0,
      isSelected: dateKey === selectedDateKey.value,
      weather: weatherByDate.value[dateKey] ?? null,
    }
  }),
)

function goPrevMonth() {
  if (currentMonth.value === 1) {
    currentMonth.value = 12
    currentYear.value -= 1
  } else {
    currentMonth.value -= 1
  }
}

function goNextMonth() {
  if (currentMonth.value === 12) {
    currentMonth.value = 1
    currentYear.value += 1
  } else {
    currentMonth.value += 1
  }
}

function selectDate(date) {
  selectedDateKey.value = formatDateKey(date)
}

const selectedEntries = computed(
  () =>
    dayData.value?.works.map((work) => ({
      id: work.workId,
      jobName: work.jobName,
      startTime: work.startTime ?? '-',
      endTime: work.endTime ?? '-',
      status: work.status,
    })) ?? [],
)
const selectedWeather = computed(
  () => dayData.value?.weather ?? weatherByDate.value[selectedDateKey.value] ?? null,
)
const selectedFatigueScore = computed(() => dayData.value?.fatigue?.score ?? null)
const selectedFatigueOverThreshold = computed(
  () => dayData.value?.fatigue?.isOverThreshold ?? false,
)

const plannedHours = computed(() => monthData.value?.summary?.plannedHours ?? 0)
const plannedIncome = computed(() => monthData.value?.summary?.expectedIncome ?? 0)
const targetIncome = computed(
  () => monthData.value?.summary?.targetAmount ?? MONTH_SUMMARY_TARGET.income,
)

// TODO(work-log-controller 연동 전용): 근무 등록/수정/확정/삭제는 서버 jobId를 아직 확보하지 못해
// (onboarding 잡이 로컬 mock) 이번 패스에서는 비활성화하고 안내 토스트만 띄운다.
function notifyWorkManagementComingSoon() {
  toastStore.show('근무 관리 기능은 준비 중이에요')
}
</script>

<template>
  <div class="flex flex-col">
    <AppHeader title="캘린더" />

    <div class="flex flex-col gap-4 px-4 py-6">
      <CalendarGrid
        :year="currentYear"
        :month="currentMonth"
        :cells="cells"
        @prev-month="goPrevMonth"
        @next-month="goNextMonth"
        @select="selectDate"
      />

      <WeatherAccordion :weather-by-date="weatherByDate" />

      <DayDetailPanel
        :date-key="selectedDateKey"
        :entries="selectedEntries"
        :weather="selectedWeather"
        :fatigue-score="selectedFatigueScore"
        :is-fatigue-over-threshold="selectedFatigueOverThreshold"
        primary-action-label="근무 계획 추가"
        @primary-action="notifyWorkManagementComingSoon"
        @open-entry="notifyWorkManagementComingSoon"
      />

      <MonthSummaryBar
        :planned-hours="plannedHours"
        :target-hours="MONTH_SUMMARY_TARGET.hours"
        :planned-income="plannedIncome"
        :target-income="targetIncome"
      />
    </div>
  </div>
</template>
