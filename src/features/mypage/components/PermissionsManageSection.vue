<!-- src/features/mypage/components/PermissionsManageSection.vue -->
<script setup>
import { onMounted, ref, watch } from 'vue'
import { useQueryClient } from '@tanstack/vue-query'
import { useModalStore } from '@/shared/store/modal'
import AppHeader from '@/shared/components/AppHeader.vue'
import BrowserPermissionGuideModal from './BrowserPermissionGuideModal.vue'
import { updateProfile } from '../api'
import {
  queryPermissionStatus,
  requestGeolocationPermission,
  requestNotificationPermission,
} from '../utils/permission'

const props = defineProps({
  profile: { type: Object, default: null },
})

defineEmits(['back'])

const queryClient = useQueryClient()
const modalStore = useModalStore()

// DB 동의값(Agree)은 실제 브라우저 권한(browserStatus)을 그대로 따라간다 — 앱 안에서 동의만
// 별도로 껐다 켰다 할 수 있는 독립적인 상태가 아니다. browserStatus가 'granted'/'denied'로
// 확정될 때만 reconcileAgreement가 Agree를 그 값에 맞춰 DB에 반영한다('prompt'/'unsupported'는
// 아직 확정된 상태가 아니라 건드리지 않음). 브라우저 권한 자체는 JS로 되돌릴 수 없으므로, 이미
// 켜진 상태에서 끄기를 누르면 상태를 바꾸지 않고 브라우저 설정으로 안내만 한다 — 실제로 취소되기
// 전에 DB만 먼저 바꾸면 화면과 실제 권한 상태가 어긋나기 때문이다.
const locationBrowserStatus = ref('prompt')
const notificationBrowserStatus = ref('prompt')
const locationAgree = ref(props.profile?.locationAgree ?? false)
const alarmAgree = ref(props.profile?.alarmAgree ?? false)

watch(
  () => props.profile,
  (profile) => {
    if (!profile) return
    locationAgree.value = profile.locationAgree
    alarmAgree.value = profile.alarmAgree
    reconcileAgreement('locationAgree', locationBrowserStatus, locationAgree)
    reconcileAgreement('alarmAgree', notificationBrowserStatus, alarmAgree)
  },
)

onMounted(async () => {
  locationBrowserStatus.value = await queryPermissionStatus('geolocation')
  notificationBrowserStatus.value = await queryPermissionStatus('notifications')
  reconcileAgreement('locationAgree', locationBrowserStatus, locationAgree)
  reconcileAgreement('alarmAgree', notificationBrowserStatus, alarmAgree)
})

// PUT은 전체 교체라 name/email/다른 쪽 동의값을 함께 보내 덮어쓰지 않도록 한다. profile이 아직
// 로딩되지 않았으면 이번 동기화는 건너뛴다 — 토글 자체는 이미 반영된 상태라 UX엔 영향 없음.
async function syncAgreement(field, value) {
  if (!props.profile) return
  await updateProfile({
    name: props.profile.name,
    email: props.profile.email,
    alarmAgree: alarmAgree.value,
    locationAgree: locationAgree.value,
    [field]: value,
  })
  queryClient.invalidateQueries({ queryKey: ['mypage', 'profile'] })
}

// browserStatus가 확정된 값('granted'/'denied')일 때만 Agree를 그 값에 맞춰 DB에 동기화한다.
// 방향 무관하게 동일 로직 — 브라우저가 허용이면 true로, 취소면 false로 맞춘다. browserStatus/profile
// 중 어느 쪽이 먼저 로딩되든 처리되도록 두 completion 지점(onMounted, profile watch)에서 각각
// 호출하며, 이미 일치하면 아무 것도 하지 않는다. 'prompt'/'unsupported'는 아직 확정된 상태가
// 아니라 건드리지 않는다.
async function reconcileAgreement(field, browserStatusRef, agreeRef) {
  if (browserStatusRef.value === 'granted' && !agreeRef.value) {
    agreeRef.value = true
    await syncAgreement(field, true)
  } else if (browserStatusRef.value === 'denied' && agreeRef.value) {
    agreeRef.value = false
    await syncAgreement(field, false)
  }
}

