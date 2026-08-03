<!-- src/features/defense-mode/components/FixedExpenseChecklist.vue -->
<script setup>
import { getExpenseStatusBadge } from '@/shared/utils/expenseStatus'

defineProps({
  items: { type: Array, required: true },
})
</script>

<template>
  <div class="rounded-2xl border border-grey-50 bg-grey-white p-4">
    <p class="text-body1 text-grey-500">고정 지출 점검</p>
    <p class="mt-1 text-[11px] text-grey-300">위기 기간 내 도래하는 지출부터 확인하세요.</p>

    <div class="mt-4 flex flex-col gap-2">
      <div
        v-for="(item, index) in items"
        :key="item.id"
        class="flex items-center gap-2.5 rounded-xl border border-grey-50 bg-grey-30 px-3 py-3"
      >
        <span
          class="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#294047] text-[10px] font-bold text-white"
        >
          {{ index + 1 }}
        </span>
        <div class="min-w-0 flex-1">
          <p class="text-[12px] font-bold text-grey-500">{{ item.name }}</p>
          <p class="text-[11px] font-bold text-grey-300">{{ item.nextDueLabel }}</p>
        </div>
        <div class="shrink-0 text-right">
          <span
            class="inline-block rounded-full px-2.5 py-1 text-[9px] font-bold"
            :class="getExpenseStatusBadge(item.status).className"
          >
            {{ getExpenseStatusBadge(item.status).label }}
          </span>
          <p class="mt-1.5 text-[12px] font-bold text-grey-500">
            {{ item.amount.toLocaleString() }}원
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
