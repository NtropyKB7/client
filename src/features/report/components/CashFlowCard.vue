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

const spendFillPercent = computed(() =>
  Math.min(100, Math.round((props.totalSpend / props.totalIncome) * 100)),
)

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

    <div class="mt-4 flex items-center justify-between text-caption">
      <p class="text-grey-300">총소득</p>
      <p class="font-bold text-grey-500">{{ formatMan(totalIncome) }}</p>
    </div>
    <div class="mt-2 h-3 w-full overflow-hidden rounded-full bg-grey-100">
      <div class="h-full w-full rounded-full bg-primary-500" />
    </div>

    <div class="mt-3 flex items-center justify-between text-caption">
      <p class="text-grey-300">총소비</p>
      <p class="font-bold text-grey-500">{{ formatMan(totalSpend) }}</p>
    </div>
    <div class="mt-2 h-3 w-full overflow-hidden rounded-full bg-grey-100">
      <div class="h-full rounded-full bg-amber-500" :style="{ width: `${spendFillPercent}%` }" />
    </div>

    <p class="mt-3 text-[10px] text-primary-800">
      소비를 제외하고 {{ formatMan(availableFunds) }}을 운용할 수 있어요.
    </p>
  </div>
</template>
