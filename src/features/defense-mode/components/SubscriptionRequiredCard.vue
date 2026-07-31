<!-- src/features/defense-mode/components/SubscriptionRequiredCard.vue -->
<script setup>
import { useRouter } from 'vue-router'
import Button from '@/shared/components/Button.vue'
import DefenseIcon from '@/shared/components/icons/DefenseIcon.vue'

const router = useRouter()

function goToSubscription() {
  router.push({ name: 'mypage' })
}
</script>

<template>
  <div
    class="flex flex-col items-center gap-3 rounded-2xl border border-[#111110]/10 bg-white p-8 text-center"
  >
    <DefenseIcon class="h-8 w-8 text-[#111110]/30" />
    <h2 class="text-base font-semibold text-[#111110]">방어모드는 Pro 전용 기능이에요</h2>
    <p class="text-xs text-[#6B6A65]">
      소득 공백 시 자산을 지키는 위기 대응 시스템은<br />Pro 구독자에게 제공돼요.
    </p>
    <div class="mt-2 w-full">
      <Button @click="goToSubscription">구독하러가기</Button>
    </div>
  </div>
</template>
