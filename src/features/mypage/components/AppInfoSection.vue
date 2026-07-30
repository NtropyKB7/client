<!-- src/features/mypage/components/AppInfoSection.vue -->
<script setup>
import BackLink from './BackLink.vue'

defineEmits(['back'])
</script>

<template>
  <div class="flex flex-col gap-4">
    <BackLink @click="$emit('back')" />
    <h2 class="text-center text-lg font-bold text-[#111110]">앱 정보 및 이용약관</h2>
    <div class="rounded-xl border border-[#111110]/10 bg-white p-4 text-sm text-[#6B6A65]">
      <p>앱 버전 1.0.0</p>
      <p class="mt-3">서비스 이용약관, 개인정보 처리방침 등 상세 내용은 추후 제공될 예정입니다.</p>
    </div>
  </div>
</template>
