<!-- src/features/home/HomeView.vue -->
<script setup>
import { useQuery } from '@tanstack/vue-query'
import { fetchDashboard } from './api'
import StatCard from '@/shared/components/StatCard.vue'
import JobRecommendationRow from './components/JobRecommendationRow.vue'
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
      <h1 class="text-lg font-semibold text-[#111110]">
        안녕하세요, {{ dashboard.greetingName }}님의 이번 달
      </h1>

      <div class="rounded-xl border border-[#111110]/10 bg-white p-4">
        <p class="text-xs text-[#6B6A65]">이번 달 목표 근무시간</p>
        <p class="mt-1 text-base font-semibold text-[#111110]">
          {{ dashboard.goalHours.current }} / {{ dashboard.goalHours.target }}h
        </p>
      </div>

      <div class="rounded-xl border border-[#111110]/10 bg-white p-2">
        <JobRecommendationRow
          v-for="job in dashboard.jobRecommendations"
          :key="job.id"
          v-bind="job"
        />
      </div>

      <div class="rounded-xl border border-[#111110]/10 bg-white p-4">
        <p class="text-xs text-[#6B6A65]">정주비(고정비) 요약</p>
        <p class="mt-1 text-base font-semibold text-[#111110]">
          {{ dashboard.fixedCostSummary.toLocaleString() }}원
        </p>
      </div>

      <StatCard
        title="목표 달성율"
        :value="`${dashboard.achievementRate.percent}% (${dashboard.achievementRate.amount.toLocaleString()}원)`"
      >
        <template #detail>{{ dashboard.achievementRate.detail }}</template>
      </StatCard>

      <StatCard
        title="실 정산액"
        :value="`${dashboard.settlementAmount.amount.toLocaleString()}원`"
      >
        <template #detail>{{ dashboard.settlementAmount.detail }}</template>
      </StatCard>

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
    </template>
  </div>
</template>
