<script setup>
import { onMounted } from 'vue'
import { useQueryClient } from '@tanstack/vue-query'
import BottomTabBar from './BottomTabBar.vue'
import { fetchUnreadCount } from '@/features/notification/api'
import { useToastStore } from '@/shared/store/toast'

const toastStore = useToastStore()
const queryClient = useQueryClient()

// 앱 마운트마다(최초 진입은 물론, 401로 인한 로그아웃 후 재로그인으로 AppLayout이
// 재마운트되는 경우까지 포함) 안읽음 알림 개수를 다시 확인해 토스트를 띄운다.
// queryClient.fetchQuery는 HomeView의 벨 배지 쿼리와 동일한 queryKey의 캐시가
// staleTime 이내로 신선하면 네트워크 요청 없이 캐시된 값을 그대로 반환하므로
// 중복 요청 없이 캐시를 공유하면서도, 매 마운트마다 값을 새로 평가할 수 있다.
// (useQuery + watch(once)는 캐시가 이미 채워진 상태로 재마운트되면 값이 곧바로
// 초기값으로 들어와 "변화"가 감지되지 않아 토스트가 뜨지 않는 문제가 있었다.)
// 조회 실패 시에는(에러는 이미 suppressErrorToast로 무시됨) 예외를 조용히 삼켜
// 토스트를 띄우지 않는다.
onMounted(async () => {
  let unreadCount
  try {
    unreadCount = await queryClient.fetchQuery({
      queryKey: ['notifications', 'unread-count'],
      queryFn: fetchUnreadCount,
    })
  } catch {
    return
  }

  if (unreadCount > 0) {
    toastStore.show(`확인하지 않은 알림이 ${unreadCount}개 있어요`)
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
