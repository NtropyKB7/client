<script setup>
import { computed } from 'vue'

const props = defineProps({
  name: { type: String, required: true },
  fatigue: { type: Number, required: true },
  roi: { type: Number, required: true },
  recommendedHours: { type: Number, required: true },
  expectedIncome: { type: Number, required: true },
  reduced: { type: Boolean, default: false },
})

const BAR_MAX_HOURS = 20

const barColorClass = computed(() => {
  const ratio = props.fatigue / 5
  if (ratio >= 0.8) return 'bg-red-500'
  if (ratio >= 0.5) return 'bg-amber-500'
  return 'bg-emerald-500'
})

const barWidthPercent = computed(() =>
  Math.min(100, (props.recommendedHours / BAR_MAX_HOURS) * 100),
)
</script>

<template>
  <div class="rounded-xl border border-[#111110]/10 bg-white p-4">
    <div class="flex items-center justify-between">
      <p class="text-sm font-semibold text-[#111110]">{{ name }}</p>
      <p class="text-sm font-semibold text-[#111110]">{{ recommendedHours }}h</p>
    </div>
    <div class="mt-1 flex items-center justify-between">
      <p class="text-[11px] text-[#6B6A65]">
        피로도 {{ fatigue }} · ROI {{ roi.toLocaleString() }}pt/hr
      </p>
      <p class="text-[11px] text-[#6B6A65]">{{ expectedIncome.toLocaleString() }}원</p>
    </div>
    <div class="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#F3F1EC]">
      <div
        class="h-full rounded-full"
        :class="barColorClass"
        :style="{ width: `${barWidthPercent}%` }"
      />
    </div>
    <p v-if="reduced" class="mt-2 text-[11px] text-red-500">⚠ 추천 시간 자동 감축됨</p>
  </div>
</template>
