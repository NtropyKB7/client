<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from './store'
import Button from '@/shared/components/Button.vue'
import NtropyLogo from '@/shared/components/icons/NtropyLogo.vue'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
const router = useRouter()
const authStore = useAuthStore()

// 아래 두 경로는 Spring Security OAuth2 기본 컨벤션을 가정한 placeholder다.
// 백엔드의 실제 소셜 로그인 진입 경로가 확정되면 이 값만 바꾸면 된다.
// TEMP: apiBaseUrl이 비어있으면(백엔드 미연동) 실제 OAuth 대신 로컬 스텁으로 우회한다.
// VITE_API_BASE_URL이 채워지면 이 if 블록을 삭제하고 아래 실제 로직만 남길 것.
function loginWithKakao() {
  if (import.meta.env.DEV || !apiBaseUrl) {
    authStore.setAccessToken('debug')
    router.push({ name: 'home' })
    return
  }
  window.location.href = `${apiBaseUrl}/oauth2/authorization/kakao`
}

function loginWithGoogle() {
  if (import.meta.env.DEV || !apiBaseUrl) {
    authStore.setAccessToken('debug')
    router.push({ name: 'home' })
    return
  }
  window.location.href = `${apiBaseUrl}/oauth2/authorization/google`
}
</script>

<template>
  <div class="flex min-h-screen flex-col items-center justify-center gap-[14px] bg-white px-8">
    <NtropyLogo class="h-[22px] w-[72px] text-[#1A1A1A]" />

    <p class="pb-[14px] text-center text-[14px] leading-[1.6] tracking-[-0.02em] text-[#737373]">
      여러 개의 잡(Job), 한번에 관리.<br />
      무질서한 소득을 진단하고 자산으로 연결합니다.
    </p>

    <div class="flex w-full max-w-xs flex-col gap-[10px]">
      <Button pill variant="accent" @click="loginWithKakao">카카오로 3초만에 시작하기</Button>
      <Button pill variant="outline" @click="loginWithGoogle">구글로 계속하기</Button>
    </div>

    <p class="pt-1 text-center text-[12px] tracking-[-0.02em] text-[#A3A3A3]">
      계속 진행 시 이용약관 및 마이데이터 수집·이용에 동의합니다
    </p>
  </div>
</template>
