<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from './store'
import { useToastStore } from '@/shared/store/toast'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const toastStore = useToastStore()

onMounted(async () => {
  const { code, state } = route.query

  if (!code || !state) {
    router.replace({ name: 'login' })
    return
  }

  try {
    const user = await authStore.loginWithOAuth(state, code)
    router.replace(user.onboardingCompleted ? { name: 'home' } : { name: 'onboarding-account' })
  } catch {
    toastStore.show('로그인 처리 중 오류가 발생했어요.')
    router.replace({ name: 'login' })
  }
})
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-[#F3F1EC]">
    <p class="text-gray-500">로그인 처리 중...</p>
  </div>
</template>
