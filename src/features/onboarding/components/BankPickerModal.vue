<script setup>
import { useModalStore } from '@/shared/store/modal'
import { BANK_LIST } from '../api'
import CheckIcon from '@/shared/components/icons/CheckIcon.vue'

const props = defineProps({
  selected: { type: String, default: '' },
})

const modalStore = useModalStore()

function select(bank) {
  modalStore.close(bank)
}
</script>

<template>
  <div class="flex flex-col gap-1">
    <h2 class="mb-2 text-base font-semibold text-[#111110]">은행 선택</h2>
    <button
      v-for="bank in BANK_LIST"
      :key="bank"
      type="button"
      class="flex items-center justify-between rounded-lg px-3 py-3 text-sm text-[#111110] hover:bg-[#F3F1EC]"
      @click="select(bank)"
    >
      {{ bank }}
      <CheckIcon v-if="bank === props.selected" class="h-4 w-4 text-[#E0B400]" />
    </button>
  </div>
</template>
