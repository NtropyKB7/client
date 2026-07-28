<script setup>
defineProps({
  modelValue: { type: Number, required: true },
  min: { type: Number, required: true },
  max: { type: Number, required: true },
  step: { type: Number, default: 1 },
  label: { type: String, required: true },
  formatValue: { type: Function, default: (v) => String(v) },
})

defineEmits(['update:modelValue'])
</script>

<template>
  <div>
    <div class="mb-1 flex items-center justify-between text-xs text-[#6B6A65]">
      <span>{{ label }}</span>
      <span class="font-semibold text-[#111110]">{{ formatValue(modelValue) }}</span>
    </div>
    <input
      :value="modelValue"
      type="range"
      :min="min"
      :max="max"
      :step="step"
      class="w-full accent-[#FFCC00]"
      @input="$emit('update:modelValue', Number($event.target.value))"
    />
  </div>
</template>
