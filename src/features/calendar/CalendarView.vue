<!-- src/features/calendar/CalendarView.vue -->
<script setup>
import { computed, ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { useOnboardingStore } from '@/features/onboarding/store'
import { useModalStore } from '@/shared/store/modal'
import { useCalendarStore } from './store'
import { fetchCalendarMonth, FATIGUE_THRESHOLD, GREETING_NAME, TODAY_DATE_KEY } from './api'
import {
  getMonthGrid,
  formatDateKey,
  computeDayStatus,
  getUniqueCategories,
  computeEntryHours,
  computeEntryIncome,
  computeDayFatigue,
} from './utils'
import { JOB_CATEGORIES } from '@/shared/utils/jobCategory'
import CalendarGrid from './components/CalendarGrid.vue'
import DayDetailPanel from './components/DayDetailPanel.vue'
import MonthSummaryBar from './components/MonthSummaryBar.vue'
import WorkPlanModal from './components/WorkPlanModal.vue'
import DeleteConfirmModal from './components/DeleteConfirmModal.vue'
import BellIcon from '@/shared/components/icons/BellIcon.vue'
import ChevronLeftIcon from '@/shared/components/icons/ChevronLeftIcon.vue'
import ChevronRightIcon from '@/shared/components/icons/ChevronRightIcon.vue'

const onboardingStore = useOnboardingStore()
const calendarStore = useCalendarStore()
const modalStore = useModalStore()

const currentYear = ref(2026)
const currentMonth = ref(7)
const selectedDateKey = ref('2026-07-16')

const { data: monthConfig } = useQuery({
  queryKey: computed(() => ['calendar', 'month', currentYear.value, currentMonth.value]),
  queryFn: () => fetchCalendarMonth({ year: currentYear.value, month: currentMonth.value }),
})

const grid = computed(() => getMonthGrid(currentYear.value, currentMonth.value))

const cells = computed(() =>
  grid.value.map((date) => {
    if (!date) return null
    const dateKey = formatDateKey(date)
    const dayEntries = calendarStore.entriesForDate(dateKey)
    const isDefenseMode = monthConfig.value?.defenseModeDates?.includes(dateKey) ?? false
    return {
      date,
      dateKey,
      dayNumber: date.getDate(),
      status: computeDayStatus(dayEntries, isDefenseMode),
      categories: getUniqueCategories(dayEntries),
      isSelected: dateKey === selectedDateKey.value,
      weather: monthConfig.value?.weatherByDate?.[dateKey] ?? null,
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
const selectedWeather = computed(
  () => monthConfig.value?.weatherByDate?.[selectedDateKey.value] ?? null,
)
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
</script>

<template>
  <div class="flex flex-col gap-4 px-4 py-6">
    <div class="flex items-center justify-between">
      <h1 class="text-lg font-semibold text-[#111110]">{{ GREETING_NAME }}님의 이번 달 캘린더</h1>
      <BellIcon class="h-6 w-6 text-[#111110]" />
    </div>

    <div class="flex items-center justify-center gap-4">
      <button type="button" aria-label="이전 달" @click="goPrevMonth">
        <ChevronLeftIcon class="h-5 w-5 text-[#111110]" />
      </button>
      <p class="text-sm font-semibold text-[#111110]">{{ currentYear }}년 {{ currentMonth }}월</p>
      <button type="button" aria-label="다음 달" @click="goNextMonth">
        <ChevronRightIcon class="h-5 w-5 text-[#111110]" />
      </button>
    </div>

    <div class="rounded-xl border border-[#111110]/10 bg-white p-4">
      <CalendarGrid :cells="cells" @select="selectDate" />
    </div>

    <div class="flex gap-3 text-xs text-[#6B6A65]">
      <span
        v-for="category in JOB_CATEGORIES"
        :key="category.value"
        class="flex items-center gap-1"
      >
        <span class="h-2 w-2 rounded-full" :class="category.colorClass" />
        {{ category.label }}
      </span>
    </div>

    <DayDetailPanel
      :date-key="selectedDateKey"
      :entries="selectedEntries"
      :weather="selectedWeather"
      :fatigue-score="selectedFatigue"
      :fatigue-threshold="FATIGUE_THRESHOLD"
      :is-today="selectedDateKey === TODAY_DATE_KEY"
      @add-plan="openCreateModal"
      @edit-entry="openEditModal"
      @confirm-entry="openConfirmModal"
      @delete-entry="openDeleteConfirm"
    />

    <MonthSummaryBar
      :planned-hours="plannedHours"
      :target-hours="monthConfig?.summaryTarget?.hours ?? 0"
      :planned-income="plannedIncome"
      :target-income="monthConfig?.summaryTarget?.income ?? 0"
    />
  </div>
</template>
