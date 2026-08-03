<script setup>
import { computed } from 'vue'

const props = defineProps({
  job: { type: Object, required: true },
})

const STATUS_STYLES = {
  blue: { border: 'border-[rgba(59,122,245,0.35)]', badge: 'bg-[#E8F2FF] text-[#3B7AF5]' },
  yellow: { border: 'border-[rgba(255,166,0,0.35)]', badge: 'bg-[#FFF5D9] text-[#FFA600]' },
  red: { border: 'border-[rgba(240,64,64,0.35)]', badge: 'bg-[#FFE8E5] text-[#F04040]' },
}

const style = computed(() => STATUS_STYLES[props.job.status.tone])
</script>

<template>
  <div class="w-[280px] shrink-0 rounded-2xl border bg-grey-white p-4" :class="style.border">
    <div class="flex items-start justify-between">
      <div class="flex items-center gap-2">
        <span
          class="flex size-6 shrink-0 items-center justify-center rounded-[6px] bg-grey-500 text-caption font-bold text-white"
        >
          {{ job.name.charAt(0) }}
        </span>
        <p class="text-body1 text-grey-500">{{ job.name }}</p>
      </div>
      <span class="shrink-0 rounded-full px-2.5 py-1 text-caption font-medium" :class="style.badge">
        {{ job.status.label }}
      </span>
    </div>

    <div class="mt-3 flex items-baseline gap-1.5">
      <p class="text-head1 text-grey-500">{{ job.hours }}h</p>
      <p class="text-caption text-grey-400">/ 추천 {{ job.recommendedHours }}h</p>
    </div>

    <p class="mt-2 text-caption text-grey-400">
      피로도 {{ job.fatigue.toFixed(1) }} · 예상 {{ job.expectedIncome.toLocaleString() }}원
    </p>
  </div>
</template>
