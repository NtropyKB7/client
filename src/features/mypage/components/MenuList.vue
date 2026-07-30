<!-- src/features/mypage/components/MenuList.vue -->
<script setup>
import Container from '@/shared/components/Container.vue'
import ChevronRightIcon from '@/shared/components/icons/ChevronRightIcon.vue'

defineEmits(['select'])

const MENU_ITEMS = [
  { id: 'accounts', label: '연동 계좌 관리' },
  { id: 'notifications', label: '알림 이력' },
  { id: 'permissions', label: '권한 설정' },
  { id: 'appInfo', label: '앱 정보 및 이용약관' },
]
</script>

<template>
  <div class="rounded-xl border border-[#111110]/10 bg-white px-4">
    <Container
      v-for="item in MENU_ITEMS"
      :key="item.id"
      clickable
      @click="$emit('select', item.id)"
    >
      <p class="text-sm text-[#111110]">{{ item.label }}</p>
      <template #trailing>
        <ChevronRightIcon class="h-4 w-4 text-[#6B6A65]" />
      </template>
    </Container>
  </div>
</template>
