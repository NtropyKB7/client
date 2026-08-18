<!-- src/shared/components/AppHeader.vue -->
<script setup>
import { useRouter } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'
import BellIcon from './icons/BellIcon.vue'
import ChevronLeftIcon from './icons/ChevronLeftIcon.vue'
import { fetchUnreadCount } from '@/features/notification/api'

defineProps({
  title: { type: String, required: true },
  back: { type: Boolean, default: false },
})

defineEmits(['back'])

const router = useRouter()

const { data: unreadCount } = useQuery({
  queryKey: ['notifications', 'unread-count'],
  queryFn: fetchUnreadCount,
})

function goToNotifications() {
  router.push({ name: 'mypage', query: { view: 'notifications' } })
}
</script>

<template>
  <header
    class="sticky top-0 z-10 flex h-[52px] shrink-0 items-center justify-center border-b border-grey-50 bg-grey-white px-4"
  >
    <button
      v-if="back"
      type="button"
      aria-label="뒤로가기"
      class="absolute left-4 text-grey-500"
      @click="$emit('back')"
    >
      <ChevronLeftIcon class="size-6" />
    </button>
    <h1 class="truncate text-[15px] font-bold text-grey-500">{{ title }}</h1>
    <button
      v-if="!back"
      type="button"
      aria-label="알림"
      class="absolute right-4"
      @click="goToNotifications"
    >
      <BellIcon class="size-6 text-grey-500" />
      <span
        v-if="unreadCount > 0"
        class="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-[#e53d33]"
        aria-hidden="true"
      />
    </button>
  </header>
</template>
