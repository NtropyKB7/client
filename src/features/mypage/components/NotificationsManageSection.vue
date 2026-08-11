<!-- src/features/mypage/components/NotificationsManageSection.vue -->
<script setup>
import { useQuery, useQueryClient } from '@tanstack/vue-query'
import { useRouter } from 'vue-router'
import {
  fetchNotifications,
  markNotificationRead,
  deleteNotification,
} from '@/features/notification/api'
import { formatDateKey } from '@/features/calendar/utils'
import AppHeader from '@/shared/components/AppHeader.vue'
import ProfileHeader from './ProfileHeader.vue'

defineProps({
  profile: { type: Object, default: null },
})

defineEmits(['back'])

const router = useRouter()
const queryClient = useQueryClient()

const { data, isLoading } = useQuery({
  queryKey: ['notifications', 'list'],
  queryFn: () => fetchNotifications({ page: 0, size: 20 }),
})

function toDateLabel(createdAt) {
  return createdAt ? createdAt.slice(0, 10) : ''
}

function invalidateNotificationQueries() {
  queryClient.invalidateQueries({ queryKey: ['notifications', 'list'] })
  queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] })
}

async function openNotification(notification) {
  await markNotificationRead(notification.notificationId)
  invalidateNotificationQueries()

  const dateKey = formatDateKey(new Date(notification.createdAt))
  router.push({ name: 'calendar', query: { date: dateKey, autoConfirm: '1' } })
}

async function removeNotification(notificationId) {
  await deleteNotification(notificationId)
  invalidateNotificationQueries()
}
</script>

<template>
  <div class="flex flex-col">
    <AppHeader back title="마이페이지" @back="$emit('back')" />

    <div class="flex flex-col gap-4 px-4 pt-5 pb-6">
      <ProfileHeader v-if="profile" :profile="profile" />

      <p v-if="isLoading" class="text-caption text-grey-300">불러오는 중...</p>

      <p v-else-if="!data?.notifications?.length" class="text-caption text-grey-300">
        알림 기록이 없어요.
      </p>

      <div v-else class="flex flex-col gap-3">
        <div
          v-for="notification in data.notifications"
          :key="notification.notificationId"
          class="cursor-pointer rounded-2xl border border-grey-50 bg-grey-white p-4"
          @click="openNotification(notification)"
        >
          <div class="flex items-start gap-1.5">
            <span
              v-if="!notification.readAt"
              class="mt-1.5 size-2 shrink-0 rounded-full bg-[#e53d33]"
              aria-hidden="true"
            />
            <p
              class="text-body3"
              :class="notification.readAt ? 'text-grey-300' : 'font-semibold text-grey-500'"
            >
              {{ notification.title }}
            </p>
          </div>
          <div class="mt-3 flex flex-col gap-1.5">
            <p class="text-caption text-grey-300">{{ notification.body }}</p>
            <p class="text-caption text-grey-300">{{ toDateLabel(notification.createdAt) }}</p>
          </div>
          <div class="mt-3 flex justify-end border-t border-grey-50 pt-2.5">
            <button
              type="button"
              class="text-caption text-[#e53d33]"
              @click.stop="removeNotification(notification.notificationId)"
            >
              삭제하기
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
