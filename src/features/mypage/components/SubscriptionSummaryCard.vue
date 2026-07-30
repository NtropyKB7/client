<!-- src/features/mypage/components/SubscriptionSummaryCard.vue -->
<script setup>
defineProps({
  subscription: { type: Object, required: true },
  planLabel: { type: String, required: true },
})

defineEmits(['open-status'])
</script>

<template>
  <div class="rounded-xl border border-[#111110]/10 bg-white p-4">
    <p class="text-sm font-semibold text-[#111110]">내 구독</p>

    <div class="mt-3 flex items-center justify-between">
      <p class="text-base font-semibold text-[#111110]">현재 플랜</p>
      <span class="rounded-full bg-amber-100 px-2 py-1 text-[10px] font-semibold text-amber-700">
        {{ planLabel }} 이용중
      </span>
    </div>
    <p class="mt-1 text-xs text-[#6B6A65]">
      다음 결제일 {{ subscription.nextBillingDate }} ·
      {{ subscription.autoRenew ? '자동 연장' : '자동 연장 꺼짐' }}
    </p>

    <button
      type="button"
      class="mt-3 flex w-full items-center justify-between border-t border-[#111110]/5 pt-3 text-sm text-[#111110]"
      @click="$emit('open-status')"
    >
      구독 설정하기
      <span class="text-[#6B6A65]">›</span>
    </button>
  </div>
</template>
