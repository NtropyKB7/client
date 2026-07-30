<!-- src/features/mypage/components/PermissionsManageSection.vue -->
<script setup>
import { onMounted, ref } from 'vue'
import SectionHeader from './SectionHeader.vue'
import {
  queryPermissionStatus,
  requestGeolocationPermission,
  requestNotificationPermission,
} from '../utils/permission'

defineEmits(['back'])

const locationStatus = ref('prompt')
const notificationStatus = ref('prompt')

onMounted(async () => {
  locationStatus.value = await queryPermissionStatus('geolocation')
  notificationStatus.value = await queryPermissionStatus('notifications')
})

async function toggleLocation() {
  if (locationStatus.value === 'granted') return
  await requestGeolocationPermission()
  locationStatus.value = await queryPermissionStatus('geolocation')
}

async function toggleNotification() {
  if (notificationStatus.value === 'granted') return
  const result = await requestNotificationPermission()
  notificationStatus.value = result === 'default' ? 'prompt' : result
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <SectionHeader
      title="권한 관리"
      description="권한별 설정을 진행할 수 있습니다."
      @back="$emit('back')"
    />

    <div class="flex flex-col gap-2">
      <div
        class="flex items-center justify-between rounded-xl border border-[#111110]/10 bg-white px-4 py-4"
      >
        <div>
          <p class="text-sm text-[#111110]">위치 권한</p>
          <p v-if="locationStatus === 'denied'" class="mt-1 text-[10px] text-[#6B6A65]">
            브라우저 설정에서 권한을 허용해 주세요.
          </p>
          <p v-else-if="locationStatus === 'granted'" class="mt-1 text-[10px] text-[#6B6A65]">
            브라우저 설정에서만 변경할 수 있어요.
          </p>
        </div>
        <button
          type="button"
          role="switch"
          :aria-checked="locationStatus === 'granted'"
          :disabled="locationStatus === 'granted'"
          class="relative h-6 w-11 shrink-0 rounded-full transition-colors disabled:opacity-60"
          :class="locationStatus === 'granted' ? 'bg-[#111110]' : 'bg-[#111110]/15'"
          @click="toggleLocation"
        >
          <span
            class="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform"
            :class="locationStatus === 'granted' ? 'translate-x-5' : 'translate-x-0'"
          />
        </button>
      </div>

      <div
        class="flex items-center justify-between rounded-xl border border-[#111110]/10 bg-white px-4 py-4"
      >
        <div>
          <p class="text-sm text-[#111110]">알림 권한</p>
          <p v-if="notificationStatus === 'denied'" class="mt-1 text-[10px] text-[#6B6A65]">
            브라우저 설정에서 권한을 허용해 주세요.
          </p>
          <p v-else-if="notificationStatus === 'granted'" class="mt-1 text-[10px] text-[#6B6A65]">
            브라우저 설정에서만 변경할 수 있어요.
          </p>
        </div>
        <button
          type="button"
          role="switch"
          :aria-checked="notificationStatus === 'granted'"
          :disabled="notificationStatus === 'granted'"
          class="relative h-6 w-11 shrink-0 rounded-full transition-colors disabled:opacity-60"
          :class="notificationStatus === 'granted' ? 'bg-[#111110]' : 'bg-[#111110]/15'"
          @click="toggleNotification"
        >
          <span
            class="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform"
            :class="notificationStatus === 'granted' ? 'translate-x-5' : 'translate-x-0'"
          />
        </button>
      </div>
    </div>
  </div>
</template>
