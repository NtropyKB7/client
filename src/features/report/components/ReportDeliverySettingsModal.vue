<!-- src/features/report/components/ReportDeliverySettingsModal.vue -->
<script setup>
import { useModalStore } from '@/shared/store/modal'
import { useReportStore } from '../store'

const modalStore = useModalStore()
const reportStore = useReportStore()
</script>

<template>
  <div class="flex flex-col gap-4">
    <h2 class="text-center text-body1 text-grey-500">월간 리포트 받기</h2>
    <p class="text-center text-caption text-grey-300">
      리포트가 발행되면 선택한 채널로 알려드려요.
    </p>

    <div class="flex flex-col gap-2">
      <div
        class="flex items-center justify-between rounded-2xl border border-grey-50 bg-grey-white px-4 py-4"
      >
        <p class="text-body4 text-grey-500">카카오톡</p>
        <button
          type="button"
          role="switch"
          :aria-checked="reportStore.kakaoDelivery"
          class="relative h-6 w-11 shrink-0 rounded-full transition-colors"
          :class="reportStore.kakaoDelivery ? 'bg-primary-500' : 'bg-grey-100'"
          @click="reportStore.toggleKakaoDelivery"
        >
          <span
            class="absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow transition-transform"
            :class="reportStore.kakaoDelivery ? 'translate-x-5' : 'translate-x-0'"
          />
        </button>
      </div>

      <div
        class="flex items-center justify-between rounded-2xl border border-grey-50 bg-grey-white px-4 py-4"
      >
        <p class="text-body4 text-grey-500">이메일</p>
        <button
          type="button"
          role="switch"
          :aria-checked="reportStore.emailDelivery"
          class="relative h-6 w-11 shrink-0 rounded-full transition-colors"
          :class="reportStore.emailDelivery ? 'bg-primary-500' : 'bg-grey-100'"
          @click="reportStore.toggleEmailDelivery"
        >
          <span
            class="absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow transition-transform"
            :class="reportStore.emailDelivery ? 'translate-x-5' : 'translate-x-0'"
          />
        </button>
      </div>
    </div>

    <button
      type="button"
      class="rounded-xl bg-primary-500 py-3 text-body4 font-bold text-white"
      @click="modalStore.close()"
    >
      완료
    </button>
  </div>
</template>
