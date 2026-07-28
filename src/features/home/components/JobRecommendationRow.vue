<!-- src/features/home/components/JobRecommendationRow.vue -->
<script setup>
import { getFatigueBadge } from '@/shared/utils/fatigueLevel'

const props = defineProps({
  name: { type: String, required: true },
  fatigue: { type: Number, required: true },
  roi: { type: Number, required: true },
  recommendedHours: { type: Number, required: true },
  expectedIncome: { type: Number, required: true },
  reduced: { type: Boolean, default: false },
})

const badge = getFatigueBadge(props.fatigue, 5)
</script>

<template>
  <div class="flex items-center justify-between border-b border-[#111110]/5 py-3 last:border-b-0">
    <div>
      <p class="text-sm font-medium text-[#111110]">{{ name }}</p>
      <p class="text-[11px] text-[#6B6A65]">ROI {{ roi }}pt/hr · 추천 {{ recommendedHours }}h</p>
      <span
        v-if="reduced"
        class="mt-1 inline-block rounded-full bg-[#FFF3C4] px-2 py-0.5 text-[10px] text-[#6b5400]"
      >
        근무시간 감축 안내
      </span>
    </div>
    <div class="text-right">
      <p class="text-sm font-semibold text-[#111110]">{{ expectedIncome.toLocaleString() }}원</p>
      <span class="rounded-full px-2 py-0.5 text-[10px] font-semibold" :class="badge.className">
        {{ badge.label }}
      </span>
    </div>
  </div>
</template>
