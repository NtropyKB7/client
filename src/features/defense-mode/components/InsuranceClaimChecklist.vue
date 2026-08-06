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
      <li v-for="item in items" :key="item.code" class="flex items-start gap-2">
        <button
          type="button"
          class="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border"
          :class="
            checkedIds.includes(item.code)
              ? 'border-primary-500 bg-primary-500 text-white'
              : 'border-grey-100 text-transparent'
          "
          @click="emit('toggle', item.code)"
        >
          <CheckIcon class="size-2.5" />
        </button>
        <div class="min-w-0 flex-1">
          <button
            type="button"
            class="block text-left text-caption font-bold"
            :class="checkedIds.includes(item.code) ? 'text-grey-300 line-through' : 'text-grey-400'"
            @click="emit('toggle', item.code)"
          >
            {{ item.title }}
          </button>
          <!-- 백엔드가 안내 링크(<a>)를 포함한 HTML을 내려준다. 신뢰된 자체 백엔드 응답이라 v-html 사용. -->
          <!-- eslint-disable-next-line vue/no-v-html -->
          <p
            class="mt-0.5 text-[11px] text-grey-300 [&_a]:text-primary-600 [&_a]:underline"
            v-html="item.description"
          />
        </div>
      </li>
    </ul>
  </div>
</template>
