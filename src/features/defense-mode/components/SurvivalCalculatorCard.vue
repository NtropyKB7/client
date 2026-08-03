<!-- src/features/defense-mode/components/SurvivalCalculatorCard.vue -->
<script setup>
import { computed } from 'vue'
import { computeSurvivalDays } from '../utils'

const SURVIVAL_METER_MAX_DAYS = 30

const props = defineProps({
  finance: { type: Object, required: true },
})

const survivalDays = computed(() =>
  computeSurvivalDays(props.finance.reserve, props.finance.safeAssets, props.finance.dailySpend),
)

const meterFillPercent = computed(() =>
  Math.min(100, Math.round((survivalDays.value / SURVIVAL_METER_MAX_DAYS) * 100)),
)

function manWon(amount) {
  return `${Math.round(amount / 10000)}만원`
}
</script>

<template>
  <div class="rounded-2xl border border-grey-50 bg-grey-white p-4">
    <p class="text-caption text-grey-300">생존 가능 기간 계산기</p>
    <p class="mt-2 flex items-end gap-1">
      <span class="text-[36px] leading-none font-bold text-grey-500">{{ survivalDays }}</span>
      <span class="pb-0.5 text-body2 text-grey-300">일 버틸 수 있어요</span>
    </p>

    <div class="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-grey-100">
      <div class="h-full rounded-full bg-primary-500" :style="{ width: `${meterFillPercent}%` }" />
    </div>

    <p class="mt-2 text-[11px] text-grey-300">
      ({{ manWon(finance.reserve) }} + {{ manWon(finance.safeAssets) }}) ÷ 일평균
      {{ manWon(finance.dailySpend) }}
    </p>

    <div class="mt-4 flex gap-2">
      <div class="flex flex-1 items-center justify-between rounded-full bg-grey-30 px-3 py-2">
        <p class="text-[10px] text-grey-300">리저브</p>
        <p class="text-[11px] font-bold text-grey-500">{{ manWon(finance.reserve) }}</p>
      </div>
      <div class="flex flex-1 items-center justify-between rounded-full bg-grey-30 px-3 py-2">
        <p class="text-[10px] text-grey-300">안전자산</p>
        <p class="text-[11px] font-bold text-grey-500">{{ manWon(finance.safeAssets) }}</p>
      </div>
      <div class="flex flex-1 items-center justify-between rounded-full bg-grey-30 px-3 py-2">
        <p class="text-[10px] text-grey-300">일 지출</p>
        <p class="text-[11px] font-bold text-grey-500">{{ manWon(finance.dailySpend) }}</p>
      </div>
    </div>
  </div>
</template>
