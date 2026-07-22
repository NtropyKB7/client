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
    <h1 class="mb-8 text-2xl font-bold">Ntropy</h1>
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
  </div>
</template>
