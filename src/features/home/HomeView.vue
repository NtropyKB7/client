<!-- src/features/home/HomeView.vue -->
<script setup>
import { useQuery } from '@tanstack/vue-query'
import { fetchDashboard } from './api'
import StatCard from '@/shared/components/StatCard.vue'
import JobRecommendationRow from './components/JobRecommendationRow.vue'
import DonutRing from './components/DonutRing.vue'
import BellIcon from '@/shared/components/icons/BellIcon.vue'
import { getFatigueBadge } from '@/shared/utils/fatigueLevel'

const { data: dashboard, isLoading } = useQuery({
  queryKey: ['home', 'dashboard'],
  queryFn: fetchDashboard,
})
</script>

<template>
  <div class="flex flex-col gap-4 px-4 py-6">
    <p v-if="isLoading" class="text-sm text-[#6B6A65]">불러오는 중...</p>

    <template v-else-if="dashboard">
      <div class="flex items-start justify-between">
        <div>
          <p class="text-sm text-[#6B6A65]">안녕하세요</p>
          <h1 class="text-lg font-semibold text-[#111110]">
            {{ dashboard.greetingName }}님의 이번 달
          </h1>
        </div>
        <BellIcon class="h-6 w-6 text-[#111110]" />
      </div>

      <div class="rounded-xl bg-[#111110] p-4 text-white">
        <p class="text-xs text-white/60">이번달 목표 근무시간</p>
        <p class="mt-1 text-3xl font-bold">
          {{ dashboard.goalHours.current }}
          <span class="text-base font-normal text-white/60"
            >/ {{ dashboard.goalHours.target }} 시간</span
          >
        </p>
        <div class="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/15">
          <div
            class="h-full rounded-full bg-emerald-400"
            :style="{
              width: `${(dashboard.goalHours.current / dashboard.goalHours.target) * 100}%`,
            }"
          />
        </div>
        <p class="mt-2 text-[11px] text-white/50">ROI 최적화 알고리즘 기반 추천 포트폴리오</p>
      </div>

      <p class="text-sm font-semibold text-[#111110]">잡별 추천 근무시간</p>
      <JobRecommendationRow
        v-for="job in dashboard.jobRecommendations"
        :key="job.id"
        v-bind="job"
      />

      <div class="grid grid-cols-2 gap-3">
        <div class="rounded-xl border border-[#111110]/10 bg-white p-4">
          <DonutRing :percent="dashboard.achievementRate.percent" color-class="text-emerald-500">
            <span class="text-sm font-semibold text-[#111110]">
              {{ dashboard.achievementRate.percent }}%
            </span>
          </DonutRing>
          <p class="mt-2 text-xs text-[#6B6A65]">현재 목표 달성율</p>
          <p class="text-sm font-semibold text-[#111110]">
            {{ dashboard.achievementRate.amount.toLocaleString() }}원 /
            {{ dashboard.achievementRate.target.toLocaleString() }}원
          </p>
        </div>

        <div class="rounded-xl border border-[#111110]/10 bg-white p-4">
          <DonutRing :percent="dashboard.settlementAmount.percent" color-class="text-amber-500">
            <span class="text-sm font-semibold text-[#111110]">
              {{ dashboard.settlementAmount.percent }}%
            </span>
          </DonutRing>
          <div class="mt-2 flex items-center justify-between">
            <p class="text-xs text-[#6B6A65]">실 정산액</p>
            <span
              class="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700"
            >
              {{ dashboard.settlementAmount.percent }}%
            </span>
          </div>
          <p class="text-sm font-semibold text-[#111110]">
            {{ dashboard.settlementAmount.amount.toLocaleString() }}원 /
            {{ dashboard.settlementAmount.target.toLocaleString() }}원
          </p>
        </div>

        <StatCard
          title="현재 피로도"
          :value="`${dashboard.fatigueScore} / 100`"
          :badge-label="getFatigueBadge(dashboard.fatigueScore, 100).label"
          :badge-class="getFatigueBadge(dashboard.fatigueScore, 100).className"
        />

        <StatCard title="실질 시급" :value="`${dashboard.realWage.real.toLocaleString()}원`">
          <template #detail>
            표면시급 {{ dashboard.realWage.nominal.toLocaleString() }}원 대비 차감 —
            {{ dashboard.realWage.detail }}
          </template>
        </StatCard>
      </div>
    </template>
  </div>
</template>
