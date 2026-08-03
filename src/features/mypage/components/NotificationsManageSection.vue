<!-- src/features/mypage/components/NotificationsManageSection.vue -->
<script setup>
import { watch } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { fetchNotifications } from '../api'
import { useMypageStore } from '../store'
import AppHeader from '@/shared/components/AppHeader.vue'

defineEmits(['back'])

const mypageStore = useMypageStore()

const { data } = useQuery({
  queryKey: ['mypage', 'notifications'],
  queryFn: fetchNotifications,
})

watch(data, (value) => {
  if (value) mypageStore.initNotifications(value)
})
</script>

<template>
  <div class="flex flex-col">
    <AppHeader back title="마이페이지" @back="$emit('back')" />

    <div class="flex flex-col gap-4 px-4 pt-5 pb-6">
      <p v-if="mypageStore.notifications === null" class="text-caption text-grey-300">
        불러오는 중...
      </p>

      <p v-else-if="mypageStore.notifications.length === 0" class="text-caption text-grey-300">
        알림 기록이 없어요.
      </p>

      <div v-else class="flex flex-col gap-3">
        <div
          v-for="notification in mypageStore.notifications"
          :key="notification.id"
          class="rounded-2xl border border-grey-50 bg-grey-white p-4"
        >
          <p class="text-body3 text-grey-500">{{ notification.title }}</p>
          <div class="mt-3 flex flex-col gap-1.5">
            <p class="text-caption text-grey-300">{{ notification.timeRangeLabel }}</p>
            <p class="text-caption text-grey-300">{{ notification.detailLabel }}</p>
            <p class="text-caption text-grey-300">{{ notification.fatigueLabel }}</p>
          </div>
          <div class="mt-3 flex justify-end border-t border-grey-50 pt-2.5">
            <button
              type="button"
              class="text-caption text-[#e53d33]"
              @click="mypageStore.removeNotification(notification.id)"
            >
              삭제하기
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
