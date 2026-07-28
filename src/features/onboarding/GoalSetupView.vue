<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useOnboardingStore } from './store'
import { calculateAchievableRange } from './api'
import RangeSlider from './components/RangeSlider.vue'
import Button from '@/shared/components/Button.vue'

const router = useRouter()
const onboardingStore = useOnboardingStore()

const amount = ref(onboardingStore.goal.amount)
const fatigue = ref(onboardingStore.goal.fatigue)

const FATIGUE_LABELS = ['매우 가벼움', '가벼움', '보통', '힘듦', '매우 힘듦']

const achievableRange = computed(() => calculateAchievableRange(amount.value, fatigue.value))

function formatWon(value) {
  return `${Math.round(value / 10000)}만원`
}

function submit() {
  onboardingStore.setGoal({ amount: amount.value, fatigue: fatigue.value })
  onboardingStore.complete()
  router.push({ name: 'home' })
}
</script>

<template>
  <div class="flex min-h-screen flex-col gap-8 bg-[#F3F1EC] px-6 py-10">
    <div>
      <h1 class="text-lg font-semibold text-[#111110]">저축목표 설정</h1>
      <p class="mt-1 text-xs text-[#6B6A65]">
        목표 금액과 감내 가능한 노동 강도를 설정하면, 잡별 추천 근무시간을 계산해 드려요.
      </p>
    </div>

    <RangeSlider
      v-model="amount"
      label="월 저축 목표 금액"
      :min="1500000"
      :max="3500000"
      :step="100000"
      :format-value="formatWon"
    />

    <div>
      <p class="text-xs text-[#6B6A65]">감내 가능한 노동 피로도 (1~5)</p>
      <div class="mt-1 flex gap-2">
        <button
          v-for="level in 5"
          :key="level"
          type="button"
          class="h-9 flex-1 rounded-lg border text-sm font-medium"
          :class="
            fatigue === level
              ? 'border-[#E0B400] text-[#E0B400]'
              : 'border-[#111110]/10 text-[#6B6A65]'
          "
          @click="fatigue = level"
        >
          {{ level }}
        </button>
      </div>
      <p class="mt-1 text-xs text-[#E0B400]">{{ FATIGUE_LABELS[fatigue - 1] }}</p>
    </div>

    <p class="rounded-lg bg-[#FFF3C4] px-4 py-3 text-xs text-[#6b5400]">
      현재 조건에서 달성 가능한 범위는 {{ formatWon(achievableRange.min) }} ~
      {{ formatWon(achievableRange.max) }} 입니다.
    </p>

    <Button class="mt-auto" @click="submit">목표 설정 완료</Button>
  </div>
</template>
