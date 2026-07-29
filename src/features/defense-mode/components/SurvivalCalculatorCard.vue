<!-- src/features/defense-mode/components/SurvivalCalculatorCard.vue -->
<script setup>
import { computed } from 'vue'
import { computeSurvivalDays } from '../utils'

const props = defineProps({
  finance: { type: Object, required: true },
})

const survivalDays = computed(() =>
  computeSurvivalDays(props.finance.reserve, props.finance.safeAssets, props.finance.dailySpend),
)

function manWon(amount) {
  return `${Math.round(amount / 10000)}만원`
}
</script>

<template>
  <div class="rounded-2xl border border-[#111110]/10 bg-white p-4">
    <p class="text-sm font-semibold text-[#111110]">생존가능기간 계산기</p>
    <p class="mt-2 text-3xl font-bold text-[#111110]">
      {{ survivalDays }}<span class="ml-1 text-base font-normal">일 버틸 수 있어요</span>
    </p>
    <p class="mt-1 text-xs text-[#6B6A65]">
      ({{ manWon(finance.reserve) }} + {{ manWon(finance.safeAssets) }}) ÷ 일평균
      {{ manWon(finance.dailySpend) }}
    </p>

    <div class="mt-4 grid grid-cols-3 gap-2 text-center">
      <div class="rounded-lg bg-[#F3F1EC] py-3">
        <p class="text-[10px] text-[#6B6A65]">리저브</p>
        <p class="mt-1 text-sm font-semibold text-[#111110]">{{ manWon(finance.reserve) }}</p>
      </div>
      <div class="rounded-lg bg-[#F3F1EC] py-3">
        <p class="text-[10px] text-[#6B6A65]">안전자산</p>
        <p class="mt-1 text-sm font-semibold text-[#111110]">{{ manWon(finance.safeAssets) }}</p>
      </div>
      <div class="rounded-lg bg-[#F3F1EC] py-3">
        <p class="text-[10px] text-[#6B6A65]">일 지출</p>
        <p class="mt-1 text-sm font-semibold text-[#111110]">{{ manWon(finance.dailySpend) }}</p>
      </div>
    </div>

    <div class="mt-4 flex items-center justify-between">
      <p class="text-xs text-[#6B6A65]">이번 달 예상 손실 소득</p>
      <p class="text-sm font-semibold text-rose-600">
        {{ finance.expectedLossIncome.toLocaleString() }}원
      </p>
    </div>
  </div>
</template>
