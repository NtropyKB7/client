<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: Number, required: true },
  min: { type: Number, required: true },
  max: { type: Number, required: true },
  step: { type: Number, default: 1 },
  label: { type: String, required: true },
  formatValue: { type: Function, default: (v) => String(v) },
  recommendedMin: { type: Number, default: null },
  recommendedMax: { type: Number, default: null },
})

defineEmits(['update:modelValue'])

function percent(value) {
  return ((value - props.min) / (props.max - props.min)) * 100
}

const fillPercent = computed(() => percent(props.modelValue))
const recommendedStartPercent = computed(() =>
  props.recommendedMin === null ? 0 : percent(props.recommendedMin),
)
const recommendedWidthPercent = computed(() =>
  props.recommendedMin === null || props.recommendedMax === null
    ? 0
    : percent(props.recommendedMax) - percent(props.recommendedMin),
)
</script>

<template>
  <div>
    <div class="mb-2 flex items-center justify-between">
      <span class="text-caption text-grey-400">{{ label }}</span>
      <span class="text-head1 text-grey-500">{{ formatValue(modelValue) }}</span>
    </div>

    <div class="relative flex h-2 items-center">
      <div class="absolute inset-x-0 h-2 rounded-full bg-grey-50" />
      <div
        v-if="recommendedMin !== null && recommendedMax !== null"
        class="absolute h-2 rounded-full bg-primary-50"
        :style="{ left: `${recommendedStartPercent}%`, width: `${recommendedWidthPercent}%` }"
      />
      <div class="absolute h-2 rounded-full bg-primary-500" :style="{ width: `${fillPercent}%` }" />
      <input
        :value="modelValue"
        type="range"
        :min="min"
        :max="max"
        :step="step"
        class="relative w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:size-[22px] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary-500 [&::-webkit-slider-thumb]:bg-grey-white [&::-webkit-slider-thumb]:shadow [&::-moz-range-thumb]:size-[22px] [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary-500 [&::-moz-range-thumb]:bg-grey-white"
        @input="$emit('update:modelValue', Number($event.target.value))"
      />
    </div>

    <div class="mt-2 flex items-center justify-between text-caption text-grey-400">
      <span>{{ formatValue(min) }}</span>
      <span
        v-if="recommendedMin !== null && recommendedMax !== null"
        class="font-medium text-primary-800"
      >
        달성 가능 {{ formatValue(recommendedMin) }}~{{ formatValue(recommendedMax) }}
      </span>
      <span>{{ formatValue(max) }}</span>
    </div>
  </div>
</template>
