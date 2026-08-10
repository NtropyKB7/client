<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useOnboardingStore } from './store'
import { useAuthStore } from '@/features/auth/store'
import { calculateAchievableRange, createSavingGoal, currentTargetMonth } from './api'
import RangeSlider from './components/RangeSlider.vue'
import OnboardingProgressBar from './components/OnboardingProgressBar.vue'
import Button from '@/shared/components/Button.vue'

const router = useRouter()
const onboardingStore = useOnboardingStore()
const authStore = useAuthStore()

const amount = ref(onboardingStore.goal.amount)
const fatigue = ref(onboardingStore.goal.fatigue)
const isSubmitting = ref(false)

const achievableRange = computed(() => calculateAchievableRange(amount.value, fatigue.value))

function formatWon(value) {
  return `${Math.round(value / 10000)}만원`
}

async function submit() {
  isSubmitting.value = true
  try {
    // 실패하면(네트워크/검증 오류) 여기서 던져 아래 온보딩 완료 처리로 넘어가지 않는다 — 에러
    // 토스트는 axiosInstance 응답 인터셉터가 자동으로 띄운다. 버튼은 finally에서 다시 활성화된다.
    const { savingGoalId } = await createSavingGoal({
      targetAmount: amount.value,
      laborIntensity: fatigue.value,
      targetMonth: currentTargetMonth(),
    })
    onboardingStore.setGoal({ amount: amount.value, fatigue: fatigue.value, savingGoalId })
    // 온보딩 완료 여부는 서버가 판단한다(회원/인증 API 스코프엔 별도 완료 API가 없음) — /auth/me를
    // 재조회해 라우터 가드가 최신 onboardingCompleted를 보게 만든다.
    await authStore.fetchMe()
    router.push({ name: 'home' })
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="flex min-h-screen flex-col bg-grey-white">
    <OnboardingProgressBar :current-step="3" />

    <div class="flex flex-1 flex-col gap-6 px-4 pb-8 pt-8">
      <div>
        <h1 class="text-head1 text-grey-500">이번 달 목표를 정해볼까요?</h1>
        <p class="mt-2 text-body4 text-grey-400">
          현재 수입 흐름을 바탕으로 무리 없이 달성 가능한<br />
          범위를 추천했어요.
        </p>
      </div>

      <div class="rounded-[20px] border border-grey-50 p-4">
        <RangeSlider
          v-model="amount"
          label="목표 금액"
          :min="1500000"
          :max="3500000"
          :step="100000"
          :format-value="formatWon"
          :recommended-min="achievableRange.min"
          :recommended-max="achievableRange.max"
        />
        <p class="mt-3 text-caption text-grey-400">
          금액을 움직이면 예상 근무시간도 함께 바뀌어요.
        </p>
      </div>

      <div class="rounded-[20px] border border-grey-50 p-4">
        <p class="text-body1 text-grey-500">원하는 노동 강도</p>
        <p class="mt-1 text-caption text-grey-400">낮을수록 여유롭게 일정을 추천해요</p>

        <div class="mt-4 flex gap-2">
          <button
            v-for="level in 5"
            :key="level"
            type="button"
            class="h-12 flex-1 rounded-2xl text-body1"
            :class="
              fatigue === level ? 'bg-primary-500 text-grey-white' : 'bg-grey-30 text-grey-400'
            "
            @click="fatigue = level"
          >
            {{ level }}
          </button>
        </div>
        <div class="mt-2 grid grid-cols-5 text-center text-caption font-bold text-[#ED6B14]">
          <span>여유</span>
          <span></span>
          <span>보통</span>
          <span></span>
          <span>힘듦</span>
        </div>
      </div>

      <div class="rounded-2xl border border-grey-50 p-4">
        <p class="text-body4 font-bold text-grey-500">근무 시간 추천 기준에 반영돼요</p>
        <p class="mt-2 text-caption text-grey-400">캘린더 일정과 피로도 추천에 사용돼요.</p>
      </div>

      <Button class="mt-auto" :disabled="isSubmitting" @click="submit">설정 완료</Button>
    </div>
  </div>
</template>