async function toggleLocation() {
  if (locationBrowserStatus.value === 'denied' || locationBrowserStatus.value === 'unsupported') {
    return
  }

  // 이미 켜진 상태(=브라우저가 이미 허용)에서 끄기를 누른 경우: 브라우저 권한 자체는 JS로
  // 취소할 수 없으므로 상태는 그대로 두고 안내만 띄운다. 실제로 브라우저에서 취소하면 다음
  // 방문 시 reconcileAgreement가 DB를 false로 맞춘다.
  if (locationAgree.value) {
    await modalStore.open(BrowserPermissionGuideModal, { permission: 'location' })
    return
  }

  if (locationBrowserStatus.value !== 'granted') {
    await requestGeolocationPermission()
    locationBrowserStatus.value = await queryPermissionStatus('geolocation')
  }
  await reconcileAgreement('locationAgree', locationBrowserStatus, locationAgree)
}

async function toggleNotification() {
  if (
    notificationBrowserStatus.value === 'denied' ||
    notificationBrowserStatus.value === 'unsupported'
  ) {
    return
  }

  // 이미 켜진 상태(=브라우저가 이미 허용)에서 끄기를 누른 경우: 브라우저 권한 자체는 JS로
  // 취소할 수 없으므로 상태는 그대로 두고 안내만 띄운다. 실제로 브라우저에서 취소하면 다음
  // 방문 시 reconcileAgreement가 DB를 false로 맞춘다.
  if (alarmAgree.value) {
    await modalStore.open(BrowserPermissionGuideModal, { permission: 'notification' })
    return
  }

  if (notificationBrowserStatus.value !== 'granted') {
    const result = await requestNotificationPermission()
    notificationBrowserStatus.value = result === 'default' ? 'prompt' : result
  }
  await reconcileAgreement('alarmAgree', notificationBrowserStatus, alarmAgree)
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
          <p v-if="locationBrowserStatus === 'denied'" class="mt-1 text-[10px] text-grey-300">
            브라우저 설정에서 권한을 허용해 주세요.
          </p>
          <p
            v-else-if="locationBrowserStatus === 'unsupported'"
            class="mt-1 text-[10px] text-grey-300"
          >
            이 브라우저에서는 지원하지 않아요.
          </p>
          <p v-else-if="locationBrowserStatus === 'granted'" class="mt-1 text-[10px] text-grey-300">
            브라우저 자체 권한을 완전히 차단하려면 브라우저 설정에서 변경해 주세요.
          </p>
        </div>
        <button
          type="button"
          role="switch"
          :aria-checked="locationAgree"
          :disabled="locationBrowserStatus === 'denied' || locationBrowserStatus === 'unsupported'"
          class="relative h-6 w-11 shrink-0 rounded-full transition-colors disabled:opacity-60"
          :class="locationAgree ? 'bg-primary-500' : 'bg-grey-100'"
          @click="toggleLocation"
        >
          <span
            class="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform"
            :class="locationAgree ? 'translate-x-5' : 'translate-x-0'"
          />
        </button>
      </div>

      <div
        class="flex items-center justify-between rounded-2xl border border-grey-50 bg-grey-white px-4 py-4"
      >
        <div>
          <p class="text-body4 text-grey-500">알림 권한</p>
          <p v-if="notificationBrowserStatus === 'denied'" class="mt-1 text-[10px] text-grey-300">
            브라우저 설정에서 권한을 허용해 주세요.
          </p>
          <p
            v-else-if="notificationBrowserStatus === 'unsupported'"
            class="mt-1 text-[10px] text-grey-300"
          >
            이 브라우저에서는 지원하지 않아요.
          </p>
          <p
            v-else-if="notificationBrowserStatus === 'granted'"
            class="mt-1 text-[10px] text-grey-300"
          >
            브라우저 자체 권한을 완전히 차단하려면 브라우저 설정에서 변경해 주세요.
          </p>
        </div>
        <button
          type="button"
          role="switch"
          :aria-checked="alarmAgree"
          :disabled="
            notificationBrowserStatus === 'denied' || notificationBrowserStatus === 'unsupported'
          "
          class="relative h-6 w-11 shrink-0 rounded-full transition-colors disabled:opacity-60"
          :class="alarmAgree ? 'bg-primary-500' : 'bg-grey-100'"
          @click="toggleNotification"
        >
          <span
            class="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform"
            :class="alarmAgree ? 'translate-x-5' : 'translate-x-0'"
          />
        </button>
      </div>
    </div>
  </div>
</template>
