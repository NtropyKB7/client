<script setup>
defineProps({
  name: { type: String, required: true },
  description: { type: String, required: true },
  provider: { type: String, default: '' },
  isSubscribed: { type: Boolean, required: true },
})

defineEmits(['subscribe'])
</script>

<template>
  <div class="rounded-2xl border border-grey-50 bg-grey-white p-4">
    <div class="flex items-center justify-between">
      <p class="text-caption font-bold text-primary-800">추천 금융상품</p>
      <span
        v-if="isSubscribed"
        class="rounded-full bg-primary-50 px-3 py-1.5 text-[10px] font-bold text-primary-800"
      >
        구독자 전용
      </span>
    </div>
    <p v-if="provider" class="mt-3 text-[11px] text-grey-300">{{ provider }}</p>
    <p class="text-body1 text-grey-500" :class="provider ? 'mt-0.5' : 'mt-3'">{{ name }}</p>
    <p class="mt-1 text-caption text-grey-300">{{ description }}</p>

    <button
      v-if="!isSubscribed"
      type="button"
      class="mt-3 w-full rounded-full bg-primary-500 py-3 text-body4 font-bold text-white"
      @click="$emit('subscribe')"
    >
      구독하고 맞춤 추천 받기
    </button>
  </div>
</template>
