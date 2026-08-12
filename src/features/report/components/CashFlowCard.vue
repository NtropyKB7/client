<!-- src/features/report/components/CashFlowCard.vue -->
<script setup>
import { computed } from 'vue'
import { formatMan } from '../utils'

const props = defineProps({
  totalIncome: { type: Number, required: true },
  totalSpend: { type: Number, required: true },
  availableFunds: { type: Number, required: true },
  incomeChangePercent: { type: Number, default: null },
})

const RADIUS = 40
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

const spendFillPercent = computed(() =>
  Math.min(100, Math.round((props.totalSpend / props.totalIncome) * 100)),
)

const dashOffset = computed(() => CIRCUMFERENCE * (1 - spendFillPercent.value / 100))

const changeLabel = computed(() => {
  if (props.incomeChangePercent === null) return null
  const sign = props.incomeChangePercent >= 0 ? '+' : ''
  return `전월대비 ${sign}${props.incomeChangePercent}%`
})
</script>

<template>
  <div class="rounded-2xl border border-grey-50 bg-grey-white p-4">
    <div class="flex items-center justify-between">
      <p class="text-body3 text-grey-500">월간 자금 흐름</p>
      <span
        v-if="changeLabel"
        class="rounded-full bg-primary-50 px-3 py-1.5 text-[10px] font-bold text-primary-800"
      >
        {{ changeLabel }}
      </span>
    </div>

    <div class="mt-4 flex items-center gap-4">
      <div class="relative size-24 shrink-0">
        <svg viewBox="0 0 96 96" class="size-24 -rotate-90">
          <circle cx="48" cy="48" r="40" fill="none" stroke-width="14" class="stroke-grey-100" />
          <circle
            cx="48"
            cy="48"
            r="40"
            fill="none"
            stroke-width="14"
            stroke-linecap="round"
            class="stroke-primary-800"
            :stroke-dasharray="CIRCUMFERENCE"
            :stroke-dashoffset="dashOffset"
          />
        </svg>
        <div class="absolute inset-0 flex flex-col items-center justify-center">
          <p class="text-body1 font-bold text-grey-500">{{ spendFillPercent }}%</p>
          <p class="text-[9px] text-grey-300">소비율</p>
        </div>
      </div>

      <div class="flex flex-1 flex-col gap-2.5">
        <div class="flex items-center justify-between text-caption">
          <span class="flex items-center gap-1.5 text-grey-300">
            <span class="size-2 shrink-0 rounded-full bg-primary-500" />
            총소득
          </span>
          <span class="font-bold text-grey-500">{{ formatMan(totalIncome) }}</span>
        </div>
        <div class="flex items-center justify-between text-caption">
          <span class="flex items-center gap-1.5 text-grey-300">
            <span class="size-2 shrink-0 rounded-full bg-primary-800" />
            총소비
          </span>
          <span class="font-bold text-grey-500">{{ formatMan(totalSpend) }}</span>
        </div>
      </div>
    </div>

    <p class="mt-3 text-[10px] text-primary-800">전체 링은 총소득, 채운 영역은 총소비예요.</p>
  </div>
</template>
