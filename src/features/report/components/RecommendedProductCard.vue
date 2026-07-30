<script setup>
import { formatMan } from '../utils'
import Button from '@/shared/components/Button.vue'

defineProps({
  name: { type: String, required: true },
  description: { type: String, required: true },
  availableFunds: { type: Number, required: true },
  isSubscribed: { type: Boolean, required: true },
})

defineEmits(['subscribe'])
</script>

<template>
  <div class="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
    <div class="flex items-center justify-between">
      <p class="text-sm font-semibold text-[#111110]">추천 금융상품</p>
      <span
        class="rounded-full border border-emerald-200 bg-white px-2 py-1 text-[10px] font-semibold text-emerald-700"
      >
        구독자 전용
      </span>
    </div>
    <p class="mt-3 text-sm font-semibold text-[#111110]">{{ name }}</p>

    <p v-if="isSubscribed" class="mt-1 text-xs text-[#6B6A65]">{{ description }}</p>
    <template v-else>
      <p class="mt-1 text-xs text-[#6B6A65]">
        가용자금 {{ formatMan(availableFunds, false) }}원 중 ...
      </p>
      <Button class="mt-3" @click="$emit('subscribe')">구독하러가기</Button>
    </template>
  </div>
</template>
