<!-- src/features/calendar/CalendarView.vue -->
<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuery, useQueryClient } from '@tanstack/vue-query'
import { useModalStore } from '@/shared/store/modal'
import { useMypageStore } from '@/features/mypage/store'
import { fetchSubscription } from '@/features/mypage/api'
import { useDefenseModeStore } from '@/features/defense-mode/store'
import { fetchDefenseModeData, fetchDefenseCalendar } from '@/features/defense-mode/api'
import { fetchJobs } from '@/features/onboarding/api'
import {
  fetchCalendarMonth,
  fetchCalendarDay,
  fetchWeatherForecast,
  createWorkPlan,
  createWorkActual,
  confirmWorkLog,
  editWorkLog,
  deleteWorkLog,
  MONTH_SUMMARY_TARGET,
} from './api'
import { getMonthGrid, formatDateKey } from './utils'
import CalendarGrid from './components/CalendarGrid.vue'
import WeatherAccordion from './components/WeatherAccordion.vue'
import DayDetailPanel from './components/DayDetailPanel.vue'
import MonthSummaryBar from './components/MonthSummaryBar.vue'
import WorkPlanModal from './components/WorkPlanModal.vue'
import DeleteConfirmModal from './components/DeleteConfirmModal.vue'
import AppHeader from '@/shared/components/AppHeader.vue'

const route = useRoute()
const router = useRouter()
const modalStore = useModalStore()
const queryClient = useQueryClient()
const defenseModeStore = useDefenseModeStore()
const mypageStore = useMypageStore()

const { data: defenseData } = useQuery({
  queryKey: ['defense-mode', 'active'],
  queryFn: fetchDefenseModeData,
})

watch(
  defenseData,
  (value) => {
    defenseModeStore.syncFromServer(value ?? null)
  },
  { immediate: true },
)

// 방어모드는 Pro 구독 전용 기능이라, 캘린더용 지난 기간 조회(fetchDefenseCalendar)도
// 구독 상태를 알아야 게이트할 수 있다(무료 유저 요청/에러 토스트 방지).
const { data: subscription } = useQuery({
  queryKey: ['mypage', 'subscription'],
  queryFn: fetchSubscription,
})

watch(subscription, (value) => {
  if (value) mypageStore.setPlan(value.planId)
})

const isSubscribed = computed(() => mypageStore.planId === 'pro')

function isDateInDefenseRange(dateKey) {
  if (!defenseModeStore.isActive || !defenseModeStore.startDate || !defenseModeStore.endDate) {
    return false
  }
  return dateKey >= defenseModeStore.startDate && dateKey <= defenseModeStore.endDate
}

const today = new Date()
const TODAY_DATE_KEY = formatDateKey(today)

// 알림 목록(NotificationsManageSection.vue)에서 ?date=YYYY-MM-DD&autoConfirm=1 형태로 넘어올 수 있다.
// 형식이 올바르지 않거나 없으면 오늘 날짜로 폴백한다.
const DATE_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/
const queryDateKey =
  typeof route.query.date === 'string' && DATE_KEY_PATTERN.test(route.query.date)
    ? route.query.date
    : null
const initialDateKey = queryDateKey ?? TODAY_DATE_KEY
const [initialYear, initialMonth] = initialDateKey.split('-').map(Number)

const currentYear = ref(initialYear)
const currentMonth = ref(initialMonth)
const selectedDateKey = ref(initialDateKey)

const { data: jobs } = useQuery({ queryKey: ['jobs'], queryFn: fetchJobs })

const { data: monthData } = useQuery({
  queryKey: computed(() => ['calendar', 'month', currentYear.value, currentMonth.value]),
  queryFn: () => fetchCalendarMonth({ year: currentYear.value, month: currentMonth.value }),
})

const { data: dayData } = useQuery({
  queryKey: computed(() => ['calendar', 'day', selectedDateKey.value]),
  queryFn: () => fetchCalendarDay({ dateKey: selectedDateKey.value }),
})

// 현재 활성 기간(isDateInDefenseRange)과 별개로, 해당 월에 걸치는 지난(종료된) 방어모드 기간을
// 가져와 캘린더에 함께 표시한다. 방어모드는 Pro 전용이라 isSubscribed일 때만 조회한다.
const { data: defenseCalendarPeriods } = useQuery({
  queryKey: computed(() => ['defense-mode', 'calendar', currentYear.value, currentMonth.value]),
  queryFn: () => fetchDefenseCalendar({ year: currentYear.value, month: currentMonth.value }),
  enabled: isSubscribed,
})

function isDateInPastDefensePeriods(dateKey) {
  return (defenseCalendarPeriods.value ?? []).some(
    (period) => dateKey >= period.startDate && dateKey <= period.endDate,
  )
}

function isDefenseDate(dateKey) {
  return isDateInDefenseRange(dateKey) || isDateInPastDefensePeriods(dateKey)
}

// 오늘부터 5일치 실황 예보(weather-controller). monthly에 내장된 weather는 예보 범위를 벗어나면
// null로 오는 경우가 많아, 가까운 날짜는 이 실황 예보값으로 덮어써 보여준다.
const { data: liveWeatherByDate } = useQuery({
  queryKey: ['calendar', 'weather', 'live'],
  queryFn: () => fetchWeatherForecast(),
})

function invalidateCalendar() {
  queryClient.invalidateQueries({ queryKey: ['calendar'] })
}

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
    const isDefenseMode = isDefenseDate(dateKey)
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
      jobId: work.jobId,
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
const selectedIsDefenseMode = computed(() => isDefenseDate(selectedDateKey.value))

