<!-- src/features/mypage/components/NotificationsManageSection.vue -->
<script setup>
import { watch } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { fetchNotifications } from '../api'
import { useMypageStore } from '../store'
import SectionHeader from './SectionHeader.vue'

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
  <div class="flex flex-col gap-4">
    <SectionHeader
      title="알림 기록 관리"
      description="이전 알림을 재확인 및 삭제 할 수 있습니다."
      @back="$emit('back')"
    />

    <p v-if="mypageStore.notifications === null" class="text-sm text-[#6B6A65]">불러오는 중...</p>

    <p v-else-if="mypageStore.notifications.length === 0" class="text-sm text-[#6B6A65]">
      알림 기록이 없어요.
    </p>

    <div v-else class="flex flex-col gap-3">
      <div
        v-for="notification in mypageStore.notifications"
        :key="notification.id"
        class="rounded-xl border border-[#111110]/10 bg-white p-4"
      >
        <p class="text-sm font-semibold text-[#111110]">{{ notification.title }}</p>
        <p class="mt-2 text-xs text-[#6B6A65]">{{ notification.timeRangeLabel }}</p>
        <p class="text-xs text-[#6B6A65]">{{ notification.detailLabel }}</p>
        <p class="text-xs text-[#6B6A65]">{{ notification.fatigueLabel }}</p>
        <div class="mt-2 flex justify-end border-t border-[#111110]/5 pt-2">
          <button
            type="button"
            class="text-xs text-[#6B6A65] underline"
            @click="mypageStore.removeNotification(notification.id)"
          >
            삭제하기
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
