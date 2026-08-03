<!-- src/features/onboarding/components/OnboardingProgressBar.vue -->
<script setup>
import { useRouter } from 'vue-router'
import ChevronLeftIcon from '@/shared/components/icons/ChevronLeftIcon.vue'

defineProps({
  currentStep: { type: Number, required: true },
  totalSteps: { type: Number, default: 3 },
})

const router = useRouter()
</script>

<template>
  <div class="flex h-[72px] items-center bg-white px-2">
    <button
      type="button"
      class="flex size-10 items-center justify-center rounded-full"
      @click="router.back()"
    >
      <ChevronLeftIcon class="size-6 text-grey-500" />
    </button>
    <div class="flex flex-1 items-center justify-center gap-1.5">
      <span
        v-for="step in totalSteps"
        :key="step"
        class="h-1.5 rounded-full bg-primary-500 transition-all"
        :class="step === currentStep ? 'w-5' : step < currentStep ? 'w-1.5' : 'w-1.5 bg-[#dadada]'"
      />
    </div>
    <div class="size-10" />
  </div>
</template>
