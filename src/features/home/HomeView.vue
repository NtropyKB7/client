<!-- src/features/home/HomeView.vue -->
<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'
import { fetchDashboard } from './api'
import { fetchUnreadCount } from '@/features/notification/api'
import JobRecommendationCard from './components/JobRecommendationCard.vue'
import DualProgressBar from './components/DualProgressBar.vue'
import BellIcon from '@/shared/components/icons/BellIcon.vue'
import NtropyLogo from '@/shared/components/icons/NtropyLogo.vue'
import { getFatigueBadge } from '@/shared/utils/fatigueLevel'
import { useDragScroll } from '@/shared/composables/useDragScroll'
import InstallBanner from './components/InstallBanner.vue'

const router = useRouter()

const jobRecommendationsRef = ref(null)
useDragScroll(jobRecommendationsRef, { axis: 'x' })

const { data: dashboard, isLoading } = useQuery({
  queryKey: ['home', 'dashboard'],
  queryFn: fetchDashboard,
  refetchOnMount: 'always',
})

const { data: unreadCount } = useQuery({
  queryKey: ['notifications', 'unread-count'],
  queryFn: fetchUnreadCount,
})

function goToNotifications() {
  router.push({ name: 'mypage', query: { view: 'notifications' } })
}

const remainingHours = computed(() =>
  Math.max(0, dashboard.value.goalHours.goalHours - dashboard.value.goalHours.confirmedHours),
)

const plannedHours = computed(() =>
  Math.min(
    dashboard.value.goalHours.goalHours,
    dashboard.value.goalHours.confirmedHours + dashboard.value.goalHours.scheduledHours,
  ),
)

const goalHoursPercent = computed(() =>
  Math.round(
    (dashboard.value.goalHours.confirmedHours / dashboard.value.goalHours.goalHours) * 100,
  ),
)

const goalIncomeRemaining = computed(
  () => dashboard.value.goalIncome.goalIncome - dashboard.value.goalIncome.actualIncome,
)

const plannedIncome = computed(() =>
  Math.min(
    dashboard.value.goalIncome.goalIncome,
    dashboard.value.goalIncome.actualIncome + dashboard.value.goalIncome.expectedSettlementIncome,
  ),
)

const fatigueBadge = computed(() => getFatigueBadge(dashboard.value.fatigueScore, 100))

const greetingMonthLabel = computed(() => {
  const match = /^(\d{4})-(\d{2})$/.exec(dashboard.value.targetMonth ?? '')
  return match ? `${Number(match[2])}월` : (dashboard.value.targetMonth ?? '이번달')
})

const averageWage = computed(() => {
  const current = dashboard.value.goalHours.confirmedHours
  if (!current) return 0
  return Math.round(dashboard.value.goalIncome.actualIncome / current)
})
</script>

<template>
  <div class="flex flex-col gap-8 bg-grey-white pb-8">
    <InstallBanner />

    <p v-if="isLoading" class="px-4 pt-6 text-body4 text-grey-400">불러오는 중...</p>

    <template v-else-if="dashboard">
      <div class="flex items-center justify-between px-4 pt-[13px]">
        <NtropyLogo class="h-[22px] w-[72px] text-grey-500" />
        <button type="button" aria-label="알림" class="relative" @click="goToNotifications">
          <BellIcon class="size-6 text-grey-500" />
          <span
            v-if="unreadCount > 0"
            class="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-[#e53d33]"
            aria-hidden="true"
          />
        </button>
      </div>

      <div class="flex flex-col gap-2 px-4">
        <p class="text-body1 text-grey-400">
          {{ dashboard.greetingName }}님의 {{ greetingMonthLabel }}
        </p>
        <p class="text-head1 leading-[1.5] text-grey-500">
          목표 금액까지<br />
          <span class="text-primary-600">{{ goalIncomeRemaining.toLocaleString() }}</span
          >원 남았어요
        </p>

        <DualProgressBar
          class="mt-10"
          :actual="dashboard.goalIncome.actualIncome"
          :planned="plannedIncome"
          :goal="dashboard.goalIncome.goalIncome"
          planned-label="예상 정산"
          :format-value="(v) => `${v.toLocaleString()}원`"
        />
      </div>

      <div v-if="dashboard.jobRecommendations.length > 0" class="flex flex-col gap-3">
        <p class="pl-4 text-body1 text-grey-500">잡별 추천 근무시간</p>
        <div ref="jobRecommendationsRef" class="scrollbar-none flex overflow-x-auto py-1">
          <div class="w-4 shrink-0" aria-hidden="true" />
          <JobRecommendationCard
            v-for="job in dashboard.jobRecommendations"
            :key="job.id"
            :job="job"
            class="mr-3 last:mr-4"
          />
        </div>
      </div>

      <div class="flex flex-col gap-3 px-4">
        <p class="text-body1 text-grey-500">이번 달 요약</p>

        <div class="rounded-2xl border border-grey-50 bg-grey-white p-4">
          <div class="flex items-center justify-between">
            <p class="text-caption font-medium text-grey-400">근무시간</p>
            <span
              class="rounded-full bg-primary-50 px-2.5 py-1 text-caption font-bold text-primary-800"
            >
              {{ goalHoursPercent }}%
            </span>
          </div>
          <p class="mt-2 text-head3 font-bold text-grey-500">
            {{ dashboard.goalHours.confirmedHours }}시간
          </p>
          <DualProgressBar
            class="mt-10"
            track-height-class="h-1.5"
            :actual="dashboard.goalHours.confirmedHours"
            :planned="plannedHours"
            :goal="dashboard.goalHours.goalHours"
            planned-label="계획"
            :format-value="(v) => `${v}h`"
          />
          <p class="mt-2.5 text-caption text-grey-400">
            목표 {{ dashboard.goalHours.goalHours }}시간까지 {{ remainingHours }}시간 남았어요
          </p>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div class="rounded-2xl border border-grey-50 p-3.5">
            <div class="flex items-center justify-between">
              <p class="text-caption font-medium text-grey-400">현재 피로도</p>
              <span
                class="rounded-full px-2 py-1 text-[10.5px] font-medium"
                :class="fatigueBadge.className"
              >
                {{ fatigueBadge.label }}
              </span>
            </div>
            <p class="mt-2 text-head3 font-bold text-grey-500">
              {{ dashboard.fatigueScore }}
              <span class="text-caption font-normal text-grey-400">/ 100</span>
            </p>
            <p class="mt-2 text-caption font-medium text-grey-400">{{ fatigueBadge.hint }}</p>
          </div>

          <div class="rounded-2xl border border-grey-50 p-3.5">
            <p class="text-caption font-medium text-grey-400">평균 시급</p>
            <p class="mt-2 text-head3 font-bold text-grey-500">
              {{ averageWage.toLocaleString() }}원
            </p>
            <p class="mt-2 text-caption text-grey-400">이번 달 수입 ÷ 근무시간</p>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
