<script setup>
import { computed } from 'vue'
import SparkleIcon from '@/shared/components/icons/SparkleIcon.vue'
import { formatMan } from '../utils'

const props = defineProps({
  name: { type: String, required: true },
  description: { type: String, required: true },
  provider: { type: String, default: '' },
  interestRate: { type: Number, default: null },
  savingPeriod: { type: Number, default: null },
  maxMonthlyAmount: { type: Number, default: null },
  targetGroup: { type: String, default: '' },
  njobTrendTip: { type: String, default: '' },
  financialType: { type: String, default: '' },
  simulatedExtraIncome: { type: Number, default: null },
})

const FINANCIAL_TYPE_LABELS = {
  SURPLUS: '흑자',
  DEFICIT: '적자',
  BALANCED: '균형',
}

const hasTerms = computed(
  () => props.interestRate != null || props.savingPeriod != null || props.maxMonthlyAmount != null,
)

const financialTypeLabel = computed(
  () => FINANCIAL_TYPE_LABELS[props.financialType] ?? props.financialType,
)

const simulatedExtraIncomeLabel = computed(() =>
  props.simulatedExtraIncome != null
    ? `${props.simulatedExtraIncome.toLocaleString('ko-KR')}원`
    : null,
)

const hasTags = computed(
  () => !!financialTypeLabel.value || !!props.targetGroup || !!simulatedExtraIncomeLabel.value,
)

const hasDetails = computed(() => hasTerms.value || hasTags.value || !!props.njobTrendTip)
</script>

<template>
  <div class="rounded-2xl border border-grey-50 bg-grey-white p-4">
    <div class="flex items-center gap-3">
      <span
        class="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary-800"
      >
        <SparkleIcon class="size-[22px]" />
      </span>
      <div class="min-w-0 flex-1">
        <div class="flex items-center justify-between gap-2">
          <p class="text-caption font-bold text-primary-800">추천 금융상품</p>
          <span
            class="shrink-0 rounded-full bg-primary-50 px-3 py-1.5 text-[10px] font-bold text-primary-800"
          >
            구독자 전용
          </span>
        </div>
        <p v-if="provider" class="mt-0.5 text-[11px] text-grey-300">{{ provider }}</p>
        <p class="text-body1 text-grey-500" :class="provider ? '' : 'mt-0.5'">{{ name }}</p>
      </div>
    </div>

    <p class="mt-3 text-caption text-grey-300">{{ description }}</p>

    <div v-if="hasDetails" class="mt-3 flex flex-col gap-2 rounded-xl bg-grey-30 p-3">
      <div
        v-if="hasTerms"
        class="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-bold text-primary-800"
      >
        <span v-if="interestRate != null">연 {{ interestRate }}%</span>
        <span v-if="savingPeriod != null">{{ savingPeriod }}개월</span>
        <span v-if="maxMonthlyAmount != null">월 최대 {{ formatMan(maxMonthlyAmount) }}</span>
      </div>

      <div v-if="hasTags" class="flex flex-wrap gap-1.5">
        <span
          v-if="financialTypeLabel"
          class="rounded-full bg-primary-50 px-2 py-1 text-[10px] font-bold text-primary-800"
        >
          {{ financialTypeLabel }}
        </span>
        <span
          v-if="targetGroup"
          class="rounded-full bg-grey-100 px-2 py-1 text-[10px] font-medium text-grey-400"
        >
          {{ targetGroup }}
        </span>
        <span
          v-if="simulatedExtraIncomeLabel"
          class="rounded-full bg-grey-100 px-2 py-1 text-[10px] font-medium text-grey-400"
        >
          예상 추가수익 {{ simulatedExtraIncomeLabel }}
        </span>
      </div>

      <p v-if="njobTrendTip" class="text-[11px] text-primary-800">{{ njobTrendTip }}</p>
    </div>
  </div>
</template>
