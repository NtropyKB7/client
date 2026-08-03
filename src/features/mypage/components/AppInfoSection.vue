<!-- src/features/mypage/components/AppInfoSection.vue -->
<script setup>
import AppHeader from '@/shared/components/AppHeader.vue'

defineEmits(['back'])
</script>

<template>
  <div class="flex flex-col">
    <AppHeader back title="마이페이지" @back="$emit('back')" />

    <div class="flex flex-col gap-4 px-4 pt-5 pb-6">
      <h2 class="text-body1 text-grey-500">앱 정보 및 이용약관</h2>
      <div class="rounded-2xl border border-grey-50 bg-grey-white p-4 text-caption text-grey-300">
        <p>앱 버전 1.0.0</p>
        <p class="mt-3">
          서비스 이용약관, 개인정보 처리방침 등 상세 내용은 추후 제공될 예정입니다.
        </p>
      </div>
    </div>
  </div>
</template>
