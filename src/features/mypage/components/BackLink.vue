<!-- src/features/mypage/components/BackLink.vue -->
<script setup>
import ChevronLeftIcon from '@/shared/components/icons/ChevronLeftIcon.vue'

defineEmits(['click'])
</script>

<template>
  <button
    type="button"
    class="flex items-center gap-1 text-xs text-[#6B6A65]"
    @click="$emit('click')"
  >
    <ChevronLeftIcon class="h-4 w-4" />
    마이페이지
  </button>
</template>
