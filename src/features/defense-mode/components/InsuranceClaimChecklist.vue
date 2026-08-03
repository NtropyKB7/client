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
  <div class="rounded-2xl border border-grey-50 bg-grey-white p-4">
    <p class="text-body1 text-grey-500">보험 청구 안내</p>
    <ul class="mt-3 flex flex-col gap-3">
      <li v-for="item in items" :key="item.id">
        <button
          type="button"
          class="flex w-full items-start gap-2 text-left"
          @click="emit('toggle', item.id)"
        >
          <span
            class="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border"
            :class="
              checkedIds.includes(item.id)
                ? 'border-primary-500 bg-primary-500 text-white'
                : 'border-grey-100 text-transparent'
            "
          >
            <CheckIcon class="size-2.5" />
          </span>
          <span
            class="text-caption"
            :class="checkedIds.includes(item.id) ? 'text-grey-300 line-through' : 'text-grey-400'"
          >
            {{ item.label }}
          </span>
        </button>
      </li>
    </ul>
  </div>
</template>
