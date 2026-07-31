<!-- src/shared/components/IncomeMethodPickerModal.vue -->
<script setup>
import { useModalStore } from '@/shared/store/modal'
import { INCOME_METHOD_OPTIONS } from '@/shared/utils/incomeMethod'
import CheckIcon from '@/shared/components/icons/CheckIcon.vue'

const props = defineProps({
  selected: { type: String, default: '' },
})

const modalStore = useModalStore()

function select(value) {
  modalStore.close(value)
}
</script>

<template>
  <div class="flex flex-col gap-1">
    <h2 class="mb-2 text-base font-semibold text-[#111110]">소득 방식 선택</h2>
    <button
      v-for="option in INCOME_METHOD_OPTIONS"
      :key="option"
      type="button"
      class="flex items-center justify-between rounded-lg px-3 py-3 text-sm text-[#111110] hover:bg-[#F3F1EC]"
      @click="select(option)"
    >
      {{ option }}
      <CheckIcon v-if="option === props.selected" class="h-4 w-4 text-[#E0B400]" />
    </button>
  </div>
</template>
