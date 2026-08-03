<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import OnboardingProgressBar from './components/OnboardingProgressBar.vue'

const router = useRouter()
const phase = ref(1)

const STATUS_STEPS = [
  { label: '거래내역 안전하게 불러오기', step: 1 },
  { label: '소득으로 보이는 입금 찾기', step: 2 },
  { label: '잡별 수입 패턴 정리하기', step: 3 },
]

onMounted(() => {
  const timers = [
    setTimeout(() => (phase.value = 2), 600),
    setTimeout(() => (phase.value = 3), 1200),
    setTimeout(() => router.replace({ name: 'onboarding-job' }), 1800),
  ]
  return () => timers.forEach(clearTimeout)
})
</script>

<template>
  <div class="flex min-h-screen flex-col bg-grey-white">
    <OnboardingProgressBar :current-step="1" />

    <div class="flex flex-1 flex-col items-center px-4 pb-8 pt-10">
      <div
        class="relative flex size-[287px] items-center justify-center rounded-full bg-primary-50"
      >
        <span
          class="absolute left-0 top-14 rounded-xl bg-grey-white px-3 py-2.5 text-caption font-bold text-primary-800 shadow-sm"
        >
          + 20,000
        </span>
        <span
          class="absolute bottom-16 right-0 rounded-xl bg-grey-white px-3 py-2.5 text-caption font-bold text-primary-800 shadow-sm"
        >
          + 680,000
        </span>

        <div
          class="flex h-[88px] w-[126px] flex-col items-center justify-center gap-1.5 rounded-[18px] bg-grey-white"
        >
          <p class="text-[28px] font-bold tracking-[-0.02em] text-primary-800">₩</p>
          <p class="text-caption text-grey-400">거래내역 확인 중</p>
        </div>

        <div class="absolute bottom-9 flex gap-1.5">
          <span class="size-3 animate-pulse rounded-full bg-primary-500 [animation-duration:1s]" />
          <span
            class="size-3 animate-pulse rounded-full bg-primary-300 [animation-delay:200ms] [animation-duration:1s]"
          />
          <span
            class="size-3 animate-pulse rounded-full bg-primary-100 [animation-delay:400ms] [animation-duration:1s]"
          />
        </div>
      </div>

      <h1 class="mt-8 text-head1 text-grey-500">계좌 내역을 분석하고 있어요</h1>
      <p class="mt-2 text-center text-body4 text-grey-400">
        잡 후보와 수입 패턴을 찾고 있어요.<br />
        보통 10초 안에 완료돼요.
      </p>

      <div class="mt-6 flex w-full flex-col gap-2 rounded-2xl bg-grey-30 p-3.5">
        <p
          v-for="item in STATUS_STEPS"
          :key="item.step"
          class="text-caption"
          :class="
            phase > item.step
              ? 'font-medium text-primary-800'
              : phase === item.step
                ? 'font-medium text-grey-500'
                : 'text-grey-400'
          "
        >
          {{ phase > item.step ? '✓' : phase === item.step ? '●' : '○' }}
          {{ item.label }}
        </p>
      </div>

      <p class="mt-auto pt-8 text-center text-caption text-grey-400">
        앱을 닫아도 분석은 계속 진행돼요.
      </p>
    </div>
  </div>
</template>