const plannedHours = computed(() => monthData.value?.summary?.plannedHours ?? 0)
const plannedIncome = computed(() => monthData.value?.summary?.expectedIncome ?? 0)
const targetIncome = computed(
  () => monthData.value?.summary?.targetAmount ?? MONTH_SUMMARY_TARGET.income,
)

// 오늘(또는 과거)로 예정된, 아직 확정 안 된 근무만 "근무일지 작성"으로 확정 가능.
function isEntryConfirmable(entry) {
  return entry.status === 'PLANNED' && selectedDateKey.value <= TODAY_DATE_KEY
}

const unconfirmedEntry = computed(() => selectedEntries.value.find(isEntryConfirmable))
// 오늘 이전 날짜는 계획 없이도 "근무일지 작성"으로 실제 근무를 바로 추가할 수 있어야 한다.
const isPastDate = computed(() => selectedDateKey.value < TODAY_DATE_KEY)
const primaryActionLabel = computed(() =>
  unconfirmedEntry.value || isPastDate.value ? '근무일지 작성' : '근무 계획 추가',
)

async function openCreateModal() {
  const payload = await modalStore.open(
    WorkPlanModal,
    { mode: 'create', dateKey: selectedDateKey.value, jobs: jobs.value ?? [], entry: null },
    { position: 'bottom' },
  )
  if (payload) {
    await createWorkPlan({
      jobId: payload.jobId,
      dateKey: selectedDateKey.value,
      startTime: payload.startTime,
      endTime: payload.endTime,
    })
    invalidateCalendar()
  }
}

async function openEditModal(entry) {
  const payload = await modalStore.open(
    WorkPlanModal,
    { mode: 'edit', dateKey: selectedDateKey.value, jobs: jobs.value ?? [], entry },
    { position: 'bottom' },
  )
  if (payload?.delete) {
    openDeleteConfirm(entry)
    return
  }
  if (payload) {
    await editWorkLog(entry.id, {
      jobId: payload.jobId,
      startTime: payload.startTime,
      endTime: payload.endTime,
      taskCount: payload.count,
      fatigue: payload.fatigue,
    })
    invalidateCalendar()
  }
}

// entry가 있으면 기존 계획(workId)을 확정하고, entry가 없으면(계획에 없던 근무) 새 실적을 등록한다.
async function openConfirmModal(entry) {
  const payload = await modalStore.open(
    WorkPlanModal,
    { mode: 'confirm', dateKey: selectedDateKey.value, jobs: jobs.value ?? [], entry },
    { position: 'bottom' },
  )
  if (payload?.delete) {
    openDeleteConfirm(entry)
    return
  }
  if (!payload) return

  if (entry) {
    await confirmWorkLog(entry.id, {
      jobId: payload.jobId,
      startTime: payload.startTime,
      endTime: payload.endTime,
      taskCount: payload.count,
      fatigue: payload.fatigue,
    })
  } else {
    await createWorkActual({
      jobId: payload.jobId,
      dateKey: selectedDateKey.value,
      startTime: payload.startTime,
      endTime: payload.endTime,
      taskCount: payload.count,
      fatigue: payload.fatigue,
    })
  }
  invalidateCalendar()
}

// 알림에서 ?autoConfirm=1로 넘어온 경우, 해당 날짜의 dayData가 로드된 시점에 확정 가능한
// 근무가 하나 있으면 자동으로 확정 모달을 띄운다. dayData의 vue-query 캐시가 이미 warm할 수도
// 있으므로(watch의 값 변화 감지에만 의존하면 { once: true }가 발동하지 않을 수 있다),
// { immediate: true } + 명시적 플래그로 warm/cold 캐시 두 경우를 모두 처리한다.
const pendingAutoConfirm = ref(route.query.autoConfirm === '1')

watch(
  dayData,
  (value) => {
    if (!pendingAutoConfirm.value || !value) return
    pendingAutoConfirm.value = false
    // 사용자가 알림 목표 날짜의 데이터가 로딩되기 전에 다른 날짜를 직접 선택하면, 그 사이
    // dayData가 갱신되면서 잘못된 날짜에 모달이 뜨는 걸 방지. 이 시점 이후로는 재방문해도
    // 자동확정을 다시 띄우지 않도록 플래그는 조건과 무관하게 소비한다.
    if (selectedDateKey.value === initialDateKey && unconfirmedEntry.value) {
      openConfirmModal(unconfirmedEntry.value)
    }
    router.replace({ name: 'calendar', query: {} })
  },
  { immediate: true },
)

async function openDeleteConfirm(entry) {
  const confirmed = await modalStore.open(DeleteConfirmModal, { entry }, { position: 'center' })
  if (confirmed) {
    await deleteWorkLog(entry.id)
    invalidateCalendar()
  }
}

// "근무일지 작성"은 그 날 기존 계획이 있어도 항상 새 실적을 추가한다(기존 계획 확정은
// 목록에서 해당 항목을 눌러야 함 — openEntryDetail 참고).
function handlePrimaryAction() {
  if (unconfirmedEntry.value || isPastDate.value) {
    openConfirmModal(null)
  } else {
    openCreateModal()
  }
}

function openEntryDetail(entry) {
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
        :fatigue-score="selectedFatigueScore"
        :is-fatigue-over-threshold="selectedFatigueOverThreshold"
        :is-defense-mode="selectedIsDefenseMode"
        :primary-action-label="primaryActionLabel"
        @primary-action="handlePrimaryAction"
        @open-entry="openEntryDetail"
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
