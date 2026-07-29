<!-- src/features/defense-mode/components/InsuranceClaimChecklist.vue -->
<script setup>
import CheckIcon from '@/shared/components/icons/CheckIcon.vue'

defineProps({
  items: { type: Array, required: true },
  checkedIds: { type: Array, required: true },
})

const emit = defineEmits(['toggle'])
</script>

<template>
  <div class="rounded-2xl border border-[#111110]/10 bg-white p-4">
    <p class="text-sm font-semibold text-[#111110]">보험 청구 체크리스트</p>
    <ul class="mt-3 flex flex-col gap-3">
      <li v-for="item in items" :key="item.id">
        <button
          type="button"
          class="flex w-full items-center gap-2 text-left"
          @click="emit('toggle', item.id)"
        >
          <span
            class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border"
            :class="
              checkedIds.includes(item.id)
                ? 'border-emerald-500 bg-emerald-500 text-white'
                : 'border-[#111110]/20 text-transparent'
            "
          >
            <CheckIcon class="h-3 w-3" />
          </span>
          <span
            class="text-sm"
            :class="checkedIds.includes(item.id) ? 'text-[#6B6A65] line-through' : 'text-[#111110]'"
          >
            {{ item.label }}
          </span>
        </button>
      </li>
    </ul>
  </div>
</template>
