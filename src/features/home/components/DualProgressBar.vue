<script setup>
import { computed } from 'vue'

const props = defineProps({
  actual: { type: Number, required: true },
  planned: { type: Number, required: true },
  goal: { type: Number, required: true },
  plannedLabel: { type: String, required: true },
  formatValue: { type: Function, required: true },
  trackHeightClass: { type: String, default: 'h-2' },
})

function percentOf(value) {
  if (!props.goal) return 0
  return Math.min(100, (value / props.goal) * 100)
}

const actualPercent = computed(() => percentOf(props.actual))
const plannedPercent = computed(() => percentOf(props.planned))
</script>

<template>
  <div class="relative">
    <div
      class="absolute -top-8 -translate-x-1/2 rounded-[4px] bg-primary-600 px-2 py-1 text-caption font-semibold text-white transition-all"
      :style="{ left: `${actualPercent}%` }"
    >
      {{ formatValue(actual) }}
    </div>

    <div class="relative w-full overflow-hidden rounded-full bg-grey-50" :class="trackHeightClass">
      <div
        class="absolute inset-y-0 left-0 rounded-full bg-primary-100 transition-all"
        :style="{ width: `${plannedPercent}%` }"
      />
      <div
        class="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary-100 to-primary-600 transition-all"
        :style="{ width: `${actualPercent}%` }"
      />
    </div>

    <div
      class="absolute top-0 flex -translate-x-1/2 flex-col items-center"
      :style="{ left: `${plannedPercent}%` }"
    >
      <div class="h-2 w-px bg-primary-300" />
      <p class="mt-1 text-caption whitespace-nowrap text-grey-300">
        {{ plannedLabel }} {{ formatValue(planned) }}
      </p>
    </div>

    <div class="mt-1.5 flex justify-between text-body4 text-grey-300">
      <span>{{ formatValue(0) }}</span>
      <span>{{ formatValue(goal) }}</span>
    </div>
  </div>
</template>
