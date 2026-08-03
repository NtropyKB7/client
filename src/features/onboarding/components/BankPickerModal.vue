<script setup>
import { ref, computed } from 'vue'
import { useModalStore } from '@/shared/store/modal'
import { BANK_LIST, BANK_META } from '../api'
import SearchIcon from '@/shared/components/icons/SearchIcon.vue'

const props = defineProps({
  selected: { type: String, default: '' },
})

const modalStore = useModalStore()
const query = ref('')

const filteredBanks = computed(() => BANK_LIST.filter((bank) => bank.includes(query.value.trim())))

function select(bank) {
  modalStore.close(bank)
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <h2 class="text-head3 text-grey-500">은행 선택</h2>

    <label class="flex items-center gap-2 rounded-xl bg-grey-30 px-3.5 py-3" for="bank-search">
      <SearchIcon class="size-[18px] shrink-0 text-grey-400" />
      <input
        id="bank-search"
        v-model="query"
        type="text"
        placeholder="은행 이름을 검색해 주세요"
        class="w-full bg-transparent text-body4 text-grey-500 placeholder:text-grey-300 focus:outline-none"
      />
    </label>

    <div class="flex flex-col gap-2">
      <button
        v-for="bank in filteredBanks"
        :key="bank"
        type="button"
        class="flex items-center gap-3 rounded-2xl px-3 py-3 text-left transition-colors"
        :class="bank === props.selected ? 'bg-primary-50' : 'hover:bg-grey-30'"
        @click="select(bank)"
      >
        <span
          class="flex size-9 shrink-0 items-center justify-center rounded-xl text-body3 font-bold"
          :style="{ backgroundColor: BANK_META[bank]?.bg, color: BANK_META[bank]?.text }"
        >
          {{ BANK_META[bank]?.initial }}
        </span>
        <span class="text-body4 font-medium text-grey-500">{{ bank }}</span>
      </button>

      <p v-if="filteredBanks.length === 0" class="py-6 text-center text-body4 text-grey-300">
        검색 결과가 없어요.
      </p>
    </div>
  </div>
</template>
