<!-- src/features/mypage/components/SubscriptionSummaryCard.vue -->
<script setup>
defineProps({
  subscription: { type: Object, required: true },
  planLabel: { type: String, required: true },
})

defineEmits(['open-status'])
</script>

<template>
  <div class="rounded-2xl border border-grey-50 bg-grey-white p-4">
    <p class="text-caption text-grey-300">내 구독</p>

    <div class="mt-2.5 flex items-center justify-between">
      <p class="text-body3 text-grey-500">현재 플랜</p>
      <span class="rounded-full bg-primary-50 px-3 py-1.5 text-[10px] font-bold text-primary-800">
        {{ planLabel }} 이용중
      </span>
    </div>
    <p v-if="subscription.nextBillingDate" class="mt-2 text-caption text-grey-300">
      다음 결제일 {{ subscription.nextBillingDate }} ·
      {{ subscription.autoRenew ? '자동 연장' : '자동 연장 꺼짐' }}
    </p>
    <p v-else class="mt-2 text-caption text-grey-300">Pro로 업그레이드하고 더 많은 기능을 이용해보세요</p>

    <button
      type="button"
      class="mt-3 w-full border-t border-grey-50 pt-3 text-left text-caption font-bold text-primary-800"
      @click="$emit('open-status')"
    >
      구독 설정하기
    </button>
  </div>
</template>
