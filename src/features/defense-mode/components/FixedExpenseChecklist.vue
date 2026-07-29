<!-- src/features/defense-mode/components/FixedExpenseChecklist.vue -->
<script setup>
import { computed } from 'vue'
import Container from '@/shared/components/Container.vue'
import { getExpenseStatusBadge } from '@/shared/utils/expenseStatus'

const props = defineProps({
  items: { type: Array, required: true },
})

const totalAmount = computed(() => props.items.reduce((sum, item) => sum + item.amount, 0))
</script>

<template>
  <div class="rounded-2xl border border-[#111110]/10 bg-white p-4">
    <p class="text-sm font-semibold text-[#111110]">고정 지출 점검</p>
    <p class="mt-1 text-xs text-[#6B6A65]">위기 기간 내 도래하는 고정지출이에요.</p>

    <div class="mt-3 flex items-center justify-between rounded-lg bg-[#F3F1EC] px-3 py-2">
      <p class="text-xs text-[#6B6A65]">이번달 고정지출 총액</p>
      <p class="text-sm font-semibold text-[#111110]">{{ Math.round(totalAmount / 10000) }}만원</p>
    </div>

    <div class="mt-2">
      <Container v-for="(item, index) in items" :key="item.id">
        <template #leading>
          <span
            class="flex h-6 w-6 items-center justify-center rounded-full bg-[#111110] text-xs font-semibold text-white"
          >
            {{ index + 1 }}
          </span>
        </template>
        <p class="text-sm font-medium text-[#111110]">{{ item.name }}</p>
        <p class="text-xs text-[#6B6A65]">{{ item.nextDueLabel }}</p>
        <template #trailing>
          <div class="text-right">
            <p class="text-sm font-semibold text-[#111110]">{{ item.amount.toLocaleString() }}원</p>
            <span
              class="mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold"
              :class="getExpenseStatusBadge(item.status).className"
            >
              {{ getExpenseStatusBadge(item.status).label }}
            </span>
          </div>
        </template>
      </Container>
    </div>

    <p class="mt-3 text-[10px] text-[#6B6A65]">
      * 3·4순위 정확한 해지금액은 각 은행·증권사 앱에서 확인하세요.
    </p>
  </div>
</template>
