<script setup>
import ReportIcon from '@/shared/components/icons/ReportIcon.vue'
import ChevronRightIcon from '@/shared/components/icons/ChevronRightIcon.vue'
import BellIcon from '@/shared/components/icons/BellIcon.vue'
import Container from '@/shared/components/Container.vue'

defineProps({
  greetingName: { type: String, required: true },
  reports: { type: Array, required: true },
})

defineEmits(['select'])
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center justify-between">
      <h1 class="text-base font-semibold text-[#111110]">{{ greetingName }}님의 월별 리포트</h1>
      <BellIcon class="h-6 w-6 text-[#111110]" />
    </div>

    <div class="flex flex-col gap-1">
      <p class="text-xs font-semibold uppercase tracking-[0.15em] text-[#6B6A65]">Monthly report</p>
      <div class="flex items-center gap-2">
        <ReportIcon class="h-8 w-8 text-[#111110]" />
        <h2 class="text-xl font-bold tracking-tight text-[#111110]">월별 리포트</h2>
      </div>
      <p class="mt-1 text-xs text-[#6B6A65]">월별 소득 관리를 돌아보기 위한 핵심이 요약된 리포트</p>
    </div>

    <div class="flex flex-col gap-3">
      <div
        v-for="report in reports"
        :key="report.month"
        class="rounded-xl border border-[#111110]/10 bg-white px-4"
      >
        <Container clickable @click="$emit('select', report.month)">
          <template #leading>
            <ReportIcon class="h-5 w-5 text-[#111110]" />
          </template>
          <p class="text-sm font-semibold text-[#111110]">{{ report.monthLabel }} 리포트</p>
          <p class="mt-1 text-xs text-[#6B6A65]">소비 분석·금융상품 추천이 담긴 월간 보고서예요.</p>
          <template #trailing>
            <ChevronRightIcon class="h-4 w-4 text-[#6B6A65]" />
          </template>
        </Container>
      </div>
    </div>
  </div>
</template>
