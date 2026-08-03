<!-- src/features/mypage/components/AccountsManageSection.vue -->
<script setup>
import { computed, ref } from 'vue'
import { useOnboardingStore } from '@/features/onboarding/store'
import { useModalStore } from '@/shared/store/modal'
import BankPickerModal from '@/features/onboarding/components/BankPickerModal.vue'
import AppHeader from '@/shared/components/AppHeader.vue'
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
  <div class="flex flex-col">
    <AppHeader back title="마이페이지" @back="$emit('back')" />

    <div class="flex flex-col gap-4 px-4 pt-5 pb-6">
      <div
        v-for="(row, index) in accountForms"
        :key="index"
        class="flex flex-col gap-4 rounded-[20px] border border-grey-50 bg-grey-white p-4"
      >
        <div class="flex items-center justify-between">
          <p class="text-body1 text-grey-500">연동된 계좌 정보</p>
          <button
            v-if="accountForms.length > 1"
            type="button"
            class="text-caption text-grey-300"
            @click="removeRow(index)"
          >
            삭제
          </button>
        </div>

        <div>
          <p class="text-caption font-medium text-grey-400">은행</p>
          <button
            type="button"
            class="mt-1.5 flex w-full items-center justify-between rounded-xl bg-grey-30 px-3.5 py-3 text-left"
            @click="pickBank(row)"
          >
            <span class="text-body4" :class="row.bank ? 'text-grey-500' : 'text-grey-300'">
              {{ row.bank || '은행 선택' }}
            </span>
          </button>
        </div>

        <div>
          <p class="text-caption font-medium text-grey-400">계좌번호</p>
          <input
            v-model="row.number"
            type="text"
            inputmode="numeric"
            placeholder="예) 0000"
            class="mt-1.5 w-full rounded-xl bg-grey-30 px-3.5 py-3 text-body4 text-grey-500 placeholder:text-grey-300"
          />
        </div>
      </div>

      <button
        type="button"
        class="rounded-xl bg-primary-500 py-3 text-body4 font-bold text-white"
        @click="addRow"
      >
        + 계좌 추가하기
      </button>

      <Button class="mt-2" :disabled="!isValid" @click="save">저장</Button>
    </div>
  </div>
</template>
