<!-- src/features/report/components/ReportDetailSection.vue -->
<script setup>
import { computed } from 'vue'
import { useModalStore } from '@/shared/store/modal'
import { formatMan } from '../utils'
import CategoryBar from './CategoryBar.vue'
import CashFlowCard from './CashFlowCard.vue'
import AiInsightCard from './AiInsightCard.vue'
import JobPerformanceCard from './JobPerformanceCard.vue'
import RecommendedProductCard from './RecommendedProductCard.vue'
import ReportDeliverySettingsModal from './ReportDeliverySettingsModal.vue'
import SectionLabel from './SectionLabel.vue'

const props = defineProps({
  monthLabel: { type: String, required: true },
  isSubscribed: { type: Boolean, required: true },
  detail: { type: Object, required: true },
  reportList: { type: Array, required: true },
})

const emit = defineEmits(['subscribe', 'change-month'])

const modalStore = useModalStore()

const currentIndex = computed(() =>
  props.reportList.findIndex((report) => report.month === props.detail.month),
)
const previousReport = computed(() => props.reportList[currentIndex.value + 1] ?? null)
const nextReport = computed(() =>
  currentIndex.value > 0 ? props.reportList[currentIndex.value - 1] : null,
)

const yearLabel = computed(() => props.detail.month?.split('-')[0])

const spendChangeLabel = computed(() => {
  const percent = props.detail.expenseChangePercent
  if (percent === null || percent === undefined) return ''
  return percent <= 0 ? `전월 대비 ${Math.abs(percent)}% 감소` : `전월 대비 ${percent}% 증가`
})
const spendChangeClass = computed(() => {
  const percent = props.detail.expenseChangePercent
  return percent !== null && percent !== undefined && percent <= 0
    ? 'text-primary-800'
    : 'text-[#e53d33]'
})

const showAiGate = computed(() => !props.isSubscribed)

function openDeliverySettings() {
  modalStore.open(ReportDeliverySettingsModal, {}, { position: 'center' })
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center justify-between">
      <button
        type="button"
        class="text-head3 text-grey-300 disabled:opacity-0"
        :disabled="!previousReport"
        @click="previousReport && emit('change-month', previousReport.month)"
      >
        ‹
      </button>
      <p class="text-head3 font-bold text-grey-500">{{ yearLabel }}년 {{ monthLabel }}</p>
      <button
        type="button"
        class="text-head3 text-grey-300 disabled:opacity-0"
        :disabled="!nextReport"
        @click="nextReport && emit('change-month', nextReport.month)"
      >
        ›
      </button>
    </div>
    <p class="text-center text-caption text-grey-300">
      이번 달에는 {{ formatMan(detail.totalIncome) }}을 벌고, {{ formatMan(detail.totalSpend) }}을
      사용했어요.
    </p>

    <div class="grid grid-cols-3 gap-2">
      <div class="rounded-2xl border border-grey-50 bg-grey-white p-3">
        <p class="text-[11px] text-grey-300">총소득</p>
        <p class="mt-2 text-body1 text-grey-500">{{ formatMan(detail.totalIncome) }}</p>
      </div>
      <div class="rounded-2xl border border-grey-50 bg-grey-white p-3">
        <p class="text-[11px] text-grey-300">총소비</p>
        <p class="mt-2 text-body1 text-grey-500">{{ formatMan(detail.totalSpend) }}</p>
      </div>
      <div class="rounded-2xl bg-primary-50 p-3">
        <p class="text-[11px] text-grey-300">가용자금</p>
        <p class="mt-2 text-body1 text-primary-800">
          {{ formatMan(detail.availableFunds) }}
        </p>
      </div>
    </div>

    <template v-if="detail.insight || detail.recommendedProduct">
      <SectionLabel label="AI 맞춤 제안" />
      <div class="relative">
        <div class="flex flex-col gap-4" :class="{ 'pointer-events-none blur-[5px]': showAiGate }">
          <AiInsightCard
            v-if="detail.insight"
            :description="detail.insight"
            :njob-trend-tip="detail.recommendedProduct?.njobTrendTip"
            :job-insight="detail.jobInsight"
            :future-income-trend="detail.futureIncomeTrend"
          />
          <RecommendedProductCard
            v-if="detail.recommendedProduct"
            :name="detail.recommendedProduct.name"
            :description="detail.recommendedProduct.description"
            :provider="detail.recommendedProduct.provider"
            :interest-rate="detail.recommendedProduct.interestRate"
            :saving-period="detail.recommendedProduct.savingPeriod"
            :max-monthly-amount="detail.recommendedProduct.maxMonthlyAmount"
            :target-group="detail.recommendedProduct.targetGroup"
            :reasoning="detail.reasoning"
            :financial-type="detail.financialType"
            :simulated-extra-income="detail.simulatedExtraIncome"
          />
        </div>
        <button
          v-if="showAiGate"
          type="button"
          class="absolute inset-0 flex flex-col items-center justify-center gap-1 rounded-2xl px-6 text-center"
          @click="emit('subscribe')"
        >
          <p
            class="text-body4 font-bold text-grey-500 [text-shadow:0_1px_3px_rgba(255,255,255,0.9)]"
          >
            구독자 전용
          </p>
          <p class="text-caption text-grey-300 [text-shadow:0_1px_3px_rgba(255,255,255,0.9)]">
            구독 후 맞춤 인사이트와 금융상품을 확인하세요
          </p>
        </button>
      </div>
    </template>

    <SectionLabel label="이번 달 자금 분석" />

    <CashFlowCard
      :total-income="detail.totalIncome"
      :total-spend="detail.totalSpend"
      :available-funds="detail.availableFunds"
      :income-change-percent="detail.incomeChangePercent"
    />

    <div class="rounded-2xl border border-grey-50 bg-grey-white p-4">
      <div class="flex items-center justify-between">
        <p class="text-body3 text-grey-500">주요 소비 카테고리</p>
        <p v-if="spendChangeLabel" class="text-[11px] font-medium" :class="spendChangeClass">
          {{ spendChangeLabel }}
        </p>
      </div>
      <div class="mt-3">
        <CategoryBar :categories="detail.categories" />
      </div>
    </div>

    <template v-if="isSubscribed && detail.jobs?.length">
      <SectionLabel label="잡별 근무 분석" />
      <JobPerformanceCard :jobs="detail.jobs" />
    </template>

    <button
      type="button"
      class="flex items-center justify-between rounded-2xl border border-grey-50 bg-grey-white p-4 text-left"
      @click="openDeliverySettings"
    >
      <div>
        <p class="text-caption font-bold text-grey-500">월간 리포트 받기</p>
        <p class="mt-1 text-[11px] text-grey-300">카카오톡 · 이메일</p>
      </div>
      <span class="rounded-full bg-primary-50 px-3 py-1.5 text-[10px] font-bold text-primary-800">
        설정
      </span>
    </button>
  </div>
</template>
