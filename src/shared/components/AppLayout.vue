<script setup>
import { onMounted } from 'vue'
import BottomTabBar from './BottomTabBar.vue'
import { fetchUnreadCount } from '@/features/notification/api'
import { useToastStore } from '@/shared/store/toast'

const toastStore = useToastStore()

onMounted(async () => {
  try {
    const unreadCount = await fetchUnreadCount()
    if (unreadCount > 0) {
      toastStore.show(`확인하지 않은 알림이 ${unreadCount}개 있어요`)
    }
  } catch {
    // 진입 직후 백그라운드 조회 실패는 조용히 무시 — 에러 토스트로 사용자를 방해하지 않는다
  }
})
</script>

<template>
  <div class="flex min-h-screen flex-col bg-grey-white">
    <main class="flex-1 overflow-y-auto pb-[84px]">
      <router-view />
    </main>
    <BottomTabBar />
  </div>
</template>
