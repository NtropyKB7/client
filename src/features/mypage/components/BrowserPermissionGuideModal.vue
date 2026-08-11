<!-- src/features/mypage/components/BrowserPermissionGuideModal.vue -->
<script setup>
import { computed } from 'vue'
import { useModalStore } from '@/shared/store/modal'
import { useToastStore } from '@/shared/store/toast'
import { getBrowserSettingsGuide } from '../utils/permission'
import Button from '@/shared/components/Button.vue'

const props = defineProps({
  // 'location' | 'notification'
  permission: { type: String, required: true },
})

const modalStore = useModalStore()
const toastStore = useToastStore()

const guide = computed(() => getBrowserSettingsGuide(props.permission))
const permissionLabel = computed(() => (props.permission === 'location' ? '위치' : '알림'))

async function copySettingsPath() {
  if (!guide.value.copyText) return
  try {
    await navigator.clipboard.writeText(guide.value.copyText)
    toastStore.show('주소를 복사했어요. 주소창에 붙여넣어 주세요.')
  } catch {
    // 클립보드 접근 실패(권한 없음 등) 시 무시 — 사용자가 직접 주소를 옮겨 적을 수 있음
  }
}

function close() {
  modalStore.close()
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <h2 class="text-center text-base font-semibold text-[#111110]">
      {{ guide.browserLabel }}에서 {{ permissionLabel }} 권한 변경하기
    </h2>
    <p class="text-center text-sm text-[#6B6A65]">
      앱 안에서는 {{ permissionLabel }} 권한 자체를 끌 수 없어요. 브라우저에서 직접 변경해 주세요.
    </p>

    <ol class="flex flex-col gap-2 rounded-xl bg-grey-30 p-4">
      <li v-for="(step, index) in guide.steps" :key="index" class="text-sm text-[#111110]">
        {{ index + 1 }}. {{ step }}
      </li>
    </ol>

    <div
      v-if="guide.copyText"
      class="flex items-center justify-between rounded-xl bg-grey-30 px-3.5 py-3"
    >
      <span class="truncate text-sm text-[#6B6A65]">{{ guide.copyText }}</span>
      <button
        type="button"
        class="shrink-0 text-sm font-semibold text-primary-600"
        @click="copySettingsPath"
      >
        복사
      </button>
    </div>

    <Button variant="outline" @click="close">확인</Button>
  </div>
</template>
