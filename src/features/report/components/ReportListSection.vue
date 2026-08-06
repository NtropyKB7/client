<script setup>
import { computed } from 'vue'
import ChevronRightIcon from '@/shared/components/icons/ChevronRightIcon.vue'
import { formatMan } from '../utils'

const props = defineProps({
  greetingName: { type: String, required: true },
  reports: { type: Array, required: true },
})

defineEmits(['select'])

const latest = computed(() => props.reports[0])
const previousReports = computed(() => props.reports.slice(1))

// Figma 스파크라인은 실제 수치가 아니라 우상향 추세를 보여주는 장식용 그래프
const SPARKLINE_HEIGHT_PERCENTS = [9, 29, 50, 75, 100]

const sparkline = computed(() =>
  props.reports
    .slice(0, 5)
    .slice()
    .reverse()
    .map((report, index) => ({
      month: report.month,
      heightPercent: SPARKLINE_HEIGHT_PERCENTS[index] ?? 100,
    })),
)
</script>

<template>
  <div class="flex flex-col gap-4">
    <p class="text-caption text-grey-300">{{ greetingName }}님의 자금 흐름을 월별로 정리했어요.</p>

    <button
      v-if="latest"
      type="button"
      class="rounded-2xl bg-primary-50 p-4 text-left"
      @click="$emit('select', latest.month)"
    >
      <div class="flex items-start justify-between">
        <span class="rounded-full bg-grey-white px-3 py-1.5 text-[10px] font-bold text-primary-800">
          최신
        </span>
        <ChevronRightIcon class="size-4 text-primary-800" />
      </div>
      <p class="mt-3 text-head3 font-bold text-grey-500">{{ latest.monthLabel }} 리포트</p>
      <p v-if="latest.totalIncome != null && latest.totalSpend != null" class="mt-1 text-caption text-grey-300">
        소득 {{ formatMan(latest.totalIncome) }} · 소비 {{ formatMan(latest.totalSpend) }}
      </p>

      <div v-if="latest.availableFunds != null" class="mt-3 flex items-end justify-between">
        <div>
          <p class="text-caption text-primary-800">이번 달 가용자금</p>
          <p class="mt-1 text-head1 text-primary-800">{{ formatMan(latest.availableFunds) }}</p>
        </div>
        <div class="flex h-10 items-end gap-1.5">
          <span
            v-for="bar in sparkline"
            :key="bar.month"
            class="w-2.5 rounded-[3px] bg-primary-600"
            :style="{ height: `${bar.heightPercent}%` }"
          />
        </div>
      </div>
    </button>

    <div class="flex flex-col gap-1">
      <div class="flex items-center justify-between">
        <p class="text-body1 text-grey-500">지난 리포트</p>
        <p class="text-[11px] text-grey-300">최근 6개월</p>
      </div>

      <button
        v-for="report in previousReports"
        :key="report.month"
        type="button"
        class="mt-2 flex items-center gap-3 rounded-2xl border border-grey-50 bg-grey-white p-3.5 text-left"
        @click="$emit('select', report.month)"
      >
        <span
          class="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-head3 font-bold text-primary-800"
        >
          {{ report.monthLabel.replace('월', '') }}
        </span>
        <div class="min-w-0 flex-1">
          <p class="text-body3 text-grey-500">{{ report.monthLabel }} 리포트</p>
          <p v-if="report.totalIncome != null && report.totalSpend != null" class="mt-1 text-caption text-grey-300">
            소득 {{ formatMan(report.totalIncome) }} · 소비 {{ formatMan(report.totalSpend) }}
          </p>
        </div>
        <ChevronRightIcon class="size-4 shrink-0 text-grey-300" />
      </button>
    </div>
  </div>
</template>
