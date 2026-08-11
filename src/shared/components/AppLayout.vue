<script setup>
import { watch } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import BottomTabBar from './BottomTabBar.vue'
import { fetchUnreadCount } from '@/features/notification/api'
import { useToastStore } from '@/shared/store/toast'

const toastStore = useToastStore()

const { data: unreadCount } = useQuery({
  queryKey: ['notifications', 'unread-count'],
  queryFn: fetchUnreadCount,
})

// 앱 마운트당 최초 1회만 토스트를 띄운다 — 이후 백그라운드 refetch로 데이터가
// 갱신되더라도 다시 띄우지 않는다. 조회 실패 시에는 값이 바뀌지 않으므로
// (에러는 이미 suppressErrorToast로 무시됨) 콜백이 아예 실행되지 않아 조용히 무시된다.
watch(
  unreadCount,
  (count) => {
    if (count > 0) {
      toastStore.show(`확인하지 않은 알림이 ${count}개 있어요`)
    }
  },
  { once: true },
)
</script>

<template>
  <div class="flex min-h-screen flex-col bg-grey-white">
    <main class="flex-1 overflow-y-auto pb-[84px]">
      <router-view />
    </main>
    <BottomTabBar />
  </div>
</template>
