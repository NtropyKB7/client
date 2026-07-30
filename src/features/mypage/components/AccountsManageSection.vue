<!-- src/features/mypage/components/AccountsManageSection.vue -->
<script setup>
import { computed, ref } from 'vue'
import { useOnboardingStore } from '@/features/onboarding/store'
import { useModalStore } from '@/shared/store/modal'
import BankPickerModal from '@/features/onboarding/components/BankPickerModal.vue'
import SectionHeader from './SectionHeader.vue'
import Button from '@/shared/components/Button.vue'

defineEmits(['back'])

const onboardingStore = useOnboardingStore()
const modalStore = useModalStore()

const accountForms = ref(
  onboardingStore.accounts.length > 0
    ? onboardingStore.accounts.map((account) => ({ ...account }))
    : [{ bank: '', number: '' }],
)

function addRow() {
  accountForms.value.push({ bank: '', number: '' })
}

function removeRow(index) {
  accountForms.value.splice(index, 1)
}

async function pickBank(row) {
  const selected = await modalStore.open(
    BankPickerModal,
    { selected: row.bank },
    { position: 'bottom' },
  )
  if (selected) {
    row.bank = selected
  }
}

const isValid = computed(
  () =>
    accountForms.value.length > 0 &&
    accountForms.value.every((row) => row.bank && /^\d{10,16}$/.test(row.number)),
)

function save() {
  if (!isValid.value) return
  onboardingStore.setAccounts(accountForms.value.map((row) => ({ ...row })))
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <SectionHeader
      title="연동 계좌 관리"
      description="연동된 계좌 수정/삭제 및 추가를 할 수 있습니다."
      @back="$emit('back')"
    />

    <div class="flex flex-col gap-3">
      <div
        v-for="(row, index) in accountForms"
        :key="index"
        class="flex flex-col gap-2 rounded-xl border border-[#111110]/10 bg-white p-4"
      >
        <button
          type="button"
          class="flex items-center justify-between rounded-lg border border-[#111110]/20 px-3 py-2 text-left text-sm"
          @click="pickBank(row)"
        >
          <span :class="row.bank ? 'text-[#111110]' : 'text-[#8A8778]'">
            {{ row.bank || '은행 선택' }}
          </span>
        </button>
        <input
          v-model="row.number"
          type="text"
          inputmode="numeric"
          placeholder="예) 0000"
          class="rounded-lg border border-[#111110]/20 px-3 py-2 text-sm"
        />
        <button
          v-if="accountForms.length > 1"
          type="button"
          class="self-end text-xs text-[#6B6A65] underline"
          @click="removeRow(index)"
        >
          삭제
        </button>
      </div>

      <button
        type="button"
        class="rounded-lg border border-dashed border-[#111110]/30 py-3 text-sm text-[#6B6A65]"
        @click="addRow"
      >
        + 계좌 추가하기
      </button>
    </div>

    <Button :disabled="!isValid" @click="save">저장</Button>
  </div>
</template>
