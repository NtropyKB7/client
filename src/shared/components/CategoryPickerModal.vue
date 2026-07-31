<!-- src/shared/components/CategoryPickerModal.vue -->
<script setup>
import { useModalStore } from '@/shared/store/modal'
import { JOB_CATEGORIES } from '@/shared/utils/jobCategory'
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
    <h2 class="mb-2 text-base font-semibold text-[#111110]">잡 카테고리 선택</h2>
    <button
      v-for="category in JOB_CATEGORIES"
      :key="category.value"
      type="button"
      class="flex items-center justify-between rounded-lg px-3 py-3 text-sm text-[#111110] hover:bg-[#F3F1EC]"
      @click="select(category.value)"
    >
      {{ category.label }}
      <CheckIcon v-if="category.value === props.selected" class="h-4 w-4 text-[#E0B400]" />
    </button>
  </div>
</template>
