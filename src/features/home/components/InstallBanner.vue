<script setup>
import { computed } from 'vue'
import { useInstallPromptStore } from '@/shared/store/installPrompt'
import CloseIcon from '@/shared/components/icons/CloseIcon.vue'

const installPromptStore = useInstallPromptStore()

const isVisible = computed(
  () =>
    !!installPromptStore.deferredPrompt &&
    !installPromptStore.isInstalled &&
    !installPromptStore.isDismissed,
)
</script>

<template>
  <div
    v-if="isVisible"
    class="flex items-center gap-3 bg-primary-50 px-4 py-3 text-body4 text-grey-500"
  >
    <p class="flex-1">홈화면에 추가하고 앱처럼 사용하세요</p>
    <button
      type="button"
      class="shrink-0 rounded-full bg-primary-500 px-3 py-1.5 text-caption font-semibold text-white"
      @click="installPromptStore.promptInstall()"
    >
      설치
    </button>
    <button
      type="button"
      aria-label="닫기"
      class="shrink-0 text-grey-300"
      @click="installPromptStore.dismiss()"
    >
      <CloseIcon class="size-5" />
    </button>
  </div>
</template>
