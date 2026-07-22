<script setup>
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

// 아래 두 경로는 Spring Security OAuth2 기본 컨벤션을 가정한 placeholder다.
// 백엔드의 실제 소셜 로그인 진입 경로가 확정되면 이 값만 바꾸면 된다.
function loginWithKakao() {
  window.location.href = `${apiBaseUrl}/oauth2/authorization/kakao`
}

function loginWithGoogle() {
  window.location.href = `${apiBaseUrl}/oauth2/authorization/google`
}
</script>

<template>
  <div class="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#F3F1EC] px-6">
    <img src="/icons/icon-192.png" alt="Ntropy" class="h-16 w-16" />
    <h1 class="text-[22px] font-medium text-gray-900">Ntropy</h1>

    <p class="mb-8 text-center text-[13px] leading-snug text-[#57544A]">
      여러 개의 잡 (Job), 한번에 관리<br />
      무질서한 소득을 진단하고 자산으로 연결합니다.
    </p>

    <button
      type="button"
      class="w-full max-w-xs rounded-lg bg-yellow-300 py-3 font-medium"
      @click="loginWithKakao"
    >
      카카오로 로그인
    </button>
    <button
      type="button"
      class="w-full max-w-xs rounded-lg border border-gray-300 bg-white py-3 font-medium"
      @click="loginWithGoogle"
    >
      구글로 로그인
    </button>

    <p class="mt-8 text-[10.5px] text-[#8A8778]">
      계속 진행 시 이용약관 및 마이데이터 수집·이용에 동의합니다
    </p>
  </div>
</template>
