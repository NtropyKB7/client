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
  { id: 'logout', label: '로그아웃', danger: true },
]
</script>

<template>
  <div class="rounded-2xl border border-grey-50 bg-grey-white px-4">
    <Container
      v-for="item in MENU_ITEMS"
      :key="item.id"
      clickable
      @click="$emit('select', item.id)"
    >
      <p class="text-body4" :class="item.danger ? 'text-[#e53d33]' : 'text-grey-500'">
        {{ item.label }}
      </p>
      <template #trailing>
        <ChevronRightIcon class="size-5 text-grey-300" />
      </template>
    </Container>
  </div>
</template>
