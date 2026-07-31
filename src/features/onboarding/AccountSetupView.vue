<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useOnboardingStore } from './store'
import { useModalStore } from '@/shared/store/modal'
import BankPickerModal from './components/BankPickerModal.vue'
import OnboardingProgressBar from './components/OnboardingProgressBar.vue'
import Button from '@/shared/components/Button.vue'

const router = useRouter()
const onboardingStore = useOnboardingStore()
const modalStore = useModalStore()

const accountForms = ref(
  onboardingStore.accounts.length > 0
    ? onboardingStore.accounts.map((a) => ({ ...a }))
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

function submit() {
  if (!isValid.value) return
  onboardingStore.setAccounts(accountForms.value.map((row) => ({ ...row })))
  router.push({ name: 'onboarding-job' })
}
</script>

<template>
  <div class="flex min-h-screen flex-col gap-6 bg-[#F3F1EC] px-6 py-10">
    <OnboardingProgressBar :current-step="1" step-label="계좌 설정" />

    <div>
      <h1 class="text-lg font-semibold text-[#111110]">계좌 설정</h1>
      <p class="mt-1 text-xs text-[#6B6A65]">마이데이터 연동을 위해 계좌를 등록해 주세요.</p>
    </div>

    <div class="flex flex-col gap-4">
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
          <span :class="row.bank ? 'text-[#111110]' : 'text-[#8A8778]'">{{
            row.bank || '은행 선택'
          }}</span>
        </button>
        <input
          v-model="row.number"
          type="text"
          inputmode="numeric"
          placeholder="계좌번호 입력 (숫자만)"
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

    <Button class="mt-auto" :disabled="!isValid" @click="submit">계좌 설정 완료</Button>
  </div>
</template>
