<!-- src/features/report/components/AiInsightCard.vue -->
<script setup>
defineProps({
  description: { type: String, required: true },
  njobTrendTip: { type: String, default: '' },
  jobInsight: { type: String, default: '' },
  futureIncomeTrend: { type: String, default: '' },
})
</script>

<template>
  <div class="rounded-2xl bg-primary-50 p-4">
    <span
      class="inline-block rounded-full bg-grey-white px-3 py-1.5 text-[10px] font-bold text-primary-800"
    >
      AI 인사이트
    </span>
    <p class="mt-3 text-body4 font-bold text-primary-800">{{ description }}</p>
    <p v-if="njobTrendTip" class="mt-2 text-caption text-primary-800">{{ njobTrendTip }}</p>
    <p v-if="jobInsight" class="mt-2 text-caption text-primary-800">{{ jobInsight }}</p>
    <p v-if="futureIncomeTrend" class="mt-2 text-caption text-primary-800">
      {{ futureIncomeTrend }}
    </p>
  </div>
</template>
