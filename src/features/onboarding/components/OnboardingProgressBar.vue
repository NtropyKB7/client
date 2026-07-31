<!-- src/features/onboarding/components/OnboardingProgressBar.vue -->
<script setup>
defineProps({
  currentStep: { type: Number, required: true },
  totalSteps: { type: Number, default: 3 },
  stepLabel: { type: String, required: true },
})
</script>

<template>
  <div>
    <div class="flex gap-1">
      <span
        v-for="step in totalSteps"
        :key="step"
        class="h-1 flex-1 rounded-full"
        :class="step <= currentStep ? 'bg-[#111110]' : 'bg-[#111110]/10'"
      />
    </div>
    <p class="mt-2 text-xs font-medium text-[#6B6A65]">
      {{ currentStep }}/{{ totalSteps }} <span class="text-[#111110]">{{ stepLabel }}</span>
    </p>
  </div>
</template>
