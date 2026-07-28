<script setup>
import { computed } from 'vue'

const props = defineProps({
  percent: { type: Number, required: true },
  colorClass: { type: String, default: 'text-[#111110]' },
})

const RADIUS = 28
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

const dashOffset = computed(() => {
  const clamped = Math.min(100, Math.max(0, props.percent))
  return CIRCUMFERENCE - (clamped / 100) * CIRCUMFERENCE
})
</script>

<template>
  <div class="relative flex h-20 w-20 items-center justify-center">
    <svg class="h-20 w-20 -rotate-90" viewBox="0 0 64 64">
      <circle cx="32" cy="32" r="28" fill="none" stroke="#F3F1EC" stroke-width="6" />
      <circle
        cx="32"
        cy="32"
        r="28"
        fill="none"
        stroke-width="6"
        stroke-linecap="round"
        class="stroke-current"
        :class="colorClass"
        :stroke-dasharray="CIRCUMFERENCE"
        :stroke-dashoffset="dashOffset"
      />
    </svg>
    <div class="absolute inset-0 flex items-center justify-center text-center">
      <slot />
    </div>
  </div>
</template>
