<!-- src/features/calendar/CalendarView.vue -->
<script setup>
import { computed, ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { useOnboardingStore } from '@/features/onboarding/store'
import { useModalStore } from '@/shared/store/modal'
import { useDefenseModeStore } from '@/features/defense-mode/store'
import { useCalendarStore } from './store'
import { fetchCalendarMonth, fetchWeatherForecast, FATIGUE_THRESHOLD, TODAY_DATE_KEY } from './api'
import {
  getMonthGrid,
  formatDateKey,
  computeDayStatus,
  getUniqueCategories,
  computeEntryHours,
  computeEntryIncome,
  computeDayFatigue,
} from './utils'
import CalendarGrid from './components/CalendarGrid.vue'
import WeatherAccordion from './components/WeatherAccordion.vue'
import DayDetailPanel from './components/DayDetailPanel.vue'
import MonthSummaryBar from './components/MonthSummaryBar.vue'
import WorkPlanModal from './components/WorkPlanModal.vue'
import DeleteConfirmModal from './components/DeleteConfirmModal.vue'
import AppHeader from '@/shared/components/AppHeader.vue'

const onboardingStore = useOnboardingStore()
const calendarStore = useCalendarStore()
const modalStore = useModalStore()
const defenseModeStore = useDefenseModeStore()

function isDateInDefenseRange(dateKey) {
  if (!defenseModeStore.isActive || !defenseModeStore.startDate || !defenseModeStore.endDate) {
    return false
  }
  return dateKey >= defenseModeStore.startDate && dateKey <= defenseModeStore.endDate
}

const currentYear = ref(2026)
const currentMonth = ref(7)
const selectedDateKey = ref('2026-07-16')

const { data: monthConfig } = useQuery({
  queryKey: computed(() => ['calendar', 'month', currentYear.value, currentMonth.value]),
  queryFn: () => fetchCalendarMonth({ year: currentYear.value, month: currentMonth.value }),
})

// TODO(연동 테스트 전용): GET /api/weather 연동 확인용. 오늘 기준 5일치만 채워지며,
// 캘린더 전체가 백엔드로 마이그레이션되면 fetchCalendarMonth의 내장 weather로 대체되어 제거된다.
const { data: liveWeatherByDate } = useQuery({
  queryKey: ['calendar', 'weather', 'live'],
  queryFn: () => fetchWeatherForecast(),
})

const weatherByDate = computed(() => ({
  ...monthConfig.value?.weatherByDate,
  ...liveWeatherByDate.value,
}))

const grid = computed(() => getMonthGrid(currentYear.value, currentMonth.value))

const cells = computed(() =>
  grid.value.map((date) => {
    if (!date) return null
    const dateKey = formatDateKey(date)
    const dayEntries = calendarStore.entriesForDate(dateKey)
    const isDefenseMode = isDateInDefenseRange(dateKey)
    return {
      date,
      dateKey,
      dayNumber: date.getDate(),
      status: computeDayStatus(dayEntries, isDefenseMode),
      categories: getUniqueCategories(dayEntries),
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

const selectedEntries = computed(() => calendarStore.entriesForDate(selectedDateKey.value))
const selectedWeather = computed(() => weatherByDate.value[selectedDateKey.value] ?? null)
const selectedFatigue = computed(() => computeDayFatigue(selectedEntries.value))

const monthPrefix = computed(
  () => `${currentYear.value}-${String(currentMonth.value).padStart(2, '0')}`,
)
const monthEntries = computed(() =>
  calendarStore.entries.filter((entry) => entry.date.startsWith(monthPrefix.value)),
)
const plannedHours = computed(() =>
  Math.round(monthEntries.value.reduce((sum, entry) => sum + computeEntryHours(entry), 0)),
)
const plannedIncome = computed(() =>
  monthEntries.value.reduce((sum, entry) => {
    const job = onboardingStore.jobs.find((j) => j.id === entry.jobId)
    return sum + computeEntryIncome(entry, job)
  }, 0),
)

function isEntryConfirmable(entry) {
  return entry.status === 'planned' && selectedDateKey.value <= TODAY_DATE_KEY
}

const unconfirmedEntry = computed(() => selectedEntries.value.find(isEntryConfirmable))
const primaryActionLabel = computed(() =>
  unconfirmedEntry.value ? '근무일지 작성' : '근무 계획 추가',
)

async function openCreateModal() {
  const payload = await modalStore.open(
    WorkPlanModal,
    { mode: 'create', dateKey: selectedDateKey.value, jobs: onboardingStore.jobs, entry: null },
    { position: 'bottom' },
  )
  if (payload) {
    calendarStore.addEntry({ id: `entry-${Date.now()}`, date: selectedDateKey.value, ...payload })
  }
}

async function openEditModal(entry) {
  const payload = await modalStore.open(
    WorkPlanModal,
    { mode: 'edit', dateKey: entry.date, jobs: onboardingStore.jobs, entry },
    { position: 'bottom' },
  )
  if (payload?.delete) {
    openDeleteConfirm(entry)
    return
  }
  if (payload) {
    calendarStore.updateEntry(entry.id, payload)
  }
}

async function openConfirmModal(entry) {
  const payload = await modalStore.open(
    WorkPlanModal,
    { mode: 'confirm', dateKey: entry.date, jobs: onboardingStore.jobs, entry },
    { position: 'bottom' },
  )
  if (payload) {
    calendarStore.updateEntry(entry.id, payload)
  }
}

async function openDeleteConfirm(entry) {
  const confirmed = await modalStore.open(DeleteConfirmModal, { entry }, { position: 'center' })
  if (confirmed) {
    calendarStore.deleteEntry(entry.id)
  }
}

function handlePrimaryAction() {
  if (unconfirmedEntry.value) {
    openConfirmModal(unconfirmedEntry.value)
  } else {
    openCreateModal()
  }
}

function openEntryDetail(entry) {
  if (entry.status === 'settled') return
  if (isEntryConfirmable(entry)) {
    openConfirmModal(entry)
  } else {
    openEditModal(entry)
  }
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
        :fatigue-score="selectedFatigue"
        :fatigue-threshold="FATIGUE_THRESHOLD"
        :primary-action-label="primaryActionLabel"
        @primary-action="handlePrimaryAction"
        @open-entry="openEntryDetail"
      />

      <MonthSummaryBar
        :planned-hours="plannedHours"
        :target-hours="monthConfig?.summaryTarget?.hours ?? 0"
        :planned-income="plannedIncome"
        :target-income="monthConfig?.summaryTarget?.income ?? 0"
      />
    </div>
  </div>
</template>
