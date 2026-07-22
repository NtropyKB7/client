<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from './store'

const router = useRouter()
const authStore = useAuthStore()

onMounted(async () => {
  const success = await authStore.tryRefresh()
  if (success) {
    router.replace({ name: 'home' })
  } else {
    router.replace({ name: 'login' })
  }
})
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-[#F3F1EC]">
    <p class="text-gray-500">로그인 처리 중...</p>
  </div>
</template>
