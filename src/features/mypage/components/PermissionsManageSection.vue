<!-- src/features/mypage/components/PermissionsManageSection.vue -->
<script setup>
import { onMounted, ref } from 'vue'
import AppHeader from '@/shared/components/AppHeader.vue'
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
  <div class="flex flex-col">
    <AppHeader back title="마이페이지" @back="$emit('back')" />

    <div class="flex flex-col gap-3 px-4 pt-5 pb-6">
      <div
        class="flex items-center justify-between rounded-2xl border border-grey-50 bg-grey-white px-4 py-4"
      >
        <div>
          <p class="text-body4 text-grey-500">위치 권한</p>
          <p v-if="locationStatus === 'denied'" class="mt-1 text-[10px] text-grey-300">
            브라우저 설정에서 권한을 허용해 주세요.
          </p>
          <p v-else-if="locationStatus === 'granted'" class="mt-1 text-[10px] text-grey-300">
            브라우저 설정에서만 변경할 수 있어요.
          </p>
        </div>
        <button
          type="button"
          role="switch"
          :aria-checked="locationStatus === 'granted'"
          :disabled="locationStatus === 'granted'"
          class="relative h-6 w-11 shrink-0 rounded-full transition-colors disabled:opacity-60"
          :class="locationStatus === 'granted' ? 'bg-primary-500' : 'bg-grey-100'"
          @click="toggleLocation"
        >
          <span
            class="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform"
            :class="locationStatus === 'granted' ? 'translate-x-5' : 'translate-x-0'"
          />
        </button>
      </div>

      <div
        class="flex items-center justify-between rounded-2xl border border-grey-50 bg-grey-white px-4 py-4"
      >
        <div>
          <p class="text-body4 text-grey-500">알림 권한</p>
          <p v-if="notificationStatus === 'denied'" class="mt-1 text-[10px] text-grey-300">
            브라우저 설정에서 권한을 허용해 주세요.
          </p>
          <p v-else-if="notificationStatus === 'granted'" class="mt-1 text-[10px] text-grey-300">
            브라우저 설정에서만 변경할 수 있어요.
          </p>
        </div>
        <button
          type="button"
          role="switch"
          :aria-checked="notificationStatus === 'granted'"
          :disabled="notificationStatus === 'granted'"
          class="relative h-6 w-11 shrink-0 rounded-full transition-colors disabled:opacity-60"
          :class="notificationStatus === 'granted' ? 'bg-primary-500' : 'bg-grey-100'"
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
